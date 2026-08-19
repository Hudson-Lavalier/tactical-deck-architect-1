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
import { advanceQueue, resolveQueuedCards } from './queueSystem';
import { generateDomainPoints } from './domainSystem';
import { checkVictory } from '../data/victoryProfiles';

// Start a player's turn
export function startTurn(state) {
  const player = state.players[state.currentPlayer];
  player.personalTurnCount++;
  state.phase = 'draw';

  // Rhetoric draw check — every 5th personal turn
  player.rhetoricDrawCounter++;
  if (player.rhetoricDrawCounter >= RHETORIC_DRAW_INTERVAL) {
    player.rhetoricDrawCounter = 0;
    drawRhetoricCard(state);
  }

  logEvent(state, { type: 'turn_start', player: state.currentPlayer });
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
  return true;
}

// Board development: change the domain (terrain)
// Per framework: placing/changing domain immediately ends the turn.
export function changeDomain(state, cardId) {
  const player = state.players[state.currentPlayer];
  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return false;

  const card = player.hand[cardIndex];
  state.domain = card;
  player.hand.splice(cardIndex, 1);

  logEvent(state, { type: 'domain_change', cardId });
  // Changing domain ends the turn immediately
  endTurn(state);
  return true;
}

// End the current player's turn
export function endTurn(state) {
  const player = state.players[state.currentPlayer];

  // Advance queued cards (slide forward one row)
  advanceQueue(state, state.currentPlayer);

  // Check for queue resolutions (cards that pass Row 1)
  resolveQueuedCards(state, state.currentPlayer);

  // Decrement ability cooldowns
  if (player.abilityCooldowns.orientation > 0) player.abilityCooldowns.orientation--;
  if (player.abilityCooldowns.knowledge > 0) player.abilityCooldowns.knowledge--;

  // Check victory
  if (checkVictory(player.points, player.victoryProfile)) {
    state.winner = state.currentPlayer;
    state.phase = 'game_over';
    logEvent(state, { type: 'victory', player: state.currentPlayer });
    return;
  }

  // Switch player
  state.currentPlayer = state.currentPlayer === 'player' ? 'opponent' : 'player';
  state.turn++;
  state.phase = 'draw';

  // Full round check (both players completed a turn)
  if (state.currentPlayer === 'player') {
    state.roundCount++;
    generateDomainPoints(state);
  }

  logEvent(state, { type: 'turn_end' });
}