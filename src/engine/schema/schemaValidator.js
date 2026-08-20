/**
 * Card JSON Schema Validator
 * 
 * Validates card objects against the Production Card JSON Schema Specification:
 * - Metadata (name, alignment, category, subCategory, flavorText, artKey)
 * - Costs (base, pointType, playConditions)
 * - Interaction (hasInteractiveChoice, modalType, options, minSelect, maxSelect)
 * - Pipeline (trigger, target, effectId, fallbackAction)
 */

export const VALID_ALIGNMENTS = ['A', 'B', 'C', 'none'];
export const VALID_MODAL_TYPES = ['SINGLE_CHOICE', 'MULTI_CHOICE', 'CARD_SELECT', 'TARGET_SELECT'];
export const VALID_TRIGGERS = ['ON_PLAY', 'ON_ROUND_END', 'BEFORE_DISCARD', 'ON_ATTACH', 'ON_EVENT', 'ON_TURN_START'];
export const VALID_TARGETS = ['PLAYER_SELF', 'PLAYER_OPPONENT', 'ALL_PLAYERS', 'TARGET_QUEUE', 'TARGET_CARD'];
export const VALID_FALLBACK_ACTIONS = ['DEFAULT_FIRST_OPTION', 'RANDOM_VALID_OPTION', 'HIGHEST_AFFORDABLE', 'AUTO_FALLBACK'];

export function validateCardSchema(card) {
  const errors = [];
  const warnings = [];

  if (!card) {
    return { valid: false, errors: ['Card object is null or undefined'], warnings: [] };
  }

  if (!card.id || typeof card.id !== 'string') {
    errors.push(`Missing or invalid 'id' string on card: ${JSON.stringify(card)}`);
  }

  // Check Metadata
  if (card.metadata) {
    if (!card.metadata.name) errors.push(`[${card.id}] Missing metadata.name`);
    if (card.metadata.alignment && !VALID_ALIGNMENTS.includes(card.metadata.alignment)) {
      warnings.push(`[${card.id}] Non-standard metadata.alignment '${card.metadata.alignment}'`);
    }
  } else if (!card.name) {
    errors.push(`[${card.id}] Missing metadata layer or root name property`);
  }

  // Check Costs
  if (card.costs) {
    if (typeof card.costs.base !== 'number') {
      warnings.push(`[${card.id}] costs.base is not a number`);
    }
    if (card.costs.playConditions && typeof card.costs.playConditions !== 'object') {
      errors.push(`[${card.id}] costs.playConditions must be an object`);
    }
  }

  // Check Interaction
  if (card.interaction) {
    if (card.interaction.modalType && !VALID_MODAL_TYPES.includes(card.interaction.modalType)) {
      warnings.push(`[${card.id}] Unrecognized modalType: '${card.interaction.modalType}'`);
    }
    if (card.interaction.hasInteractiveChoice && (!card.interaction.options || card.interaction.options.length === 0)) {
      warnings.push(`[${card.id}] hasInteractiveChoice is true but interaction.options is empty`);
    }
  }

  // Check Pipeline
  if (card.pipeline) {
    if (card.pipeline.trigger && !VALID_TRIGGERS.includes(card.pipeline.trigger)) {
      warnings.push(`[${card.id}] Unrecognized pipeline.trigger: '${card.pipeline.trigger}'`);
    }
    if (card.pipeline.target && !VALID_TARGETS.includes(card.pipeline.target)) {
      warnings.push(`[${card.id}] Unrecognized pipeline.target: '${card.pipeline.target}'`);
    }
    if (card.pipeline.fallbackAction && !VALID_FALLBACK_ACTIONS.includes(card.pipeline.fallbackAction)) {
      warnings.push(`[${card.id}] Unrecognized pipeline.fallbackAction: '${card.pipeline.fallbackAction}'`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateCardBatch(cards) {
  const allErrors = [];
  const allWarnings = [];

  cards.forEach((card) => {
    const result = validateCardSchema(card);
    if (!result.valid) {
      allErrors.push(...result.errors);
    }
    if (result.warnings.length > 0) {
      allWarnings.push(...result.warnings);
    }
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    totalValidated: cards.length,
  };
}
