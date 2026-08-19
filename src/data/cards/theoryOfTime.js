// Theory of Time cards.
// ════════════════════════════════════════════════════════════════
// ALL text transcribed VERBATIM from the user's Theory of Time Cards document.
// No effects, names, or mechanics have been invented.
//
// Per framework:
//   - Sits in a persistent slot on the player's board
//   - Dictates conditions for playing additional cards / bypassing timing
//   - Grounding/System Time: immediate pacing bonuses
//   - Adaptation Time: accumulates capacity while Domain unchanged
//
// Each philosophy has 2 card variants sharing a System Effect;
// each variant has its own Bonus Feature.
//
// Alignment mapping:
//   Presentism      → A (Grounding)
//   Eternalism      → B (System)
//   Growing-Block   → C (Adaptation)
// ════════════════════════════════════════════════════════════════

export const theoryOfTimeCards = [
  // ── Presentism (Alignment A — Grounding) ───────────────────────
  {
    id: 'present_reality',
    name: 'Present Reality',
    alignment: 'A',
    category: 'theory_of_time',
    subcategory: 'Presentism',
    aspect: 'Presentism 1 of 2',
    text: `Presentism System Effect: Whenever any Presentism Theory of Time card is active for a player cards that would be queued by that player go into effect immediately unless disadantaged. If disadvantaged they will resolve in one turn instead of two. This effect applies whenever either Presentism card is active.

Bonus Feature: While a Grounding Domain is active, you may play 1 additional Grounding card during each of your turns.

This additional play is separate from and stacks with your normal Theory of Time play allowance.`,
  },

  {
    id: 'the_vanishing_past',
    name: 'The Vanishing Past',
    alignment: 'A',
    category: 'theory_of_time',
    subcategory: 'Presentism',
    aspect: 'Presentism 2 of 2',
    text: `Presentism System Effect: Whenever any Presentism Theory of Time card is active for a player cards that would be queued by that player go into effect immediately unless disadantaged. If disadvantaged they will resolve in one turn instead of two. This effect applies whenever either Presentism card is active.

Bonus Feature: Anytime the domain changes to a grounding domain any card queued by a player who has The Vanishing Past active immediately goes into effect.`,
  },

  // ── Eternalism (Alignment B — System) ─────────────────────────
  {
    id: 'equal_reality',
    name: 'Equal Reality',
    alignment: 'B',
    category: 'theory_of_time',
    subcategory: 'Eternalism',
    aspect: 'Eternalism 1 of 2',
    text: `Eternalism System Effect: Anytime an Eternalism Theory of Time card is active for a player system cards can never be disadvantaged for that player. This effect applies whenever either Eternalism card is active.

Bonus Feature: Any player who has Equal Reality active adopts the Bonus Feature only of the opposing player's active Theory of Time card. The adopted Bonus Feature remains in effect until Equal Reality is changed or removed.

When a Bonus Feature is adopted, treat the copied Theory of Time card as though it had just been placed and become active for the Equal Reality player for purposes of that Bonus Feature's activation conditions.

If both players have Equal Reality active, neither Equal Reality adopts a Bonus Feature. Both cards retain only the Eternalism System Effect. If either Equal Reality is later changed or swapped, that Equal Reality is discarded normally.`,
  },

  {
    id: 'tenseless_order',
    name: 'Tenseless Order',
    alignment: 'B',
    category: 'theory_of_time',
    subcategory: 'Eternalism',
    aspect: 'Eternalism 2 of 2',
    text: `Eternalism System Effect: Anytime an Eternalism Theory of Time card is active for a player system cards can never be disadvantaged for that player. This effect applies whenever either Eternalism card is active.

Bonus Feature: While Tenseless Order is active and the active Domain is System-type, the opposing player must add 1 additional turn to the normal queue requirement of any card they play that is affected by Domain timing.

If an opposing card would normally resolve immediately, it instead resolves after 1 turn.

An external card or effect that specifically causes that card to resolve immediately may override this additional queue time.`,
  },

  // ── Growing-Block Theory (Alignment C — Adaptation) ─────────────
  {
    id: 'accumulated_reality',
    name: 'Accumulated Reality',
    alignment: 'C',
    category: 'theory_of_time',
    subcategory: 'Growing-Block Theory',
    aspect: 'Growing-Block 1 of 2',
    text: `Growing-Block System Effect: Accumulating Reality

When a player has a Growing-Block Theory of Time active, that player's Adaptation card-play allowance becomes 1 Adaptation card per turn, regardless of the active Domain.

For every 2 full rounds that the Domain remains unchanged, that allowance increases by 1 Adaptation card per turn.

The allowance may increase up to a maximum of 5 Adaptation cards per turn.

This Growing-Block allowance replaces the normal Theory of Time play allowance for Adaptation cards.

Other cards and effects may still increase or otherwise modify this allowance.

The effect applies only to players who currently have a Growing-Block Theory of Time active.

When the Domain changes, all accumulated progress resets and the allowance returns to 1 Adaptation card per turn.

Bonus Feature: When Accumulated Reality is placed by a player and becomes active, all cards currently queued by that player immediately go into effect.

If that player has no cards queued, they may immediately play 1 card, and that card immediately goes into effect or is used.

A card played through this Bonus Feature does not count against the player's normal card-play allowance.`,
  },

  {
    id: 'reality_frontier',
    name: 'Reality Frontier',
    alignment: 'C',
    category: 'theory_of_time',
    subcategory: 'Growing-Block Theory',
    aspect: 'Growing-Block 2 of 2',
    text: `Growing-Block System Effect: Accumulating Reality

When a player has a Growing-Block Theory of Time active, that player's Adaptation card-play allowance becomes 1 Adaptation card per turn, regardless of the active Domain.

For every 2 full rounds that the Domain remains unchanged, that allowance increases by 1 Adaptation card per turn.

The allowance may increase up to a maximum of 5 Adaptation cards per turn.

This Growing-Block allowance replaces the normal Theory of Time play allowance for Adaptation cards.

Other cards and effects may still increase or otherwise modify this allowance.

The effect applies only to players who currently have a Growing-Block Theory of Time active.

When the Domain changes, all accumulated progress resets and the allowance returns to 1 Adaptation card per turn.

Bonus Feature: While Reality Frontier is active and an Adaptation Domain is active, System-type cards may still be played and enter the queue, but their queue timers are paused. They do not progress toward resolution and cannot resolve naturally while this condition remains active. A card or effect that specifically overrides the queue may still cause them to resolve.

This paused state is not considered disadvantage and is unaffected by effects that merely reduce or accelerate normal queue timing.`,
  },
];