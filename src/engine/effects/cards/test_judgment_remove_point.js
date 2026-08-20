import { removePoints, getOpponent } from '../../effects/primitives';

export default {
  getInteraction(state, playerId, card) {
    const oppId = getOpponent(playerId);
    const opp = state.players[oppId];
    const pts = opp ? opp.points : { A: 0, B: 0, C: 0 };

    return {
      type: 'test_judgment_remove_point',
      title: 'REMOVE POINT: CHOOSE TARGET POOL',
      subtitle: `TARGET OPPONENT'S POINT POOL TO REDUCE BY 1`,
      card,
      options: [
        {
          id: 'A',
          label: `Grounding Point Pool (${pts.A || 0} pts)`,
          description: 'Remove 1 Grounding point from the opponent',
          disabled: (pts.A || 0) <= 0,
          color: '#38bdf8',
        },
        {
          id: 'B',
          label: `System Point Pool (${pts.B || 0} pts)`,
          description: 'Remove 1 System point from the opponent',
          disabled: (pts.B || 0) <= 0,
          color: '#a855f7',
        },
        {
          id: 'C',
          label: `Adaptation Point Pool (${pts.C || 0} pts)`,
          description: 'Remove 1 Adaptation point from the opponent',
          disabled: (pts.C || 0) <= 0,
          color: '#00ff41',
        },
        {
          id: 'highest',
          label: 'Highest Available Pool (Auto-detect)',
          description: 'Remove 1 point from whichever pool the opponent has the most in',
          color: '#eab308',
        },
      ],
    };
  },

  onPlay(state, playerId, card, targets = {}) {
    const oppId = getOpponent(playerId);
    const opp = state.players[oppId];
    if (!opp) return;

    let targetType = targets.selectedOptionId;
    if (!targetType || targetType === 'highest' || !['A', 'B', 'C'].includes(targetType)) {
      targetType = 'A';
      for (const t of ['A', 'B', 'C']) {
        if (opp.points[t] > opp.points[targetType]) targetType = t;
      }
    }

    if (opp.points[targetType] > 0) {
      removePoints(state, oppId, targetType, 1, 'test_remove_point');
    }
  },
};
