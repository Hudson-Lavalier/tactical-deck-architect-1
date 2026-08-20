// ════════════════════════════════════════════════════════════════
// REAL MORAL FACTS (Moral Non-Naturalism — Alignment B / System)
//
// Core Distinction: Moral facts genuinely exist, even though they are
//   not reducible to ordinary natural facts.
//
// Bonus Feature: While Real Moral Facts is active, you may choose either
//   your Theory of Time slot or your Moral Reality slot to disable. The
//   chosen slot may only be disabled if it is currently empty. Once
//   disabled, that slot cannot be used for the remainder of the time
//   Real Moral Facts remains active. After disabling a slot, choose 1
//   point type. The maximum number of points required from that point
//   pool for your victory condition is reduced by 3. Once activated:
//   you may not voluntarily change, remove, or replace Real Moral Facts
//   by any means. These effects end only if Real Moral Facts is changed
//   or removed by the opposing player.
// ════════════════════════════════════════════════════════════════

import { disableSlot, reduceVictoryRequirement } from '../../effects/primitives';

export default {
  onPlace(state, playerId, card) {
    const player = state.players[playerId];
    if (!player) return;
    // Auto-disable the first empty slot (ToT preferred, then Moral Reality).
    let slot = null;
    if (!player.persistentSlots.left) slot = 'left';
    else if (!player.persistentSlots.middle) slot = 'middle';
    if (slot) disableSlot(state, playerId, slot);

    // Reduce victory requirement by 3 for the player's most common alignment.
    const counts = { A: 0, B: 0, C: 0 };
    for (const a of (player.alignments || [])) if (counts[a] !== undefined) counts[a]++;
    let bestType = 'B';
    for (const t of ['A', 'B', 'C']) if (counts[t] > counts[bestType]) bestType = t;
    reduceVictoryRequirement(state, playerId, bestType, 3);

    // Mark this card as locked — cannot be voluntarily changed.
    player._realMoralFactsLocked = true;
  },

  onRemove(state, playerId, card) {
    const player = state.players[playerId];
    if (player) player._realMoralFactsLocked = false;
  },
};