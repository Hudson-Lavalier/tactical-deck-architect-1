/**
 * Declarative Action Payload Runner
 * 
 * Executes declarative action payloads defined in card options and pipelines.
 * Eliminates custom hardcoded glue code and gives cards pure data-driven execution.
 */

import {
  addPoints,
  removePoints,
  drawCards,
  drawTypedCard,
  addQueueTurns,
  resumeQueueCard,
  getOpponent,
} from '../effects/primitives';

export function executeActionPayload(state, playerId, card, payload, context = {}) {
  if (!payload || !payload.type) return false;

  const oppId = getOpponent(playerId);
  const player = state.players[playerId];
  const opp = state.players[oppId];

  switch (payload.type) {
    case 'DRAW_CARD': {
      const count = payload.amount || 1;
      if (payload.filter === 'SINGLE_USE' || payload.filter === 'moral_judgment') {
        drawTypedCard(state, playerId, 'meta_ethics', payload.alignment || 'C', 'moral_judgment');
      } else if (payload.filter === 'METAPHYSICS') {
        drawCards(state, playerId, 'metaphysics', count);
      } else if (payload.filter === 'META_ETHICS') {
        drawCards(state, playerId, 'meta_ethics', count);
      } else if (payload.filter === 'PERSISTENT' || payload.filter === 'MORAL_PERSISTENT') {
        drawTypedCard(state, playerId, 'meta_ethics', payload.alignment || 'C', null);
      } else {
        drawCards(state, playerId, payload.pile || 'meta_ethics', count);
      }
      return true;
    }

    case 'DISCARD_AND_GAIN': {
      const count = payload.discardCount || 1;
      const gainType = payload.gainPoint || 'C';
      const gainAmount = payload.gainAmount || 1;

      // Check if a specific card was chosen for discard
      if (context.selectedCardId && Array.isArray(player.hand)) {
        const idx = player.hand.findIndex((c) => c.id === context.selectedCardId);
        if (idx !== -1) {
          player.hand.splice(idx, 1);
          addPoints(state, playerId, gainType, gainAmount, card?.id || 'action_payload');
          return true;
        }
      }

      // Default discard
      if (Array.isArray(player.hand) && player.hand.length > 0) {
        // Discard matching filter or first card
        let targetIdx = 0;
        if (payload.filterAlignment) {
          const match = player.hand.findIndex((c) => c.alignment === payload.filterAlignment);
          if (match !== -1) targetIdx = match;
        }
        player.hand.splice(targetIdx, count);
        addPoints(state, playerId, gainType, gainAmount, card?.id || 'action_payload');
        return true;
      }
      return false;
    }

    case 'ADD_POINTS': {
      const pointType = payload.pointType || payload.type_key || 'A';
      const amount = payload.amount || 1;
      addPoints(state, playerId, pointType, amount, card?.id || 'action_payload');
      return true;
    }

    case 'REMOVE_POINTS': {
      const pointType = payload.pointType || 'A';
      const amount = payload.amount || 1;
      const targetPlayer = payload.target === 'PLAYER_SELF' ? playerId : oppId;
      removePoints(state, targetPlayer, pointType, amount, card?.id || 'action_payload');
      return true;
    }

    case 'STEAL_POINTS': {
      const pointType = payload.pointType || 'A';
      const amount = payload.amount || 1;
      if (opp && opp.points && opp.points[pointType] >= amount) {
        removePoints(state, oppId, pointType, amount, card?.id || 'action_payload');
        addPoints(state, playerId, pointType, amount, card?.id || 'action_payload');
        return true;
      }
      return false;
    }

    case 'MODIFY_QUEUE_DELAY': {
      const turns = payload.amount || 1;
      const targetQueuePlayer = payload.target === 'PLAYER_SELF' ? playerId : oppId;
      const queueIdx = context.queueIndex !== undefined ? context.queueIndex : 0;
      addQueueTurns(state, targetQueuePlayer, queueIdx, turns);
      return true;
    }

    case 'REMOVE_PENALTY': {
      const targetQueuePlayer = payload.target === 'PLAYER_SELF' ? playerId : oppId;
      const queueIdx = context.queueIndex !== undefined ? context.queueIndex : 0;
      resumeQueueCard(state, targetQueuePlayer, queueIdx);
      return true;
    }

    default:
      return false;
  }
}
