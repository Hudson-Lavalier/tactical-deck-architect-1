// TEST: Remove Point — Moral Judgment action.
// Remove 1 point from the opponent of the type they have the most of.

import { removePoints, getOpponent } from '../../effects/primitives';

export default {
  onPlay(state, playerId, card, targets) {
    const oppId = getOpponent(playerId);
    const opp = state.players[oppId];
    if (!opp) return;
    // Pick the type the opponent has the most of.
    let bestType = 'A';
    for (const t of ['A', 'B', 'C']) {
      if (opp.points[t] > opp.points[bestType]) bestType = t;
    }
    if (opp.points[bestType] > 0) removePoints(state, oppId, bestType, 1, 'test_remove_point');
  },
};