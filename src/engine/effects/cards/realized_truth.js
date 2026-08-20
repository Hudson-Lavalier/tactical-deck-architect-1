// ════════════════════════════════════════════════════════════════
// REALIZED TRUTH (Moral Realism — Alignment A / Grounding)
//
// Core Distinction: At least some moral claims actually succeed in
//   being true.
//
// Bonus Feature: While Realized Truth is active, you may turn up to 3
//   cards in your queue face up, so long as each has more than 1 round
//   remaining in its queue duration. On your next turn, those revealed
//   cards become Grounding-type until they resolve or are discarded.
// ════════════════════════════════════════════════════════════════

import { revealQueueCard, claimOncePerTurn } from '../../effects/primitives';

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'turn_start') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    if (payload?.playerId !== owner) return;
    const queue = state.players[owner]?.queue || [];

    // First: convert any cards flagged last turn to Grounding-type.
    for (const item of queue) {
      if (item._becomeGroundingNextTurn) {
        item._becomeGroundingNextTurn = false;
        item.card = { ...item.card, alignment: 'A', _originalAlignment: item.card._originalAlignment || item.card.alignment };
      }
    }

    // Then: reveal up to 3 face-down cards with >1 turn remaining.
    if (!claimOncePerTurn(state, owner, 'realized_truth_reveal')) return;
    let revealed = 0;
    for (let i = 0; i < queue.length && revealed < 3; i++) {
      const item = queue[i];
      if (item.faceDown && item.turnsRemaining > 1) {
        revealQueueCard(state, owner, i);
        item._becomeGroundingNextTurn = true;
        revealed++;
      }
    }
  },
};