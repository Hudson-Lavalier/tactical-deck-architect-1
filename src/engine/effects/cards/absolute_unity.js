// ════════════════════════════════════════════════════════════════
// ABSOLUTE UNITY (Idealism — Alignment B / System)
//
// Point Generation: At the end of each full round, both players gain
//   1 System point.
//
// Bonus Feature: Absolute Unity
//   When this Domain is placed, if the player who placed it has a
//   System-type Moral Grounding, System-type Moral Reality, System-type
//   Theory of Time, and a hand consisting entirely of System-type
//   cards, this Domain cannot be changed or replaced by any card,
//   ability, or effect.
//   The condition remains active only for as long as that player
//   continues to meet all four conditions. If any condition is broken,
//   the lock ends immediately and cannot reactivate unless this Domain
//   is placed again.
// ════════════════════════════════════════════════════════════════

import { addPoints } from '../../effects/primitives';

// Check if the placer meets all four Absolute Unity conditions.
function unityConditionsMet(state) {
  const pid = state.domainPlacedBy;
  const player = state.players[pid];
  if (!player) return false;
  const slots = player.persistentSlots;
  if (!slots) return false;
  if (slots.left?.alignment !== 'B') return false;   // Theory of Time
  if (slots.middle?.alignment !== 'B') return false; // Moral Reality
  if (slots.right?.alignment !== 'B') return false;  // Moral Grounding
  if (player.hand.length === 0) return false; // hand must consist entirely of System cards
  if (!player.hand.every((c) => c.alignment === 'B')) return false;
  return true;
}

export default {
  onRoundEnd(state) {
    addPoints(state, 'player', 'B', 1, 'domain');
    addPoints(state, 'opponent', 'B', 1, 'domain');
  },

  // Absolute Unity lock — cannot be changed while conditions hold.
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'before:domain_change_attempted') return;
    if (unityConditionsMet(state)) return { cancel: true };
  },
};