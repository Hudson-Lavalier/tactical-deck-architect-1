// ════════════════════════════════════════════════════════════════
// ACCUMULATED REALITY (Growing-Block — Alignment C / Adaptation)
//
// Growing-Block System Effect: Accumulating Reality
//   When a player has a Growing-Block Theory of Time active, that
//   player's Adaptation card-play allowance becomes 1 Adaptation card
//   per turn, regardless of the active Domain.
//   For every 2 full rounds that the Domain remains unchanged, that
//   allowance increases by 1 Adaptation card per turn.
//   The allowance may increase up to a maximum of 5 Adaptation cards
//   per turn.
//   When the Domain changes, all accumulated progress resets.
//
// Bonus Feature: When Accumulated Reality is placed by a player and
//   becomes active, all cards currently queued by that player
//   immediately go into effect. If that player has no cards queued,
//   they may immediately play 1 card, and that card immediately goes
//   into effect or is used. A card played through this Bonus Feature
//   does not count against the player's normal card-play allowance.
// ════════════════════════════════════════════════════════════════

import { resolveQueueImmediate } from '../../effects/primitives';

export default {
  // Growing-Block: 1 + floor(domainDuration/2), max 5.
  getAllowanceModifier(state, playerId, base) {
    const accumulated = 1 + Math.floor(state.domainDuration / 2);
    return Math.min(accumulated, 5);
  },

  // When placed, all queued cards resolve immediately.
  onPlace(state, playerId, card) {
    const player = state.players[playerId];
    if (!player) return;
    for (let i = 0; i < player.queue.length; i++) {
      resolveQueueImmediate(state, playerId, i);
    }
    // If no cards queued, the player may immediately play 1 card (UI-driven;
    // the engine marks a free-play flag for the UI to honor).
    if (player.queue.length === 0) {
      player.freePlayAvailable = true;
    }
  },
};