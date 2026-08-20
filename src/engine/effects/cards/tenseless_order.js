// ════════════════════════════════════════════════════════════════
// TENSELESS ORDER (Eternalism — Alignment B / System)
//
// Eternalism System Effect: Anytime an Eternalism Theory of Time card
//   is active for a player, system cards can never be disadvantaged.
//
// Bonus Feature: While Tenseless Order is active and the active Domain
//   is System-type, the opposing player must add 1 additional turn to
//   the normal queue requirement of any card they play that is
//   affected by Domain timing.
//   If an opposing card would normally resolve immediately, it
//   instead resolves after 1 turn.
//   An external card or effect that specifically causes that card to
//   resolve immediately may override this additional queue time.
// ════════════════════════════════════════════════════════════════

import { getDomainAlignment } from '../../domainSystem';

export default {
  getAllowanceModifier(state, playerId, base) {
    return base + 1; // ToT base
  },

  // When the opponent queues a card while System domain is active, add 1 turn.
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'card_queued') return;
    const oppId = owner === 'player' ? 'opponent' : 'player';
    // Only the opponent of the Tenseless Order player is affected.
    if (payload.playerId === owner) return; // not the ToT owner
    if (getDomainAlignment(state) !== 'B') return;
    const player = state.players[payload.playerId];
    if (!player) return;
    const item = player.queue.find((q) => q.card?.id === payload.card?.id);
    if (!item) return;
    item.turnsRemaining += 1;
    item.row += 1;
  },
};