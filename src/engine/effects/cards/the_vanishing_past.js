// ════════════════════════════════════════════════════════════════
// THE VANISHING PAST (Presentism — Alignment A / Grounding)
//
// Presentism System Effect: Whenever any Presentism Theory of Time
//   card is active for a player, cards that would be queued by that
//   player go into effect immediately unless disadvantaged. If
//   disadvantaged they will resolve in one turn instead of two.
//
// Bonus Feature: Anytime the domain changes to a grounding domain any
//   card queued by a player who has The Vanishing Past active
//   immediately goes into effect.
// ════════════════════════════════════════════════════════════════

import { resolveQueueImmediate } from '../../effects/primitives';
import { getDomainAlignment } from '../../domainSystem';

export default {
  getAllowanceModifier(state, playerId, base) {
    const domainAlign = getDomainAlignment(state);
    if (domainAlign === 'A') return base + 2;
    return base + 1;
  },

  // When the domain changes to Grounding, all this player's queued cards resolve.
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'domain_changed') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    if (getDomainAlignment(state) !== 'A') return;
    const player = state.players[owner];
    if (!player) return;
    for (let i = 0; i < player.queue.length; i++) {
      resolveQueueImmediate(state, owner, i);
    }
  },
};