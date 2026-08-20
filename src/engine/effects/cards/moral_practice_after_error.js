// ════════════════════════════════════════════════════════════════
// MORAL PRACTICE AFTER ERROR (Error Theory — Alignment B / System)
//
// Core Distinction: After recognizing moral error, moral language may
//   be abandoned, revised, or retained as a useful fiction.
//
// Bonus Feature: While Moral Practice After Error is active, every
//   other turn, whenever a card in your queue is removed, changed, or
//   otherwise affected by your opponent, you may immediately play 1
//   card from your hand into your queue. This ability may be used
//   during your opponent's turn.
// ════════════════════════════════════════════════════════════════

import { claimOnceEveryOtherTurn, getOpponent } from '../../effects/primitives';
import { enqueueCard, getResolutionSpeed } from '../../queueSystem';

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'queue_bounce' && eventType !== 'queue_removed') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    // Only react when the opponent affected your queue.
    if (payload?.playerId !== owner) return;
    if (!claimOnceEveryOtherTurn(state, owner, 'moral_practice_after_error')) return;
    const player = state.players[owner];
    if (!player || player.hand.length === 0) return;
    if (player.queue.length >= player.queueLimit) return;
    const card = player.hand[0];
    const speed = getResolutionSpeed(card, { alignment: state.domain?.alignment });
    enqueueCard(state, owner, card, speed);
  },
};