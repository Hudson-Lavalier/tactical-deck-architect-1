// ════════════════════════════════════════════════════════════════
// SYSTEMATIC ERROR (Error Theory — Alignment B / System)
//
// Core Distinction: Because moral discourse attempts to describe moral
//   facts that do not exist, moral claims systematically fail.
//
// Bonus Feature: If an effect is applied to one of your queued cards,
//   or one of your cards is blocked, you may discard 1 card from your
//   own queue to nullify that effect or block.
// ════════════════════════════════════════════════════════════════

import { removeQueueCard, discardCard } from '../../effects/primitives';

export default {
  onEvent(state, owner, eventType, payload) {
    // When one of your queued cards would be cancelled, discard a queue card to nullify.
    if (eventType !== 'before:effect_cancelled') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    if (payload?.playerId !== owner) return;
    const player = state.players[owner];
    if (!player || player.queue.length === 0) return;
    // Discard the last card in your queue to nullify the cancellation.
    const item = player.queue[player.queue.length - 1];
    removeQueueCard(state, owner, player.queue.length - 1);
    discardCard(state, item.card, owner);
    return { cancel: true }; // nullify the cancellation
  },
};