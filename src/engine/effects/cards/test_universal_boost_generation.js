import { addPoints } from '../../effects/primitives';

export default {
  getInteraction(state, playerId, card) {
    const player = state.players[playerId];
    const slots = player?.persistentSlots || {};

    const options = [];
    const slotCards = [];

    const slotNames = {
      left: 'Theory of Time (Left Slot)',
      middle: 'Moral Reality (Middle Slot)',
      right: 'Moral Grounding (Right Slot)',
    };

    ['left', 'middle', 'right'].forEach((slot) => {
      const placed = slots[slot];
      if (placed) {
        slotCards.push({
          ...placed,
          id: slot,
          name: `[${placed.alignment}] ${placed.name}`,
        });
        options.push({
          id: slot,
          label: `${slotNames[slot]}: ${placed.name}`,
          description: `Generate +1 ${placed.alignment || 'bonus'} point immediately from this construct`,
          color: placed.alignment === 'A' ? '#38bdf8' : placed.alignment === 'B' ? '#a855f7' : '#00ff41',
        });
      }
    });

    if (options.length === 0) {
      options.push({
        id: 'A',
        label: 'Direct Grounding Generation (+1 A)',
        description: 'No persistent cards in slots; boost Grounding pool directly',
        color: '#38bdf8',
      });
      options.push({
        id: 'B',
        label: 'Direct System Generation (+1 B)',
        description: 'No persistent cards in slots; boost System pool directly',
        color: '#a855f7',
      });
      options.push({
        id: 'C',
        label: 'Direct Adaptation Generation (+1 C)',
        description: 'No persistent cards in slots; boost Adaptation pool directly',
        color: '#00ff41',
      });
    }

    return {
      type: 'test_universal_boost_generation',
      title: 'BOOST GENERATION: CHOOSE PERSISTENT CARD',
      subtitle: 'SELECT ACTIVE PERSISTENT SLOT CARD TO TRIGGER +1 BONUS POINT GENERATION',
      card,
      options,
      cards: slotCards,
    };
  },

  onAttach(state, playerId, card, target = {}) {
    const player = state.players[playerId];
    const choice = target.selectedOptionId || target.selectedCardId;

    if (choice && ['left', 'middle', 'right'].includes(choice)) {
      const placed = player?.persistentSlots?.[choice];
      const type = placed?.alignment || 'B';
      addPoints(state, playerId, type, 1, 'test_boost_generation');
      return;
    }

    if (choice && ['A', 'B', 'C'].includes(choice)) {
      addPoints(state, playerId, choice, 1, 'test_boost_generation');
      return;
    }

    if (target?.card?.alignment) {
      addPoints(state, playerId, target.card.alignment, 1, 'test_boost_generation');
    } else {
      addPoints(state, playerId, 'B', 1, 'test_boost_generation');
    }
  },
};
