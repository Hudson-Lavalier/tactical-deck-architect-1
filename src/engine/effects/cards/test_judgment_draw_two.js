import { drawCards } from '../../effects/primitives';

export default {
  // Returns interactive modal configuration when played by a human user
  getInteraction(state, playerId, card) {
    return {
      type: 'test_judgment_draw_two',
      title: 'DRAW TWO: CHOOSE SOURCE',
      subtitle: 'SELECT FROM WHICH PILE(S) TO DRAW 2 CARDS',
      card,
      options: [
        {
          id: 'meta_both',
          label: '2x Metaphysics Cards',
          description: 'Draw 2 cards from Metaphysics draw pile (Domain, Theory of Time, Universals)',
          color: '#38bdf8',
        },
        {
          id: 'ethics_both',
          label: '2x Meta-Ethics Cards',
          description: 'Draw 2 cards from Meta-Ethics draw pile (Moral Reality, Grounding, Judgment)',
          color: '#a855f7',
        },
        {
          id: 'split',
          label: '1x Metaphysics + 1x Meta-Ethics',
          description: 'Draw 1 card from Metaphysics and 1 card from Meta-Ethics',
          color: '#00ff41',
        },
      ],
    };
  },

  onPlay(state, playerId, card, targets = {}) {
    const choice = targets.selectedOptionId || 'meta_both';
    if (choice === 'ethics_both') {
      drawCards(state, playerId, 'meta_ethics', 2);
    } else if (choice === 'split') {
      drawCards(state, playerId, 'metaphysics', 1);
      drawCards(state, playerId, 'meta_ethics', 1);
    } else {
      drawCards(state, playerId, 'metaphysics', 2);
    }
  },
};
