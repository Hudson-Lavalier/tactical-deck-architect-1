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
import { generateDomainPoints } from './domainSystem';
import { checkVictory } from '../data/victoryProfiles';
import { openResponseWindow } from './responseSystem';

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

  const card = pile.shift();
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

// Board development: place a persistent card in a slot
export function placePersistent(state, cardId, slot) {
  const player = state.players[state.currentPlayer];
  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return false;

  const card = player.hand[cardIndex];
  player.persistentSlots[slot] = card;
  player.hand.splice(cardIndex, 1);

  logEvent(state, { type: 'place_persistent', slot, cardId });
  openResponseWindow(state, card, state.currentPlayer, 'board_dev');
  return true;
}

// Board development: change the domain
// Per framework: placing/changing domain immediately ends the turn.
export function changeDomain(state, cardId) {
  const player = state.players[state.currentPlayer];
  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return false;

  const card = player.hand[cardIndex];
  state.domain = card;
  player.hand.splice(cardIndex, 1);

  logEvent(state, { type: 'domain_change', cardId });
  // Open response window; turn ends after window closes
  openResponseWindow(state, card, state.currentPlayer, 'domain');
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
    generateDomainPoints(state);
  }

  // Start the next player's turn (advances queue, resolves, checks victory)
  startTurn(state);

  logEvent(state, { type: 'turn_end' });
}