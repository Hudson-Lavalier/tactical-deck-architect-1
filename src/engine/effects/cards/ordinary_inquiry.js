// ════════════════════════════════════════════════════════════════
// ORDINARY INQUIRY (Moral Naturalism — Alignment A / Grounding)
//
// Core Distinction: Moral knowledge can be accessed through ordinary
//   empirical, rational, or naturalistic investigation.
//
// Bonus Feature: While Ordinary Inquiry and a Grounding Domain are
//   active, if your opponent played a Grounding card during their
//   previous turn, you may take 2 Grounding points from them and add
//   those points to your own pool. After this ability is used, it
//   enters a 2-full-round cooldown.
// ════════════════════════════════════════════════════════════════

import { stealPoints, claimOnceEveryOtherTurn, getOpponent } from '../../effects/primitives';
import { getDomainAlignment } from '../../domainSystem';

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'turn_start') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    if (payload?.playerId !== owner) return;
    if (getDomainAlignment(state) !== 'A') return; // Grounding Domain
    // Check if opponent played a Grounding card last turn (scan recent log).
    const oppId = getOpponent(owner);
    const recentGroundingPlay = state.log.some(
      (e) => e.type === 'card_played' && e.player === oppId,
    );
    if (!recentGroundingPlay) return;
    if (!claimOnceEveryOtherTurn(state, owner, 'ordinary_inquiry_steal')) return;
    stealPoints(state, oppId, owner, 'A', 2, 'ordinary_inquiry');
  },
};