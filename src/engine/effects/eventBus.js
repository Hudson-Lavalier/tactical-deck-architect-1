// Event bus — dispatches game events to active persistent cards.
//
// Persistent cards (Domain, Theory of Time, Moral Reality, Moral Grounding)
// do not explicitly subscribe. While a card is in play (in a persistent slot or
// the shared Domain), its `onEvent` handler is called for every event the engine
// fires. This avoids subscribe/unsubscribe lifecycle bugs.
//
// Two phases:
//   emitBefore(state, eventType, payload) — cancelable. A handler returns
//     { cancel: true } to nullify the action, or { modify: { ... } } to alter
//     the payload before the action runs. Returns { cancelled, payload }.
//   emit(state, eventType, payload) — informational. Handlers react (grant a
//     point, copy an effect, etc.) but cannot cancel.
//
// The handler lookup is injected by registry.js at init to avoid an import cycle
// (eventBus must remain a leaf module — it imports nothing from the engine).

let _getHandler = () => null;
export function setHandlerLookup(fn) { _getHandler = fn; }

// Expose the handler lookup so primitives can resolve card effects without
// importing the registry (avoids a circular import at init time).
export function getHandler(cardId) { return _getHandler(cardId); }

// Collect every active persistent card: the shared Domain + both players' slots.
function activeCards(state) {
  const cards = [];
  if (state.domain) cards.push({ owner: 'domain', card: state.domain });
  for (const pid of ['player', 'opponent']) {
    const p = state.players?.[pid];
    if (!p?.persistentSlots) continue;
    for (const slot of ['left', 'middle', 'right']) {
      const c = p.persistentSlots[slot];
      if (c) cards.push({ owner: pid, card: c });
    }
  }
  return cards;
}

// Cancelable "before" event. Handlers may cancel or modify the pending action.
export function emitBefore(state, eventType, payload = {}) {
  let current = { ...payload };
  for (const { owner, card } of activeCards(state)) {
    const handler = _getHandler(card.id);
    if (!handler?.onEvent) continue;
    const res = handler.onEvent(state, owner, 'before:' + eventType, current);
    if (res?.cancel) return { cancelled: true, cancelledBy: owner, card };
    if (res?.modify) current = { ...current, ...res.modify };
  }
  return { cancelled: false, payload: current };
}

// Informational "after" event. Handlers react; return values are ignored.
export function emit(state, eventType, payload = {}) {
  for (const { owner, card } of activeCards(state)) {
    const handler = _getHandler(card.id);
    if (!handler?.onEvent) continue;
    handler.onEvent(state, owner, eventType, payload);
  }
}