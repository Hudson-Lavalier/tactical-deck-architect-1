// ════════════════════════════════════════════════════════════════
// MORALITY IS CONSTRUCTED (Moral Constructivism — Alignment C / Adaptation)
//
// Core Distinction: Normative truths are constituted through some
//   suitable process of construction.
//
// Bonus Feature: While Morality Is Constructed is active, once per turn
//   you may use one of the following construction options:
//   - Spend 1 Adaptation point to draw 1 guaranteed Adaptation-type
//     single-use card from the single-use card pool.
//   - Exchange 1 Adaptation Moral Reality or Moral Grounding card from
//     your hand for 1 Adaptation point.
//   - Spend 2 points of any type or combination to draw 1 guaranteed
//     Adaptation-type Moral Reality or Moral Grounding card.
//   You may use only one of these options per turn.
// ════════════════════════════════════════════════════════════════

import { removePoints, addPoints, drawTypedCard, claimOncePerTurn } from '../../effects/primitives';

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'turn_start') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    if (payload?.playerId !== owner) return;
    if (!claimOncePerTurn(state, owner, 'morality_is_constructed')) return;
    const player = state.players[owner];
    if (!player) return;

    // Option 1: spend 1 Adaptation to draw a guaranteed Adaptation single-use card.
    if (player.points.C >= 1) {
      removePoints(state, owner, 'C', 1, 'morality_is_constructed');
      drawTypedCard(state, owner, 'meta_ethics', 'C', 'moral_judgment');
      return;
    }
    // Option 2: exchange an Adaptation MR/MG card from hand for 1 Adaptation point.
    const adaptCardIdx = player.hand.findIndex(
      (c) => c.alignment === 'C' && (c.category === 'moral_reality' || c.category === 'moral_grounding'),
    );
    if (adaptCardIdx >= 0) {
      player.hand.splice(adaptCardIdx, 1);
      addPoints(state, owner, 'C', 1, 'morality_is_constructed');
      return;
    }
    // Option 3: spend 2 points to draw a guaranteed Adaptation MR/MG card.
    const total = player.points.A + player.points.B + player.points.C;
    if (total >= 2) {
      // Spend 2 from the largest pool.
      for (const t of ['C', 'B', 'A']) {
        if (player.points[t] >= 2) {
          removePoints(state, owner, t, 2, 'morality_is_constructed');
          drawTypedCard(state, owner, 'meta_ethics', 'C', null);
          return;
        }
      }
      // Split across pools
      let remaining = 2;
      for (const t of ['C', 'B', 'A']) {
        const spend = Math.min(player.points[t], remaining);
        if (spend > 0) { removePoints(state, owner, t, spend, 'morality_is_constructed'); remaining -= spend; }
        if (remaining <= 0) break;
      }
      if (remaining <= 0) drawTypedCard(state, owner, 'meta_ethics', 'C', null);
    }
  },
};