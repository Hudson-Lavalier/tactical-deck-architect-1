// Twofold Reality support — attach/switch the two flanking domains.
// State shape: state.domainAttached = { left, right, activeSide, switchesThisTurn }.
// `left` must be a Grounding (A) domain, `right` a System (B) domain.

import { logEvent } from './gameState';
import { emit } from './effects/eventBus';

// Attach two domain cards from the placing player's hand to the flanks.
// Either id may be null (skip). Cards are removed from hand.
export function attachTwofoldDomains(state, playerId, leftCardId, rightCardId) {
  const player = state.players[playerId];
  if (!state.domainAttached) {
    state.domainAttached = { left: null, right: null, activeSide: null, switchesThisTurn: 0 };
  }
  if (leftCardId) {
    const idx = player.hand.findIndex((c) => c.id === leftCardId);
    if (idx !== -1) state.domainAttached.left = player.hand.splice(idx, 1)[0];
  }
  if (rightCardId) {
    const idx = player.hand.findIndex((c) => c.id === rightCardId);
    if (idx !== -1) state.domainAttached.right = player.hand.splice(idx, 1)[0];
  }
  if (!state.domainAttached.activeSide) {
    state.domainAttached.activeSide = state.domainAttached.left ? 'left' : (state.domainAttached.right ? 'right' : null);
  }
  logEvent(state, { type: 'twofold_attach', playerId, left: !!state.domainAttached.left, right: !!state.domainAttached.right });
}

// Switch the active flank. Only the placing player, on their turn, up to 2×/turn.
// Counts as a domain-change trigger but does NOT end the turn.
export function switchTwofoldDomain(state, playerId, side) {
  if (!state.domainAttached) return false;
  if (state.domainPlacedBy !== playerId) return false;
  if (state.domainAttached.switchesThisTurn >= 2) return false;
  if (!state.domainAttached[side]) return false;
  if (state.domainAttached.activeSide === side) return false;
  state.domainAttached.activeSide = side;
  state.domainAttached.switchesThisTurn++;
  emit(state, 'domain_changed', { playerId, card: state.domain, switch: true });
  logEvent(state, { type: 'twofold_switch', playerId, side, switchesLeft: 2 - state.domainAttached.switchesThisTurn });
  return true;
}

// Reset the per-turn switch counter at the start of the placing player's turn.
export function resetTwofoldSwitches(state, playerId) {
  if (state.domainAttached && state.domainPlacedBy === playerId) {
    state.domainAttached.switchesThisTurn = 0;
  }
}