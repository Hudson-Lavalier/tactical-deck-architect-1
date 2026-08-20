// ════════════════════════════════════════════════════════════════
// MISSING PROPERTIES (Error Theory — Alignment B / System)
//
// Core Distinction: The objective moral properties or facts
//   presupposed by ordinary moral discourse are absent from reality.
//
// Bonus Feature: While Missing Properties is active, every other turn
//   you may choose 1 card in your opponent's queue and return it to
//   their hand. Any protections, designations, revealed status, or
//   other effects currently applied to that card are nullified when it
//   returns to their hand.
// ════════════════════════════════════════════════════════════════

import { bounceQueueCard, claimOnceEveryOtherTurn, getOpponent } from '../../effects/primitives';

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'turn_start') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    if (payload?.playerId !== owner) return;
    if (!claimOnceEveryOtherTurn(state, owner, 'missing_properties_bounce')) return;
    const oppId = getOpponent(owner);
    const oppQueue = state.players[oppId]?.queue || [];
    if (oppQueue.length === 0) return;
    bounceQueueCard(state, oppId, 0); // bounce first queued card
  },
};