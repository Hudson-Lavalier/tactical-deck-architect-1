// Domain cards.
// ════════════════════════════════════════════════════════════════
// ALL text transcribed VERBATIM from the user's Domain Cards document.
// No effects, names, or mechanics have been invented.
// Original text backup: docs/sheets/DomainCards_OriginalText.txt
// Tracking sheet: docs/cards/domainCards.md
//
// Alignment mapping:
//   Physicalism → A (Grounding)
//   Idealism    → B (System)
//   Dualism     → C (Adaptation)
//   Nihilism    → null (special, no point type)
// ════════════════════════════════════════════════════════════════

export const domainCards = [
  // ── Physicalism (Alignment A — Grounding) ──────────────────────
  {
    id: 'physical_foundation',
    name: 'Physical Foundation',
    alignment: 'A',
    category: 'domain',
    subcategory: 'Physicalism',
    aspect: 'Physicalism 1 of 4',
    text: `Point Generation: At the end of each full round, both players gain 1 Grounding point.

Bonus Feature: Physical Barrier
This Domain cannot be changed or replaced by the opposing player until 2 full rounds have passed since it was placed.`,
  },

  {
    id: 'physical_supervenience',
    name: 'Physical Supervenience',
    alignment: 'A',
    category: 'domain',
    subcategory: 'Physicalism',
    aspect: 'Physicalism 2 of 4',
    text: `Point Generation: At the end of every second full round, the player who placed this Domain gains 1 Grounding point. The opposing player does not receive this base point generation.

Bonus Feature: Physical Derivation
While this Domain is active, whenever either player gains one or more Grounding points from a non-domain source, that player gains 1 additional Grounding point.`,
  },

  {
    id: 'causal_completeness',
    name: 'Causal Completeness',
    alignment: 'A',
    category: 'domain',
    subcategory: 'Physicalism',
    aspect: 'Physicalism 3 of 4',
    text: `Point Generation: At the end of each full round, both players gain 1 Grounding point.

Bonus Feature: Sufficient Physical Cause
While this Domain is active, when a Grounding-type card would be discarded after being used, its player may spend 1 Grounding point to place that card back into their active hand instead of discarding it.

This replacement effect may also prevent a Grounding card from being discarded by another effect, including the loss of a reusable or recharging status, provided the card is being discarded after having been used.

This effect may be used once per turn.`,
  },

  {
    id: 'the_physical_mind',
    name: 'The Physical Mind',
    alignment: 'A',
    category: 'domain',
    subcategory: 'Physicalism',
    aspect: 'Physicalism 4 of 4',
    text: `Point Generation: This Domain generates no Grounding points.

Bonus Feature: Anti-Immaterial Field

While this Domain is active, System-type one-time-use cards cannot be played, even if another effect would normally allow them to ignore Domain alignment.

System-type cards that are not one-time-use cards are unaffected. A one-time-use System card may still be played if another card or ability specifically overrides its one-time-use restriction.`,
  },

  // ── Idealism (Alignment B — System) ────────────────────────────
  {
    id: 'mental_foundation',
    name: 'Mental Foundation',
    alignment: 'B',
    category: 'domain',
    subcategory: 'Idealism',
    aspect: 'Idealism 1 of 4',
    text: `Point Generation: At the end of each full round, both players gain 1 System point.

Bonus Feature: While this Domain is active, any player with a system type Moral Grounding, system type Moral Reality and system type theory of time in play then that player's system points cannot be reduced or converted by anything at any time.`,
  },

  {
    id: 'mind_dependent_reality',
    name: 'Mind-Dependent Reality',
    alignment: 'B',
    category: 'domain',
    subcategory: 'Idealism',
    aspect: 'Idealism 2 of 4',
    text: `Point Generation: At the end of each full round, any player who has Rationalism epistemology gains 2 System point. All other players at the end of each full round get 1 system point.

Bonus Feature: While this Domain is active, if both players have a System-type Moral Grounding in play, both players are treated as having Rationalism as their Orientation of Inquiry for all Orientation abilities and effects until the Domain changes. Their original Epistemology selections, victory profiles, and draw distributions do not change.`,
  },

  {
    id: 'constructive_cognition',
    name: 'Constructive Cognition',
    alignment: 'B',
    category: 'domain',
    subcategory: 'Idealism',
    aspect: 'Idealism 3 of 4',
    text: `Point Generation: At the end of each full round, both players gain 1 System point.

Bonus Feature: While this Domain is active, whenever a player plays a System-type card, they may draw one random card from either the Metaphysics or Meta-Ethics pile. If the drawn card is System-type, they may play it immediately. Otherwise, place it on the bottom of its original pile.

This effect may trigger up to twice during each player's turn.`,
  },

  {
    id: 'absolute_unity',
    name: 'Absolute Unity',
    alignment: 'B',
    category: 'domain',
    subcategory: 'Idealism',
    aspect: 'Idealism 4 of 4',
    text: `Point Generation: At the end of each full round, both players gain 1 System point.

Bonus Feature: Absolute Unity
When this Domain is placed, if the player who placed it has a System-type Moral Grounding, System-type Moral Reality, System-type Theory of Time, and a hand consisting entirely of System-type cards, this Domain cannot be changed or replaced by any card, ability, or effect.

The condtion remains active only for as long as that player continues to meet all four conditions. If any condition is broken, the lock ends immediately and cannot reactivate unless this Domain is placed again.`,
  },

  // ── Dualism (Alignment C — Adaptation) ────────────────────────
  {
    id: 'twofold_reality',
    name: 'Twofold Reality',
    alignment: 'C',
    category: 'domain',
    subcategory: 'Dualism',
    aspect: 'Dualism 1 of 4',
    text: `Point Generation: None.

Bonus Feature: When this Domain is placed, one Grounding Domain may be placed to its left and one System Domain to its right. During the placing player's turn only, they may switch the active Domain between those two attached Domains up to 2 times during that turn. If Twofold Reality is removed, all three Domains are discarded.

Second Bonus Feature: Twofold Reality cannot be changed out by any card or effect whose method of removal is changing the active Domain. It can only be removed by a card or effect that specifically states that it removes a Domain.

Twofold Domain Structure: Twofold Reality is an exception to the normal one-Domain structure. Both attached Domains remain part of Twofold Reality while it is active, but only one attached Domain's ruleset is considered active at a time. Switching between them changes which attached Domain ruleset is active.

Adaptation cards may be played while either attached Domain is active, overriding normal Domain restrictions.

Switching between the attached Domains counts as a Domain change for abilities and effects that trigger on Domain changes but it does not end a players turn.`,
  },

  {
    id: 'ontological_independence',
    name: 'Ontological Independence',
    alignment: 'C',
    category: 'domain',
    subcategory: 'Dualism',
    aspect: 'Dualism 2 of 4',
    text: `Point Generation: At the end of each full round, both players gain 1 Adaptation point.

Bonus Feature: While this Domain is active, whenever an effect or card attempts to remove or change it, you may discard a copy of Ontological Independence from your hand to cancel that removal or change. If you do, this Domain cannot be removed or changed by any further card or effect for the remainder of the turn.`,
  },

  {
    id: 'marks_of_mind',
    name: 'Marks of Mind',
    alignment: 'C',
    category: 'domain',
    subcategory: 'Dualism',
    aspect: 'Dualism 3 of 4',
    text: `Point Generation: At the end of each full round, both players gain 1 Adaptation point.

Bonus Feature: When this Domain is placed, the player who placed it gains Domain-Mind Link. This effect remains active for as long as Marks of Mind remains the active Domain.

Domain-Mind Link: While this link is active, whenever another player would remove, steal, convert, or otherwise change one or more of your Adaptation points, that effect is nullified. You then gain 1 Adaptation point.

Additionally, whenever another player changes one of your non-Adaptation points into a different non-Adaptation point, you may immediately convert that point into an Adaptation point at no cost.`,
  },

  {
    id: 'bridge_between_realms',
    name: 'Bridge Between Realms',
    alignment: 'C',
    category: 'domain',
    subcategory: 'Dualism',
    aspect: 'Dualism 4 of 4',
    text: `Point Generation: None.

Bonus Feature: While this domain is active you may do the one following once per tern:

If the opponent has a moral reality card or moral grounding card of the System type then you may take one Grounding point away from them and give it to yourself.

If the opponent has a moral reality card or moral grounding card of the Grounding type then you may take one System point away from them and give it to yourself.

Change 2 of the same points of either Grounding or System from your point pool to Adaptiation points.`,
  },

  // ── Nihilism (Special — no alignment) ──────────────────────────
  {
    id: 'black_hole_domain',
    name: 'Black Hole Domain',
    alignment: null,
    category: 'domain',
    subcategory: 'Nihilism',
    aspect: 'Nihilism 1 of 1',
    text: `When Placed: For the next 3 full rounds, at the start of each player's turn, that player must discard 3 cards of their choice from their hand.

If both players have 0 cards in hand, this effect ends immediately.

Event Horizon: If a player has no cards remaining in their hand while the other player still has at least 1 card in hand, the empty-handed player must discard active cards they control to satisfy Black Hole Domain's discard requirement. These active cards are treated as being pulled into the Black Hole.

After 3 full rounds, discard Black Hole Domain.`,
  },
];