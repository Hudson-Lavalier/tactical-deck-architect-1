// ════════════════════════════════════════════════════════════════
// MORAL FACTS (Moral Realism — Alignment A / Grounding)
//
// Core Distinction: Moral properties or facts are genuine features of
//   reality.
//
// Bonus Feature: While Moral Facts is active, once per turn you may
//   choose 1 card in your opponent's queue. That card is turned face
//   up and remains face up for the rest of its duration in the queue.
//   You may not turn more than 1 card face up at a time.
// ════════════════════════════════════════════════════════════════

import { revealQueueCard, claimOncePerTurn, getOpponent } from '../../effects/primitives';

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'turn_start') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    if (payload?.playerId !== owner) return; // only on your own turn
    if (!claimOncePerTurn(state, owner, 'moral_facts_reveal')) return;
    const oppId = getOpponent(owner);
    const oppQueue = state.players[oppId]?.queue || [];
    const idx = oppQueue.findIndex((q) => q.faceDown);
    if (idx >= 0) revealQueueCard(state, oppId, idx);
  },
};