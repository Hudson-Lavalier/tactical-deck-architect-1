// Card-type overviews / summaries.
// ════════════════════════════════════════════════════════════════
// Verbatim introductory text transcribed from each card-type document.
// These are the overviews that appear at the top of every card sheet,
// shown in Card Info below the active category heading.
//
// No text is invented — only categories whose documents have been
// provided are populated. Others are omitted (undefined) and render
// nothing until their source document arrives.
// ════════════════════════════════════════════════════════════════

export const CARD_OVERVIEWS = {
  domain: `What Domain Cards Govern

Domain represents the shared philosophical reality in which both players are operating.

There is only one active Domain at a time, and it occupies the central shared Domain position rather than belonging to either player's persistent board.

Domain is one of the most important systems in the game because it governs several things simultaneously.

Domain Governs Point Generation

Domain generates points of its associated point type.

When the Domain generates a point:

Both players gain the generated point.

The player who placed the Domain does not automatically receive an additional point simply for controlling the Domain.

Other cards, abilities, Moral Grounding effects, or build synergies may create additional benefits for one player.

This creates a shared strategic problem. Establishing the Domain you want may also generate useful points for your opponent.

Dualist or Adaptation Domain may have card-specific rules determining which point type it generates.

Domain Changes

Domain cannot simply be changed whenever a player wants.

A card or ability must specifically permit a Domain change.

When a player successfully places or replaces the active Domain:

Their turn immediately ends.

This is one of the main costs of changing Domain.

The opponent therefore receives the first normal turn under the newly established Domain.

Domain changes can also trigger abilities, including several Epistemology abilities.

Domain and Timing

Domain alignment determines the normal resolution timing of applicable cards.

Cards may resolve immediately, enter the queue for 1 turn, or become disadvantaged and enter the queue for 2 turns.

When the Domain changes, the timing of cards already waiting in the queue is recalculated under the newly active Domain unless another card or effect prevents or overrides that recalculation.

Individual cards and abilities may create exceptions to these timing rules.

Domain and Theory of Time

Domain is also important to Theory of Time effects.

Theory of Time cards can reward matching Domain, and the Adaptation / Growing-Block system becomes stronger when Domain remains unchanged.

Changing Domain resets that accumulated Domain-duration progress.

Where Domain Cards Are Played

Domain cards are played into:

The Shared Domain Slot

They do not attach to a player's Moral Grounding, Moral Reality, or Theory of Time slot.

Replacing the Domain replaces the shared environment for both players.

Domain Governs Action-Card Timing

Action cards may be played regardless of whether their Grounding, System, or Adaptation type matches the active Domain.

The active Domain instead determines how applicable cards resolve through the timing system.

Depending on their relationship to the active Domain, cards may:

Resolve immediately.

Enter the queue and resolve after 1 turn.

Be disadvantaged and resolve after 2 turns.

Individual cards, abilities, and Theory of Time effects may modify or override this timing.

Domain cards themselves are not Action cards and may be played regardless of the currently active Domain.

Timing Effect Hierarchy

Normal Domain timing establishes whether a card resolves immediately, after 1 turn, or after 2 turns due to disadvantage.

Effects that modify normal timing, such as Presentism, modify those values.

A card that places a card into a special paused or suspended queue state, such as Reality Frontier, is not changing that card's advantage or disadvantage status. The card remains suspended until the condition ends or an effect specifically overrides the queue.

Effects that explicitly cause a queued card to immediately go into effect override ordinary queue timing and paused queue progression unless specifically prohibited.`,

  theory_of_time: `What Theory of Time Cards Govern

Theory of Time represents how a player's philosophy understands temporal existence, sequencing, and the availability of actions through time.

Each player may have one Theory of Time card active at a time.

Theory of Time cards are persistent and remain active until changed, removed, discarded, or otherwise affected by another card or ability.

Each Theory of Time philosophy has 2 card variants.

Both variants within the same philosophy share a unique System Effect associated with that philosophy. The individual cards then have their own separate Bonus Feature.

Theory of Time Play Allowance

While you have an active Theory of Time card, you may play up to 2 cards of that Theory of Time card's type during each full round, instead of the normal limit of 1.

For example:

A Grounding Theory of Time allows you to play up to 2 Grounding cards during the full round.

A System Theory of Time allows you to play up to 2 System cards during the full round.

An Adaptation Theory of Time allows you to play up to 2 Adaptation cards during the full round.

If you play 1 card of a different type during that full round, you lose the additional play granted by your Theory of Time for the remainder of that full round.

In that case, you may not use your Theory of Time to play a second card of its matching type during that full round.

Individual Theory of Time cards and System Effects may replace, increase, or otherwise modify this normal play allowance.

Unless an effect explicitly says otherwise, these additional card plays are separate from the normal Theory of Time play allowance.

Immediate Card Plays

When a card or ability allows a player to immediately play a card, that play does not count against the player's normal card-play allowance unless the effect explicitly states otherwise.

The card must still obey any other applicable restrictions unless the effect specifically overrides them.

This matters because "play immediately" appears outside Theory of Time too.`,

  moral_reality: `Moral Reality Card Ability Worksheet

Moral Reality cards are persistent cards. Each player may have one Moral Reality card active at a time.

Each card has its own individual Bonus Feature. There is no shared philosophy-wide System Effect for Moral Realism, Error Theory, or Moral Relativism.`,
};