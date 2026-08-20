# Card Effect Audit

Status meanings: **Working** = engine-wired and automatically actionable. **Partial** = core rule is wired, but one or more player-choice/target-selection controls still require a dedicated interaction. **Needs work** = no effect handler is registered; the UI marks these cards `NEEDS WORK`.

## Domains
- Physical Foundation — Working
- Physical Supervenience — Working
- Causal Completeness — Partial: optional point-spend return choice is automatic/limited
- The Physical Mind — Working
- Mental Foundation — Working
- Mind-Dependent Reality — Working
- Constructive Cognition — Partial: immediate-play choice needs a selector
- Absolute Unity — Working
- Twofold Reality — Working: transactional flank attachment, active-flank events, round effects, two switches per owner turn, NPC attachment
- Ontological Independence — Partial: discard-copy choice needs a prompt
- Marks of Mind — Working
- Bridge Between Realms — Partial: once-per-turn option picker required
- Black Hole Domain — Partial: discard selection is not yet player-directed

## Theory of Time
- Present Reality — Working
- The Vanishing Past — Working
- Equal Reality — Partial: copied bonus target lifecycle needs explicit selection for choice-based bonuses
- Tenseless Order — Working
- Accumulated Reality — Partial: bonus immediate-play choice needs a prompt
- Reality Frontier — Working

## Moral Reality
- Moral Facts — Partial: opponent queue target control required
- Moral Truth — Partial: Truth target control required
- Realized Truth — Partial: multi-card reveal control required
- Objective Authority — Working
- Factual Appearance — Partial: queue/hand swap controls required
- Missing Properties — Partial: opponent queue target control required
- Systematic Error — Partial: sacrifice target control required
- Moral Practice After Error — Partial: reaction card selector required
- Moral Diversity — Partial: copied-effect target control required
- Framework-Relative Truth — Partial: optional framework toggle required
- No Privileged Framework — Partial: two-persistent selector required
- Contextual Judgment — Partial: effect target/redirect controls required

## Moral Grounding
- Natural Moral Facts — Working
- Moral Properties in Nature — Working
- Ordinary Inquiry — Partial: optional activation prompt required
- Natural Explanation — Partial: up-to-two card selector required
- Real Moral Facts — Partial: empty-slot and point-type selector required
- Irreducible Morality — Partial: point-pool toggle selector required
- Distinct Moral Properties — Partial: point designation selector required
- Rational or Intuitive Access — Partial: optional conversion boost prompt required
- Morality Is Constructed — Partial: three-option construction control required
- Valid Construction — Partial: optional reaction prompt required
- Agents and Standards — Partial: optional replacement prompt required
- Binding Outcome — Partial: optional disregard/take-card prompt required

## Undefined production categories
Universals, Moral Judgment, and Rhetoric currently have no production card definitions. Their isolated TEST cards all have registered handlers and remain available through Test Mode.

## Engine coverage completed
- Effect registry and lifecycle dispatcher
- Persistent event bus and cancelable before-events
- Point operations, shields, locks, conversion, theft, and distinct points
- Queue reveal, bounce, swap, delay, pause, remove, and force-resolve primitives
- Domain change locks and round-end dispatch
- Twofold active-flank resolution alignment and lifecycle dispatch
- Synthesized cues for all logged gameplay events, plus global UI interactions and persistent mute