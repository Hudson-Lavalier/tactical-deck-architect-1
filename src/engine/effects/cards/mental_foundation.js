// ════════════════════════════════════════════════════════════════
// MENTAL FOUNDATION (Idealism — Alignment B / System)
//
// Point Generation: At the end of each full round, both players gain
//   1 System point.
//
// Bonus Feature: While this Domain is active, any player with a system
//   type Moral Grounding, system type Moral Reality and system type
//   theory of time in play then that player's system points cannot be
//   reduced or converted by anything at any time.
// ════════════════════════════════════════════════════════════════

import { addPoints } from '../../effects/primitives';

// Check if a player has all three System-type persistent cards.
function hasSystemTrifecta(state, playerId) {
  const slots = state.players[playerId]?.persistentSlots;
  if (!slots) return false;
  return (
    slots.left?.alignment === 'B' &&   // Theory of Time
    slots.middle?.alignment === 'B' && // Moral Reality
    slots.right?.alignment === 'B'    // Moral Grounding
  );
}

export default {
  onRoundEnd(state) {
    addPoints(state, 'player', 'B', 1, 'domain');
    addPoints(state, 'opponent', 'B', 1, 'domain');
  },

  // System points of a player with the System trifecta cannot be reduced/converted.
  onEvent(state, owner, eventType, payload) {
    if (eventType === 'before:point_removed' || eventType === 'before:point_converted') {
      if (payload.type !== 'B' && payload.fromType !== 'B') return;
      const targetId = payload.playerId;
      if (hasSystemTrifecta(state, targetId)) return { cancel: true };
    }
  },
};