// ════════════════════════════════════════════════════════════════
// REALITY FRONTIER (Growing-Block — Alignment C / Adaptation)
//
// Growing-Block System Effect: Accumulating Reality (see Accumulated
//   Reality).
//
// Bonus Feature: While Reality Frontier is active and an Adaptation
//   Domain is active, System-type cards may still be played and enter
//   the queue, but their queue timers are paused. They do not progress
//   toward resolution and cannot resolve naturally while this
//   condition remains active. A card or effect that specifically
//   overrides the queue may still cause them to resolve.
//   This paused state is not considered disadvantage and is unaffected
//   by effects that merely reduce or accelerate normal queue timing.
// ════════════════════════════════════════════════════════════════

import { resolveQueueImmediate, pauseQueueCard } from '../../effects/primitives';
import { getDomainAlignment } from '../../domainSystem';

export default {
  getAllowanceModifier(state, playerId, base) {
    const accumulated = 1 + Math.floor(state.domainDuration / 2);
    return Math.min(accumulated, 5);
  },

  // When a System card is queued while Adaptation domain is active, pause it.
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'card_queued') return;
    if (getDomainAlignment(state) !== 'C') return; // Adaptation domain
    const { card, playerId } = payload;
    if (!card || card.alignment !== 'B') return; // System-type only
    const player = state.players[playerId];
    if (!player) return;
    const idx = player.queue.findIndex((q) => q.card?.id === card.id);
    if (idx >= 0) pauseQueueCard(state, playerId, idx);
  },
};