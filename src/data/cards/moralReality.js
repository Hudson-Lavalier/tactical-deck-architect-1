// Moral Reality cards.
// ════════════════════════════════════════════════════════════════
// ALL text transcribed VERBATIM from the user's Moral Reality Cards document.
// No effects, names, or mechanics have been invented.
//
// Per framework:
//   - Sits in a persistent slot on the player's board
//   - Interacts with face-down queue and active effects
//   - Grounding (Realism): preserves and stabilizes effects
//   - System (Error Theory): cancels and invalidates effects
//   - Adaptation (Relativism): redirects or restricts to frameworks
//
// Each card has its own individual Bonus Feature; there is no shared
// philosophy-wide System Effect for Moral Realism, Error Theory, or
// Moral Relativism.
//
// Alignment mapping:
//   Moral Realism     → A (Grounding)
//   Error Theory      → B (System)
//   Moral Relativism  → C (Adaptation)
// ════════════════════════════════════════════════════════════════

export const moralRealityCards = [
  // ── Moral Realism (Alignment A — Grounding) ────────────────────
  {
    id: 'moral_facts',
    name: 'Moral Facts',
    alignment: 'A',
    category: 'moral_reality',
    subcategory: 'Moral Realism',
    aspect: 'Moral Realism 1 of 4',
    text: `Core Distinction: Moral properties or facts are genuine features of reality. Rightness, wrongness, goodness, obligation, and other moral features are treated as things that genuinely obtain.

Bonus Feature: While Moral Facts is active, once per turn you may choose 1 card in your opponent's queue. That card is turned face up and remains face up for the rest of its duration in the queue. You may not turn more than 1 card face up at a time.`,
  },

  {
    id: 'moral_truth',
    name: 'Moral Truth',
    alignment: 'A',
    category: 'moral_reality',
    subcategory: 'Moral Realism',
    aspect: 'Moral Realism 2 of 4',
    text: `Core Distinction: Moral judgments function as claims capable of being true or false rather than merely expressions, commands, or attitudes.

Bonus Feature: While Moral Truth is active, you may designate 1 face-up card in a queue as Truth. A card designated as Truth cannot have its remaining queue duration increased, cannot be canceled, and cannot be blocked when it goes into effect. You may only have 1 card designated as Truth at a time.`,
  },

  {
    id: 'realized_truth',
    name: 'Realized Truth',
    alignment: 'A',
    category: 'moral_reality',
    subcategory: 'Moral Realism',
    aspect: 'Moral Realism 3 of 4',
    text: `Core Distinction: Moral claims do not merely attempt to state truths. At least some moral claims actually succeed in being true.

Bonus Feature: While Realized Truth is active, you may turn up to 3 cards in your queue face up, so long as each has more than 1 round remaining in its queue duration. On your next turn, those revealed cards become Grounding-type until they resolve or are discarded.`,
  },

  {
    id: 'objective_authority',
    name: 'Objective Authority',
    alignment: 'A',
    category: 'moral_reality',
    subcategory: 'Moral Realism',
    aspect: 'Moral Realism 4 of 4',
    text: `Core Distinction: Moral truth or authority does not merely depend on what an individual, society, or culture happens to approve or believe.

Bonus Feature: While Objective Authority is active, once per turn, when the effect or ability of one of your cards would be canceled, you may override that cancellation if the card's type matches the active Domain. The effect or ability resolves normally.`,
  },

  // ── Error Theory (Alignment B — System) ────────────────────────
  {
    id: 'factual_appearance',
    name: 'Factual Appearance',
    alignment: 'B',
    category: 'moral_reality',
    subcategory: 'Error Theory',
    aspect: 'Error Theory 1 of 4',
    text: `Core Distinction: Moral language presents itself as factual. Moral claims behave as though they describe moral reality and are capable of being true or false.

Bonus Feature: While Factual Appearance is active, once per turn you may swap 1 card in your queue that has exactly 1 turn remaining with 1 card from your hand.

The replacement card takes the queued card's position and remaining queue duration.

If the original queued card was revealed or had any effects applied to it, the replacement card does not inherit those revealed states, effects, protections, restrictions, or designations.`,
  },

  {
    id: 'missing_properties',
    name: 'Missing Properties',
    alignment: 'B',
    category: 'moral_reality',
    subcategory: 'Error Theory',
    aspect: 'Error Theory 2 of 4',
    text: `Core Distinction: The objective moral properties or facts presupposed by ordinary moral discourse are absent from reality.

Bonus Feature: While Missing Properties is active, every other turn you may choose 1 card in your opponent's queue and return it to their hand.

Any protections, designations, revealed status, or other effects currently applied to that card are nullified when it returns to their hand.`,
  },

  {
    id: 'systematic_error',
    name: 'Systematic Error',
    alignment: 'B',
    category: 'moral_reality',
    subcategory: 'Error Theory',
    aspect: 'Error Theory 3 of 4',
    text: `Core Distinction: Because moral discourse attempts to describe moral facts that do not exist, moral claims systematically fail rather than merely being uncertain in isolated cases.

Bonus Feature: If an effect is applied to one of your queued cards, or one of your cards is blocked, you may discard 1 card from your own queue to nullify that effect or block.`,
  },

  {
    id: 'moral_practice_after_error',
    name: 'Moral Practice After Error',
    alignment: 'B',
    category: 'moral_reality',
    subcategory: 'Error Theory',
    aspect: 'Error Theory 4 of 4',
    text: `Core Distinction: After recognizing moral error, moral language may be abandoned, revised, or retained as a useful fiction despite no longer being treated as literally true.

Bonus Feature: While Moral Practice After Error is active, every other turn, whenever a card in your queue is removed, changed, or otherwise affected by your opponent, you may immediately play 1 card from your hand into your queue.

This ability may be used during your opponent's turn.`,
  },

  // ── Moral Relativism (Alignment C — Adaptation) ─────────────────
  {
    id: 'moral_diversity',
    name: 'Moral Diversity',
    alignment: 'C',
    category: 'moral_reality',
    subcategory: 'Moral Relativism',
    aspect: 'Moral Relativism 1 of 4',
    text: `Core Distinction: Moral beliefs, standards, and judgments vary deeply between cultures, societies, persons, or other groups and perspectives.

Bonus Feature: While Moral Diversity is active, anytime your opponent places an effect on their own card in queue you may copy that effect onto any card of your choosing in your queue.`,
  },

  {
    id: 'framework_relative_truth',
    name: 'Framework-Relative Truth',
    alignment: 'C',
    category: 'moral_reality',
    subcategory: 'Moral Relativism',
    aspect: 'Moral Relativism 2 of 4',
    text: `Core Distinction: Moral truth or justification is evaluated relative to some relevant framework, standpoint, culture, society, person, or context rather than through one absolute standard.

Bonus Feature: Once per turn, when one of your cards checks the type of the active Domain, you may have that effect check the type of your Moral Reality instead.`,
  },

  {
    id: 'no_privileged_framework',
    name: 'No Privileged Framework',
    alignment: 'C',
    category: 'moral_reality',
    subcategory: 'Moral Relativism',
    aspect: 'Moral Relativism 3 of 4',
    text: `Core Distinction: No single moral framework automatically possesses universal authority for conclusively judging every competing framework.

Bonus Feature: Once per turn, choose two of your active persistent cards.

Until your next turn, cards that refer specifically to one of those cards as a requirement may refer to either one instead.`,
  },

  {
    id: 'contextual_judgment',
    name: 'Contextual Judgment',
    alignment: 'C',
    category: 'moral_reality',
    subcategory: 'Moral Relativism',
    aspect: 'Moral Relativism 4 of 4',
    text: `Core Distinction: Moral judgments must be evaluated according to a specified standpoint or context, such as the evaluator, agent, society, group, or context in which the judgment occurs.

Bonus Feature: While Contextual Judgment is active, its Bonus Feature changes according to the active Domain:

Grounding Domain: Once per turn, choose 1 effect currently applied to one of your queued cards. That effect and its target cannot be changed.

System Domain: Once per turn, when your opponent chooses one of your queued cards as the target of an effect, you may redirect that effect to another valid card in your queue.

Adaptation Domain: Once per turn, when your opponent applies an effect to a card in their own queue, you may redirect that effect to another valid card in their queue.`,
  },
];