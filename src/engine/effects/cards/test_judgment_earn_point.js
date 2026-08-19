// TEST: Earn Point — Moral Judgment action.
// Add 1 point to yourself matching the active Domain's type.

import { addPoints } from '../../effects/primitives';
import { getDomainAlignment } from '../../domainSystem';

export default {
  onPlay(state, playerId, card, targets) {
    let type = getDomainAlignment(state);
    if (!type) type = 'A'; // default if no domain
    addPoints(state, playerId, type, 1, 'test_earn_point');
  },
};