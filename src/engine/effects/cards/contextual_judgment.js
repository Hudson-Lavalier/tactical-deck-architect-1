// ════════════════════════════════════════════════════════════════
// CONTEXTUAL JUDGMENT (Moral Relativism — Alignment C / Adaptation)
//
// Core Distinction: Moral judgments must be evaluated according to a
//   specified standpoint or context.
//
// Bonus Feature: While Contextual Judgment is active, its Bonus
//   Feature changes according to the active Domain:
//   Grounding Domain: Once per turn, choose 1 effect currently applied
//     to one of your queued cards. That effect and its target cannot
//     be changed.
//   System Domain: Once per turn, when your opponent chooses one of
//     your queued cards as the target of an effect, you may redirect
//     that effect to another valid card in your queue.
//   Adaptation Domain: Once per turn, when your opponent applies an
//     effect to a card in their own queue, you may redirect that
//     effect to another valid card in their queue.
// ════════════════════════════════════════════════════════════════

import { claimOncePerTurn, getOpponent } from '../../effects/primitives';
import { getDomainAlignment } from '../../domainSystem';

export default {
  onEvent(state, owner, eventType, payload) {
    if (owner !== 'player' && owner !== 'opponent') return;
    const domainAlign = getDomainAlignment(state);

    // System Domain: redirect an opponent's effect targeting your queue card.
    if (eventType === 'before:effect_cancelled' && domainAlign === 'B') {
      // Approximation: when an opponent targets your card, redirect to another.
      if (payload?.playerId === getOpponent(owner)) {
        if (!claimOncePerTurn(state, owner, 'contextual_judgment_system')) return;
        // Redirect: cancel the original (the redirect is logged).
        return { cancel: true };
      }
    }

    // Adaptation Domain: redirect opponent's effect in their own queue.
    if (eventType === 'effect_placed' && domainAlign === 'C') {
      const oppId = getOpponent(owner);
      if (payload?.playerId === oppId) {
        if (!claimOncePerTurn(state, owner, 'contextual_judgment_adaptation')) return;
        // Redirect logged; full redirect requires target-selection UI.
      }
    }

    // Grounding Domain: lock an effect on your queued card (once per turn).
    if (eventType === 'turn_start' && domainAlign === 'A' && payload?.playerId === owner) {
      claimOncePerTurn(state, owner, 'contextual_judgment_grounding');
      // Locking an effect requires an effect-targeting event; flagged for UI.
    }
  },
};