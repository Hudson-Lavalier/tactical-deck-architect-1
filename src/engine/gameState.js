// Game state initialization.
// Creates the initial board state per the canonical framework.
// No card content is invented — state is structured to receive user-defined cards.

import { HAND_LIMIT, QUEUE_LIMIT, POINT_LIMIT, DRAW_PILES } from '../data/gameConstants';
import { getVictoryProfile } from '../data/victoryProfiles';
import { getAlignmentsFromSelection, getAlignmentsFromParadigmIds } from '../data/epistemologies';
import { buildDrawPiles } from '../data/cards';

// Shuffle helper (Fisher-Yates)
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Deep clone state for safe mutation.
// The engine mutates state in place; the UI must clone before any engine call
// to avoid corrupting React's state references (shallow spread is not enough).
export function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

// Create a player's board state
function createPlayerState(playerId, epistemologySelection, isPlayerOne) {
  // Support new format { paradigms: [id1, id2, id3] } (any 3 from any family)
  // and old format { orientation, structure, knowledge } (one per family)
  let alignments;
  if (epistemologySelection.paradigms) {
    alignments = getAlignmentsFromParadigmIds(epistemologySelection.paradigms);
  } else {
    alignments = getAlignmentsFromSelection(
      epistemologySelection.orientation,
      epistemologySelection.structure,
      epistemologySelection.knowledge,
    );
  }

  return {
    id: playerId,
    isPlayerOne,
    epistemologies: epistemologySelection,
    alignments,
    victoryProfile: null, // computed after selection
    hand: [],             // max HAND_LIMIT
    handLimit: HAND_LIMIT,
    // Persistent slots: left, middle, right
    persistentSlots: {
      left: null,   // Theory of Time
      middle: null, // Moral Reality
      right: null,  // Moral Grounding
    },
    // Queue: 4 rows x 3 cols, max 6 active cards
    queue: [],     // array of queued card objects: { card, row, faceDown, turnsRemaining }
    queueLimit: QUEUE_LIMIT,
    // Points
    points: { A: 0, B: 0, C: 0 },
    pointLimit: POINT_LIMIT,
    // Rhetoric hand
    rhetoricHand: [],
    // Turn tracking
    personalTurnCount: 0,
    rhetoricDrawCounter: 0,
    // Epistemology ability cooldowns
    abilityCooldowns: {
      orientation: 0, // turns until available
      knowledge: 0,
    },
  };
}

// Create the full initial game state
export function createInitialState(playerSelection, opponentSelection, difficulty = 3) {
  const piles = buildDrawPiles();
  const totalCards = piles.metaphysics.length + piles.metaEthics.length + piles.rhetoric.length;

  const player = createPlayerState('player', playerSelection, true);
  const opponent = createPlayerState('opponent', opponentSelection, false);

  // Compute victory profiles
  player.victoryProfile = getVictoryProfile(player.alignments);
  opponent.victoryProfile = getVictoryProfile(opponent.alignments);

  // Player 2 (opponent in single-player) starts with 1 Rhetoric card
  // (per framework: balances turn advantage)
  if (piles.rhetoric.length > 0) {
    opponent.rhetoricHand.push(piles.rhetoric.shift());
  }

  return {
    turn: 0,              // global turn counter
    currentPlayer: 'player', // 'player' | 'opponent'
    phase: 'setup',       // 'setup' | 'draw' | 'board_dev' | 'action' | 'response' | 'end'
    domain: null,         // active terrain card
    domainModifiers: {
      player: [],         // effects to the right of domain
      opponent: [],       // effects to the left of domain
    },
    drawPiles: {
      [DRAW_PILES.METAPHYSICS]: shuffle(piles.metaphysics),
      [DRAW_PILES.META_ETHICS]: shuffle(piles.metaEthics),
      rhetoric: piles.rhetoric,
    },
    discardPiles: {
      [DRAW_PILES.METAPHYSICS]: [],
      [DRAW_PILES.META_ETHICS]: [],
      rhetoric: [],
    },
    players: {
      player,
      opponent,
    },
    roundCount: 0,        // full rounds completed (for terrain point generation)
    log: [],              // game event log
    winner: null,
    difficulty,
    responseWindow: {
      active: false,
      activeCard: null,
      activePlayerId: null,
      respondingPlayerId: null,
      chain: [],
      cancelled: false,
      source: null,       // 'queue' | 'action'
    },
    pendingResolutions: [], // cards waiting to resolve through response windows
    npcActionCount: 0,    // NPC actions played this turn
    totalCards,           // total cards in game (0 during prototyping — guards exhaustion)
  };
}

// Log an event
export function logEvent(state, event) {
  state.log.push({
    turn: state.turn,
    player: state.currentPlayer,
    ...event,
  });
}