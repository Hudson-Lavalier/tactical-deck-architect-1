// ════════════════════════════════════════════════════════════════
// MORAL TRUTH (Moral Realism — Alignment A / Grounding)
//
// Core Distinction: Moral judgments function as claims capable of
//   being true or false.
//
// Bonus Feature: While Moral Truth is active, you may designate 1
//   face-up card in a queue as Truth. A card designated as Truth
//   cannot have its remaining queue duration increased, cannot be
//   canceled, and cannot be blocked when it goes into effect. You may
//   only have 1 card designated as Truth at a time.
// ════════════════════════════════════════════════════════════════

import { designateTruth, claimOncePerTurn } from '../../effects/primitives';

export default {
  onEvent(state, owner, eventType, payload) {
    // On your turn, designate the first face-up queued card as Truth.
    if (eventType === 'turn_start') {
      if (owner !== 'player' && owner !== 'opponent') return;
      if (payload?.playerId !== owner) return;
      if (!claimOncePerTurn(state, owner, 'moral_truth_designate')) return;
      const queue = state.players[owner]?.queue || [];
      const idx = queue.findIndex((q) => !q.faceDown && q.designated !== 'truth');
      if (idx >= 0) designateTruth(state, owner, idx);
      return;
    }
    // Prevent cancellation of Truth-designated cards.
    if (eventType === 'before:effect_cancelled') {
      const card = payload?.card;
      for (const pid of ['player', 'opponent']) {
        const q = state.players[pid]?.queue || [];
        if (q.some((item) => item.card?.id === card?.id && item.designated === 'truth')) {
          return { cancel: true };
        }
      }
    }
  },
};