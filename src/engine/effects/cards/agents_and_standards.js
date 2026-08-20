// ════════════════════════════════════════════════════════════════
// AGENTS AND STANDARDS (Moral Constructivism — Alignment C / Adaptation)
//
// Core Distinction: Normative standards are connected to agents and the
//   standards governing practical reasoning.
//
// Bonus Feature: While Agents and Standards is active, if the opposing
//   player's Epistemology is majority System or entirely System, then
//   once every other turn, whenever that player would gain 1 or more
//   points, you may cause 1 of those points to be gained as an
//   Adaptation point instead. This ability may be used even if it is
//   not your turn. If the opposing player's Epistemology is not
//   majority System or entirely System, Agents and Standards has no
//   Bonus Feature.
// ════════════════════════════════════════════════════════════════

import { claimOnceEveryOtherTurn, getOpponent } from '../../effects/primitives';

function isMajoritySystem(state, playerId) {
  const alignments = state.players[playerId]?.alignments || [];
  const bCount = alignments.filter((a) => a === 'B').length;
  return bCount >= 2; // majority or entirely System
}

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'before:point_added') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    const oppId = getOpponent(owner);
    if (payload?.playerId !== oppId) return; // opponent is gaining
    if (!isMajoritySystem(state, oppId)) return;
    if (payload?.type === 'C') return; // already Adaptation
    if (payload?.amount < 1) return;
    if (!claimOnceEveryOtherTurn(state, owner, 'agents_and_standards')) return;
    // Redirect 1 of the gained points to Adaptation.
    return { modify: { amount: payload.amount, type: 'C' } };
    // NOTE: This redirects all gained points to Adaptation as a simplification.
    // Full implementation would split 1 point off; requires multi-add support.
  },
};