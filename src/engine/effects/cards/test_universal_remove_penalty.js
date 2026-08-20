import { resumeQueueCard, getOpponent } from '../../effects/primitives';

export default {
  getInteraction(state, playerId, card) {
    const oppId = getOpponent(playerId);
    const playerQueue = state.players[playerId]?.queue || [];
    const oppQueue = state.players[oppId]?.queue || [];

    const options = [];
    const queueCards = [];

    // Player queued cards
    playerQueue.forEach((item, idx) => {
      const c = item.card || { id: `player_q_${idx}`, name: `Your Queue #${idx + 1}` };
      const isDelayedOrPaused = item.paused || item.row > 1;
      queueCards.push({
        ...c,
        id: `player_${idx}`,
        name: `[YOU] ${c.name} (Row ${item.row})`,
      });
      options.push({
        id: `player_${idx}`,
        label: `Your Card in Row ${item.row}: ${c.name || 'Construct'}`,
        description: `Remove delay/paused penalties (${item.paused ? 'PAUSED' : `Row ${item.row}, ${item.turnsRemaining} turns remaining`})`,
        color: isDelayedOrPaused ? '#00ff41' : '#38bdf8',
      });
    });

    // Opponent queued cards
    oppQueue.forEach((item, idx) => {
      const c = item.card || { id: `opp_q_${idx}`, name: `Opponent Queue #${idx + 1}` };
      queueCards.push({
        ...c,
        id: `opp_${idx}`,
        name: `[OPP] ${c.name} (Row ${item.row})`,
      });
      options.push({
        id: `opp_${idx}`,
        label: `Opponent Card in Row ${item.row}: ${c.name || 'Construct'}`,
        description: `Clear pause/delay status on opponent's queued card`,
        color: '#ff4444',
      });
    });

    if (options.length === 0) {
      options.push({
        id: 'no_queue',
        label: 'No Queued Cards Active',
        description: 'Modifier will resolve cleanly without target queue penalty',
        color: '#888888',
      });
    }

    return {
      type: 'test_universal_remove_penalty',
      title: 'REMOVE PENALTY: CHOOSE TARGET',
      subtitle: 'SELECT A QUEUED CARD TO CLEAR PAUSED / DELAYED STATUS',
      card,
      options,
      cards: queueCards,
    };
  },

  onAttach(state, playerId, card, target = {}) {
    const choice = target.selectedOptionId || target.selectedCardId;
    if (choice && choice.startsWith('player_')) {
      const idx = parseInt(choice.replace('player_', ''), 10);
      resumeQueueCard(state, playerId, idx);
      return;
    }
    if (choice && choice.startsWith('opp_')) {
      const idx = parseInt(choice.replace('opp_', ''), 10);
      const oppId = getOpponent(playerId);
      resumeQueueCard(state, oppId, idx);
      return;
    }

    if (target && target.queueIndex !== undefined) {
      resumeQueueCard(state, target.playerId || playerId, target.queueIndex);
    }
  },
};
