// ════════════════════════════════════════════════════════════════
// FACTUAL APPEARANCE (Error Theory — Alignment B / System)
//
// Core Distinction: Moral language presents itself as factual.
//
// Bonus Feature: While Factual Appearance is active, once per turn you
//   may swap 1 card in your queue that has exactly 1 turn remaining
//   with 1 card from your hand. The replacement card takes the queued
//   card's position and remaining queue duration. If the original
//   queued card was revealed or had any effects applied to it, the
//   replacement card does not inherit those states.
// ════════════════════════════════════════════════════════════════

import { swapQueueCard, claimOncePerTurn } from '../../effects/primitives';

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'turn_start') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    if (payload?.playerId !== owner) return;
    if (!claimOncePerTurn(state, owner, 'factual_appearance_swap')) return;
    const player = state.players[owner];
    if (!player || player.hand.length === 0) return;
    const idx = player.queue.findIndex((q) => q.turnsRemaining === 1);
    if (idx < 0) return;
    swapQueueCard(state, owner, idx, player.hand[0].id);
  },
};