// Resolution engine — determines how and when cards resolve.
//
// This module ties together the queue system and domain system to
// determine resolution timing for action cards.

import { getResolutionSpeed, getStartingRow } from './queueSystem';
import { getDomainAlignment } from './domainSystem';

// Determine how a card should be played given the current domain
export function determinePlayMode(state, card) {
  const domainAlignment = getDomainAlignment(state);

  if (!domainAlignment) {
    // No domain active — default to neutral (Row 1)
    return { speed: 'row1', row: 1, immediate: false };
  }

  const speed = getResolutionSpeed(card, { alignment: domainAlignment });
  const row = getStartingRow(speed);
  const immediate = speed === 'immediate';

  return { speed, row, immediate };
}

// Check if a card can be played this turn
// Per framework: the amount of action cards you can play is dictated
// by the Domain and active abilities (Theory of Time).
export function canPlayActionCard(state, playerId, card) {
  const player = state.players[playerId];

  // Must have the card in hand
  if (!player.hand.find((c) => c.id === card.id)) return false;

  // Queue must not be full (unless card resolves immediately)
  const playMode = determinePlayMode(state, card);
  if (!playMode.immediate && player.queue.length >= player.queueLimit) return false;

  return true;
}

// Get the number of action cards a player can play this turn
// Base: 1 per turn. Theory of Time may allow more.
// This is a placeholder — actual allowances depend on user-defined
// Theory of Time card effects.
export function getActionAllowance(state, playerId) {
  const player = state.players[playerId];
  let base = 1;

  // Theory of Time persistent card may modify this
  // (effect will be applied once user defines Theory of Time cards)
  const theoryOfTime = player.persistentSlots.left;
  if (theoryOfTime && theoryOfTime.effect) {
    // Placeholder: Theory of Time effect handling goes here
  }

  return base;
}