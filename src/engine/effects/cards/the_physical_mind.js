// ════════════════════════════════════════════════════════════════
// THE PHYSICAL MIND (Physicalism — Alignment A / Grounding)
//
// Point Generation: This Domain generates no Grounding points.
//
// Bonus Feature: Anti-Immaterial Field
//   While this Domain is active, System-type one-time-use cards cannot
//   be played, even if another effect would normally allow them to
//   ignore Domain alignment.
//   System-type cards that are not one-time-use cards are unaffected. A
//   one-time-use System card may still be played if another card or
//   ability specifically overrides its one-time-use restriction.
// ════════════════════════════════════════════════════════════════

// One-time-use categories: moral_judgment (action) and rhetoric (response).
const ONE_TIME_USE = ['moral_judgment', 'rhetoric'];

export default {
  // No point generation.

  // Anti-Immaterial Field — block System one-time-use cards.
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'before:card_played') return;
    const { card } = payload;
    if (!card || card.alignment !== 'B') return; // System-type only
    if (!ONE_TIME_USE.includes(card.category)) return; // one-time-use only
    return { cancel: true };
  },
};