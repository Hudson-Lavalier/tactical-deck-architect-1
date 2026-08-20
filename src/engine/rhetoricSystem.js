// Rhetoric system — interruption and response.
//
// Per framework:
//   - Players automatically draw 1 Rhetoric card every 5th personal turn
//   - Player 2 starts with 1 Rhetoric (to balance turn advantage)
//   - Rhetoric cards are played directly onto targeted active cards to:
//     cancel, protect, delay, or counter
//   - Allows unlimited counter-chains until neither player wishes to respond

import { logEvent } from './gameState';

// Play a rhetoric card onto a target
export function playRhetoric(state, playerId, rhetoricCardId, targetCardId, action) {
  const player = state.players[playerId];
  const cardIndex = player.rhetoricHand.findIndex((c) => c.id === rhetoricCardId);
  if (cardIndex === -1) return false;

  const card = player.rhetoricHand[cardIndex];
  player.rhetoricHand.splice(cardIndex, 1);

  logEvent(state, {
    type: 'rhetoric_played',
    playerId,
    rhetoricCardId,
    targetCardId,
    action, // 'cancel' | 'protect' | 'delay' | 'counter'
  });

  // ═══════════════════════════════════════════════════════════════
  // Rhetoric effect execution goes here.
  // The action type determines what happens to the target card.
  // Specific effects await user-defined rhetoric card content.
  // ═══════════════════════════════════════════════════════════════

  return true;
}

// Counter-chain: respond to an opponent's rhetoric with your own
export function counterRhetoric(state, playerId, rhetoricCardId, targetRhetoricCardId) {
  return playRhetoric(state, playerId, rhetoricCardId, targetRhetoricCardId, 'counter');
}

// Check if a player can respond with rhetoric
export function canRespondWithRhetoric(state, playerId) {
  const player = state.players[playerId];
  return player.rhetoricHand.length > 0;
}