// Moral Grounding cards.
// ════════════════════════════════════════════════════════════════
// ALL text transcribed VERBATIM from the user's Moral Grounding Cards document.
// No effects, names, or mechanics have been invented.
//
// Per framework:
//   - Sits in a persistent slot on the player's board
//   - The point-economy layer: manipulates Grounding, System, and Adaptation points
//   - Grounding (Naturalism): generates and shields points
//   - System (Non-Naturalism): locks and protects point pools
//   - Adaptation (Constructivism): converts, redirects, and binds point effects
//
// Each card has its own individual Bonus Feature; there is no shared
// philosophy-wide System Effect.
//
// Alignment mapping:
//   Moral Naturalism     → A (Grounding)
//   Moral Non-Naturalism → B (System)
//   Moral Constructivism → C (Adaptation)
// ════════════════════════════════════════════════════════════════

export const moralGroundingCards = [
  // ── Moral Naturalism (Alignment A — Grounding) ─────────────────
  {
    id: 'natural_moral_facts',
    name: 'Natural Moral Facts',
    alignment: 'A',
    category: 'moral_grounding',
    subcategory: 'Moral Naturalism',
    aspect: 'Moral Naturalism 1 of 4',
    text: `Core Distinction: Genuine moral facts exist within the natural world rather than belonging to a separate non-natural realm.

Bonus Feature: While Natural Moral Facts is active, at the end of each full round you gain 1 additional point matching the active Domain's type, so long as you have at least 7 cards of that type in your hand. If you no longer meet that requirement, this Bonus Feature becomes inactive until the requirement is met again.`,
  },

  {
    id: 'moral_properties_in_nature',
    name: 'Moral Properties in Nature',
    alignment: 'A',
    category: 'moral_grounding',
    subcategory: 'Moral Naturalism',
    aspect: 'Moral Naturalism 2 of 4',
    text: `Core Distinction: Moral properties such as goodness, wrongness, virtue, or obligation are themselves natural properties or are realized through natural features of the world.

Bonus Feature: While Moral Properties in Nature is active, once per full round you gain a temporary Grounding Point Shield. The shield nullifies the first opposing effect that would remove, convert, or otherwise change 1 of your Grounding points.

After the shield is triggered, it is lost until the next full round.`,
  },

  {
    id: 'ordinary_inquiry',
    name: 'Ordinary Inquiry',
    alignment: 'A',
    category: 'moral_grounding',
    subcategory: 'Moral Naturalism',
    aspect: 'Moral Naturalism 3 of 4',
    text: `Core Distinction: Moral knowledge can be accessed through ordinary, empirical, rational, or naturalistic investigation rather than requiring access to a separate non-natural realm.

Bonus Feature: While Ordinary Inquiry and a Grounding Domain are active, if your opponent played a Grounding card during their previous turn, you may take 2 Grounding points from them and add those points to your own pool.

After this ability is used, it enters a 2-full-round cooldown.`,
  },

  {
    id: 'natural_explanation',
    name: 'Natural Explanation',
    alignment: 'A',
    category: 'moral_grounding',
    subcategory: 'Moral Naturalism',
    aspect: 'Moral Naturalism 4 of 4',
    text: `Core Distinction: Moral facts and values can be explained through familiar features of the natural world, such as flourishing, psychology, social structures, or functional relationships.

Bonus Feature: While Natural Explanation is active, once every 2 full rounds, whenever your opponent removes, steals, or converts one or more of your points, you may immediately place up to 2 cards from your hand into your queue.

If your queue is full when this ability triggers, you may instead immediately play up to 2 cards from your hand, even if it is not your turn. These immediate plays do not count against your normal card-play allowance.`,
  },

  // ── Moral Non-Naturalism (Alignment B — System) ──────────────────
  {
    id: 'real_moral_facts',
    name: 'Real Moral Facts',
    alignment: 'B',
    category: 'moral_grounding',
    subcategory: 'Moral Non-Naturalism',
    aspect: 'Moral Non-Naturalism 1 of 4',
    text: `Core Distinction: Moral facts genuinely exist, even though they are not reducible to ordinary natural facts.

Bonus Feature: While Real Moral Facts is active, you may choose either your Theory of Time slot or your Moral Reality slot to disable.

The chosen slot may only be disabled if it is currently empty. Once disabled, that slot cannot be used for the remainder of the time Real Moral Facts remains active.

After disabling a slot, choose 1 point type. The maximum number of points required from that point pool for your victory condition is reduced by 3.

Once this ability has been activated:

You may not voluntarily change, remove, or replace Real Moral Facts by any means.

The disabled slot remains unavailable.

The reduced victory requirement remains in effect.

These effects end only if Real Moral Facts is changed or removed by the opposing player.`,
  },

  {
    id: 'irreducible_morality',
    name: 'Irreducible Morality',
    alignment: 'B',
    category: 'moral_grounding',
    subcategory: 'Moral Non-Naturalism',
    aspect: 'Moral Non-Naturalism 2 of 4',
    text: `Core Distinction: Moral reality cannot be completely translated into, identified with, or reduced to natural or nonnormative facts.

While Irreducible Morality is active, choose 1 point type. That point pool cannot be removed, stolen, converted, manipulated, or otherwise altered by any effect.

While this toggle is active, you also cannot gain points of the chosen type by any means.

You may activate, deactivate, or change the chosen point type once every other turn.`,
  },

  {
    id: 'distinct_moral_properties',
    name: 'Distinct Moral Properties',
    alignment: 'B',
    category: 'moral_grounding',
    subcategory: 'Moral Non-Naturalism',
    aspect: 'Moral Non-Naturalism 3 of 4',
    text: `Core Distinction: Moral properties form a genuinely distinct kind of property rather than merely being another description of natural features.

Bonus Feature: While Distinct Moral Properties is active, once every other turn you may designate 1 point from any of your point pools as a Distinct Moral Point, up to a maximum of 3 Distinct Moral Points at a time.

Distinct Moral Points are placed on and associated with Distinct Moral Properties and retain their original point type.

While designated as Distinct Moral Points, they cannot be removed, stolen, converted, changed, spent, or otherwise manipulated by any card, ability, or effect.

You may designate points from different point types.

If Distinct Moral Properties is forcibly removed or changed by the opposing player or player of use, all Distinct Moral Points immediately return to their original point pools and retain their original types.`,
  },

  {
    id: 'rational_or_intuitive_access',
    name: 'Rational or Intuitive Access',
    alignment: 'B',
    category: 'moral_grounding',
    subcategory: 'Moral Non-Naturalism',
    aspect: 'Moral Non-Naturalism 4 of 4',
    text: `Core Distinction: Moral truths may be accessible through rational reflection, intuition, or self-evident principles rather than ordinary empirical observation alone.

Bonus Feature: While Rational or Intuitive Access is active, once every other turn, whenever you would convert one or more points from one type into another, you may increase the number of points converted.

If you have Rationalism as your Orientation of Inquiry, you may double the number of points that would normally be converted.

If you do not have Rationalism, you may instead convert 1 additional point beyond the amount normally allowed.

This applies whether you are converting your own points or an opponent's points.`,
  },

  // ── Moral Constructivism (Alignment C — Adaptation) ─────────────
  {
    id: 'morality_is_constructed',
    name: 'Morality Is Constructed',
    alignment: 'C',
    category: 'moral_grounding',
    subcategory: 'Moral Constructivism',
    aspect: 'Moral Constructivism 1 of 4',
    text: `Core Distinction: Normative truths are constituted or determined through some suitable process of construction rather than simply discovered as completely independent moral facts.

Bonus Feature: While Morality Is Constructed is active, once per turn you may use one of the following construction options:

Spend 1 Adaptation point to draw 1 guaranteed Adaptation-type single-use card from the single-use card pool.

Exchange 1 Adaptation Moral Reality or Moral Grounding card from your hand, including Morality Is Constructed, for 1 Adaptation point.

Spend 2 points of any type or combination of types to draw 1 guaranteed Adaptation-type Moral Reality or Moral Grounding card.

You may use only one of these options per turn.`,
  },

  {
    id: 'valid_construction',
    name: 'Valid Construction',
    alignment: 'C',
    category: 'moral_grounding',
    subcategory: 'Moral Constructivism',
    aspect: 'Moral Constructivism 2 of 4',
    text: `Core Distinction: Not every choice, agreement, or rule produces valid morality. A legitimate construction depends on satisfying the correct procedure or conditions.

Bonus Feature: Valid Procedure

While Valid Construction is active, the following effects apply:

Once every other turn, whenever an opponent's Moral Reality or Moral Grounding card modifies, adds to, changes, or otherwise contributes to an effect that would alter one or more of your points, you may completely negate the contribution made by that Moral Reality or Moral Grounding card, so long as at least 1 of the affected points is an Adaptation point. This does not cancel the originating single-use card or other underlying effect. Only the additional effect contributed by the opponent's Moral Reality or Moral Grounding card is negated.

If an opponent's active Adaptation-type Moral Reality or Moral Grounding card directly removes, steals, converts, changes, or otherwise affects your Adaptation points through its own Bonus Feature, that effect is completely negated while Valid Construction remains active.`,
  },

  {
    id: 'agents_and_standards',
    name: 'Agents and Standards',
    alignment: 'C',
    category: 'moral_grounding',
    subcategory: 'Moral Constructivism',
    aspect: 'Moral Constructivism 3 of 4',
    text: `Core Distinction: Normative standards are connected to agents and the standards governing practical reasoning, deliberation, agreement, or agency.

Bonus Feature: While Agents and Standards is active, if the opposing player's Epistemology is majority System or entirely System, then once every other turn, whenever that player would gain 1 or more points, you may cause 1 of those points to be gained as an Adaptation point instead.

This ability may be used even if it is not your turn.

If the opposing player's Epistemology is not majority System or entirely System, Agents and Standards has no Bonus Feature.`,
  },

  {
    id: 'binding_outcome',
    name: 'Binding Outcome',
    alignment: 'C',
    category: 'moral_grounding',
    subcategory: 'Moral Constructivism',
    aspect: 'Moral Constructivism 4 of 4',
    text: `Core Distinction: Once a valid construction has been completed, its result becomes genuinely authoritative or binding rather than remaining merely optional.

Bonus Feature: While Binding Outcome is active, its effect also applies to your active Moral Reality card.

If a Grounding-type card would affect, change, or remove either Binding Outcome or your active Moral Reality card, you may disregard that card's effect on the affected card.

If a non-Grounding single-use card successfully affects, changes, or removes either Binding Outcome or your active Moral Reality card, that effect resolves normally. After the card finishes resolving, if it would normally be discarded and no other effect returns it to its original player, you take that card and add it to your hand instead.`,
  },
];