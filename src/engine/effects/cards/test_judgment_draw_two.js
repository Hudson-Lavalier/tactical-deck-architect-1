// TEST: Draw Two — Moral Judgment action.
// Place this card to immediately draw 2 cards from the Metaphysics pile.

import { drawCards } from '../../effects/primitives';

export default {
  onPlay(state, playerId, card, targets) {
    drawCards(state, playerId, 'metaphysics', 2);
  },
};