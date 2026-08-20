// ════════════════════════════════════════════════════════════════
// BINDING OUTCOME (Moral Constructivism — Alignment C / Adaptation)
//
// Core Distinction: Once a valid construction has been completed, its
//   result becomes genuinely authoritative or binding.
//
// Bonus Feature: While Binding Outcome is active, its effect also
//   applies to your active Moral Reality card. If a Grounding-type card
//   would affect, change, or remove either Binding Outcome or your
//   active Moral Reality card, you may disregard that card's effect on
//   the affected card. If a non-Grounding single-use card successfully
//   affects, changes, or removes either Binding Outcome or your active
//   Moral Reality card, that effect resolves normally. After the card
//   finishes resolving, if it would normally be discarded and no other
//   effect returns it to its original player, you take that card and
//   add it to your hand instead.
// ════════════════════════════════════════════════════════════════

export default {
  onEvent(state, owner, eventType, payload) {
    if (owner !== 'player' && owner !== 'opponent') return;
    const player = state.players[owner];
    if (!player) return;
    const myMR = player.persistentSlots.middle;

    // Grounding-type cards cannot affect Binding Outcome or your Moral Reality.
    if (eventType === 'before:card_played') {
      const card = payload?.card;
      if (!card || card.alignment !== 'A') return; // Grounding-type only
      // If this Grounding card targets your MR or Binding Outcome, disregard.
      // (Full targeting check requires target info; this blocks Grounding
      // single-use cards played by the opponent that would affect your board.)
      const oppId = owner === 'player' ? 'opponent' : 'player';
      if (payload?.playerId === oppId && (card.category === 'moral_judgment' || card.category === 'rhetoric')) {
        return { cancel: true };
      }
    }

    // Non-Grounding single-use that affects them → after resolving, take the card.
    if (eventType === 'card_discarded') {
      const card = payload?.card;
      if (!card) return;
      if (card.alignment === 'A') return; // only non-Grounding
      if (payload?.playerId === owner) return; // only opponent's cards
      if (!card.category || !['moral_judgment', 'rhetoric'].includes(card.category)) return;
      // Take the card into your hand instead of the discard pile.
      const discardPile = state.discardPiles;
      // Remove from discard pile if present.
      for (const pile of Object.values(discardPile)) {
        const idx = pile.findIndex((c) => c?.id === card.id);
        if (idx >= 0) { pile.splice(idx, 1); break; }
      }
      if (player.hand.length < player.handLimit) {
        player.hand.push(card);
      }
    }
  },
};