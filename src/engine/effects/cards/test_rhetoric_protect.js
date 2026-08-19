// TEST: Protect — Rhetoric response.
// Protect the target card from the next opposing rhetoric card.

export default {
  onRhetoric(state, playerId, card, targetCard, action) {
    if (action !== 'protect') return;
    // Mark the target card as protected from the next rhetoric.
    if (!targetCard) return;
    // Search both players' queues for the target and mark it.
    for (const pid of ['player', 'opponent']) {
      const queue = state.players[pid]?.queue || [];
      const item = queue.find((q) => q.card?.id === targetCard.id);
      if (item) { item._rhetoricProtected = true; return; }
    }
  },
};