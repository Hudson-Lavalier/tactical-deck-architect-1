// ════════════════════════════════════════════════════════════════
// VALID CONSTRUCTION (Moral Constructivism — Alignment C / Adaptation)
//
// Core Distinction: A legitimate construction depends on satisfying the
//   correct procedure or conditions.
//
// Bonus Feature: Valid Procedure — While Valid Construction is active:
//   Once every other turn, whenever an opponent's Moral Reality or Moral
//   Grounding card modifies, adds to, changes, or otherwise contributes
//   to an effect that would alter one or more of your points, you may
//   completely negate the contribution made by that Moral Reality or
//   Moral Grounding card, so long as at least 1 of the affected points
//   is an Adaptation point. This does not cancel the originating
//   single-use card — only the MR/MG contribution is negated.
//   If an opponent's active Adaptation-type MR/MG card directly removes,
//   steals, converts, or changes your Adaptation points through its own
//   Bonus Feature, that effect is completely negated while Valid
//   Construction remains active.
// ════════════════════════════════════════════════════════════════

import { claimOnceEveryOtherTurn, getOpponent } from '../../effects/primitives';

export default {
  onEvent(state, owner, eventType, payload) {
    if (owner !== 'player' && owner !== 'opponent') return;
    // Negate effects on your Adaptation points from opponent's Adaptation MR/MG.
    if (eventType === 'before:point_removed' || eventType === 'before:point_converted') {
      if (payload?.playerId !== owner) return;
      const isAdaptation =
        (eventType === 'before:point_removed' && payload?.type === 'C') ||
        (eventType === 'before:point_converted' && (payload?.fromType === 'C' || payload?.toType === 'C'));
      if (!isAdaptation) return;
      // Check if the source is the opponent's Adaptation MR/MG bonus feature.
      const oppId = getOpponent(owner);
      const oppSlots = state.players[oppId]?.persistentSlots;
      const oppAdaptMRMG =
        (oppSlots?.middle?.alignment === 'C') || (oppSlots?.right?.alignment === 'C');
      if (oppAdaptMRMG) {
        if (!claimOnceEveryOtherTurn(state, owner, 'valid_construction')) return;
        return { cancel: true };
      }
    }
  },
};