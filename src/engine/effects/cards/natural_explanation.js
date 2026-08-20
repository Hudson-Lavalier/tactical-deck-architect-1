// ════════════════════════════════════════════════════════════════
// NATURAL EXPLANATION (Moral Naturalism — Alignment A / Grounding)
//
// Core Distinction: Moral facts and values can be explained through
//   familiar features of the natural world.
//
// Bonus Feature: While Natural Explanation is active, once every 2 full
//   rounds, whenever your opponent removes, steals, or converts one or
//   more of your points, you may immediately place up to 2 cards from
//   your hand into your queue. If your queue is full when this ability
//   triggers, you may instead immediately play up to 2 cards from your
//   hand, even if it is not your turn. These immediate plays do not
//   count against your normal card-play allowance.
// ════════════════════════════════════════════════════════════════

import { claimOnceEveryOtherTurn, getOpponent } from '../../effects/primitives';
import { enqueueCard, getResolutionSpeed } from '../../queueSystem';

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'point_removed' && eventType !== 'point_converted') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    if (payload?.playerId !== owner) return; // your points were affected
    if (!claimOnceEveryOtherTurn(state, owner, 'natural_explanation')) return;
    const player = state.players[owner];
    if (!player) return;
    const domainAlign = state.domain?.alignment;
    let placed = 0;
    for (let i = 0; i < player.hand.length && placed < 2; i++) {
      const card = player.hand[i];
      if (player.queue.length < player.queueLimit) {
        const speed = getResolutionSpeed(card, { alignment: domainAlign });
        if (enqueueCard(state, owner, card, speed)) {
          player.hand.splice(i, 1);
          i--;
          placed++;
        }
      }
    }
  },
};