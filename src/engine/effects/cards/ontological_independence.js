// ════════════════════════════════════════════════════════════════
// ONTOLOGICAL INDEPENDENCE (Dualism — Alignment C / Adaptation)
//
// Point Generation: At the end of each full round, both players gain
//   1 Adaptation point.
//
// Bonus Feature: While this Domain is active, whenever an effect or
//   card attempts to remove or change it, you may discard a copy of
//   Ontological Independence from your hand to cancel that removal or
//   change. If you do, this Domain cannot be removed or changed by any
//   further card or effect for the remainder of the turn.
// ════════════════════════════════════════════════════════════════

import { addPoints, setDomainLock } from '../../effects/primitives';

export default {
  onRoundEnd(state) {
    addPoints(state, 'player', 'C', 1, 'domain');
    addPoints(state, 'opponent', 'C', 1, 'domain');
  },

  // Discard a copy from hand to cancel a domain change/removal.
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'before:domain_change_attempted') return;
    const pid = state.domainPlacedBy;
    const player = state.players[pid];
    if (!player) return;
    const copyIndex = player.hand.findIndex((c) => c.id === 'ontological_independence');
    if (copyIndex === -1) return; // no copy to discard
    player.hand.splice(copyIndex, 1);
    state.discardPiles.metaphysics.push({ id: 'ontological_independence', category: 'domain' });
    // Lock for the remainder of the turn.
    setDomainLock(state, 'ontological_independence', pid);
    return { cancel: true };
  },
};