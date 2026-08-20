// ════════════════════════════════════════════════════════════════
// TEST CARDS — Declarative Component Schema.
// Layer 1: Metadata (alignment, category, subCategory, flavorText, artKey)
// Layer 2: Costs & Requirements (base, pointType, playConditions)
// Layer 3: Interaction (hasInteractiveChoice, modalType, options, prompts)
// Layer 4: Pipeline (trigger, target, effectId, fallbackAction)
// ════════════════════════════════════════════════════════════════

import { defineCard } from '../../engine/schema/cardSchema';

export const testCards = [
  // ── Universals (Modifiers) ──────────────────────────────────────
  defineCard({
    id: 'test_universal_extend_duration',
    version: '1.0',
    metadata: {
      name: 'TEST: Extend Duration',
      alignment: 'A',
      category: 'universals',
      subCategory: 'Test',
      flavorText: `TEST MODIFIER.

Attach to a queued card in your or your opponent's queue. Choose target queue card to extend its queue delay by 1 turn.`,
      artKey: 'test_universal_extend_duration',
    },
    costs: {
      base: 0,
      pointType: 'A',
      playConditions: {
        minDomainDuration: 0,
        requiredDomainAlignment: null,
        requiresEmptyQueueSlot: false,
      },
    },
    interaction: {
      hasInteractiveChoice: true,
      modalType: 'CARD_SELECT',
      title: 'EXTEND DURATION: CHOOSE TARGET',
      prompt: 'Select a queued card to extend its queue delay by +1 turn:',
      minSelect: 1,
      maxSelect: 1,
      options: [],
    },
    pipeline: {
      trigger: 'ON_ATTACH',
      target: 'TARGET_QUEUE',
      effectId: 'test_universal_extend_duration',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
    test: true,
    temporary: true,
  }),

  defineCard({
    id: 'test_universal_boost_generation',
    version: '1.0',
    metadata: {
      name: 'TEST: Boost Generation',
      alignment: 'B',
      category: 'universals',
      subCategory: 'Test',
      flavorText: `TEST MODIFIER.

Attach to an active persistent card (Theory of Time, Moral Reality, or Moral Grounding). Immediately generate 1 bonus point matching that persistent card's alignment.`,
      artKey: 'test_universal_boost_generation',
    },
    costs: {
      base: 0,
      pointType: 'B',
      playConditions: {
        minDomainDuration: 0,
        requiredDomainAlignment: null,
        requiresEmptyQueueSlot: false,
      },
    },
    interaction: {
      hasInteractiveChoice: true,
      modalType: 'CARD_SELECT',
      title: 'BOOST GENERATION: CHOOSE PERSISTENT CARD',
      prompt: 'Select active persistent slot card to trigger +1 bonus point generation:',
      minSelect: 1,
      maxSelect: 1,
      options: [],
    },
    pipeline: {
      trigger: 'ON_ATTACH',
      target: 'TARGET_CARD',
      effectId: 'test_universal_boost_generation',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
    test: true,
    temporary: true,
  }),

  defineCard({
    id: 'test_universal_remove_penalty',
    version: '1.0',
    metadata: {
      name: 'TEST: Remove Penalty',
      alignment: 'C',
      category: 'universals',
      subCategory: 'Test',
      flavorText: `TEST MODIFIER.

Attach to a queued card. Choose a target card in queue to clear all pause and delay penalties.`,
      artKey: 'test_universal_remove_penalty',
    },
    costs: {
      base: 0,
      pointType: 'C',
      playConditions: {
        minDomainDuration: 0,
        requiredDomainAlignment: null,
        requiresEmptyQueueSlot: false,
      },
    },
    interaction: {
      hasInteractiveChoice: true,
      modalType: 'CARD_SELECT',
      title: 'REMOVE PENALTY: CHOOSE TARGET',
      prompt: 'Select a queued card to clear paused / delayed status:',
      minSelect: 1,
      maxSelect: 1,
      options: [],
    },
    pipeline: {
      trigger: 'ON_ATTACH',
      target: 'TARGET_QUEUE',
      effectId: 'test_universal_remove_penalty',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
    test: true,
    temporary: true,
  }),

  // ── Moral Judgment (Action — one-time-use) ───────────────────────
  defineCard({
    id: 'test_judgment_remove_point',
    version: '1.0',
    metadata: {
      name: 'TEST: Remove Point',
      alignment: 'A',
      category: 'moral_judgment',
      subCategory: 'Test',
      flavorText: `TEST ACTION.

Choose an opponent point pool (Grounding / System / Adaptation) to remove 1 point from, or target their highest pool.`,
      artKey: 'test_judgment_remove_point',
    },
    costs: {
      base: 0,
      pointType: 'A',
      playConditions: {
        minDomainDuration: 0,
        requiredDomainAlignment: null,
        requiresEmptyQueueSlot: true,
      },
    },
    interaction: {
      hasInteractiveChoice: true,
      modalType: 'SINGLE_CHOICE',
      title: 'REMOVE POINT: CHOOSE TARGET POOL',
      prompt: "Target opponent's point pool to reduce by 1:",
      minSelect: 1,
      maxSelect: 1,
      options: [
        {
          id: 'A',
          label: 'Grounding Point Pool (A)',
          description: 'Remove 1 Grounding point from opponent pool',
          actionPayload: { type: 'REMOVE_POINTS', pointType: 'A', amount: 1, target: 'PLAYER_OPPONENT' },
          color: '#38bdf8',
        },
        {
          id: 'B',
          label: 'System Point Pool (B)',
          description: 'Remove 1 System point from opponent pool',
          actionPayload: { type: 'REMOVE_POINTS', pointType: 'B', amount: 1, target: 'PLAYER_OPPONENT' },
          color: '#a855f7',
        },
        {
          id: 'C',
          label: 'Adaptation Point Pool (C)',
          description: 'Remove 1 Adaptation point from opponent pool',
          actionPayload: { type: 'REMOVE_POINTS', pointType: 'C', amount: 1, target: 'PLAYER_OPPONENT' },
          color: '#00ff41',
        },
        {
          id: 'highest',
          label: 'Highest Available Pool (Auto-detect)',
          description: 'Remove 1 point from whichever pool the opponent has the most in',
          actionPayload: { type: 'CUSTOM_DISPATCH' },
          color: '#eab308',
        },
      ],
    },
    pipeline: {
      trigger: 'ON_PLAY',
      target: 'PLAYER_OPPONENT',
      effectId: 'test_judgment_remove_point',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
    test: true,
    temporary: true,
  }),

  defineCard({
    id: 'test_judgment_earn_point',
    version: '1.0',
    metadata: {
      name: 'TEST: Earn Point',
      alignment: 'B',
      category: 'moral_judgment',
      subCategory: 'Test',
      flavorText: `TEST ACTION.

Choose 1 point type (Grounding / System / Adaptation) to gain for your construct pool, or gain 1 matching active Domain.`,
      artKey: 'test_judgment_earn_point',
    },
    costs: {
      base: 0,
      pointType: 'B',
      playConditions: {
        minDomainDuration: 0,
        requiredDomainAlignment: null,
        requiresEmptyQueueSlot: true,
      },
    },
    interaction: {
      hasInteractiveChoice: true,
      modalType: 'SINGLE_CHOICE',
      title: 'EARN POINT: CHOOSE POINT TYPE',
      prompt: 'Select which construct point to add to your total:',
      minSelect: 1,
      maxSelect: 1,
      options: [
        {
          id: 'A',
          label: 'Grounding Point (+1 A)',
          description: 'Add 1 Grounding point to your score',
          actionPayload: { type: 'ADD_POINTS', pointType: 'A', amount: 1 },
          color: '#38bdf8',
        },
        {
          id: 'B',
          label: 'System Point (+1 B)',
          description: 'Add 1 System point to your score',
          actionPayload: { type: 'ADD_POINTS', pointType: 'B', amount: 1 },
          color: '#a855f7',
        },
        {
          id: 'C',
          label: 'Adaptation Point (+1 C)',
          description: 'Add 1 Adaptation point to your score',
          actionPayload: { type: 'ADD_POINTS', pointType: 'C', amount: 1 },
          color: '#00ff41',
        },
        {
          id: 'domain_match',
          label: 'Match Active Domain (+1)',
          description: 'Automatically earn 1 point matching current active Domain alignment',
          actionPayload: { type: 'CUSTOM_DISPATCH' },
          color: '#eab308',
        },
      ],
    },
    pipeline: {
      trigger: 'ON_PLAY',
      target: 'PLAYER_SELF',
      effectId: 'test_judgment_earn_point',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
    test: true,
    temporary: true,
  }),

  defineCard({
    id: 'test_judgment_draw_two',
    version: '1.0',
    metadata: {
      name: 'TEST: Draw Two',
      alignment: 'C',
      category: 'moral_judgment',
      subCategory: 'Test',
      flavorText: `TEST ACTION.

Choose which draw pile to draw 2 cards from: Metaphysics, Meta-Ethics, or 1 from each.`,
      artKey: 'test_judgment_draw_two',
    },
    costs: {
      base: 0,
      pointType: 'C',
      playConditions: {
        minDomainDuration: 0,
        requiredDomainAlignment: null,
        requiresEmptyQueueSlot: true,
      },
    },
    interaction: {
      hasInteractiveChoice: true,
      modalType: 'SINGLE_CHOICE',
      title: 'DRAW TWO: CHOOSE SOURCE',
      prompt: 'Select from which pile(s) to draw 2 cards:',
      minSelect: 1,
      maxSelect: 1,
      options: [
        {
          id: 'meta_both',
          label: '2x Metaphysics Cards',
          description: 'Draw 2 cards from Metaphysics draw pile (Domain, Theory of Time, Universals)',
          actionPayload: { type: 'DRAW_CARD', amount: 2, filter: 'METAPHYSICS' },
          color: '#38bdf8',
        },
        {
          id: 'ethics_both',
          label: '2x Meta-Ethics Cards',
          description: 'Draw 2 cards from Meta-Ethics draw pile (Moral Reality, Grounding, Judgment)',
          actionPayload: { type: 'DRAW_CARD', amount: 2, filter: 'META_ETHICS' },
          color: '#a855f7',
        },
        {
          id: 'split',
          label: '1x Metaphysics + 1x Meta-Ethics',
          description: 'Draw 1 card from Metaphysics and 1 card from Meta-Ethics',
          actionPayload: { type: 'CUSTOM_DISPATCH' },
          color: '#00ff41',
        },
      ],
    },
    pipeline: {
      trigger: 'ON_PLAY',
      target: 'PLAYER_SELF',
      effectId: 'test_judgment_draw_two',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
    test: true,
    temporary: true,
  }),

  // ── Rhetoric (Response) ──────────────────────────────────────────
  defineCard({
    id: 'test_rhetoric_cancel',
    version: '1.0',
    metadata: {
      name: 'TEST: Cancel',
      alignment: 'A',
      category: 'rhetoric',
      subCategory: 'Test',
      flavorText: `TEST CARD — DELETE LATER.

Cancel the target card's effect.`,
      artKey: 'test_rhetoric_cancel',
    },
    costs: {
      base: 0,
      pointType: 'A',
      playConditions: {
        minDomainDuration: 0,
        requiredDomainAlignment: null,
        requiresEmptyQueueSlot: false,
      },
    },
    interaction: {
      hasInteractiveChoice: false,
      modalType: 'SINGLE_CHOICE',
      options: [],
    },
    pipeline: {
      trigger: 'BEFORE_DISCARD',
      target: 'TARGET_CARD',
      effectId: 'test_rhetoric_cancel',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
    test: true,
    temporary: true,
  }),

  defineCard({
    id: 'test_rhetoric_protect',
    version: '1.0',
    metadata: {
      name: 'TEST: Protect',
      alignment: 'B',
      category: 'rhetoric',
      subCategory: 'Test',
      flavorText: `TEST CARD — DELETE LATER.

Protect the target card so it cannot be cancelled or delayed.`,
      artKey: 'test_rhetoric_protect',
    },
    costs: {
      base: 0,
      pointType: 'B',
      playConditions: {
        minDomainDuration: 0,
        requiredDomainAlignment: null,
        requiresEmptyQueueSlot: false,
      },
    },
    interaction: {
      hasInteractiveChoice: false,
      modalType: 'SINGLE_CHOICE',
      options: [],
    },
    pipeline: {
      trigger: 'BEFORE_DISCARD',
      target: 'TARGET_CARD',
      effectId: 'test_rhetoric_protect',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
    test: true,
    temporary: true,
  }),

  defineCard({
    id: 'test_rhetoric_delay',
    version: '1.0',
    metadata: {
      name: 'TEST: Delay',
      alignment: 'C',
      category: 'rhetoric',
      subCategory: 'Test',
      flavorText: `TEST CARD — DELETE LATER.

Delay the target card by 1 turn.`,
      artKey: 'test_rhetoric_delay',
    },
    costs: {
      base: 0,
      pointType: 'C',
      playConditions: {
        minDomainDuration: 0,
        requiredDomainAlignment: null,
        requiresEmptyQueueSlot: false,
      },
    },
    interaction: {
      hasInteractiveChoice: false,
      modalType: 'SINGLE_CHOICE',
      options: [],
    },
    pipeline: {
      trigger: 'BEFORE_DISCARD',
      target: 'TARGET_CARD',
      effectId: 'test_rhetoric_delay',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
    test: true,
    temporary: true,
  }),
];
