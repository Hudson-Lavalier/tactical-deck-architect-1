// ════════════════════════════════════════════════════════════════
// MIND-DEPENDENT REALITY (Idealism — Alignment B / System)
//
// Point Generation: At the end of each full round, any player who has
//   Rationalism epistemology gains 2 System point. All other players
//   at the end of each full round get 1 system point.
//
// Bonus Feature: While this Domain is active, if both players have a
//   System-type Moral Grounding in play, both players are treated as
//   having Rationalism as their Orientation of Inquiry for all
//   Orientation abilities and effects until the Domain changes. Their
//   original Epistemology selections, victory profiles, and draw
//   distributions do not change.
// ════════════════════════════════════════════════════════════════

import { addPoints } from '../../effects/primitives';

function hasRationalism(state, playerId) {
  const eps = state.players[playerId]?.epistemologies;
  if (!eps) return false;
  if (eps.paradigms) return eps.paradigms.includes('rationalism');
  return eps.orientation === 'rationalism';
}

// Both players have System-type Moral Grounding → both treated as Rationalism.
function bothSystemGrounding(state) {
  return (
    state.players.player?.persistentSlots.right?.alignment === 'B' &&
    state.players.opponent?.persistentSlots.right?.alignment === 'B'
  );
}

export function isTreatedRationalism(state, playerId) {
  return hasRationalism(state, playerId) || bothSystemGrounding(state);
}

export default {
  onRoundEnd(state) {
    for (const pid of ['player', 'opponent']) {
      const amount = isTreatedRationalism(state, pid) ? 2 : 1;
      addPoints(state, pid, 'B', amount, 'domain');
    }
  },
};