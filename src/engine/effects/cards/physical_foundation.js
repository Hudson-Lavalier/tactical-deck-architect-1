// ════════════════════════════════════════════════════════════════
// PHYSICAL FOUNDATION (Physicalism — Alignment A / Grounding)
//
// Point Generation: At the end of each full round, both players gain 1
//   Grounding point.
//
// Bonus Feature: Physical Barrier
//   This Domain cannot be changed or replaced by the opposing player
//   until 2 full rounds have passed since it was placed.
// ════════════════════════════════════════════════════════════════

import { addPoints } from '../../effects/primitives';

export default {
  onRoundEnd(state) {
    addPoints(state, 'player', 'A', 1, 'domain');
    addPoints(state, 'opponent', 'A', 1, 'domain');
  },

  // Physical Barrier — opponent cannot change the domain for 2 full rounds.
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'before:domain_change_attempted') return;
    if (payload.playerId === state.domainPlacedBy) return; // placer can always change
    if (state.domainDuration < 2) return { cancel: true };
  },
};