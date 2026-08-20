// ════════════════════════════════════════════════════════════════
// NO PRIVILEGED FRAMEWORK (Moral Relativism — Alignment C / Adaptation)
//
// Core Distinction: No single moral framework automatically possesses
//   universal authority for conclusively judging every competing
//   framework.
//
// Bonus Feature: Once per turn, choose two of your active persistent
//   cards. Until your next turn, cards that refer specifically to one
//   of those cards as a requirement may refer to either one instead.
// ════════════════════════════════════════════════════════════════

import { claimOncePerTurn } from '../../effects/primitives';

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'turn_start') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    if (payload?.playerId !== owner) return;
    if (!claimOncePerTurn(state, owner, 'no_privileged_framework')) return;
    // Mark the first two persistent cards as interchangeable until next turn.
    const slots = state.players[owner]?.persistentSlots || {};
    const cards = Object.values(slots).filter(Boolean).slice(0, 2);
    state.players[owner]._interchangeableCards = cards.map((c) => c.id);
  },
};