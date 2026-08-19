// NPC AI — hardcoded logic with randomness (no AI models).
//
// Per user specification:
//   - Single-player game (multiplayer canceled)
//   - NPC follows hardcoded logic with randomness
//   - No AI/LLM integration
//
// The NPC makes decisions based on simple heuristics:
//   1. Draw from the pile that best matches its victory profile needs
//   2. Board development: place persistent cards or change domain based on board state
//   3. Action phase: play cards that advance its victory profile or disrupt opponent
//   4. Rhetoric: use defensively when opponent plays threatening cards

import { DRAW_PILES, ALIGNMENT } from '../data/gameConstants';
import { drawCard, placePersistent, changeDomain, endTurn } from '../engine/turnManager';
import { determinePlayMode, getActionAllowance, canPlayActionCard } from '../engine/resolutionEngine';
import { enqueueCard } from '../engine/queueSystem';

// Pick a draw pile based on victory profile needs
function pickDrawPile(state) {
  const player = state.players[state.currentPlayer];
  const profile = player.victoryProfile;

  if (!profile) {
    return Math.random() < 0.5 ? DRAW_PILES.METAPHYSICS : DRAW_PILES.META_ETHICS;
  }

  // Determine which alignment the NPC needs most
  const needed = { A: profile.A - player.points.A, B: profile.B - player.points.B, C: profile.C - player.points.C };
  const maxNeeded = Math.max(needed.A, needed.B, needed.C);

  if (maxNeeded <= 0) {
    return Math.random() < 0.5 ? DRAW_PILES.METAPHYSICS : DRAW_PILES.META_ETHICS;
  }

  // Metaphysics pile: Terrain (A/B/C), Theory of Time, Universals
  // Meta-Ethics pile: Moral Reality, Moral Grounding, Moral Judgment
  // Simple heuristic: if needing more points, draw from Meta-Ethics (action cards)
  // If needing board control, draw from Metaphysics (terrain/time)
  const hasDomain = state.domain !== null;
  const hasAllPersistents = Object.values(player.persistentSlots).every((s) => s !== null);

  if (!hasAllPersistents && Math.random() < 0.6) {
    return DRAW_PILES.METAPHYSICS;
  }
  if (!hasDomain && Math.random() < 0.4) {
    return DRAW_PILES.METAPHYSICS;
  }

  return DRAW_PILES.META_ETHICS;
}

// Decide board development action
function decideBoardDevelopment(state) {
  const player = state.players[state.currentPlayer];

  // Check if we have persistent cards to place
  const emptySlots = Object.entries(player.persistentSlots)
    .filter(([_, card]) => card === null)
    .map(([slot, _]) => slot);

  if (emptySlots.length > 0) {
    // Look for persistent cards in hand
    const persistentCard = player.hand.find((c) =>
      c && c.category && ['theory_of_time', 'moral_reality', 'moral_grounding'].includes(c.category)
    );

    if (persistentCard && Math.random() < 0.7) {
      // Map card category to slot
      const slotMap = {
        theory_of_time: 'left',
        moral_reality: 'middle',
        moral_grounding: 'right',
      };
      const slot = slotMap[persistentCard.category];
      if (slot && emptySlots.includes(slot)) {
        placePersistent(state, persistentCard.id, slot);
        return true;
      }
    }
  }

  // Maybe change domain if we have a terrain card
  if (!state.domain || Math.random() < 0.2) {
    const terrainCard = player.hand.find((c) => c && c.category === 'terrain');
    if (terrainCard && Math.random() < 0.5) {
      changeDomain(state, terrainCard.id);
      return true; // changing domain ends turn
    }
  }

  return false; // no board development
}

// decideActions is replaced by npcPlayNextAction (step-by-step action phase).

// Main NPC turn execution.
// Draws, does board development, and starts the action phase.
// The action phase is step-by-step: npcPlayNextAction plays actions one at a time.
// If a response window opens (advantaged card), execution pauses until the window closes.
export function executeNPCTurn(state) {
  // Phase 1: Draw
  const pileId = pickDrawPile(state);
  drawCard(state, pileId);

  // Phase 2: Board Development (limit 1)
  const didBoardDev = decideBoardDevelopment(state);
  if (didBoardDev && state.phase === 'game_over') return;

  // If domain was changed (turn ended or response window opened for domain)
  if (state.currentPlayer !== 'opponent') return;

  // Set up action phase
  state.npcActionCount = 0;

  // If a response window opened (persistent card placed), pause execution.
  // The UI will call npcPlayNextAction when the window closes.
  if (state.responseWindow?.active) return;

  // Phase 3: Action Phase (start)
  state.phase = 'action';
  npcPlayNextAction(state);
}

// Play the next NPC action or end turn.
// Called by executeNPCTurn (to start the action phase) and by the UI
// (after a response window closes, to continue the action phase).
export function npcPlayNextAction(state) {
  if (state.currentPlayer !== 'opponent') return;
  if (state.responseWindow?.active) return;

  const player = state.players[state.currentPlayer];
  const allowance = getActionAllowance(state, state.currentPlayer);

  // Try to play actions up to the allowance
  const triedCards = new Set();

  while (state.npcActionCount < allowance) {
    const actionCards = player.hand.filter((c) =>
      c && c.category === 'moral_judgment' && !triedCards.has(c.id)
    );
    const playableCards = actionCards.filter((c) => canPlayActionCard(state, state.currentPlayer, c));

    if (playableCards.length === 0) break;

    const card = playableCards[Math.floor(Math.random() * playableCards.length)];
    triedCards.add(card.id);

    if (Math.random() < 0.3 + (state.difficulty * 0.12)) {
      const playMode = determinePlayMode(state, card);
      enqueueCard(state, state.currentPlayer, card, playMode.speed);
      const idx = player.hand.findIndex((c) => c.id === card.id);
      if (idx !== -1) player.hand.splice(idx, 1);
      state.npcActionCount++;

      // If a response window opened (advantaged card), pause execution
      if (state.responseWindow?.active) return;
    }
  }

  // No more actions or allowance reached, end turn
  state.npcActionCount = 0;
  endTurn(state);
}

// NPC reactive rhetoric decision.
// Decides whether to counter the active card during a response window.
export function npcDecideRhetoric(state) {
  if (!state.responseWindow?.active) return null;
  if (state.responseWindow.respondingPlayerId !== 'opponent') return null;

  const player = state.players.opponent;
  if (player.rhetoricHand.length === 0) return null;

  // Simple heuristic: counter chance scales with difficulty
  if (Math.random() < 0.1 + (state.difficulty * 0.08)) {
    const card = player.rhetoricHand[0];
    return { cardId: card.id, action: 'counter' };
  }

  return null; // Pass
}