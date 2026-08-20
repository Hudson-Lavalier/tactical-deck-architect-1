// Resolution engine — determines how and when cards resolve.
//
// This module ties together the queue system and domain system to
// determine resolution timing for action cards.

import { getResolutionSpeed, getStartingRow } from './queueSystem';
import { getDomainAlignment } from './domainSystem';
import { getAllowance } from './effects/primitives';

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

// Get the number of action cards a player can play this turn.
// Base: 1 per turn. Theory of Time persistent cards may modify this via their
// getAllowanceModifier handler (Presentism extra play, Growing-Block accumulation, etc.).
export function getActionAllowance(state, playerId) {
  return getAllowance(state, playerId);
}