// ════════════════════════════════════════════════════════════════
// BRIDGE BETWEEN REALMS (Dualism — Alignment C / Adaptation)
//
// Point Generation: None.
//
// Bonus Feature: While this domain is active you may do the one
//   following once per turn:
//   - If the opponent has a moral reality card or moral grounding card
//     of the System type then you may take one Grounding point away
//     from them and give it to yourself.
//   - If the opponent has a moral reality card or moral grounding card
//     of the Grounding type then you may take one System point away
//     from them and give it to yourself.
//   - Change 2 of the same points of either Grounding or System from
//     your point pool to Adaptation points.
// ════════════════════════════════════════════════════════════════

import { stealPoints, convertPoints, claimOncePerTurn, getOpponent } from '../../effects/primitives';

export default {
  // No point generation.

  // Once per turn, the placer may use one of three options.
  // Auto-triggered at turn start for the placer (best available option).
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'turn_start') return;
    const pid = state.domainPlacedBy;
    if (payload?.playerId !== pid) return;
    if (!claimOncePerTurn(state, pid, 'bridge_between_realms')) return;

    const oppId = getOpponent(pid);
    const opp = state.players[oppId];
    const oppSlots = opp?.persistentSlots;
    const hasSystemPersistent =
      oppSlots?.middle?.alignment === 'B' || oppSlots?.right?.alignment === 'B';
    const hasGroundingPersistent =
      oppSlots?.middle?.alignment === 'A' || oppSlots?.right?.alignment === 'A';

    const me = state.players[pid];
    // Option 1: steal a Grounding point if opponent has System persistent
    if (hasSystemPersistent && opp.points.A > 0) {
      stealPoints(state, oppId, pid, 'A', 1, 'bridge_between_realms');
      return;
    }
    // Option 2: steal a System point if opponent has Grounding persistent
    if (hasGroundingPersistent && opp.points.B > 0) {
      stealPoints(state, oppId, pid, 'B', 1, 'bridge_between_realms');
      return;
    }
    // Option 3: convert 2 of same type (Grounding or System) to Adaptation
    if (me.points.A >= 2) {
      convertPoints(state, pid, 'A', 'C', 2, 'bridge_between_realms');
      return;
    }
    if (me.points.B >= 2) {
      convertPoints(state, pid, 'B', 'C', 2, 'bridge_between_realms');
      return;
    }
  },
};