// ════════════════════════════════════════════════════════════════
// IRREDUCIBLE MORALITY (Moral Non-Naturalism — Alignment B / System)
//
// Core Distinction: Moral reality cannot be completely translated into
//   or reduced to natural or nonnormative facts.
//
// Bonus Feature: While Irreducible Morality is active, choose 1 point
//   type. That point pool cannot be removed, stolen, converted,
//   manipulated, or otherwise altered by any effect. While this toggle
//   is active, you also cannot gain points of the chosen type by any
//   means. You may activate, deactivate, or change the chosen point
//   type once every other turn.
// ════════════════════════════════════════════════════════════════

import { claimOnceEveryOtherTurn } from '../../effects/primitives';

export default {
  onPlace(state, playerId, card) {
    const player = state.players[playerId];
    if (!player) return;
    // Auto-lock the player's most common alignment type.
    const counts = { A: 0, B: 0, C: 0 };
    for (const a of (player.alignments || [])) if (counts[a] !== undefined) counts[a]++;
    let bestType = 'B';
    for (const t of ['A', 'B', 'C']) if (counts[t] > counts[bestType]) bestType = t;
    player.pointPoolLock = { A: false, B: false, C: false };
    player.pointPoolLock[bestType] = true;
    player._irreducibleType = bestType;
  },

  onEvent(state, owner, eventType, payload) {
    if (owner !== 'player' && owner !== 'opponent') return;
    // Prevent removal/conversion of the locked pool.
    if (eventType === 'before:point_removed' || eventType === 'before:point_converted') {
      const player = state.players[owner];
      const lockedType = player?._irreducibleType;
      if (!lockedType) return;
      if (payload?.playerId !== owner) return;
      if (eventType === 'before:point_removed' && payload?.type === lockedType) return { cancel: true };
      if (eventType === 'before:point_converted' && (payload?.fromType === lockedType || payload?.toType === lockedType)) return { cancel: true };
    }
  },

  onRemove(state, playerId, card) {
    const player = state.players[playerId];
    if (player) {
      player.pointPoolLock = { A: false, B: false, C: false };
      player._irreducibleType = null;
    }
  },
};