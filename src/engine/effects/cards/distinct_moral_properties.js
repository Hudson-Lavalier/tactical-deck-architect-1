// ════════════════════════════════════════════════════════════════
// DISTINCT MORAL PROPERTIES (Moral Non-Naturalism — Alignment B / System)
//
// Core Distinction: Moral properties form a genuinely distinct kind of
//   property.
//
// Bonus Feature: While Distinct Moral Properties is active, once every
//   other turn you may designate 1 point from any of your point pools as
//   a Distinct Moral Point, up to a maximum of 3 Distinct Moral Points
//   at a time. Distinct Moral Points cannot be removed, stolen,
//   converted, changed, spent, or otherwise manipulated. You may
//   designate points from different point types. If Distinct Moral
//   Properties is forcibly removed or changed, all Distinct Moral Points
//   immediately return to their original point pools.
// ════════════════════════════════════════════════════════════════

import { claimOnceEveryOtherTurn, designateDistinctPoint, releaseDistinctPoints } from '../../effects/primitives';

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'turn_start') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    if (payload?.playerId !== owner) return;
    if (!claimOnceEveryOtherTurn(state, owner, 'distinct_moral_properties')) return;
    const player = state.players[owner];
    if (!player) return;
    // Designate 1 point from the first pool that has points.
    for (const t of ['A', 'B', 'C']) {
      if (player.points[t] > 0) {
        designateDistinctPoint(state, owner, t, 1);
        return;
      }
    }
  },

  onRemove(state, playerId, card) {
    // All Distinct Moral Points return to their original pools.
    releaseDistinctPoints(state, playerId);
  },
};