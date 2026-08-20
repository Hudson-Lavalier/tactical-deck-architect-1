// ════════════════════════════════════════════════════════════════
// CONSTRUCTIVE COGNITION (Idealism — Alignment B / System)
//
// Point Generation: At the end of each full round, both players gain
//   1 System point.
//
// Bonus Feature: While this Domain is active, whenever a player plays a
//   System-type card, they may draw one random card from either the
//   Metaphysics or Meta-Ethics pile. If the drawn card is System-type,
//   they may play it immediately. Otherwise, place it on the bottom of
//   its original pile.
//   This effect may trigger up to twice during each player's turn.
// ════════════════════════════════════════════════════════════════

import { addPoints, drawCards, claimOncePerTurn } from '../../effects/primitives';

export default {
  onRoundEnd(state) {
    addPoints(state, 'player', 'B', 1, 'domain');
    addPoints(state, 'opponent', 'B', 1, 'domain');
  },

  // When a System card is played, draw 1 random card. Up to twice per turn.
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'card_played') return;
    const { card, playerId } = payload;
    if (!card || card.alignment !== 'B') return;
    // Up to twice per turn per player
    if (!claimOncePerTurn(state, playerId, 'constructive_cognition_1')) {
      if (!claimOncePerTurn(state, playerId, 'constructive_cognition_2')) return;
    }
    // Draw 1 random card from a random pile
    const pileId = Math.random() < 0.5 ? 'metaphysics' : 'meta_ethics';
    const drawn = drawCards(state, playerId, pileId, 1);
    if (!drawn.length) return;
    const c = drawn[0];
    if (c.alignment !== 'B') {
      // Not System-type → place on bottom of its original pile
      const player = state.players[playerId];
      player.hand.pop(); // remove the drawn card
      state.drawPiles[pileId].push(c);
    }
    // If System-type, it stays in hand (may be played immediately).
  },
};