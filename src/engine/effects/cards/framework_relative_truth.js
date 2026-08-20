// ════════════════════════════════════════════════════════════════
// FRAMEWORK-RELATIVE TRUTH (Moral Relativism — Alignment C / Adaptation)
//
// Core Distinction: Moral truth or justification is evaluated relative
//   to some relevant framework rather than through one absolute
//   standard.
//
// Bonus Feature: Once per turn, when one of your cards checks the type
//   of the active Domain, you may have that effect check the type of
//   your Moral Reality instead.
// ════════════════════════════════════════════════════════════════

import { claimOncePerTurn } from '../../effects/primitives';

// Provides a helper that other effects can consult: if this card is
// active, the Domain-type check may be redirected to the Moral Reality
// type. Exposed via state flag.
export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'turn_start') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    if (payload?.playerId !== owner) return;
    if (!claimOncePerTurn(state, owner, 'framework_relative_truth')) return;
    // Mark that this player may redirect one Domain-type check this turn.
    state.players[owner]._frameworkRelativeRedirect = true;
  },
};