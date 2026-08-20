// ════════════════════════════════════════════════════════════════
// EQUAL REALITY (Eternalism — Alignment B / System)
//
// Eternalism System Effect: Anytime an Eternalism Theory of Time card
//   is active for a player, system cards can never be disadvantaged for
//   that player.
//
// Bonus Feature: Any player who has Equal Reality active adopts the
//   Bonus Feature only of the opposing player's active Theory of Time
//   card. The adopted Bonus Feature remains in effect until Equal
//   Reality is changed or removed.
//   If both players have Equal Reality active, neither adopts a Bonus
//   Feature.
// ════════════════════════════════════════════════════════════════

import { getHandler } from '../../effects/eventBus';
import { getDomainAlignment } from '../../domainSystem';

export default {
  // Eternalism: base 1, +1 if System domain (ToT matching).
  getAllowanceModifier(state, playerId, base) {
    let mod = base + 1; // ToT base
    if (getDomainAlignment(state) === 'B') mod += 0; // System match already in base+1
    // Adopt opponent's ToT bonus feature (allowance modifier only).
    const oppId = playerId === 'player' ? 'opponent' : 'player';
    const oppToT = state.players[oppId]?.persistentSlots.left;
    if (oppToT && oppToT.id !== 'equal_reality') {
      const oppHandler = getHandler(oppToT.id);
      if (oppHandler?.getAllowanceModifier) {
        mod = oppHandler.getAllowanceModifier(state, playerId, mod);
      }
    }
    return mod;
  },
};