# Card System Analysis

A complete analysis of every card in the game, the types of interactions they perform, and the engine primitives that support them. This is the source of truth for which interaction categories exist and which engine capabilities must be maintained.

---

## Master Taxonomy of Interaction Types

Every card effect in the game falls into one or more of these categories. The engine primitives module (`src/engine/effects/primitives.js`) provides an atomic operation for each.

### 1. Point Economy
Cards that generate, gain, remove, steal, convert, shield, lock, or designate points.

| Primitive | Description |
|---|---|
| `addPoints` | Add points (respects 12-pt limit, pool locks, shields) |
| `removePoints` | Remove points (respects distinct-point immunity, shields) |
| `stealPoints` | Remove from one player, add to another |
| `convertPoints` | Change points from one type to another |
| `setPoints` | Force a specific value (rare) |
| `addShield` | Grant a one-use shield that nullifies the next matching effect |
| `designateDistinctPoint` | Mark points as immune (cannot be removed/stolen/converted) |
| `releaseDistinctPoints` | Return all distinct points to their pools |
| `reduceVictoryRequirement` | Lower the points needed in a pool to win |
| `pointPoolLock` (state) | A pool that cannot be gained or altered |

### 2. Queue Manipulation
Cards that reveal, swap, bounce, pause, delay, or force-resolve queued cards.

| Primitive | Description |
|---|---|
| `revealQueueCard` | Turn a face-down queued card face up |
| `bounceQueueCard` | Return a queued card to its owner's hand |
| `swapQueueCard` | Swap a queued card with a hand card (inherits duration, not states) |
| `addQueueTurns` | Add turns to a card's queue timer (delay) |
| `pauseQueueCard` | Pause a card's timer progression |
| `resumeQueueCard` | Resume a paused card's timer |
| `removeQueueCard` | Remove a card from the queue |
| `resolveQueueImmediate` | Force a card to resolve now (bypass timer) |

### 3. Effect Manipulation
Cards that cancel, redirect, copy, designate, nullify, or override other effects.

| Primitive / Mechanism | Description |
|---|---|
| `before:effect_cancelled` event | Cancelable — a handler can override a cancellation |
| `before:point_removed/converted` | Cancelable — shields/locks can nullify point changes |
| `designateTruth` | Mark a queued card as Truth (cannot be cancelled/delayed/blocked) |
| `isTruthDesignated` | Check Truth status |
| Effect redirect / copy | Via `onEvent` handlers that modify event payloads or re-dispatch |

### 4. Domain Control
Cards that lock, protect, attach sub-domains, or prevent domain changes.

| Primitive / Mechanism | Description |
|---|---|
| `before:domain_change_attempted` event | Cancelable — active effects can block a domain change |
| `setDomainLock` / `clearDomainLock` | Hard lock / unlock the domain |
| `state.domainPlacedBy` | Who placed the current domain |
| `state.domainDuration` | Full rounds since the domain changed (Growing-Block) |
| `state.domainAttached` | Twofold Reality's attached sub-domains |

### 5. Slot / Board Control
Cards that disable slots, reduce victory requirements, or protect persistent cards.

| Primitive | Description |
|---|---|
| `disableSlot` | Disable a persistent slot (cannot be used) |
| `isSlotDisabled` | Check if a slot is disabled |
| `reduceVictoryRequirement` | Lower victory points needed |
| `designateDistinctPoint` | Immune points |
| `dispatchRemove` | Fire a persistent card's cleanup (onRemove) |

### 6. Card-Play Allowance & Drawing
Cards that modify how many cards can be played, grant immediate plays, or draw cards.

| Primitive | Description |
|---|---|
| `getAllowance` | Compute action-card allowance (checks Theory of Time) |
| `getAllowanceModifier` (handler) | Theory of Time cards modify the base allowance |
| `drawCards` | Draw N cards from a pile |
| `drawTypedCard` | Draw a guaranteed typed card from a pile |
| `before:card_played` event | Cancelable — can block a card from being played |

### 7. Conditional Bonuses
Cards whose effects depend on the active Domain, epistemology composition, or hand composition.

| Check | Used by |
|---|---|
| `getDomainAlignment` | Domain-type conditional effects |
| Epistemology alignment count | "Majority System" (Agents and Standards) |
| `hasRationalism` | Rationalism-dependent bonuses |
| `countHandByType` | Hand-composition conditions (Natural Moral Facts, Absolute Unity) |

### 8. Cooldowns & Usage Limits
Cards with once-per-turn, every-other-turn, or cooldown restrictions.

| Primitive | Description |
|---|---|
| `claimOncePerTurn` | Claim a once-per-turn ability (returns false if already used) |
| `claimOnceEveryOtherTurn` | Claim an every-other-turn ability |
| `isAvailable` | Check if an ability is available |
| `resetTurnUsage` | Reset per-turn flags at turn start |
| `state.roundCount` | Full rounds completed (for every-other-turn checks) |

---

## Per-Card Analysis

### Domain Cards (Metaphysics)

| Card | Alters | Categories |
|---|---|---|
| Physical Foundation | Generates 1 Grounding/round for both; locks domain from opponent for 2 rounds | Point Economy, Domain Control |
| Physical Supervenience | Generates 1 Grounding/round for placer only (every 2nd round); bonus Grounding on non-domain Grounding gains | Point Economy |
| Causal Completeness | Generates 1 Grounding/round for both; rescues Grounding cards from discard (once/turn, costs 1 point) | Point Economy, Queue Manipulation |
| The Physical Mind | No points; blocks System one-time-use cards from being played | Effect Manipulation, Card-Play Allowance |
| Mental Foundation | Generates 1 System/round for both; locks System points if player has System trifecta | Point Economy, Slot/Board Control |
| Mind-Dependent Reality | Generates 2 System for Rationalism players, 1 for others; treats both as Rationalism if both have System Moral Grounding | Point Economy, Conditional Bonuses |
| Constructive Cognition | Generates 1 System/round for both; draws a card when a System card is played (up to 2/turn) | Point Economy, Card-Play Allowance |
| Absolute Unity | Generates 1 System/round for both; hard-locks domain if placer has System trifecta + all-System hand | Domain Control, Conditional Bonuses |
| Twofold Reality | No points; attaches 2 sub-domains, switchable; immune to domain-change removal | Domain Control |
| Ontological Independence | Generates 1 Adaptation/round for both; cancels domain change by discarding a copy (locks for turn) | Domain Control, Point Economy |
| Marks of Mind | Generates 1 Adaptation/round for both; nullifies Adaptation-point theft + grants 1; converts non-Adaptation conversions to Adaptation | Point Economy, Effect Manipulation |
| Bridge Between Realms | No points; once/turn: steal a point based on opponent's persistent types, or convert 2 to Adaptation | Point Economy, Conditional Bonuses |
| Black Hole Domain | No points; 3-round forced discard (3 cards/turn), Event Horizon pulls active cards | Queue Manipulation, Slot/Board Control |

### Theory of Time Cards (Metaphysics — persistent, left slot)

| Card | Alters | Categories |
|---|---|---|
| Present Reality | +2 Grounding card allowance with Grounding domain; Presentism system effect (immediate queue) | Card-Play Allowance, Queue Manipulation |
| The Vanishing Past | Same allowance; resolves all queued cards when domain changes to Grounding | Card-Play Allowance, Queue Manipulation |
| Equal Reality | Eternalism system effect (System never disadvantaged); adopts opponent's ToT bonus | Card-Play Allowance, Effect Manipulation |
| Tenseless Order | Eternalism system effect; adds +1 turn to opponent's queue when System domain active | Queue Manipulation, Conditional Bonuses |
| Accumulated Reality | Growing-Block allowance (1 + 1 per 2 rounds, max 5); resolves all queued cards on placement | Card-Play Allowance, Queue Manipulation |
| Reality Frontier | Growing-Block allowance; pauses System card timers when Adaptation domain active | Card-Play Allowance, Queue Manipulation |

### Moral Reality Cards (Meta-Ethics — persistent, middle slot)

| Card | Alters | Categories |
|---|---|---|
| Moral Facts | Reveals 1 opponent queue card face up (once/turn) | Queue Manipulation |
| Moral Truth | Designates 1 face-up queued card as Truth (uncancellable) | Effect Manipulation, Queue Manipulation |
| Realized Truth | Reveals up to 3 queued cards; they become Grounding-type next turn | Queue Manipulation, Point Economy |
| Objective Authority | Overrides cancellation of your card if type matches domain (once/turn) | Effect Manipulation, Conditional Bonuses |
| Factual Appearance | Swaps a queue card (1 turn left) with a hand card (once/turn) | Queue Manipulation |
| Missing Properties | Bounces 1 opponent queue card to hand (every other turn) | Queue Manipulation |
| Systematic Error | Discards 1 own queue card to nullify an effect on your queued card | Effect Manipulation, Queue Manipulation |
| Moral Practice After Error | Immediately plays 1 card into queue when opponent affects your queue (every other turn, off-turn) | Queue Manipulation, Card-Play Allowance |
| Moral Diversity | Copies an effect opponent places on their own card onto your card | Effect Manipulation |
| Framework-Relative Truth | Redirects a Domain-type check to your Moral Reality type (once/turn) | Effect Manipulation, Conditional Bonuses |
| No Privileged Framework | Makes two persistent cards interchangeable as requirements (once/turn) | Effect Manipulation |
| Contextual Judgment | Domain-dependent: lock effect / redirect target / redirect in opponent's queue | Effect Manipulation, Conditional Bonuses |

### Moral Grounding Cards (Meta-Ethics — persistent, right slot)

| Card | Alters | Categories |
|---|---|---|
| Natural Moral Facts | +1 point of domain type at round end if ≥7 cards of that type in hand | Point Economy, Conditional Bonuses |
| Moral Properties in Nature | Grounding Point Shield (once/round) nullifies first opposing Grounding point effect | Point Economy, Effect Manipulation |
| Ordinary Inquiry | Steals 2 Grounding from opponent if they played a Grounding card last turn (2-round cooldown) | Point Economy, Cooldowns |
| Natural Explanation | Places up to 2 cards into queue when opponent affects your points (every 2 rounds) | Queue Manipulation, Cooldowns |
| Real Moral Facts | Disables an empty slot; reduces victory requirement by 3; locks itself from voluntary change | Slot/Board Control, Point Economy |
| Irreducible Morality | Locks a point pool (immune + cannot gain); toggle every other turn | Point Economy, Cooldowns |
| Distinct Moral Properties | Designates up to 3 points as immune (every other turn); releases on removal | Point Economy, Slot/Board Control |
| Rational or Intuitive Access | Boosts point conversion (double with Rationalism, +1 otherwise; every other turn) | Point Economy, Conditional Bonuses |
| Morality Is Constructed | Once/turn: spend Adaptation to draw, exchange card for point, or spend 2 to draw | Point Economy, Card-Play Allowance |
| Valid Construction | Negates opponent's MR/MG contribution to effects on your Adaptation points (every other turn) | Effect Manipulation, Point Economy |
| Agents and Standards | Redirects 1 gained point to Adaptation if opponent is majority System (every other turn, off-turn) | Point Economy, Conditional Bonuses |
| Binding Outcome | Protects itself + your Moral Reality from Grounding cards; steals non-Grounding cards that affect them | Effect Manipulation, Slot/Board Control |

### Test Cards (isolated — for deletion)

| Card | Alters | Categories |
|---|---|---|
| TEST: Extend Duration | +1 turn to a queued card's timer | Queue Manipulation |
| TEST: Boost Generation | +1 point of target card's type | Point Economy |
| TEST: Remove Penalty | Resumes a paused queued card | Queue Manipulation |
| TEST: Remove Point | Removes 1 point from opponent (highest pool) | Point Economy |
| TEST: Earn Point | Adds 1 point of the active Domain's type to you | Point Economy |
| TEST: Draw Two | Draws 2 cards from the Metaphysics pile | Card-Play Allowance |
| TEST: Cancel | Cancels the target card's effect | Effect Manipulation |
| TEST: Protect | Protects target from next rhetoric | Effect Manipulation |
| TEST: Delay | +1 turn to target's queue timer | Queue Manipulation |

---

## Event Reference

The event bus (`src/engine/effects/eventBus.js`) fires these events. Persistent cards react via their `onEvent` handler.

| Event | Phase | Payload | Cancelable |
|---|---|---|---|
| `point_added` | before/after | `{ playerId, type, amount, source }` | Yes (before) |
| `point_removed` | before/after | `{ playerId, type, amount, source }` | Yes (before) |
| `point_converted` | before/after | `{ playerId, fromType, toType, amount, source }` | Yes (before) |
| `card_played` | before/after | `{ playerId, card, speed }` | Yes (before) |
| `card_queued` | after | `{ playerId, card, row, speed }` | No |
| `card_discarded` | before/after | `{ card, playerId }` | Yes (before) |
| `domain_change_attempted` | before | `{ playerId, newDomainCard }` | Yes |
| `domain_changed` | after | `{ playerId, card }` | No |
| `effect_cancelled` | before | `{ card, playerId, source }` | Yes (override) |
| `queue_bounce` | after | `{ playerId, queueIndex, card }` | No |
| `queue_removed` | after | `{ playerId, queueIndex, card }` | No |
| `turn_start` | after | `{ playerId }` | No |
| `round_end` | after | `{ round }` | No |

---

## Architecture Notes

- **Per-card effect files**: Each card's logic lives in `src/engine/effects/cards/<cardId>.js`. The registry auto-discovers them via Vite's `import.meta.glob`. Adding or editing a card's effect requires touching only that one file.
- **Handler signature**: `{ onPlay, onPlace, onRemove, onRoundEnd, onRhetoric, onAttach, onEvent, getAllowanceModifier }`. A card implements only the handlers it needs.
- **Event bus**: Iterates over all active persistent cards (Domain + both players' 3 slots) on every event. No subscribe/unsubscribe lifecycle — a card's `onEvent` is called automatically while it's in play.
- **Primitives layer**: All game mutations go through primitives, which emit events. Card effects never call raw systems directly, ensuring shields/locks always get a chance to react.
- **Cancelable vs informational**: `before:` events can be cancelled (return `{ cancel: true }`) or modified (return `{ modify: { ... } }`). After-events are informational only.