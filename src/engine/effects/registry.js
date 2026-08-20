// Effect registry — auto-discovers per-card effect files and maps card id → handler.
//
// Each card's game logic lives in its own file under ./cards/<cardId>.js,
// exporting a default handler object. This module eager-loads them all at
// startup and registers the lookup function with the event bus.
//
// Adding a new card's effect = drop a new file in ./cards/. No registration call
// needed; no other file needs to change.

import { setHandlerLookup } from './eventBus';

const modules = import.meta.glob('./cards/*.js', { eager: true });

const handlers = {};
for (const [path, mod] of Object.entries(modules)) {
  const match = path.match(/\/([^/]+)\.js$/);
  if (!match) continue;
  const id = match[1];
  if (mod.default) handlers[id] = mod.default;
}

export function getEffect(cardId) {
  return handlers[cardId] || null;
}

export function hasEffect(cardId) {
  return Boolean(handlers[cardId]);
}

export function allEffectIds() {
  return Object.keys(handlers);
}

// Wire the lookup into the event bus so it can find handlers without importing
// this module (avoids a circular import at init time).
setHandlerLookup(getEffect);