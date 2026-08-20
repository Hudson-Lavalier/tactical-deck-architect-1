// TEST: Cancel — Rhetoric response.
// Cancel the target card's effect.

export default {
  onRhetoric(state, playerId, card, targetCard, action) {
    // The response system marks the active card as cancelled when action === 'cancel'.
    // This handler confirms the cancel intent; the engine handles the rest.
    if (action !== 'cancel') return;
    // No additional state change needed — the response window's `cancelled` flag
    // is set by playRhetoricResponse in responseSystem.
  },
};