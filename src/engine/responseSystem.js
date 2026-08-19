// Response system — rhetoric counter-chains.
//
// Per framework:
//   - Rhetoric cards are played directly onto targeted active cards
//   - Allows unlimited counter-chains until neither player wishes to respond
//
// Per user spec:
//   - 3-second delay between card activations
//   - Window appears for the player who has the rhetoric card
//   - It's up to them to react in time
//
// When a card becomes active (resolves from queue or is played immediately),
// a response window opens for the opposing player. They can play rhetoric
// (counter) or pass. If they counter, the other player gets a chance to
// counter-counter. When the responding player passes, the window closes
// and the card resolves (if not cancelled).

import { logEvent } from './gameState';
import { resolveCard } from './queueSystem';
import { proceedWithTurn, endTurn } from './turnManager';
import { dispatchPlace, dispatchRemove } from './effects/dispatcher';
import { emit, emitBefore } from './effects/eventBus';
import { discardCard } from './effects/primitives';

// Open a response window for a card that is becoming active.
// `extra` carries source-specific context (e.g. slot for board_dev, oldDomain for domain).
export function openResponseWindow(state, card, activePlayerId, source = 'queue', extra = {}) {
  const respondingPlayerId = activePlayerId === 'player' ? 'opponent' : 'player';
  const respondingPlayer = state.players[respondingPlayerId];

  state.responseWindow = {
    active: true,
    activeCard: card,
    activePlayerId,
    respondingPlayerId,
    chain: [],
    cancelled: false,
    source,
    ...extra,
  };
  state.phase = 'response';

  // If responding player has no rhetoric cards, auto-close immediately
  if (respondingPlayer.rhetoricHand.length === 0) {
    logEvent(state, { type: 'response_window_skip', reason: 'no_rhetoric' });
    closeResponseWindow(state);
    return;
  }

  logEvent(state, { type: 'response_window_open', cardId: card?.id, activePlayerId, source });
}

// Play a rhetoric card during the response window
export function playRhetoricResponse(state, playerId, rhetoricCardId, action) {
  const window = state.responseWindow;
  if (!window.active) return false;
  if (window.respondingPlayerId !== playerId) return false;

  const player = state.players[playerId];
  const cardIndex = player.rhetoricHand.findIndex((c) => c.id === rhetoricCardId);
  if (cardIndex === -1) return false;

  const card = player.rhetoricHand[cardIndex];
  player.rhetoricHand.splice(cardIndex, 1);

  window.chain.push({ playerId, card, action });
  window.respondingPlayerId = playerId === 'player' ? 'opponent' : 'player';

  // If action is 'cancel', mark the active card as cancelled
  if (action === 'cancel') {
    window.cancelled = true;
  }

  logEvent(state, { type: 'rhetoric_response', playerId, rhetoricCardId, action });
  return true;
}

// Pass on responding during the response window.
// When the responding player passes, the chain ends and the window closes.
export function passResponse(state, playerId) {
  const window = state.responseWindow;
  if (!window.active) return false;
  if (window.respondingPlayerId !== playerId) return false;

  logEvent(state, { type: 'response_pass', playerId });
  closeResponseWindow(state);
  return true;
}

// Close the response window and resolve/place/revert the card.
export function closeResponseWindow(state) {
  const window = state.responseWindow;
  const { activeCard, activePlayerId, cancelled, source, slot, oldDomain, oldDomainPlacedBy } = window;

  if (cancelled && activeCard) {
    // Protective effects (e.g. Objective Authority) may override the cancellation
    // via a before:event_cancelled handler returning { cancel: true }.
    const before = emitBefore(state, 'effect_cancelled', { card: activeCard, playerId: activePlayerId, source });
    if (before.cancelled) {
      // Cancellation overridden — resolve/place normally.
      clearWindow(state);
      handleResolve(state, source, activeCard, activePlayerId, slot);
    } else {
      clearWindow(state);
      handleCancel(state, source, activeCard, activePlayerId, slot, oldDomain, oldDomainPlacedBy);
    }
  } else if (activeCard) {
    clearWindow(state);
    handleResolve(state, source, activeCard, activePlayerId, slot);
  } else {
    clearWindow(state);
  }

  // Remove from pending resolutions
  state.pendingResolutions.shift();

  logEvent(state, { type: 'response_window_close', cancelled });

  // If there are more pending resolutions, open the next window
  if (state.pendingResolutions.length > 0) {
    const next = state.pendingResolutions[0];
    openResponseWindow(state, next.card, next.playerId, 'queue');
  } else {
    // All resolutions complete
    if (source === 'queue') {
      proceedWithTurn(state);
    } else if (source === 'domain') {
      endTurn(state);
    } else {
      // 'action' or 'board_dev' → return to action phase
      state.phase = 'action';
    }
  }
}

// Clear the response window state.
function clearWindow(state) {
  state.responseWindow = {
    active: false,
    activeCard: null,
    activePlayerId: null,
    respondingPlayerId: null,
    chain: [],
    cancelled: false,
    source: null,
  };
}

// Card resolved successfully — dispatch its effect/placement.
function handleResolve(state, source, card, playerId, slot) {
  if (source === 'board_dev') {
    dispatchPlace(state, playerId, card, slot);
  } else if (source === 'domain') {
    dispatchPlace(state, playerId, card, 'domain');
  } else {
    // 'queue' or 'action' — resolve as a one-time-use action card
    resolveCard(state, playerId, card);
  }
}

// Card was cancelled — discard it and revert any board state.
function handleCancel(state, source, card, playerId, slot, oldDomain, oldDomainPlacedBy) {
  if (source === 'board_dev' && slot) {
    // Remove the card from the persistent slot it was placed into
    const player = state.players[playerId];
    if (player.persistentSlots[slot]?.id === card.id) {
      player.persistentSlots[slot] = null;
    }
  } else if (source === 'domain') {
    // Revert the domain to what was active before the attempted change
    if (oldDomain) {
      state.domain = oldDomain;
      state.domainPlacedBy = oldDomainPlacedBy;
    } else {
      state.domain = null;
      state.domainPlacedBy = null;
    }
  }
  discardCard(state, card);
  logEvent(state, { type: 'card_discarded', cardId: card.id, reason: 'cancelled' });
}