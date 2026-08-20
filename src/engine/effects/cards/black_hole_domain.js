// ════════════════════════════════════════════════════════════════
// BLACK HOLE DOMAIN (Nihilism — no alignment)
//
// When Placed: For the next 3 full rounds, at the start of each
//   player's turn, that player must discard 3 cards of their choice
//   from their hand.
//   If both players have 0 cards in hand, this effect ends immediately.
//
// Event Horizon: If a player has no cards remaining in their hand while
//   the other player still has at least 1 card in hand, the
//   empty-handed player must discard active cards they control to
//   satisfy Black Hole Domain's discard requirement. These active
//   cards are treated as being pulled into the Black Hole.
//
// After 3 full rounds, discard Black Hole Domain.
// ════════════════════════════════════════════════════════════════

import { discardCard } from '../../effects/primitives';

export default {
  onPlace(state) {
    // Track rounds remaining for the Black Hole effect.
    state.blackHoleRounds = 3;
  },

  onRemove(state) {
    state.blackHoleRounds = 0;
  },

  // At the start of each turn, the current player discards 3 cards.
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'turn_start') return;
    if (!state.blackHoleRounds || state.blackHoleRounds <= 0) return;

    const pid = payload?.playerId;
    const player = state.players[pid];
    if (!player) return;

    // If both players have 0 cards, end the effect.
    const otherId = pid === 'player' ? 'opponent' : 'player';
    if (player.hand.length === 0 && state.players[otherId].hand.length === 0) {
      state.blackHoleRounds = 0;
      // Discard the Black Hole Domain itself.
      if (state.domain?.id === 'black_hole_domain') {
        const bh = state.domain;
        state.domain = null;
        state.domainPlacedBy = null;
        discardCard(state, bh);
      }
      return;
    }

    // Discard up to 3 cards from hand.
    let toDiscard = 3;
    while (toDiscard > 0 && player.hand.length > 0) {
      const card = player.hand.shift();
      discardCard(state, card, pid);
      toDiscard--;
    }

    // Event Horizon: if hand is empty but need to discard more, pull active cards.
    if (toDiscard > 0 && player.hand.length === 0) {
      // Pull from persistent slots and queue.
      for (const slot of ['left', 'middle', 'right']) {
        if (toDiscard <= 0) break;
        const c = player.persistentSlots[slot];
        if (c) {
          player.persistentSlots[slot] = null;
          discardCard(state, c, pid);
          toDiscard--;
        }
      }
      for (let i = player.queue.length - 1; i >= 0 && toDiscard > 0; i--) {
        const item = player.queue[i];
        discardCard(state, item.card, pid);
        player.queue.splice(i, 1);
        toDiscard--;
      }
    }
  },

  // Decrement the round counter at round end; discard after 3 rounds.
  onRoundEnd(state) {
    if (!state.blackHoleRounds) return;
    state.blackHoleRounds--;
    if (state.blackHoleRounds <= 0) {
      const bh = state.domain;
      if (bh?.id === 'black_hole_domain') {
        state.domain = null;
        state.domainPlacedBy = null;
        discardCard(state, bh);
      }
    }
  },
};