// ════════════════════════════════════════════════════════════════
// RATIONAL OR INTUITIVE ACCESS (Moral Non-Naturalism — Alignment B / System)
//
// Core Distinction: Moral truths may be accessible through rational
//   reflection or intuition rather than ordinary empirical observation.
//
// Bonus Feature: While Rational or Intuitive Access is active, once
//   every other turn, whenever you would convert one or more points
//   from one type into another, you may increase the number of points
//   converted. If you have Rationalism as your Orientation of Inquiry,
//   you may double the number of points that would normally be
//   converted. If you do not have Rationalism, you may instead convert
//   1 additional point beyond the amount normally allowed.
// ════════════════════════════════════════════════════════════════

import { claimOnceEveryOtherTurn } from '../../effects/primitives';

function hasRationalism(state, playerId) {
  const eps = state.players[playerId]?.epistemologies;
  if (!eps) return false;
  if (eps.paradigms) return eps.paradigms.includes('rationalism');
  return eps.orientation === 'rationalism';
}

export default {
  onEvent(state, owner, eventType, payload) {
    if (eventType !== 'before:point_converted') return;
    if (owner !== 'player' && owner !== 'opponent') return;
    if (payload?.playerId !== owner) return; // your conversion
    if (!claimOnceEveryOtherTurn(state, owner, 'rational_or_intuitive_access')) return;
    const boost = hasRationalism(state, owner) ? payload.amount : 1;
    return { modify: { amount: payload.amount + boost } };
  },
};