// ════════════════════════════════════════════════════════════════
// PHYSICAL SUPERVENIENCE (Physicalism — Alignment A / Grounding)
//
// Point Generation: At the end of every second full round, the player
//   who placed this Domain gains 1 Grounding point. The opposing player
//   does not receive this base point generation.
//
// Bonus Feature: Physical Derivation
//   While this Domain is active, whenever either player gains one or
//   more Grounding points from a non-domain source, that player gains
//   1 additional Grounding point.
// ════════════════════════════════════════════════════════════════

import { addPoints } from '../../effects/primitives';

export default {
  onRoundEnd(state) {
    // Only the placer gains, and only every 2nd full round.
    if (state.domainDuration > 0 && state.domainDuration % 2 === 0) {
      addPoints(state, state.domainPlacedBy, 'A', 1, 'domain');
    }
  },

  // Physical Derivation — bonus Grounding point on non-domain Grounding gains.
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'point_added') return;
    if (payload.type !== 'A') return;
    if (payload.source === 'domain') return; // only non-domain sources
    if (payload.amount <= 0) return;
    // The player who gained the point gets +1 Grounding.
    addPoints(state, payload.playerId, 'A', 1, 'physical_derivation');
  },
};