// ════════════════════════════════════════════════════════════════
// PRESENT REALITY (Presentism — Alignment A / Grounding)
//
// Presentism System Effect: Whenever any Presentism Theory of Time
//   card is active for a player, cards that would be queued by that
//   player go into effect immediately unless disadvantaged. If
//   disadvantaged they will resolve in one turn instead of two. This
//   effect applies whenever either Presentism card is active.
//
// Bonus Feature: While a Grounding Domain is active, you may play 1
//   additional Grounding card during each of your turns. This
//   additional play is separate from and stacks with your normal
//   Theory of Time play allowance.
// ════════════════════════════════════════════════════════════════

import { getDomainAlignment } from '../../domainSystem';

export default {
  // Presentism: base 1, +1 ToT matching (Grounding domain), +1 Presentism bonus.
  getAllowanceModifier(state, playerId, base) {
    const domainAlign = getDomainAlignment(state);
    if (domainAlign === 'A') return base + 2; // ToT match + Presentism bonus
    return base + 1; // ToT base (2 cards of matching type per round → +1/turn)
  },
};