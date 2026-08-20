/**
 * AI Choice Resolver
 * 
 * Automatically resolves declarative card interaction options for NPC players
 * or automated tests based on card.pipeline.fallbackAction.
 */

import { executeActionPayload } from './actionPayloadRunner';
import { removePoints } from '../effects/primitives';

export function resolveNpcChoice(state, playerId, card, interaction) {
  if (!interaction || !interaction.options || interaction.options.length === 0) {
    return null;
  }

  const fallbackStrategy = card.pipeline?.fallbackAction || 'DEFAULT_FIRST_OPTION';
  const player = state.players[playerId];
  const options = interaction.options;

  // Filter options that player can afford if costOverride is present
  const validOptions = options.filter((opt) => {
    if (opt.disabled) return false;
    if (opt.costOverride && player) {
      const { amount, type } = opt.costOverride;
      if (player.points[type] < amount) return false;
    }
    return true;
  });

  const pool = validOptions.length > 0 ? validOptions : options;
  let chosenOption = pool[0];

  if (fallbackStrategy === 'RANDOM_VALID_OPTION' && pool.length > 1) {
    chosenOption = pool[Math.floor(Math.random() * pool.length)];
  } else if (fallbackStrategy === 'HIGHEST_AFFORDABLE') {
    // Pick the most impactful affordable option
    chosenOption = pool[pool.length - 1];
  }

  // Deduct cost override if any
  if (chosenOption.costOverride && player) {
    const { amount, type } = chosenOption.costOverride;
    removePoints(state, playerId, type, amount, card.id || 'ai_choice');
  }

  // Execute declarative action payload
  if (chosenOption.actionPayload) {
    executeActionPayload(state, playerId, card, chosenOption.actionPayload, {
      selectedOptionId: chosenOption.id,
    });
  }

  return {
    selectedOptionId: chosenOption.id,
    option: chosenOption,
  };
}
