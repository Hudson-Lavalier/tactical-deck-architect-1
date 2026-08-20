// ════════════════════════════════════════════════════════════════
// OBJECTIVE AUTHORITY (Moral Realism — Alignment A / Grounding)
//
// Core Distinction: Moral truth or authority does not merely depend on
//   what an individual, society, or culture happens to approve.
//
// Bonus Feature: While Objective Authority is active, once per turn,
//   when the effect or ability of one of your cards would be canceled,
//   you may override that cancellation if the card's type matches the
//   active Domain. The effect or ability resolves normally.
// ════════════════════════════════════════════════════════════════

import { claimOncePerTurn } from '../../effects/primitives';
import { getDomainAlignment as getDomainAlign } from '../../domainSystem';

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'before:effect_cancelled') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    const card = payload?.card;
    if (!card) return;
    // Only override for your own cards.
    if (payload.playerId !== owner) return;
    // Card type must match active Domain.
    const domainAlign = getDomainAlign(state);
    if (card.alignment !== domainAlign) return;
    if (!claimOncePerTurn(state, owner, 'objective_authority_override')) return;
    return { cancel: true }; // cancel the cancellation → card resolves
  },
};