// Twofold Reality support — attach/switch the two flanking domains.
// State shape: state.domainAttached = { left, right, activeSide, switchesThisTurn }.
// `left` must be a Grounding (A) domain, `right` a System (B) domain.

import { logEvent } from './gameState';
import { discardCard } from './effects/primitives';
import { dispatchPlace, dispatchRemove } from './effects/dispatcher';

function isTwofold(card) {
  return (card?.effectId || card?.id) === 'twofold_reality';
}

function validFlank(card, side) {
  return card?.category === 'domain' && ((side === 'left' && card.alignment === 'A') || (side === 'right' && card.alignment === 'B'));
}

// Attach two domain cards from the placing player's hand to the flanks.
// Either id may be null (skip). Cards are removed from hand.
export function attachTwofoldDomains(state, playerId, leftCardId, rightCardId) {
  if (!isTwofold(state.domain) || state.domainPlacedBy !== playerId) return false;
  const player = state.players[playerId];
  if (!player) return false;
  if (!state.domainAttached) state.domainAttached = { left: null, right: null, activeSide: null, switchesThisTurn: 0 };

  const attachFromHand = (cardId, side) => {
    if (!cardId) return false;
    const index = player.hand.findIndex((card) => card.id === cardId && validFlank(card, side));
    if (index === -1) return false;
    state.domainAttached[side] = player.hand.splice(index, 1)[0];
    return true;
  };

  attachFromHand(leftCardId, 'left');
  attachFromHand(rightCardId, 'right');
  state.domainAttached.activeSide = state.domainAttached.left ? 'left' : (state.domainAttached.right ? 'right' : null);
  const activeCard = state.domainAttached.activeSide ? state.domainAttached[state.domainAttached.activeSide] : null;
  if (activeCard) dispatchPlace(state, playerId, activeCard, 'domain');
  logEvent(state, { type: 'twofold_attach', playerId, left: !!state.domainAttached.left, right: !!state.domainAttached.right });
  return true;
}

export function autoAttachTwofoldDomains(state, playerId) {
  const hand = state.players[playerId]?.hand || [];
  const left = hand.find((card) => validFlank(card, 'left'));
  const right = hand.find((card) => validFlank(card, 'right'));
  return attachTwofoldDomains(state, playerId, left?.id || null, right?.id || null);
}

// Attach one domain from hand to either flank. An occupied flank is discarded.
export function attachTwofoldFlank(state, playerId, cardId, side) {
  if (!isTwofold(state.domain) || state.domainPlacedBy !== playerId || state.currentPlayer !== playerId) return false;
  if (!['left', 'right'].includes(side)) return false;
  const player = state.players[playerId];
  const cardIndex = player.hand.findIndex((card) => card.id === cardId && validFlank(card, side));
  if (cardIndex === -1) return false;
  if (!state.domainAttached) state.domainAttached = { left: null, right: null, activeSide: null, switchesThisTurn: 0 };
  const replaced = state.domainAttached[side];
  const wasActive = state.domainAttached.activeSide === side;
  if (replaced && wasActive) dispatchRemove(state, playerId, replaced);
  if (replaced) discardCard(state, replaced, playerId);
  state.domainAttached[side] = player.hand.splice(cardIndex, 1)[0];
  if (!state.domainAttached.activeSide || wasActive) {
    state.domainAttached.activeSide = side;
    dispatchPlace(state, playerId, state.domainAttached[side], 'domain');
  }
  logEvent(state, { type: 'twofold_attach', playerId, side, cardId, replacedCardId: replaced?.id || null });
  return true;
}

// Switch the active flank. Only the placing player, on their turn, up to 2×/turn.
// Counts as a domain-change trigger but does NOT end the turn.
export function switchTwofoldDomain(state, playerId, side) {
  if (!isTwofold(state.domain) || !state.domainAttached) return false;
  if (state.domainPlacedBy !== playerId || state.currentPlayer !== playerId) return false;
  if (state.domainAttached.switchesThisTurn >= 2) return false;
  if (!state.domainAttached[side] || state.domainAttached.activeSide === side) return false;
  const previous = state.domainAttached[state.domainAttached.activeSide];
  if (previous) dispatchRemove(state, playerId, previous);
  state.domainAttached.activeSide = side;
  state.domainAttached.switchesThisTurn++;
  dispatchPlace(state, playerId, state.domainAttached[side], 'domain');
  logEvent(state, { type: 'twofold_switch', playerId, side, switchesLeft: 2 - state.domainAttached.switchesThisTurn });
  return true;
}

// Reset the per-turn switch counter at the start of the placing player's turn.
export function resetTwofoldSwitches(state, playerId) {
  if (state.domainAttached && state.domainPlacedBy === playerId) {
    state.domainAttached.switchesThisTurn = 0;
  }
}