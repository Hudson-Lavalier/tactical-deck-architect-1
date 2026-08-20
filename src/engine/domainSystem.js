// Domain (Terrain) system — the shared playing field.
//
// Per framework:
//   - Establishes the shared playing field in the center of the board
//   - Determines resolution speed of Action cards
//   - Generates 1 point of its matching type for BOTH players
//     at the end of every full round
//   - Placing or changing the Domain immediately ends the active player's turn
//   - Domain modifiers: active player's effects go RIGHT of domain,
//     opponent's effects go LEFT

import { logEvent } from './gameState';
import { addPoints } from './pointSystem';

// Generate domain points at the end of a full round
export function generateDomainPoints(state) {
  if (!state.domain) return;

  const type = state.domain.alignment;
  if (!type) return;

  // Both players receive 1 point of the domain's matching type
  addPoints(state, 'player', type, 1);
  addPoints(state, 'opponent', type, 1);

  logEvent(state, { type: 'domain_points', pointType: type });
}

// Add a domain modifier (effect placed beside the domain)
export function addDomainModifier(state, playerId, modifier) {
  const side = playerId === 'player' ? 'player' : 'opponent';
  state.domainModifiers[side].push(modifier);
  logEvent(state, { type: 'domain_modifier_added', playerId, modifierId: modifier.id });
}

// Remove a domain modifier
export function removeDomainModifier(state, playerId, modifierId) {
  const side = playerId === 'player' ? 'player' : 'opponent';
  state.domainModifiers[side] = state.domainModifiers[side].filter((m) => m.id !== modifierId);
  logEvent(state, { type: 'domain_modifier_removed', playerId, modifierId });
}

// Get the active domain alignment.
// For Twofold Reality, the active flank's alignment governs resolution;
// falls back to Twofold's own C alignment if no flank is active.
export function getDomainAlignment(state) {
  if (!state.domain) return null;
  if (state.domain.id === 'twofold_reality' && state.domainAttached) {
    const side = state.domainAttached.activeSide;
    const attached = side ? state.domainAttached[side] : null;
    return attached?.alignment ?? state.domain.alignment;
  }
  return state.domain.alignment || null;
}