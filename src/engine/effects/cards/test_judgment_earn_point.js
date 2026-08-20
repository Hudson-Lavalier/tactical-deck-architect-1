import { addPoints } from '../../effects/primitives';
import { getDomainAlignment } from '../../domainSystem';

export default {
  getInteraction(state, playerId, card) {
    const domainAlign = getDomainAlignment(state) || 'A';
    return {
      type: 'test_judgment_earn_point',
      title: 'EARN POINT: CHOOSE POINT TYPE',
      subtitle: 'SELECT WHICH CONSTRUCT POINT TO ADD TO YOUR TOTAL',
      card,
      options: [
        {
          id: 'A',
          label: 'Grounding Point (+1)',
          description: 'Add 1 Grounding point to your score',
          color: '#38bdf8',
        },
        {
          id: 'B',
          label: 'System Point (+1)',
          description: 'Add 1 System point to your score',
          color: '#a855f7',
        },
        {
          id: 'C',
          label: 'Adaptation Point (+1)',
          description: 'Add 1 Adaptation point to your score',
          color: '#00ff41',
        },
        {
          id: 'domain_match',
          label: `Match Active Domain (+1 ${domainAlign})`,
          description: `Automatically earn 1 point matching current active Domain (${domainAlign})`,
          color: '#eab308',
        },
      ],
    };
  },

  onPlay(state, playerId, card, targets = {}) {
    let type = targets.selectedOptionId;
    if (!type || type === 'domain_match' || !['A', 'B', 'C'].includes(type)) {
      type = getDomainAlignment(state) || 'A';
    }
    addPoints(state, playerId, type, 1, 'test_earn_point');
  },
};
