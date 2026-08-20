// Turn manager — implements the canonical turn structure.
//
// Turn Flow (per framework):
//   1. Draw: choose 1 card from Metaphysics or Meta-Ethics pile
//   2. Board Development (limit 1): change Domain OR place 1 permanent card
//   3. Action Phase: play single-use cards (amount dictated by Domain)
//   4. Opponent Response: Rhetoric counter/protect
//   5. Turn Ends: pass to opponent

import { DRAW_PILES, RHETORIC_DRAW_INTERVAL } from '../data/gameConstants';
import { logEvent } from './gameState';
import { advanceQueue, collectResolvableCards } from './queueSystem';
import { checkVictory } from '../data/victoryProfiles';
import { openResponseWindow } from './responseSystem';
import { dispatchPlace, dispatchRemove, dispatchRoundEnd, dispatchDomainChangeAttempt } from './effects/dispatcher';
import { emit } from './effects/eventBus';
import { resetTurnUsage, clearDomainLock } from './effects/primitives';

// Proceed with the turn after all queue resolutions are complete.
// Called by startTurn (when no cards to resolve) or by closeResponseWindow
// (after the last response window closes).
export function proceedWithTurn(state) {
  const player = state.players[state.currentPlayer];

  // Check deck exhaustion (empty piles + no cards in hand)
  if (checkDeckExhaustion(state)) return;

  // Check victory (after all resolutions — opponent had their turn to disrupt)
  if (checkVictory(player.points, player.victoryProfile)) {
    state.winner = state.currentPlayer;
    state.phase = 'game_over';
    logEvent(state, { type: 'victory', player: state.currentPlayer });
    return;
  }

  // Rhetoric draw check — every 5th personal turn
  player.rhetoricDrawCounter++;
  if (player.rhetoricDrawCounter >= RHETORIC_DRAW_INTERVAL) {
    player.rhetoricDrawCounter = 0;
    drawRhetoricCard(state);
  }

  state.phase = 'draw';
  logEvent(state, { type: 'turn_start', player: state.currentPlayer });
}

// Check if both draw piles are empty and both players have no cards.
// If so, calculate who's closest to their victory profile.
function checkDeckExhaustion(state) {
  // Guard: don't trigger exhaustion if the game started with no cards
  // (all card arrays are empty during prototyping — prevents instant draw)
  if (state.totalCards === 0) return false;
  // Guard: don't check on the very first turn (give player a chance to play)
  if (state.turn < 1) return false;

  const metaphysicsEmpty = state.drawPiles.metaphysics.length === 0;
  const metaEthicsEmpty = state.drawPiles.meta_ethics.length === 0;
  const playerHandEmpty = state.players.player.hand.length === 0 && state.players.player.rhetoricHand.length === 0;
  const opponentHandEmpty = state.players.opponent.hand.length === 0 && state.players.opponent.rhetoricHand.length === 0;

  if (!(metaphysicsEmpty && metaEthicsEmpty && playerHandEmpty && opponentHandEmpty)) {
    return false;
  }

  const playerDist = calculateDistanceToGoal(state.players.player);
  const opponentDist = calculateDistanceToGoal(state.players.opponent);

  if (playerDist < opponentDist) {
    state.winner = 'player';
  } else if (opponentDist < playerDist) {
    state.winner = 'opponent';
  } else {
    const playerTotal = state.players.player.points.A + state.players.player.points.B + state.players.player.points.C;
    const opponentTotal = state.players.opponent.points.A + state.players.opponent.points.B + state.players.opponent.points.C;
    if (playerTotal > opponentTotal) {
      state.winner = 'player';
    } else if (opponentTotal > playerTotal) {
      state.winner = 'opponent';
    } else {
      state.winner = 'tie';
    }
  }

  state.phase = 'game_over';
  logEvent(state, { type: 'deck_exhaustion', winner: state.winner });
  return true;
}

// Calculate how far a player is from their victory profile.
// Distance = points needed + excess points to remove.
function calculateDistanceToGoal(player) {
  const profile = player.victoryProfile;
  if (!profile) return Infinity;
  let distance = 0;
  distance += Math.max(0, profile.A - player.points.A);
  distance += Math.max(0, profile.B - player.points.B);
  distance += Math.max(0, profile.C - player.points.C);
  distance += Math.max(0, player.points.A - profile.A);
  distance += Math.max(0, player.points.B - profile.B);
  distance += Math.max(0, player.points.C - profile.C);
  return distance;
}

// Start a player's turn.
// Queue advancement happens HERE (when it comes back to this player).
// Cards that are ready to resolve are collected and processed through
// response windows (one at a time). When all are resolved, proceedWithTurn
// is called (victory check, rhetoric draw).
export function startTurn(state) {
  const player = state.players[state.currentPlayer];
  player.personalTurnCount++;
  state.phase = 'draw';

  // Reset once-per-turn ability usage for this player
  resetTurnUsage(state, state.currentPlayer);

  // Reset the Twofold Reality switch counter at the start of the placing player's turn.
  if (state.domainAttached && state.domainPlacedBy === state.currentPlayer) {
    state.domainAttached.switchesThisTurn = 0;
  }

  // Emit turn_start so domain/persistent effects can react (Black Hole, Bridge).
  emit(state, 'turn_start', { playerId: state.currentPlayer });

  // Advance queue (cards come back to this player)
  advanceQueue(state, state.currentPlayer);

  // Collect cards that are ready to resolve (row <= 0)
  collectResolvableCards(state, state.currentPlayer);

  // If there are pending resolutions, open response window for the first
  if (state.pendingResolutions.length > 0) {
    const first = state.pendingResolutions[0];
    openResponseWindow(state, first.card, first.playerId, 'queue');
  } else {
    // No cards to resolve, proceed with turn
    proceedWithTurn(state);
  }
}

// Draw a card from the specified pile
export function drawCard(state, pileId) {
  const player = state.players[state.currentPlayer];
  const pile = state.drawPiles[pileId];

  if (pile.length === 0) {
    logEvent(state, { type: 'draw_failed', reason: 'pile_empty', pile: pileId });
    return null;
  }

  if (player.hand.length >= player.handLimit) {
    logEvent(state, { type: 'draw_failed', reason: 'hand_full' });
    return null;
  }

  // Bias draw toward temporary one-use cards (testing).
  // 65% chance to pull a random temporary card from the pile if any exist.
  const tempIndices = [];
  for (let i = 0; i < pile.length; i++) {
    if (pile[i]?.temporary) tempIndices.push(i);
  }
  let card;
  if (tempIndices.length > 0 && Math.random() < 0.65) {
    const pick = tempIndices[Math.floor(Math.random() * tempIndices.length)];
    card = pile.splice(pick, 1)[0];
  } else {
    card = pile.shift();
  }
  player.hand.push(card);
  logEvent(state, { type: 'draw', pile: pileId, cardId: card?.id });
  return card;
}

// Draw a rhetoric card
function drawRhetoricCard(state) {
  const player = state.players[state.currentPlayer];
  const pile = state.drawPiles.rhetoric;

  if (pile.length === 0) return;

  const card = pile.shift();
  player.rhetoricHand.push(card);
  logEvent(state, { type: 'rhetoric_draw', cardId: card?.id });
}

// Peek at top card(s) of a pile (for epistemology abilities)
export function peekPile(state, pileId, count = 1) {
  return state.drawPiles[pileId].slice(0, count);
}

// Board development: place a persistent card in a slot.
// If the slot is occupied, the old card is removed (its onRemove fires).
export function placePersistent(state, cardId, slot) {
  const player = state.players[state.currentPlayer];
  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return false;

  const card = player.hand[cardIndex];
  // Remove the existing card in this slot first (if any)
  const existing = player.persistentSlots[slot];
  if (existing) dispatchRemove(state, state.currentPlayer, existing);

  player.persistentSlots[slot] = card;
  player.hand.splice(cardIndex, 1);

  logEvent(state, { type: 'place_persistent', slot, cardId });
  // The card's onPlace fires when the response window closes uncancelled.
  openResponseWindow(state, card, state.currentPlayer, 'board_dev', { slot });
  return true;
}

// Board development: change the domain.
// Per framework: placing/changing domain immediately ends the turn.
export function changeDomain(state, cardId, options = {}) {
  const player = state.players[state.currentPlayer];
  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return false;

  // Dispatch the change attempt so active effects (Physical Barrier, Absolute
  // Unity, Twofold Reality, Ontological Independence) can cancel it via the
  // before:domain_change_attempted event. If cancelled, abort.
  const card = player.hand[cardIndex];
  const allowed = options.replaceTwofold === true || dispatchDomainChangeAttempt(state, state.currentPlayer, card);
  if (!allowed) {
    logEvent(state, { type: 'domain_change_blocked', reason: 'effect_cancelled' });
    return false;
  }

  const oldDomain = state.domain;
  const oldDomainPlacedBy = state.domainPlacedBy;

  state.domain = card;
  state.domainPlacedBy = state.currentPlayer;
  state.domainDuration = 0;
  clearDomainLock(state);
  player.hand.splice(cardIndex, 1);

  logEvent(state, { type: 'domain_change', cardId });
  // The domain's onPlace fires when the response window closes uncancelled.
  // Pass the old domain so we can revert if cancelled.
  openResponseWindow(state, card, state.currentPlayer, 'domain', { oldDomain, oldDomainPlacedBy });
  return true;
}

// End the current player's turn.
// Queue advancement and victory check are handled by startTurn() for the NEXT player,
// so that cards resolve "when it comes back to your turn" and victory is checked
// only after the opponent had a full turn to disrupt.
export function endTurn(state) {
  const player = state.players[state.currentPlayer];

  // Decrement ability cooldowns for the player ending their turn
  if (player.abilityCooldowns.orientation > 0) player.abilityCooldowns.orientation--;
  if (player.abilityCooldowns.knowledge > 0) player.abilityCooldowns.knowledge--;

  // Switch player
  state.currentPlayer = state.currentPlayer === 'player' ? 'opponent' : 'player';
  state.turn++;

  // Full round check (both players completed a turn)
  if (state.currentPlayer === 'player') {
    state.roundCount++;
    state.domainDuration++;
    // Domain generates points per its own rules (dispatchRoundEnd → onRoundEnd).
    dispatchRoundEnd(state);
    emit(state, 'round_end', { round: state.roundCount });
  }

  // Start the next player's turn (advances queue, resolves, checks victory)
  startTurn(state);

  logEvent(state, { type: 'turn_end' });
}