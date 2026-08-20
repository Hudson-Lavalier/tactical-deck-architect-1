// ════════════════════════════════════════════════════════════════
// MORAL DIVERSITY (Moral Relativism — Alignment C / Adaptation)
//
// Core Distinction: Moral beliefs, standards, and judgments vary
//   deeply between cultures, societies, persons, or other groups.
//
// Bonus Feature: While Moral Diversity is active, anytime your
//   opponent places an effect on their own card in queue you may copy
//   that effect onto any card of your choosing in your queue.
// ════════════════════════════════════════════════════════════════

// This effect requires an "effect_placed_on_card" event which the engine
// does not yet emit. The handler is structured to react when that event
// becomes available; for now it logs intent.
import { logEvent } from '../../gameState';

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'effect_placed') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    const oppId = owner === 'player' ? 'opponent' : 'player';
    if (payload?.playerId !== oppId) return; // opponent placed on their own card
    // Copy the effect onto the first card in your queue.
    const myQueue = state.players[owner]?.queue || [];
    if (myQueue.length === 0) return;
    logEvent(state, { type: 'moral_diversity_copy', playerId: owner, targetCardId: myQueue[0].card?.id });
    // Effect copying infrastructure pending; the intent is logged.
  },
};