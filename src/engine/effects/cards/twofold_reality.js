// ════════════════════════════════════════════════════════════════
// TWOFOLD REALITY (Dualism — Alignment C / Adaptation)
//
// Point Generation: None.
//
// Bonus Feature: When this Domain is placed, one Grounding Domain may
//   be placed to its left and one System Domain to its right. During
//   the placing player's turn only, they may switch the active Domain
//   between those two attached Domains up to 2 times during that turn.
//   If Twofold Reality is removed, all three Domains are discarded.
//
// Second Bonus Feature: Twofold Reality cannot be changed out by any
//   card or effect whose method of removal is changing the active
//   Domain. It can only be removed by a card or effect that
//   specifically states that it removes a Domain.
//
// Twofold Domain Structure: Both attached Domains remain part of
//   Twofold Reality while it is active, but only one attached Domain's
//   ruleset is considered active at a time. Switching between them
//   changes which attached Domain ruleset is active.
//   Adaptation cards may be played while either attached Domain is
//   active, overriding normal Domain restrictions.
//   Switching between the attached Domains counts as a Domain change
//   for abilities and effects that trigger on Domain changes but it
//   does not end a player's turn.
// ════════════════════════════════════════════════════════════════

import { discardCard } from '../primitives';

export default {
  // No point generation.

  // Initialize the Twofold structure. The flanking domains are selected
  // by the player via the attach modal (twofoldSystem.attachTwofoldDomains).
  onPlace(state, playerId, card) {
    state.domainAttached = { left: null, right: null, activeSide: null, switchesThisTurn: 0 };
  },

  // All three Domains are discarded when Twofold Reality is removed.
  onRemove(state, playerId, card) {
    if (state.domainAttached) {
      if (state.domainAttached.left) discardCard(state, state.domainAttached.left, playerId);
      if (state.domainAttached.right) discardCard(state, state.domainAttached.right, playerId);
      state.domainAttached = null;
    }
  },

  // Cannot be changed out by domain-change effects — only by explicit removal.
  onEvent(state, owner, eventType, payload) {
    if (eventType === 'before:domain_change_attempted') return { cancel: true };
  },
};