// Queue system — the face-down card queue with row-based timers.
//
// Per framework:
//   - Max 6 queued cards per player
//   - Cards are placed face-down (hidden information)
//   - 4 rows extending backward from the shared Domain:
//       Row 1: 1 turn remaining (resolves next turn)
//       Row 2: 2 turns remaining
//       Row 3: 3 turns remaining
//       Row 4: 4 turns remaining
//   - As turns pass, cards slide one row forward
//   - When a card advances past Row 1, it flips face-up and resolves
//
// Resolution speed (governed by Domain alignment):
//   - Advantaged (matches Domain): resolves immediately (bypasses queue)
//   - Neutral: placed face-down in Row 1
//   - Disadvantaged (opposing Domain): placed face-down in Row 2

import { QUEUE_LIMIT, RESOLUTION_SPEED } from '../data/gameConstants';
import { logEvent } from './gameState';
import { openResponseWindow } from './responseSystem';

// Determine resolution speed for a card given the active domain
export function getResolutionSpeed(card, domain) {
  if (!domain || !card) return RESOLUTION_SPEED.NEUTRAL;

  if (card.alignment === domain.alignment) {
    return RESOLUTION_SPEED.ADVANTAGED;
  }

  // C-type on A/B domain = neutral
  if (card.alignment === 'C' && (domain.alignment === 'A' || domain.alignment === 'B')) {
    return RESOLUTION_SPEED.NEUTRAL;
  }

  // Opposing alignment = disadvantaged
  // A counters C, B counters A, C counters B (per alignment cycle)
  const counters = { A: 'C', B: 'A', C: 'B' };
  if (counters[domain.alignment] === card.alignment) {
    return RESOLUTION_SPEED.DISADVANTAGED;
  }

  return RESOLUTION_SPEED.NEUTRAL;
}

// Get the starting row for a card based on resolution speed
export function getStartingRow(speed) {
  switch (speed) {
    case RESOLUTION_SPEED.ADVANTAGED:
      return 0; // immediate, no queue
    case RESOLUTION_SPEED.NEUTRAL:
      return 1;
    case RESOLUTION_SPEED.DISADVANTAGED:
      return 2;
    default:
      return 1;
  }
}

// Add a card to the queue.
// Advantaged cards open a response window instead of resolving immediately.
// The card resolves when the window closes (if not cancelled).
export function enqueueCard(state, playerId, card, speed) {
  const player = state.players[playerId];

  if (speed === RESOLUTION_SPEED.ADVANTAGED) {
    openResponseWindow(state, card, playerId, 'action');
    return true;
  }

  if (player.queue.length >= player.queueLimit) {
    logEvent(state, { type: 'queue_full', playerId });
    return false;
  }

  const row = getStartingRow(speed);
  player.queue.push({
    card,
    row,
    faceDown: true,
    turnsRemaining: row,
  });

  logEvent(state, { type: 'enqueue', playerId, cardId: card.id, row });
  return true;
}

// Advance all queued cards forward one row (called at end of turn)
export function advanceQueue(state, playerId) {
  const player = state.players[playerId];

  for (const queued of player.queue) {
    queued.row--;
    queued.turnsRemaining = queued.row;
  }

  logEvent(state, { type: 'queue_advance', playerId });
}

// Collect cards that have advanced past Row 1 (row <= 0) and move them to
// pending resolutions. They will be resolved through response windows.
export function collectResolvableCards(state, playerId) {
  const player = state.players[playerId];
  const remaining = [];

  for (const queued of player.queue) {
    if (queued.row <= 0) {
      queued.faceDown = false;
      state.pendingResolutions.push({ card: queued.card, playerId });
    } else {
      remaining.push(queued);
    }
  }

  player.queue = remaining;

  if (state.pendingResolutions.length > 0) {
    logEvent(state, { type: 'queue_collect', playerId, count: state.pendingResolutions.length });
  }
}

// Resolve a single card's effect
// This is the hook where card-specific effects will execute.
// Until the user defines card effects, this is a no-op placeholder
// that logs the resolution.
export function resolveCard(state, playerId, card) {
  if (!card) return;

  logEvent(state, { type: 'card_resolved', playerId, cardId: card.id, cardName: card.name });

  // ═══════════════════════════════════════════════════════════════
  // Card effect execution goes here.
  // Each card's `effect` object (user-defined) will be interpreted
  // by the effect engine. No effects are invented — this is the
  // dispatch point that will call user-defined effect handlers.
  // ═══════════════════════════════════════════════════════════════
  executeEffect(state, playerId, card);
}

// Effect execution dispatcher — placeholder.
// Will route to specific effect handlers based on card.effect.type
// once the user defines card effects.
function executeEffect(state, playerId, card) {
  if (!card.effect) return;

  // This is where the user's card effect definitions will be processed.
  // The structure is in place; the content awaits user definition.
}