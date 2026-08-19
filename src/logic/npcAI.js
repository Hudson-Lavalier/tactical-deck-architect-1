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

// Decide action phase plays
function decideActions(state) {
  const player = state.players[state.currentPlayer];
  const allowance = getActionAllowance(state, state.currentPlayer);
  let actionsPlayed = 0;

  // Find playable action cards
  const actionCards = player.hand.filter((c) =>
    c && c.category === 'moral_judgment'
  );

  for (const card of actionCards) {
    if (actionsPlayed >= allowance) break;
    if (!canPlayActionCard(state, state.currentPlayer, card)) continue;

    // Random chance to play (adds variability)
    if (Math.random() < 0.6) {
      const playMode = determinePlayMode(state, card);
      enqueueCard(state, state.currentPlayer, card, playMode.speed);
      // Remove from hand
      const idx = player.hand.findIndex((c) => c.id === card.id);
      if (idx !== -1) player.hand.splice(idx, 1);
      actionsPlayed++;
    }
  }
}

// Main NPC turn execution
export function executeNPCTurn(state) {
  // Phase 1: Draw
  const pileId = pickDrawPile(state);
  drawCard(state, pileId);

  // Phase 2: Board Development (limit 1)
  const didBoardDev = decideBoardDevelopment(state);
  if (didBoardDev && state.phase === 'game_over') return;

  // If domain was changed, turn already ended
  if (state.currentPlayer !== 'opponent') return;

  // Phase 3: Action Phase
  decideActions(state);

  // Phase 4: End turn
  endTurn(state);
}