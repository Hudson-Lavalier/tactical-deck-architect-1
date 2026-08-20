import { addQueueTurns, getOpponent } from '../../effects/primitives';

export default {
  getInteraction(state, playerId, card) {
    const oppId = getOpponent(playerId);
    const playerQueue = state.players[playerId]?.queue || [];
    const oppQueue = state.players[oppId]?.queue || [];

    const options = [];
    const queueCards = [];

    // Opponent queued cards
    oppQueue.forEach((item, idx) => {
      const c = item.card || { id: `opp_q_${idx}`, name: `Opponent Queue #${idx + 1}` };
      queueCards.push({
        ...c,
        id: `opp_${idx}`,
        name: `[OPP] ${c.name} (Row ${item.row})`,
        turnsRemaining: item.turnsRemaining,
      });
      options.push({
        id: `opp_${idx}`,
        label: `Opponent Card in Row ${item.row}: ${c.name || 'Face-down construct'}`,
        description: `Delay opponent card by +1 turn (currently ${item.turnsRemaining} turn${item.turnsRemaining > 1 ? 's' : ''} left)`,
        color: '#ff4444',
      });
    });

    // Player queued cards
    playerQueue.forEach((item, idx) => {
      const c = item.card || { id: `player_q_${idx}`, name: `Your Queue #${idx + 1}` };
      queueCards.push({
        ...c,
        id: `player_${idx}`,
        name: `[YOU] ${c.name} (Row ${item.row})`,
        turnsRemaining: item.turnsRemaining,
      });
      options.push({
        id: `player_${idx}`,
        label: `Your Card in Row ${item.row}: ${c.name || 'Queued construct'}`,
        description: `Delay your card by +1 turn (currently ${item.turnsRemaining} turn${item.turnsRemaining > 1 ? 's' : ''} left)`,
        color: '#38bdf8',
      });
    });

    if (options.length === 0) {
      options.push({
        id: 'no_queue',
        label: 'No Queued Cards on Board',
        description: 'Universal modifier will resolve without active queue target',
        disabled: false,
        color: '#888888',
      });
    }

    return {
      type: 'test_universal_extend_duration',
      title: 'EXTEND DURATION: CHOOSE TARGET',
      subtitle: 'SELECT A QUEUED CARD TO EXTEND ITS QUEUE DELAY BY +1 TURN',
      card,
      options,
      cards: queueCards,
    };
  },

  onAttach(state, playerId, card, target = {}) {
    const choice = target.selectedOptionId || target.selectedCardId;
    if (choice && choice.startsWith('opp_')) {
      const idx = parseInt(choice.replace('opp_', ''), 10);
      const oppId = getOpponent(playerId);
      addQueueTurns(state, oppId, idx, 1);
      return;
    }
    if (choice && choice.startsWith('player_')) {
      const idx = parseInt(choice.replace('player_', ''), 10);
      addQueueTurns(state, playerId, idx, 1);
      return;
    }

    // Direct target from queue click
    if (target.queueIndex !== undefined) {
      addQueueTurns(state, target.playerId || playerId, target.queueIndex, 1);
    }
  },
};
