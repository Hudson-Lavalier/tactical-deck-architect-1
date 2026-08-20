// TEST: Boost Generation — Universal modifier.
// Attach to a persistent card; it generates 1 extra point of its type at the next round end.

import { addPoints } from '../../effects/primitives';

export default {
  onAttach(state, playerId, card, target) {
    if (!target || !target.card) return;
    // Grant the owner 1 bonus point of the target card's type immediately
    // (simplified: the "next round end" bonus is applied now for testing).
    const type = target.card.alignment;
    if (type) addPoints(state, playerId, type, 1, 'test_boost_generation');
  },
};