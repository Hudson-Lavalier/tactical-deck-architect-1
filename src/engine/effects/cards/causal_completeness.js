// ════════════════════════════════════════════════════════════════
// CAUSAL COMPLETENESS (Physicalism — Alignment A / Grounding)
//
// Point Generation: At the end of each full round, both players gain
//   1 Grounding point.
//
// Bonus Feature: Sufficient Physical Cause
//   While this Domain is active, when a Grounding-type card would be
//   discarded after being used, its player may spend 1 Grounding point
//   to place that card back into their active hand instead of
//   discarding it.
//   This replacement effect may also prevent a Grounding card from
//   being discarded by another effect, including the loss of a reusable
//   or recharging status, provided the card is being discarded after
//   having been used.
//   This effect may be used once per turn.
// ════════════════════════════════════════════════════════════════

import { addPoints, removePoints, claimOncePerTurn } from '../../effects/primitives';

export default {
  onRoundEnd(state) {
    addPoints(state, 'player', 'A', 1, 'domain');
    addPoints(state, 'opponent', 'A', 1, 'domain');
  },

  // Sufficient Physical Cause — rescue a Grounding card from discard once/turn.
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'before:card_discarded') return;
    const { card, playerId } = payload;
    if (!card || card.alignment !== 'A') return; // only Grounding-type cards
    if (!playerId) return;
    const player = state.players[playerId];
    if (!player) return;
    // Once per turn
    if (!claimOncePerTurn(state, playerId, 'causal_completeness_rescue')) return;
    // Must have a Grounding point to spend
    if (player.points.A < 1) return;
    removePoints(state, playerId, 'A', 1, 'causal_completeness');
    // Return the card to hand instead of discarding
    if (player.hand.length < player.handLimit) {
      player.hand.push(card);
    }
    return { cancel: true }; // prevent the normal discard
  },
};