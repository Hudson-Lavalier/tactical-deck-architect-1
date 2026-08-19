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
import { proceedWithTurn } from './turnManager';

// Open a response window for a card that is becoming active
export function openResponseWindow(state, card, activePlayerId, source = 'queue') {
  const respondingPlayerId = activePlayerId === 'player' ? 'opponent' : 'player';
  state.responseWindow = {
    active: true,
    activeCard: card,
    activePlayerId,
    respondingPlayerId,
    chain: [],
    cancelled: false,
    source,
  };
  state.phase = 'response';
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

// Close the response window and resolve the card (if not cancelled)
export function closeResponseWindow(state) {
  const window = state.responseWindow;
  const { activeCard, activePlayerId, cancelled, source } = window;

  state.responseWindow = {
    active: false,
    activeCard: null,
    activePlayerId: null,
    respondingPlayerId: null,
    chain: [],
    cancelled: false,
    source: null,
  };

  // Resolve the card if not cancelled
  if (!cancelled && activeCard) {
    resolveCard(state, activePlayerId, activeCard);
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
    } else {
      // Return to action phase
      state.phase = 'action';
    }
  }
}