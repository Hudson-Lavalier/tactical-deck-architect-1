// ════════════════════════════════════════════════════════════════
// MARKS OF MIND (Dualism — Alignment C / Adaptation)
//
// Point Generation: At the end of each full round, both players gain
//   1 Adaptation point.
//
// Bonus Feature: When this Domain is placed, the player who placed it
//   gains Domain-Mind Link. This effect remains active for as long as
//   Marks of Mind remains the active Domain.
//
// Domain-Mind Link: While this link is active, whenever another player
//   would remove, steal, convert, or otherwise change one or more of
//   your Adaptation points, that effect is nullified. You then gain 1
//   Adaptation point.
//   Additionally, whenever another player changes one of your
//   non-Adaptation points into a different non-Adaptation point, you
//   may immediately convert that point into an Adaptation point at no
//   cost.
// ════════════════════════════════════════════════════════════════

import { addPoints, convertPoints } from '../../effects/primitives';

export default {
  onPlace(state) {
    // Domain-Mind Link is active while this domain is active.
    // (No explicit state needed — the onEvent handler below enforces it.)
  },

  onRoundEnd(state) {
    addPoints(state, 'player', 'C', 1, 'domain');
    addPoints(state, 'opponent', 'C', 1, 'domain');
  },

  onEvent(state, owner, eventType, payload) {
    const pid = state.domainPlacedBy;
    // Nullify Adaptation point removal/steal/convert from the placer.
    if (eventType === 'before:point_removed' || eventType === 'before:point_converted') {
      if (payload.playerId !== pid) return;
      if (eventType === 'before:point_removed' && payload.type === 'C') {
        // Nullify and grant 1 Adaptation.
        addPoints(state, pid, 'C', 1, 'domain_mind_link');
        return { cancel: true };
      }
      if (eventType === 'before:point_converted' && payload.fromType === 'C') {
        addPoints(state, pid, 'C', 1, 'domain_mind_link');
        return { cancel: true };
      }
    }
    // Non-Adaptation → different non-Adaptation: may convert to Adaptation.
    if (eventType === 'point_converted' && payload.playerId === pid) {
      if (payload.fromType !== 'C' && payload.toType !== 'C' && payload.fromType !== payload.toType) {
        convertPoints(state, pid, payload.toType, 'C', payload.amount, 'domain_mind_link');
      }
    }
  },
};