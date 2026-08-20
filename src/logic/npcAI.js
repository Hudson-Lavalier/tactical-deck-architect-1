// NPC AI — hardcoded logic with randomness (no AI models).
//
// Single-player NPC. Difficulty (1–5) meaningfully scales:
//   - action play probability & allowance usage
//   - rhetoric counter chance
//   - draw-pile heuristics (smart vs random)
//   - action selection (best-fit vs random)
//   - respect for the test-mode opponent domain lock
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
import { switchTwofoldDomain } from '../engine/twofoldSystem';

// ── Difficulty-scaled thresholds ────────────────────────────────────
// d1 = easy (passive, rarely counters), d5 = hard (aggressive, smart).
function actionPlayProb(difficulty) { return 0.3 + (difficulty - 1) * 0.17; }   // 0.30 → 0.98
function rhetoricCounterProb(difficulty) { return 0.05 + (difficulty - 1) * 0.11; } // 0.05 → 0.49
function smartDrawChance(difficulty) { return 0.3 + (difficulty - 1) * 0.17; }   // 0.30 → 0.98
function smartActionChance(difficulty) { return 0.3 + (difficulty - 1) * 0.17; } // 0.30 → 0.98
function allowanceUseMin(difficulty) { return Math.max(1, Math.round(difficulty / 2)); } // d1→1, d5→3 (uses full allowance at high diff)

// Pick a draw pile based on victory profile needs (smart) or random (easy).
function pickDrawPile(state) {
  const player = state.players[state.currentPlayer];
  const profile = player.victoryProfile;

  if (!profile || Math.random() > smartDrawChance(state.difficulty)) {
    return Math.random() < 0.5 ? DRAW_PILES.METAPHYSICS : DRAW_PILES.META_ETHICS;
  }

  const needed = { A: profile.A - player.points.A, B: profile.B - player.points.B, C: profile.C - player.points.C };
  const maxNeeded = Math.max(needed.A, needed.B, needed.C);

  if (maxNeeded <= 0) {
    return Math.random() < 0.5 ? DRAW_PILES.METAPHYSICS : DRAW_PILES.META_ETHICS;
  }

  const hasDomain = state.domain !== null;
  const hasAllPersistents = Object.values(player.persistentSlots).every((s) => s !== null);

  if (!hasAllPersistents && Math.random() < 0.6) return DRAW_PILES.METAPHYSICS;
  if (!hasDomain && Math.random() < 0.4) return DRAW_PILES.METAPHYSICS;

  return DRAW_PILES.META_ETHICS;
}

// Decide board development action
function decideBoardDevelopment(state) {
  const player = state.players[state.currentPlayer];

  const emptySlots = Object.entries(player.persistentSlots)
    .filter(([_, card]) => card === null)
    .map(([slot, _]) => slot);

  if (emptySlots.length > 0) {
    const persistentCard = player.hand.find((c) =>
      c && c.category && ['theory_of_time', 'moral_reality', 'moral_grounding'].includes(c.category)
    );

    if (persistentCard && Math.random() < 0.7) {
      const slotMap = { theory_of_time: 'left', moral_reality: 'middle', moral_grounding: 'right' };
      const slot = slotMap[persistentCard.category];
      if (slot && emptySlots.includes(slot)) {
        placePersistent(state, persistentCard.id, slot);
        return true;
      }
    }
  }

  // Maybe change domain — but never when the test-mode opponent domain lock is on.
  if (state.opponentDomainLock) return false;

  if (!state.domain || Math.random() < 0.2) {
    const domainCard = player.hand.find((c) => c && c.category === 'domain');
    if (domainCard && Math.random() < 0.5) {
      changeDomain(state, domainCard.id);
      return true; // changing domain ends turn
    }
  }

  return false;
}

// Pick the best action card to advance the victory profile (smart) or random (easy).
function pickActionCard(state, player, playableCards) {
  if (Math.random() > smartActionChance(state.difficulty)) {
    return playableCards[Math.floor(Math.random() * playableCards.length)];
  }
  const profile = player.victoryProfile || { A: 4, B: 4, C: 4 };
  const needed = { A: profile.A - player.points.A, B: profile.B - player.points.B, C: profile.C - player.points.C };
  // Prefer cards whose alignment matches the most-needed point type.
  let best = null;
  let bestScore = -Infinity;
  for (const c of playableCards) {
    const score = (needed[c.alignment] || 0) + Math.random() * 0.5;
    if (score > bestScore) { bestScore = score; best = c; }
  }
  return best || playableCards[0];
}

// Main NPC turn execution.
export function executeNPCTurn(state) {
  const pileId = pickDrawPile(state);
  drawCard(state, pileId);

  if (state.domain?.id === 'twofold_reality' && state.domainPlacedBy === 'opponent' && state.domainAttached) {
    const alternate = state.domainAttached.activeSide === 'left' ? 'right' : 'left';
    if (state.domainAttached[alternate] && Math.random() < smartActionChance(state.difficulty)) {
      switchTwofoldDomain(state, 'opponent', alternate);
    }
  }

  const didBoardDev = decideBoardDevelopment(state);
  if (didBoardDev && state.phase === 'game_over') return;
  if (state.currentPlayer !== 'opponent') return;

  state.npcActionCount = 0;
  if (state.responseWindow?.active) return;

  state.phase = 'action';
  npcPlayNextAction(state);
}

// Play the next NPC action or end turn.
export function npcPlayNextAction(state) {
  if (state.currentPlayer !== 'opponent') return;
  if (state.responseWindow?.active) return;

  const player = state.players[state.currentPlayer];
  const allowance = getActionAllowance(state, state.currentPlayer);
  const minActions = allowanceUseMin(state.difficulty);
  const triedCards = new Set();

  while (state.npcActionCount < allowance) {
    const actionCards = player.hand.filter((c) =>
      c && c.category === 'moral_judgment' && !triedCards.has(c.id)
    );
    const playableCards = actionCards.filter((c) => canPlayActionCard(state, state.currentPlayer, c));
    if (playableCards.length === 0) break;

    // At low difficulty, sometimes stop before using the full allowance.
    if (state.npcActionCount >= minActions && Math.random() > actionPlayProb(state.difficulty)) break;

    const card = pickActionCard(state, player, playableCards);
    triedCards.add(card.id);

    const playMode = determinePlayMode(state, card);
    enqueueCard(state, state.currentPlayer, card, playMode.speed);
    const idx = player.hand.findIndex((c) => c.id === card.id);
    if (idx !== -1) player.hand.splice(idx, 1);
    state.npcActionCount++;

    if (state.responseWindow?.active) return;
  }

  state.npcActionCount = 0;
  endTurn(state);
}

// NPC reactive rhetoric decision.
export function npcDecideRhetoric(state) {
  if (!state.responseWindow?.active) return null;
  if (state.responseWindow.respondingPlayerId !== 'opponent') return null;

  const player = state.players.opponent;
  if (player.rhetoricHand.length === 0) return null;

  if (Math.random() < rhetoricCounterProb(state.difficulty)) {
    const card = player.rhetoricHand[0];
    return { cardId: card.id, action: 'counter' };
  }

  return null; // Pass
}