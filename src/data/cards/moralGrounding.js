// Moral Grounding cards — Declarative Component Schema.
// ════════════════════════════════════════════════════════════════
// Transcribed verbatim from the Moral Grounding Cards specification.
// Layer 1: Metadata (alignment, category, subCategory, flavorText, artKey)
// Layer 2: Costs & Requirements (base, pointType, playConditions)
// Layer 3: Interaction (hasInteractiveChoice, modalType, options, prompts)
// Layer 4: Pipeline (trigger, target, effectId, fallbackAction)
// ════════════════════════════════════════════════════════════════

import { defineCard } from '../../engine/schema/cardSchema';

export const moralGroundingCards = [
  // ── Moral Naturalism (Alignment A — Grounding) ─────────────────
  defineCard({
    id: 'natural_moral_facts',
    version: '1.0',
    metadata: {
      name: 'Natural Moral Facts',
      alignment: 'A',
      category: 'moral_grounding',
      subCategory: 'Moral Naturalism',
      aspect: 'Moral Naturalism 1 of 4',
      flavorText: `Core Distinction: Genuine moral facts exist within the natural world rather than belonging to a separate non-natural realm.

Bonus Feature: While Natural Moral Facts is active, at the end of each full round you gain 1 additional point matching the active Domain's type, so long as you have at least 7 cards of that type in your hand. If you no longer meet that requirement, this Bonus Feature becomes inactive until the requirement is met again.`,
      artKey: 'natural_moral_facts',
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
      trigger: 'ON_ROUND_END',
      target: 'PLAYER_SELF',
      effectId: 'natural_moral_facts',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
  }),

  defineCard({
    id: 'moral_properties_in_nature',
    version: '1.0',
    metadata: {
      name: 'Moral Properties in Nature',
      alignment: 'A',
      category: 'moral_grounding',
      subCategory: 'Moral Naturalism',
      aspect: 'Moral Naturalism 2 of 4',
      flavorText: `Core Distinction: Moral properties such as goodness, wrongness, virtue, or obligation are themselves natural properties or are realized through natural features of the world.

Bonus Feature: While Moral Properties in Nature is active, once per full round you gain a temporary Grounding Point Shield. The shield nullifies the first opposing effect that would remove, convert, or otherwise change 1 of your Grounding points.

After the shield is triggered, it is lost until the next full round.`,
      artKey: 'moral_properties_in_nature',
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
      trigger: 'ON_ROUND_END',
      target: 'PLAYER_SELF',
      effectId: 'moral_properties_in_nature',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
  }),

  defineCard({
    id: 'ordinary_inquiry',
    version: '1.0',
    metadata: {
      name: 'Ordinary Inquiry',
      alignment: 'A',
      category: 'moral_grounding',
      subCategory: 'Moral Naturalism',
      aspect: 'Moral Naturalism 3 of 4',
      flavorText: `Core Distinction: Moral knowledge can be accessed through ordinary, empirical, rational, or naturalistic investigation rather than requiring access to a separate non-natural realm.

Bonus Feature: While Ordinary Inquiry and a Grounding Domain are active, if your opponent played a Grounding card during their previous turn, you may take 2 Grounding points from them and add those points to your own pool.

After this ability is used, it enters a 2-full-round cooldown.`,
      artKey: 'ordinary_inquiry',
    },
    costs: {
      base: 0,
      pointType: 'A',
      playConditions: {
        minDomainDuration: 0,
        requiredDomainAlignment: 'A',
        requiresEmptyQueueSlot: false,
      },
    },
    interaction: {
      hasInteractiveChoice: true,
      modalType: 'SINGLE_CHOICE',
      title: 'ORDINARY INQUIRY: POINT ACQUISITION',
      prompt: 'Seize 2 Grounding points from the opponent into your pool:',
      options: [
        {
          id: 'take_grounding',
          label: 'Take 2 Grounding Points from Opponent',
          description: 'Transfer 2 Grounding points from the opposing pool into your own construct pool',
          actionPayload: { type: 'STEAL_POINTS', pointType: 'A', amount: 2 },
        },
      ],
    },
    pipeline: {
      trigger: 'ON_EVENT',
      target: 'PLAYER_OPPONENT',
      effectId: 'ordinary_inquiry',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
  }),

  defineCard({
    id: 'natural_explanation',
    version: '1.0',
    metadata: {
      name: 'Natural Explanation',
      alignment: 'A',
      category: 'moral_grounding',
      subCategory: 'Moral Naturalism',
      aspect: 'Moral Naturalism 4 of 4',
      flavorText: `Core Distinction: Moral facts and values can be explained through familiar features of the natural world, such as flourishing, psychology, social structures, or functional relationships.

Bonus Feature: While Natural Explanation is active, once every 2 full rounds, whenever your opponent removes, steals, or converts one or more of your points, you may immediately place up to 2 cards from your hand into your queue.

If your queue is full when this ability triggers, you may instead immediately play up to 2 cards from your hand, even if it is not your turn. These immediate plays do not count against your normal card-play allowance.`,
      artKey: 'natural_explanation',
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
      modalType: 'CARD_SELECT',
      options: [],
    },
    pipeline: {
      trigger: 'ON_EVENT',
      target: 'PLAYER_SELF',
      effectId: 'natural_explanation',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
  }),

  // ── Moral Non-Naturalism (Alignment B — System) ──────────────────
  defineCard({
    id: 'real_moral_facts',
    version: '1.0',
    metadata: {
      name: 'Real Moral Facts',
      alignment: 'B',
      category: 'moral_grounding',
      subCategory: 'Moral Non-Naturalism',
      aspect: 'Moral Non-Naturalism 1 of 4',
      flavorText: `Core Distinction: Moral facts genuinely exist, even though they are not reducible to ordinary natural facts.

Bonus Feature: While Real Moral Facts is active, you may choose either your Theory of Time slot or your Moral Reality slot to disable.

The chosen slot may only be disabled if it is currently empty. Once disabled, that slot cannot be used for the remainder of the time Real Moral Facts remains active.

After disabling a slot, choose 1 point type. The maximum number of points required from that point pool for your victory condition is reduced by 3.

Once this ability has been activated:
You may not voluntarily change, remove, or replace Real Moral Facts by any means.
The disabled slot remains unavailable.
The reduced victory requirement remains in effect.
These effects end only if Real Moral Facts is changed or removed by the opposing player.`,
      artKey: 'real_moral_facts',
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
      modalType: 'SINGLE_CHOICE',
      title: 'REAL MORAL FACTS: DISABLE SLOT & REDUCE REQUIREMENT',
      prompt: 'Choose an empty slot to sacrifice and select a point type to reduce victory target by -3:',
      options: [
        {
          id: 'disable_time_A',
          label: 'Disable Theory of Time Slot → Reduce Grounding Goal by 3',
          description: 'Locks left slot in exchange for lowering Grounding victory threshold',
          actionPayload: { type: 'CUSTOM_DISPATCH', slot: 'left', pointType: 'A' },
        },
        {
          id: 'disable_time_B',
          label: 'Disable Theory of Time Slot → Reduce System Goal by 3',
          description: 'Locks left slot in exchange for lowering System victory threshold',
          actionPayload: { type: 'CUSTOM_DISPATCH', slot: 'left', pointType: 'B' },
        },
        {
          id: 'disable_time_C',
          label: 'Disable Theory of Time Slot → Reduce Adaptation Goal by 3',
          description: 'Locks left slot in exchange for lowering Adaptation victory threshold',
          actionPayload: { type: 'CUSTOM_DISPATCH', slot: 'left', pointType: 'C' },
        },
        {
          id: 'disable_reality_B',
          label: 'Disable Moral Reality Slot → Reduce System Goal by 3',
          description: 'Locks middle slot in exchange for lowering System victory threshold',
          actionPayload: { type: 'CUSTOM_DISPATCH', slot: 'middle', pointType: 'B' },
        },
      ],
    },
    pipeline: {
      trigger: 'ON_PLAY',
      target: 'PLAYER_SELF',
      effectId: 'real_moral_facts',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
  }),

  defineCard({
    id: 'irreducible_morality',
    version: '1.0',
    metadata: {
      name: 'Irreducible Morality',
      alignment: 'B',
      category: 'moral_grounding',
      subCategory: 'Moral Non-Naturalism',
      aspect: 'Moral Non-Naturalism 2 of 4',
      flavorText: `Core Distinction: Moral reality cannot be completely translated into, identified with, or reduced to natural or nonnormative facts.

While Irreducible Morality is active, choose 1 point type. That point pool cannot be removed, stolen, converted, manipulated, or otherwise altered by any effect.

While this toggle is active, you also cannot gain points of the chosen type by any means.

You may activate, deactivate, or change the chosen point type once every other turn.`,
      artKey: 'irreducible_morality',
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
      modalType: 'SINGLE_CHOICE',
      title: 'IRREDUCIBLE MORALITY: LOCK POOL',
      prompt: 'Select a point pool to lock (immune to alterations, but cannot gain new points):',
      options: [
        {
          id: 'lock_A',
          label: 'Lock Grounding Pool (A)',
          description: 'Protects Grounding pool completely from theft/removal; locks gains',
          actionPayload: { type: 'CUSTOM_DISPATCH', lockPool: 'A' },
          color: '#38bdf8',
        },
        {
          id: 'lock_B',
          label: 'Lock System Pool (B)',
          description: 'Protects System pool completely from theft/removal; locks gains',
          actionPayload: { type: 'CUSTOM_DISPATCH', lockPool: 'B' },
          color: '#a855f7',
        },
        {
          id: 'lock_C',
          label: 'Lock Adaptation Pool (C)',
          description: 'Protects Adaptation pool completely from theft/removal; locks gains',
          actionPayload: { type: 'CUSTOM_DISPATCH', lockPool: 'C' },
          color: '#00ff41',
        },
      ],
    },
    pipeline: {
      trigger: 'ON_PLAY',
      target: 'PLAYER_SELF',
      effectId: 'irreducible_morality',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
  }),

  defineCard({
    id: 'distinct_moral_properties',
    version: '1.0',
    metadata: {
      name: 'Distinct Moral Properties',
      alignment: 'B',
      category: 'moral_grounding',
      subCategory: 'Moral Non-Naturalism',
      aspect: 'Moral Non-Naturalism 3 of 4',
      flavorText: `Core Distinction: Moral properties form a genuinely distinct kind of property rather than merely being another description of natural features.

Bonus Feature: While Distinct Moral Properties is active, once every other turn you may designate 1 point from any of your point pools as a Distinct Moral Point, up to a maximum of 3 Distinct Moral Points at a time.

Distinct Moral Points are placed on and associated with Distinct Moral Properties and retain their original point type.

While designated as Distinct Moral Points, they cannot be removed, stolen, converted, changed, spent, or otherwise manipulated by any card, ability, or effect.

You may designate points from different point types.

If Distinct Moral Properties is forcibly removed or changed by the opposing player or player of use, all Distinct Moral Points immediately return to their original point pools and retain their original types.`,
      artKey: 'distinct_moral_properties',
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
      modalType: 'SINGLE_CHOICE',
      title: 'DISTINCT MORAL PROPERTIES: SHIELD POINT',
      prompt: 'Select 1 point to designate as an inviolable Distinct Moral Point:',
      options: [
        {
          id: 'designate_A',
          label: 'Designate Grounding Point (A)',
          description: 'Move 1 Grounding point to distinct status (max 3)',
          actionPayload: { type: 'CUSTOM_DISPATCH', pointType: 'A' },
          color: '#38bdf8',
        },
        {
          id: 'designate_B',
          label: 'Designate System Point (B)',
          description: 'Move 1 System point to distinct status (max 3)',
          actionPayload: { type: 'CUSTOM_DISPATCH', pointType: 'B' },
          color: '#a855f7',
        },
        {
          id: 'designate_C',
          label: 'Designate Adaptation Point (C)',
          description: 'Move 1 Adaptation point to distinct status (max 3)',
          actionPayload: { type: 'CUSTOM_DISPATCH', pointType: 'C' },
          color: '#00ff41',
        },
      ],
    },
    pipeline: {
      trigger: 'ON_EVENT',
      target: 'PLAYER_SELF',
      effectId: 'distinct_moral_properties',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
  }),

  defineCard({
    id: 'rational_or_intuitive_access',
    version: '1.0',
    metadata: {
      name: 'Rational or Intuitive Access',
      alignment: 'B',
      category: 'moral_grounding',
      subCategory: 'Moral Non-Naturalism',
      aspect: 'Moral Non-Naturalism 4 of 4',
      flavorText: `Core Distinction: Moral truths may be accessible through rational reflection, intuition, or self-evident principles rather than ordinary empirical observation alone.

Bonus Feature: While Rational or Intuitive Access is active, once every other turn, whenever you would convert one or more points from one type into another, you may increase the number of points converted.

If you have Rationalism as your Orientation of Inquiry, you may double the number of points that would normally be converted.

If you do not have Rationalism, you may instead convert 1 additional point beyond the amount normally allowed.

This applies whether you are converting your own points or an opponent's points.`,
      artKey: 'rational_or_intuitive_access',
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
      trigger: 'ON_EVENT',
      target: 'PLAYER_SELF',
      effectId: 'rational_or_intuitive_access',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
  }),

  // ── Moral Constructivism (Alignment C — Adaptation) ─────────────
  defineCard({
    id: 'morality_is_constructed',
    version: '1.0',
    metadata: {
      name: 'Morality Is Constructed',
      alignment: 'C',
      category: 'moral_grounding',
      subCategory: 'Moral Constructivism',
      aspect: 'Moral Constructivism 1 of 4',
      flavorText: `Core Distinction: Normative truths are constituted or determined through some suitable process of construction rather than simply discovered as completely independent moral facts.

Bonus Feature: While Morality Is Constructed is active, once per turn you may use one of the following construction options:

Spend 1 Adaptation point to draw 1 guaranteed Adaptation-type single-use card from the single-use card pool.

Exchange 1 Adaptation Moral Reality or Moral Grounding card from your hand, including Morality Is Constructed, for 1 Adaptation point.

Spend 2 points of any type or combination of types to draw 1 guaranteed Adaptation-type Moral Reality or Moral Grounding card.

You may use only one of these options per turn.`,
      artKey: 'constructivism_01',
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
      title: 'Select Constructive Method',
      prompt: 'Spend resources to modify your game state:',
      minSelect: 1,
      maxSelect: 1,
      options: [
        {
          id: 'opt_draw',
          label: 'Spend 1 Adaptation to draw a single-use card',
          description: 'Draw 1 guaranteed Adaptation-type single-use card from Meta-Ethics',
          costOverride: { amount: 1, type: 'C' },
          actionPayload: { type: 'DRAW_CARD', amount: 1, filter: 'SINGLE_USE', alignment: 'C' },
          color: '#00ff41',
        },
        {
          id: 'opt_exchange',
          label: 'Exchange 1 hand card for 1 Adaptation point',
          description: 'Discard 1 Adaptation persistent card from your hand to generate +1 Adaptation point',
          actionPayload: { type: 'DISCARD_AND_GAIN', discardCount: 1, gainPoint: 'C', filterAlignment: 'C' },
          color: '#38bdf8',
        },
        {
          id: 'opt_draw_persistent',
          label: 'Spend 2 points to draw an Adaptation persistent card',
          description: 'Draw 1 guaranteed Adaptation Moral Reality or Moral Grounding card',
          costOverride: { amount: 2, type: 'C' },
          actionPayload: { type: 'DRAW_CARD', amount: 1, filter: 'PERSISTENT', alignment: 'C' },
          color: '#a855f7',
        },
      ],
    },
    pipeline: {
      trigger: 'ON_TURN_START',
      target: 'PLAYER_SELF',
      effectId: 'morality_is_constructed',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
  }),

  defineCard({
    id: 'valid_construction',
    version: '1.0',
    metadata: {
      name: 'Valid Construction',
      alignment: 'C',
      category: 'moral_grounding',
      subCategory: 'Moral Constructivism',
      aspect: 'Moral Constructivism 2 of 4',
      flavorText: `Core Distinction: Not every choice, agreement, or rule produces valid morality. A legitimate construction depends on satisfying the correct procedure or conditions.

Bonus Feature: Valid Procedure
While Valid Construction is active, the following effects apply:

Once every other turn, whenever an opponent's Moral Reality or Moral Grounding card modifies, adds to, changes, or otherwise contributes to an effect that would alter one or more of your points, you may completely negate the contribution made by that Moral Reality or Moral Grounding card, so long as at least 1 of the affected points is an Adaptation point.

If an opponent's active Adaptation-type Moral Reality or Moral Grounding card directly removes, steals, converts, changes, or otherwise affects your Adaptation points through its own Bonus Feature, that effect is completely negated while Valid Construction remains active.`,
      artKey: 'valid_construction',
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
      trigger: 'ON_EVENT',
      target: 'PLAYER_SELF',
      effectId: 'valid_construction',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
  }),

  defineCard({
    id: 'agents_and_standards',
    version: '1.0',
    metadata: {
      name: 'Agents and Standards',
      alignment: 'C',
      category: 'moral_grounding',
      subCategory: 'Moral Constructivism',
      aspect: 'Moral Constructivism 3 of 4',
      flavorText: `Core Distinction: Normative standards are connected to agents and the standards governing practical reasoning, deliberation, agreement, or agency.

Bonus Feature: While Agents and Standards is active, if the opposing player's Epistemology is majority System or entirely System, then once every other turn, whenever that player would gain 1 or more points, you may cause 1 of those points to be gained as an Adaptation point instead.

This ability may be used even if it is not your turn.

If the opposing player's Epistemology is not majority System or entirely System, Agents and Standards has no Bonus Feature.`,
      artKey: 'agents_and_standards',
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
      trigger: 'ON_EVENT',
      target: 'PLAYER_SELF',
      effectId: 'agents_and_standards',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
  }),

  defineCard({
    id: 'binding_outcome',
    version: '1.0',
    metadata: {
      name: 'Binding Outcome',
      alignment: 'C',
      category: 'moral_grounding',
      subCategory: 'Moral Constructivism',
      aspect: 'Moral Constructivism 4 of 4',
      flavorText: `Core Distinction: Once a valid construction has been completed, its result becomes genuinely authoritative or binding rather than remaining merely optional.

Bonus Feature: While Binding Outcome is active, its effect also applies to your active Moral Reality card.

If a Grounding-type card would affect, change, or remove either Binding Outcome or your active Moral Reality card, you may disregard that card's effect on the affected card.

If a non-Grounding single-use card successfully affects, changes, or removes either Binding Outcome or your active Moral Reality card, that effect resolves normally. After the card finishes resolving, if it would normally be discarded and no other effect returns it to its original player, you take that card and add it to your hand instead.`,
      artKey: 'binding_outcome',
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
      trigger: 'ON_EVENT',
      target: 'PLAYER_SELF',
      effectId: 'binding_outcome',
      fallbackAction: 'DEFAULT_FIRST_OPTION',
    },
  }),
];
