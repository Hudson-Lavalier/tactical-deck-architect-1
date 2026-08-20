// Primitives — atomic game operations that every card effect file calls.
//
// Each primitive wraps the raw system math with event-bus emission so passive
// cards (shields, nullifications, redirects) can react. Card effect files
// import from HERE, never from the raw systems (pointSystem/queueSystem) — that
// way events always fire and shields always get a chance to trigger.
//
// Conventions:
//   playerId is always 'player' | 'opponent'.
//   type is always 'A' | 'B' | 'C'.
//   source is a string describing what caused the op (for logs / shields).

import { emitBefore, emit, getHandler } from './eventBus';
import { logEvent } from '../gameState';
import { POINT_LIMIT } from '../../data/gameConstants';

// ── Point economy ───────────────────────────────────────────────────

export function addPoints(state, playerId, type, amount, source = 'card') {
  const player = state.players[playerId];
  if (!player) return 0;

  // Pool lock (Irreducible Morality): cannot gain points of the locked type.
  if (player.pointPoolLock?.[type]) {
    logEvent(state, { type: 'points_blocked', playerId, pointType: type, reason: 'pool_locked' });
    return 0;
  }

  // Cancelable before event — shields/redirects may cancel or modify.
  const before = emitBefore(state, 'point_added', { playerId, type, amount, source });
  if (before.cancelled) {
    logEvent(state, { type: 'points_blocked', playerId, pointType: type, reason: 'nullified', by: before.cancelledBy });
    return 0;
  }
  const eff = before.payload;
  const currentTotal = player.points.A + player.points.B + player.points.C;
  const space = POINT_LIMIT - currentTotal;
  const actual = Math.min(eff.amount, Math.max(0, space));
  player.points[eff.type] += actual;
  logEvent(state, { type: 'points_added', playerId, pointType: eff.type, amount: actual, source });
  emit(state, 'point_added', { playerId, type: eff.type, amount: actual, source });
  return actual;
}

export function removePoints(state, playerId, type, amount, source = 'card') {
  const player = state.players[playerId];
  if (!player) return 0;

  // Distinct Moral Points are immune — only the non-distinct portion is removable.
  const distinct = player.distinctMoralPoints?.[type] || 0;
  const removable = Math.max(0, player.points[type] - distinct);

  const before = emitBefore(state, 'point_removed', { playerId, type, amount, removable, source });
  if (before.cancelled) {
    logEvent(state, { type: 'points_protected', playerId, pointType: type, by: before.cancelledBy });
    return 0;
  }
  const eff = before.payload;
  const actual = Math.min(eff.amount, removable);
  player.points[eff.type] -= actual;
  logEvent(state, { type: 'points_removed', playerId, pointType: eff.type, amount: actual, source });
  emit(state, 'point_removed', { playerId, type: eff.type, amount: actual, source });
  return actual;
}

export function stealPoints(state, fromId, toId, type, amount, source = 'card') {
  const stolen = removePoints(state, fromId, type, amount, source);
  if (stolen <= 0) return 0;
  return addPoints(state, toId, type, stolen, source);
}

export function convertPoints(state, playerId, fromType, toType, amount, source = 'card') {
  const player = state.players[playerId];
  if (!player) return 0;

  const before = emitBefore(state, 'point_converted', { playerId, fromType, toType, amount, source });
  if (before.cancelled) {
    logEvent(state, { type: 'convert_blocked', playerId, by: before.cancelledBy });
    return 0;
  }
  const eff = before.payload;
  const distinct = player.distinctMoralPoints?.[eff.fromType] || 0;
  const removable = Math.max(0, player.points[eff.fromType] - distinct);
  const actual = Math.min(eff.amount, removable);
  player.points[eff.fromType] -= actual;
  // Adding respects the 12-pt limit and pool locks via addPoints.
  const added = addPoints(state, playerId, eff.toType, actual, source);
  logEvent(state, { type: 'points_converted', playerId, fromType: eff.fromType, toType: eff.toType, amount: added, source });
  emit(state, 'point_converted', { playerId, fromType: eff.fromType, toType: eff.toType, amount: added, source });
  return added;
}

// Direct set (rare — used by effects that force a specific value).
export function setPoints(state, playerId, type, amount) {
  const player = state.players[playerId];
  if (!player) return;
  player.points[type] = Math.max(0, Math.min(POINT_LIMIT, amount));
  logEvent(state, { type: 'points_set', playerId, pointType: type, amount: player.points[type] });
}

// ── Point protection / designation ──────────────────────────────────

export function addShield(state, playerId, shieldType) {
  const player = state.players[playerId];
  if (!player.pointShields) player.pointShields = [];
  player.pointShields.push({ type: shieldType, used: false });
  logEvent(state, { type: 'shield_added', playerId, shieldType });
}

// ── Queue manipulation ─────────────────────────────────────────────

export function revealQueueCard(state, playerId, queueIndex) {
  const player = state.players[playerId];
  const item = player.queue[queueIndex];
  if (!item) return false;
  item.faceDown = false;
  logEvent(state, { type: 'queue_reveal', playerId, queueIndex, cardId: item.card?.id });
  return true;
}

export function bounceQueueCard(state, playerId, queueIndex) {
  const player = state.players[playerId];
  const item = player.queue[queueIndex];
  if (!item) return false;
  // Return to hand (if room), clearing any effects/designations.
  const clean = { ...item.card };
  if (player.hand.length < player.handLimit) {
    player.hand.push(clean);
  }
  player.queue.splice(queueIndex, 1);
  logEvent(state, { type: 'queue_bounce', playerId, queueIndex, cardId: clean.id });
  emit(state, 'queue_bounce', { playerId, queueIndex, card: clean });
  return true;
}

export function swapQueueCard(state, playerId, queueIndex, handCardId) {
  const player = state.players[playerId];
  const item = player.queue[queueIndex];
  const handIndex = player.hand.findIndex((c) => c.id === handCardId);
  if (!item || handIndex === -1) return false;
  const handCard = player.hand[handIndex];
  const remaining = item.turnsRemaining;
  player.hand.splice(handIndex, 1);
  player.hand.push(item.card);
  item.card = handCard;
  item.faceDown = true; // replacement does not inherit revealed state
  item.designated = null;
  logEvent(state, { type: 'queue_swap', playerId, queueIndex, newCardId: handCard.id });
  return true;
}

export function addQueueTurns(state, playerId, queueIndex, turns) {
  const player = state.players[playerId];
  const item = player.queue[queueIndex];
  if (!item) return false;
  item.turnsRemaining += turns;
  item.row += turns;
  logEvent(state, { type: 'queue_delay', playerId, queueIndex, turns, newRemaining: item.turnsRemaining });
  return true;
}

export function pauseQueueCard(state, playerId, queueIndex) {
  const player = state.players[playerId];
  const item = player.queue[queueIndex];
  if (!item) return false;
  item.paused = true;
  logEvent(state, { type: 'queue_paused', playerId, queueIndex, cardId: item.card?.id });
  return true;
}

export function resumeQueueCard(state, playerId, queueIndex) {
  const player = state.players[playerId];
  const item = player.queue[queueIndex];
  if (!item) return false;
  item.paused = false;
  logEvent(state, { type: 'queue_resumed', playerId, queueIndex });
  return true;
}

export function removeQueueCard(state, playerId, queueIndex) {
  const player = state.players[playerId];
  if (!player.queue[queueIndex]) return false;
  const [removed] = player.queue.splice(queueIndex, 1);
  logEvent(state, { type: 'queue_removed', playerId, queueIndex, cardId: removed.card?.id });
  emit(state, 'queue_removed', { playerId, queueIndex, card: removed.card });
  return true;
}

// Force a queued card to resolve immediately (bypasses remaining timer).
export function resolveQueueImmediate(state, playerId, queueIndex) {
  const player = state.players[playerId];
  const item = player.queue[queueIndex];
  if (!item) return false;
  item.turnsRemaining = 0;
  item.row = 0;
  item.faceDown = false;
  logEvent(state, { type: 'queue_force_resolve', playerId, queueIndex, cardId: item.card?.id });
  return true;
}

// ── Effect manipulation ──────────────────────────────────────────────

export function designateTruth(state, playerId, queueIndex) {
  const player = state.players[playerId];
  const item = player.queue[queueIndex];
  if (!item) return false;
  // Clear any previous Truth designation for this player
  for (const q of player.queue) if (q.designated === 'truth') q.designated = null;
  item.designated = 'truth';
  logEvent(state, { type: 'designate_truth', playerId, queueIndex, cardId: item.card?.id });
  return true;
}

export function isTruthDesignated(item) {
  return item?.designated === 'truth';
}

// ── Domain control ──────────────────────────────────────────────────

export function setDomainLock(state, lockType, playerId = null) {
  state.domainLock = { type: lockType, playerId };
  logEvent(state, { type: 'domain_lock', lockType, playerId });
}

export function clearDomainLock(state) {
  state.domainLock = null;
  logEvent(state, { type: 'domain_lock_cleared' });
}

export function isDomainLocked(state, playerId) {
  if (!state.domainLock) return false;
  // A lock set by a player doesn't block that same player.
  if (state.domainLock.playerId === playerId) return false;
  return true;
}

// ── Slot / board control ─────────────────────────────────────────────

export function disableSlot(state, playerId, slot) {
  const player = state.players[playerId];
  if (!player.disabledSlots) player.disabledSlots = [];
  if (!player.disabledSlots.includes(slot)) player.disabledSlots.push(slot);
  logEvent(state, { type: 'slot_disabled', playerId, slot });
}

export function isSlotDisabled(state, playerId, slot) {
  return (state.players[playerId]?.disabledSlots || []).includes(slot);
}

export function reduceVictoryRequirement(state, playerId, type, amount) {
  const player = state.players[playerId];
  if (!player.victoryReduction) player.victoryReduction = { A: 0, B: 0, C: 0 };
  player.victoryReduction[type] += amount;
  logEvent(state, { type: 'victory_reduced', playerId, pointType: type, amount });
}

export function designateDistinctPoint(state, playerId, type, amount = 1) {
  const player = state.players[playerId];
  if (!player.distinctMoralPoints) player.distinctMoralPoints = { A: 0, B: 0, C: 0 };
  const current = (player.distinctMoralPoints.A + player.distinctMoralPoints.B + player.distinctMoralPoints.C);
  if (current >= 3) return false;
  const move = Math.min(amount, 3 - current, player.points[type]);
  player.distinctMoralPoints[type] += move;
  logEvent(state, { type: 'distinct_point', playerId, pointType: type, amount: move });
  return true;
}

export function releaseDistinctPoints(state, playerId) {
  const player = state.players[playerId];
  if (!player.distinctMoralPoints) return;
  // Return all distinct points to their original pools
  for (const t of ['A', 'B', 'C']) {
    if (player.distinctMoralPoints[t] > 0) {
      player.points[t] += player.distinctMoralPoints[t];
      player.distinctMoralPoints[t] = 0;
    }
  }
  logEvent(state, { type: 'distinct_released', playerId });
}

// ── Card-play allowance & drawing ───────────────────────────────────

// Draw N cards from a pile (metaphysics or meta_ethics).
export function drawCards(state, playerId, pileId, count = 1) {
  const player = state.players[playerId];
  const pile = state.drawPiles[pileId];
  const drawn = [];
  for (let i = 0; i < count; i++) {
    if (!pile.length || player.hand.length >= player.handLimit) break;
    const card = pile.shift();
    player.hand.push(card);
    drawn.push(card);
  }
  logEvent(state, { type: 'draw', playerId, pile: pileId, count: drawn.length });
  return drawn;
}

// Draw a guaranteed typed card from a pile (searches for matching alignment).
export function drawTypedCard(state, playerId, pileId, alignment, category = null) {
  const player = state.players[playerId];
  const pile = state.drawPiles[pileId];
  const idx = pile.findIndex((c) => c.alignment === alignment && (!category || c.category === category));
  if (idx === -1) return null;
  if (player.hand.length >= player.handLimit) return null;
  const [card] = pile.splice(idx, 1);
  player.hand.push(card);
  logEvent(state, { type: 'draw_typed', playerId, pile: pileId, alignment, cardId: card.id });
  return card;
}

// ── Ability usage tracking (once-per-turn, every-other-turn, cooldowns) ─

export function claimOncePerTurn(state, playerId, abilityId) {
  const player = state.players[playerId];
  if (!player.abilityUsage) player.abilityUsage = {};
  const usage = player.abilityUsage[abilityId] || { usedThisTurn: false };
  if (usage.usedThisTurn) return false;
  usage.usedThisTurn = true;
  player.abilityUsage[abilityId] = usage;
  return true;
}

export function claimOnceEveryOtherTurn(state, playerId, abilityId) {
  const player = state.players[playerId];
  if (!player.abilityUsage) player.abilityUsage = {};
  const usage = player.abilityUsage[abilityId] || { lastUsedRound: -2 };
  if (state.roundCount - usage.lastUsedRound < 2) return false;
  usage.lastUsedRound = state.roundCount;
  player.abilityUsage[abilityId] = usage;
  return true;
}

export function isAvailable(state, playerId, abilityId) {
  const player = state.players[playerId];
  const usage = player.abilityUsage?.[abilityId];
  if (!usage) return true;
  if (usage.usedThisTurn) return false;
  if (usage.lastUsedRound !== undefined && state.roundCount - usage.lastUsedRound < 2) return false;
  return true;
}

// Reset per-turn usage flags at the start of a player's turn.
export function resetTurnUsage(state, playerId) {
  const player = state.players[playerId];
  if (!player.abilityUsage) return;
  for (const key of Object.keys(player.abilityUsage)) {
    if (player.abilityUsage[key].usedThisTurn !== undefined) {
      player.abilityUsage[key].usedThisTurn = false;
    }
  }
}

// ── Card-play allowance (Theory of Time) ────────────────────────────

// Compute how many action cards a player may play this turn.
// Base 1, modified by active Theory of Time and Domain bonuses.
export function getAllowance(state, playerId) {
  const player = state.players[playerId];
  let base = 1;

  const tot = player.persistentSlots.left;
  if (tot) {
    const handler = getHandler(tot.id);
    if (handler?.getAllowanceModifier) {
      base = handler.getAllowanceModifier(state, playerId, base);
    }
  }

  return Math.max(0, base);
}

// ── Misc helpers ─────────────────────────────────────────────────────

export function discardCard(state, card, playerId = null) {
  // before:card_discarded — cancelable (e.g. Causal Completeness returns to hand)
  const before = emitBefore(state, 'card_discarded', { card, playerId });
  if (before.cancelled) return; // a replacement effect handled it

  const cat = card?.category;
  if (cat === 'rhetoric') state.discardPiles.rhetoric.push(card);
  else if (['domain', 'theory_of_time', 'universals'].includes(cat)) state.discardPiles.metaphysics.push(card);
  else if (['moral_reality', 'moral_grounding', 'moral_judgment'].includes(cat)) state.discardPiles.meta_ethics.push(card);
  logEvent(state, { type: 'card_discarded', cardId: card?.id, reason: 'used' });
  emit(state, 'card_discarded', { card, playerId });
}

export function getOpponent(playerId) {
  return playerId === 'player' ? 'opponent' : 'player';
}

export function countHandByType(player, type) {
  return player.hand.filter((c) => c.alignment === type).length;
}