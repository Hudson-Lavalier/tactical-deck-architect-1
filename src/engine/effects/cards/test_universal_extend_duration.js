// TEST: Extend Duration — Universal modifier.
// Attach to a queued card; its queue duration is extended by 1 turn.

import { addQueueTurns } from '../../effects/primitives';

export default {
  onAttach(state, playerId, card, target) {
    if (!target || target.queueIndex === undefined) return;
    addQueueTurns(state, target.playerId || playerId, target.queueIndex, 1);
  },
};