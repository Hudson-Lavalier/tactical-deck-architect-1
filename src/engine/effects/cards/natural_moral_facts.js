// ════════════════════════════════════════════════════════════════
// NATURAL MORAL FACTS (Moral Naturalism — Alignment A / Grounding)
//
// Core Distinction: Genuine moral facts exist within the natural world.
//
// Bonus Feature: While Natural Moral Facts is active, at the end of
//   each full round you gain 1 additional point matching the active
//   Domain's type, so long as you have at least 7 cards of that type
//   in your hand. If you no longer meet that requirement, this Bonus
//   Feature becomes inactive until the requirement is met again.
// ════════════════════════════════════════════════════════════════

import { addPoints, countHandByType } from '../../effects/primitives';
import { getDomainAlignment } from '../../domainSystem';

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'round_end') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    const domainAlign = getDomainAlignment(state);
    if (!domainAlign) return;
    const player = state.players[owner];
    if (!player) return;
    if (countHandByType(player, domainAlign) >= 7) {
      addPoints(state, owner, domainAlign, 1, 'natural_moral_facts');
    }
  },
};