// TEST: Delay — Rhetoric response.
// Add 1 turn to the target card's queue timer.

import { addQueueTurns } from '../../effects/primitives';

export default {
  onRhetoric(state, playerId, card, targetCard, action) {
    if (action !== 'delay') return;
    if (!targetCard) return;
    for (const pid of ['player', 'opponent']) {
      const queue = state.players[pid]?.queue || [];
      const idx = queue.findIndex((q) => q.card?.id === targetCard.id);
      if (idx >= 0) { addQueueTurns(state, pid, idx, 1); return; }
    }
  },
};