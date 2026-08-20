// TEST: Remove Penalty — Universal modifier.
// Attach to a queued card; removes paused/delayed state.

import { resumeQueueCard } from '../../effects/primitives';

export default {
  onAttach(state, playerId, card, target) {
    if (!target || target.queueIndex === undefined) return;
    resumeQueueCard(state, target.playerId || playerId, target.queueIndex);
  },
};