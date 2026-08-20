/**
 * Declarative Card Schema & Normalization Engine
 * 
 * Implements the 4-layer CCG card architecture:
 * 1. Metadata: Identity, styling, artwork, and deck-filtering rules.
 * 2. Costs & Requirements: Points, domain durations, and play conditions.
 * 3. Interaction: Declarative choice UI, modal types, prompts, and options.
 * 4. Pipeline: Execution triggers, targets, fallback actions, and effect routing.
 */

/**
 * Creates a fully validated and normalized card adhering to the 4-layer schema.
 * Provides backwards-compatible field aliases (name, alignment, category, text)
 * so existing UI rendering and legacy accessors continue working with zero breaking changes.
 */
export function defineCard(def) {
  const metadata = {
    name: def.metadata?.name || def.name || 'Unnamed Card',
    alignment: def.metadata?.alignment || def.alignment || 'none',
    category: def.metadata?.category || def.category || 'general',
    subCategory: def.metadata?.subCategory || def.subcategory || def.subCategory || '',
    flavorText: def.metadata?.flavorText || def.text || '',
    artKey: def.metadata?.artKey || def.artKey || def.id || '',
    aspect: def.metadata?.aspect || def.aspect || '',
  };

  const costs = {
    base: def.costs?.base !== undefined ? def.costs.base : (def.cost || 0),
    pointType: def.costs?.pointType || def.pointType || null,
    playConditions: {
      minDomainDuration: def.costs?.playConditions?.minDomainDuration ?? 0,
      requiredDomainAlignment: def.costs?.playConditions?.requiredDomainAlignment ?? null,
      requiresEmptyQueueSlot: def.costs?.playConditions?.requiresEmptyQueueSlot ?? true,
      customCondition: def.costs?.playConditions?.customCondition ?? null,
      ...(def.costs?.playConditions || {}),
    },
  };

  const interaction = {
    hasInteractiveChoice: Boolean(def.interaction?.hasInteractiveChoice || def.interaction?.options?.length),
    modalType: def.interaction?.modalType || 'SINGLE_CHOICE', // 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'CARD_SELECT' | 'TARGET_SELECT'
    title: def.interaction?.title || `${metadata.name.toUpperCase()} CHOICE`,
    prompt: def.interaction?.prompt || def.interaction?.subtitle || 'Select an option or target:',
    minSelect: def.interaction?.minSelect ?? 1,
    maxSelect: def.interaction?.maxSelect ?? 1,
    options: Array.isArray(def.interaction?.options)
      ? def.interaction.options.map((opt, idx) => ({
          id: opt.id || `opt_${idx}`,
          label: opt.label || `Option ${idx + 1}`,
          description: opt.description || '',
          costOverride: opt.costOverride || null, // e.g. { amount: 1, type: 'C' }
          actionPayload: opt.actionPayload || null, // e.g. { type: 'DRAW_CARD', amount: 1 }
          disabled: Boolean(opt.disabled),
          color: opt.color || null,
        }))
      : [],
    ...(def.interaction || {}),
  };

  const pipeline = {
    trigger: def.pipeline?.trigger || 'ON_PLAY', // 'ON_PLAY' | 'ON_ROUND_END' | 'BEFORE_DISCARD' | 'ON_ATTACH' | 'ON_EVENT' | 'ON_TURN_START'
    target: def.pipeline?.target || 'PLAYER_SELF', // 'PLAYER_SELF' | 'PLAYER_OPPONENT' | 'ALL_PLAYERS' | 'TARGET_QUEUE' | 'TARGET_CARD'
    effectId: def.pipeline?.effectId || def.effectId || def.id,
    fallbackAction: def.pipeline?.fallbackAction || 'DEFAULT_FIRST_OPTION', // 'DEFAULT_FIRST_OPTION' | 'RANDOM_VALID_OPTION' | 'HIGHEST_AFFORDABLE'
    ...(def.pipeline || {}),
  };

  const normalized = {
    id: def.id,
    version: def.version || '1.0',
    metadata,
    costs,
    interaction,
    pipeline,

    // Legacy and UI compatibility accessors
    name: metadata.name,
    alignment: metadata.alignment,
    category: metadata.category,
    subcategory: metadata.subCategory,
    subCategory: metadata.subCategory,
    text: metadata.flavorText,
    aspect: metadata.aspect,
    effectId: pipeline.effectId,
    temporary: Boolean(def.temporary),
    test: Boolean(def.test),
  };

  return normalized;
}

/**
 * Normalizes any card or array of cards.
 */
export function normalizeCard(card) {
  if (!card) return null;
  if (card.metadata && card.costs && card.pipeline && card.interaction) {
    return card;
  }
  return defineCard(card);
}

export function normalizeCards(cards) {
  if (!Array.isArray(cards)) return [];
  return cards.map(normalizeCard);
}
