// Twofold Reality support — attach/switch the two flanking domains.
// State shape: state.domainAttached = { left, right, activeSide, switchesThisTurn }.
// `left` must be a Grounding (A) domain, `right` a System (B) domain.

import { logEvent } from './gameState';
import { emit, getHandler } from './effects/eventBus';
import { discardCard } from './effects/primitives';

// Attach two domain cards from the placing player's hand to the flanks.
// Either id may be null (skip). Cards are removed from hand.
export function attachTwofoldDomains(state, playerId, leftCardId, rightCardId) {
  if (state.domain?.id !== 'twofold_reality' || state.domainPlacedBy !== playerId) return false;
  const player = state.players[playerId];
  if (!player) return false;
  if (!state.domainAttached) state.domainAttached = { left: null, right: null, activeSide: null, switchesThisTurn: 0 };

  const leftIndex = leftCardId ? player.hand.findIndex((card) => card.id === leftCardId && card.category === 'domain' && card.alignment === 'A') : -1;
  const rightIndex = rightCardId ? player.hand.findIndex((card) => card.id === rightCardId && card.category === 'domain' && card.alignment === 'B') : -1;
  if (leftCardId && leftIndex === -1) return false;
  if (rightCardId && rightIndex === -1) return false;

  if (leftIndex !== -1) state.domainAttached.left = player.hand.splice(leftIndex, 1)[0];
  if (rightIndex !== -1) {
    const adjustedIndex = leftIndex !== -1 && rightIndex > leftIndex ? rightIndex - 1 : rightIndex;
    state.domainAttached.right = player.hand.splice(adjustedIndex, 1)[0];
  }
  state.domainAttached.activeSide = state.domainAttached.left ? 'left' : (state.domainAttached.right ? 'right' : null);
  const activeCard = state.domainAttached.activeSide ? state.domainAttached[state.domainAttached.activeSide] : null;
  const activeHandler = activeCard ? getHandler(activeCard.id) : null;
  if (activeHandler?.onPlace) activeHandler.onPlace(state, playerId, activeCard, 'domain');
  state.pendingTwofoldAttach = null;
  emit(state, 'domain_changed', { playerId, card: activeCard, twofoldAttach: true });
  logEvent(state, { type: 'twofold_attach', playerId, left: !!state.domainAttached.left, right: !!state.domainAttached.right });
  return true;
}

// Attach one domain from hand to either flank. An occupied flank is discarded.
export function attachTwofoldFlank(state, playerId, cardId, side) {
  if (state.domain?.id !== 'twofold_reality' || state.domainPlacedBy !== playerId) return false;
  if (!['left', 'right'].includes(side)) return false;
  if (state.currentPlayer !== playerId) return false;
  const player = state.players[playerId];
  const requiredAlignment = side === 'left' ? 'A' : 'B';
  const cardIndex = player.hand.findIndex((card) => card.id === cardId && card.category === 'domain' && card.alignment === requiredAlignment);
  if (cardIndex === -1) return false;
  if (!state.domainAttached) state.domainAttached = { left: null, right: null, activeSide: null, switchesThisTurn: 0 };
  const replaced = state.domainAttached[side];
  const wasActive = state.domainAttached.activeSide === side;
  if (replaced) {
    const replacedHandler = getHandler(replaced.id);
    if (wasActive && replacedHandler?.onRemove) replacedHandler.onRemove(state, playerId, replaced);
    discardCard(state, replaced, playerId);
  }
  state.domainAttached[side] = player.hand.splice(cardIndex, 1)[0];
  if (!state.domainAttached.activeSide || wasActive) {
    state.domainAttached.activeSide = side;
    const handler = getHandler(state.domainAttached[side].id);
    if (handler?.onPlace) handler.onPlace(state, playerId, state.domainAttached[side], 'domain');
  }
  logEvent(state, { type: 'twofold_attach', playerId, side, cardId, replacedCardId: replaced?.id || null });
  return true;
}

// Switch the active flank. Only the placing player, on their turn, up to 2×/turn.
// Counts as a domain-change trigger but does NOT end the turn.
export function switchTwofoldDomain(state, playerId, side) {
  if (!state.domainAttached) return false;
  if (state.domainPlacedBy !== playerId) return false;
  if (state.currentPlayer !== playerId) return false;
  if (state.domainAttached.switchesThisTurn >= 2) return false;
  if (!state.domainAttached[side]) return false;
  if (state.domainAttached.activeSide === side) return false;
  const previous = state.domainAttached[state.domainAttached.activeSide];
  const previousHandler = previous ? getHandler(previous.id) : null;
  if (previousHandler?.onRemove) previousHandler.onRemove(state, playerId, previous);
  state.domainAttached.activeSide = side;
  const active = state.domainAttached[side];
  const activeHandler = getHandler(active.id);
  if (activeHandler?.onPlace) activeHandler.onPlace(state, playerId, active, 'domain');
  state.domainAttached.switchesThisTurn++;
  emit(state, 'domain_changed', { playerId, card: active, switch: true });
  logEvent(state, { type: 'twofold_switch', playerId, side, switchesLeft: 2 - state.domainAttached.switchesThisTurn });
  return true;
}

// Reset the per-turn switch counter at the start of the placing player's turn.
export function resetTwofoldSwitches(state, playerId) {
  if (state.domainAttached && state.domainPlacedBy === playerId) {
    state.domainAttached.switchesThisTurn = 0;
  }
}