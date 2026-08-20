// ════════════════════════════════════════════════════════════════
// MORAL PROPERTIES IN NATURE (Moral Naturalism — Alignment A / Grounding)
//
// Core Distinction: Moral properties are themselves natural properties.
//
// Bonus Feature: While Moral Properties in Nature is active, once per
//   full round you gain a temporary Grounding Point Shield. The shield
//   nullifies the first opposing effect that would remove, convert, or
//   otherwise change 1 of your Grounding points. After the shield is
//   triggered, it is lost until the next full round.
// ════════════════════════════════════════════════════════════════

import { addShield, getOpponent } from '../../effects/primitives';

export default {
  onEvent(state, owner, eventType, payload) {
    if (owner !== 'player' && owner !== 'opponent') return;

    // Grant a shield at the end of each full round.
    if (eventType === 'round_end') {
      addShield(state, owner, 'A');
      return;
    }

    // Consume the shield when an opponent removes/converts your Grounding points.
    if (eventType === 'before:point_removed' || eventType === 'before:point_converted') {
      const isGrounding =
        (eventType === 'before:point_removed' && payload?.type === 'A') ||
        (eventType === 'before:point_converted' && (payload?.fromType === 'A' || payload?.toType === 'A'));
      if (!isGrounding) return;
      if (payload?.playerId !== owner) return; // must be your points
      // Only block opposing effects (source is a card played by opponent).
      const player = state.players[owner];
      const shieldIdx = (player.pointShields || []).findIndex((s) => s.type === 'A' && !s.used);
      if (shieldIdx < 0) return;
      player.pointShields[shieldIdx].used = true;
      return { cancel: true };
    }
  },
};