// Dispatcher — routes card lifecycle events to the correct per-card handler.
//
// The engine calls these dispatch functions (not the handlers directly) so the
// call sites don't need to know about the registry. Each dispatch is a no-op if
// the card has no effect file yet, so partially-implemented cards still work.

import { getEffect } from './registry';
import { emit, emitBefore } from './eventBus';
import { logEvent } from '../gameState';

// A one-time-use action card resolves (from queue or immediate play).
export function dispatchResolve(state, playerId, card, targets = {}) {
  const handler = getEffect(card.id);
  if (!handler?.onPlay) {
    logEvent(state, { type: 'effect_noop', cardId: card.id, reason: 'no_onPlay' });
    return;
  }
  handler.onPlay(state, playerId, card, targets);
}

// A persistent card is placed into a slot (or the shared Domain).
// `slot` is 'left' | 'middle' | 'right' | 'domain'.
export function dispatchPlace(state, playerId, card, slot) {
  const handler = getEffect(card.id);
  if (handler?.onPlace) handler.onPlace(state, playerId, card, slot);
  if (slot === 'domain') emit(state, 'domain_changed', { playerId, card });
}

// A persistent card is removed/replaced — clean up its state.
export function dispatchRemove(state, playerId, card) {
  const handler = getEffect(card.id);
  if (handler?.onRemove) handler.onRemove(state, playerId, card);
}

// A Rhetoric card is played onto a target during a response window.
export function dispatchRhetoric(state, playerId, card, targetCard, action) {
  const handler = getEffect(card.id);
  if (handler?.onRhetoric) handler.onRhetoric(state, playerId, card, targetCard, action);
}

// A Universals modifier attaches to a target card/queue slot.
export function dispatchAttach(state, playerId, card, target) {
  const handler = getEffect(card.id);
  if (handler?.onAttach) handler.onAttach(state, playerId, card, target);
}

// End of a full round — the active Domain generates points per its rules.
export function dispatchRoundEnd(state) {
  let domain = state.domain;
  if (!domain) return;
  if (domain.id === 'twofold_reality' && state.domainAttached?.activeSide) {
    domain = state.domainAttached[state.domainAttached.activeSide] || domain;
  }
  const handler = getEffect(domain.id);
  if (handler?.onRoundEnd) handler.onRoundEnd(state, state.domainPlacedBy || 'domain', domain);
}

// A player attempts to change the Domain. Cancelable by active effects (locks).
export function dispatchDomainChangeAttempt(state, playerId, newDomainCard) {
  const before = emitBefore(state, 'domain_change_attempted', { playerId, newDomainCard });
  return !before.cancelled;
}