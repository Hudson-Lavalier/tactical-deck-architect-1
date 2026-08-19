// Point system — tracking, 12-point limit, and victory checks.
//
// Per framework:
//   - Type A: Grounding Points
//   - Type B: System Points
//   - Type C: Adaptation Points
//   - Players can hold no more than 12 points total
//   - Unwanted points must be converted, spent, or removed
//   - Win by reaching exact 12-point configuration matching victory profile

import { POINT_LIMIT, ALIGNMENT } from '../data/gameConstants';
import { checkVictory } from '../data/victoryProfiles';
import { logEvent } from './gameState';

// Add points to a player (respects 12-point limit)
export function addPoints(state, playerId, type, amount) {
  const player = state.players[playerId];
  const currentTotal = player.points.A + player.points.B + player.points.C;
  const space = POINT_LIMIT - currentTotal;
  const actual = Math.min(amount, Math.max(0, space));

  player.points[type] += actual;
  logEvent(state, { type: 'points_added', playerId, pointType: type, amount: actual });

  // Check victory
  if (checkVictory(player.points, player.victoryProfile)) {
    state.winner = playerId;
    state.phase = 'game_over';
    logEvent(state, { type: 'victory', playerId });
  }

  return actual;
}

// Remove points from a player
export function removePoints(state, playerId, type, amount) {
  const player = state.players[playerId];
  const actual = Math.min(amount, player.points[type]);

  player.points[type] -= actual;
  logEvent(state, { type: 'points_removed', playerId, pointType: type, amount: actual });
  return actual;
}

// Steal points from opponent
export function stealPoints(state, fromPlayerId, toPlayerId, type, amount) {
  const stolen = removePoints(state, fromPlayerId, type, amount);
  const gained = addPoints(state, toPlayerId, type, stolen);
  logEvent(state, { type: 'points_stolen', from: fromPlayerId, to: toPlayerId, type, amount: gained });
  return gained;
}

// Convert points from one type to another
export function convertPoints(state, playerId, fromType, toType, amount) {
  const player = state.players[playerId];
  const currentTotal = player.points.A + player.points.B + player.points.C;
  const space = POINT_LIMIT - currentTotal;
  const actualFrom = Math.min(amount, player.points[fromType]);

  player.points[fromType] -= actualFrom;

  // Converting doesn't add total, just changes type — but still respect limit
  const actualTo = Math.min(actualFrom, Math.max(0, space + actualFrom));
  player.points[toType] += actualTo;

  logEvent(state, { type: 'points_converted', playerId, fromType, toType, amount: actualTo });
  return actualTo;
}

// Get total points for a player
export function getTotalPoints(player) {
  return player.points.A + player.points.B + player.points.C;
}

// Check if player has reached their victory configuration
export function checkPlayerVictory(player) {
  return checkVictory(player.points, player.victoryProfile);
}

// Get point breakdown for display
export function getPointBreakdown(player) {
  return {
    A: player.points.A,
    B: player.points.B,
    C: player.points.C,
    total: getTotalPoints(player),
    limit: POINT_LIMIT,
    victoryProfile: player.victoryProfile,
  };
}