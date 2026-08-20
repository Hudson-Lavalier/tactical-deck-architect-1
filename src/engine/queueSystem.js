// Queue system — the face-down card queue with row-based timers.
//
// Per framework:
//   - Max 12 queued cards per player (3 cards in each of 4 turn rows)
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
import { dispatchResolve } from './effects/dispatcher';
import { emit, emitBefore } from './effects/eventBus';

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

  // before:card_played — cancelable (e.g. The Physical Mind's Anti-Immaterial Field)
  const before = emitBefore(state, 'card_played', { playerId, card, speed });
  if (before.cancelled) {
    logEvent(state, { type: 'card_play_blocked', playerId, cardId: card?.id, by: before.cancelledBy });
    return false;
  }

  if (speed === RESOLUTION_SPEED.ADVANTAGED) {
    emit(state, 'card_played', { playerId, card, speed });
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

  emit(state, 'card_queued', { playerId, card, row, speed });
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

// Resolve a single card's effect — dispatch to the card's per-card effect file.
export function resolveCard(state, playerId, card, targets = {}) {
  if (!card) return;
  const mergedTargets = { ...(card.chosenTargets || {}), ...targets };
  logEvent(state, { type: 'card_resolved', playerId, cardId: card.id, cardName: card.name });
  dispatchResolve(state, playerId, card, mergedTargets);
}