// Dispatcher — routes card lifecycle events to the correct per-card handler.
//
// The engine calls these dispatch functions (not the handlers directly) so the
// call sites don't need to know about the registry. Each dispatch is a no-op if
// the card has no effect file yet, so partially-implemented cards still work.

import { getEffect } from './registry';
import { emit, emitBefore } from './eventBus';
import { logEvent } from '../gameState';
import { getActiveDomainCard } from '../domainSystem';
import { executeActionPayload } from '../schema/actionPayloadRunner';
import { removePoints } from './primitives';

// Check if a card requires an interactive choice modal from the player before/upon resolution
export function getCardInteraction(state, playerId, card) {
  if (!card) return null;

  // 1. Check declarative interaction layer first
  if (card.interaction?.hasInteractiveChoice && Array.isArray(card.interaction.options) && card.interaction.options.length > 0) {
    const player = state.players[playerId];
    const options = card.interaction.options.map((opt) => {
      let disabled = Boolean(opt.disabled);
      let costDesc = '';
      if (opt.costOverride && player) {
        const { amount, type } = opt.costOverride;
        const currentPoints = player.points?.[type] || 0;
        if (currentPoints < amount) {
          disabled = true;
          costDesc = ` [Requires ${amount} ${type} point(s), you have ${currentPoints}]`;
        }
      }
      return {
        ...opt,
        disabled,
        description: opt.description ? `${opt.description}${costDesc}` : costDesc.trim(),
      };
    });

    return {
      type: card.pipeline?.effectId || card.id,
      title: card.interaction.title || `${card.name.toUpperCase()} CHOICE`,
      subtitle: card.interaction.prompt || 'SELECT AN OPTION OR TARGET',
      card,
      modalType: card.interaction.modalType || 'SINGLE_CHOICE',
      minSelect: card.interaction.minSelect || 1,
      maxSelect: card.interaction.maxSelect || 1,
      options,
    };
  }

  // 2. Check custom handler's getInteraction if defined
  const handler = getEffect(card.effectId || card.id);
  if (handler?.getInteraction) {
    return handler.getInteraction(state, playerId, card);
  }
  return null;
}

// A one-time-use action card resolves (from queue or immediate play).
export function dispatchResolve(state, playerId, card, targets = {}) {
  if (!card) return;

  // Handle declarative schema option resolution if an option was chosen
  if (targets?.selectedOptionId && card.interaction?.options) {
    const chosenOpt = card.interaction.options.find((o) => o.id === targets.selectedOptionId);
    if (chosenOpt) {
      if (chosenOpt.costOverride) {
        const { amount, type } = chosenOpt.costOverride;
        removePoints(state, playerId, type, amount, card.id || 'schema_choice');
      }
      if (chosenOpt.actionPayload) {
        executeActionPayload(state, playerId, card, chosenOpt.actionPayload, targets);
      }
    }
  }

  const handler = getEffect(card.effectId || card.id);
  if (!handler?.onPlay) {
    if (!targets?.selectedOptionId) {
      logEvent(state, { type: 'effect_noop', cardId: card.id, reason: 'no_onPlay' });
    }
    return;
  }
  handler.onPlay(state, playerId, card, targets);
}

// A persistent card is placed into a slot (or the shared Domain).
// `slot` is 'left' | 'middle' | 'right' | 'domain'.
export function dispatchPlace(state, playerId, card, slot) {
  if (!card) return;
  const handler = getEffect(card.effectId || card.id);
  if (handler?.onPlace) handler.onPlace(state, playerId, card, slot);
  if (slot === 'domain') emit(state, 'domain_changed', { playerId, card });
}

// A persistent card is removed/replaced — clean up its state.
export function dispatchRemove(state, playerId, card) {
  if (!card) return;
  const handler = getEffect(card.effectId || card.id);
  if (handler?.onRemove) handler.onRemove(state, playerId, card);
}

// A Rhetoric card is played onto a target during a response window.
export function dispatchRhetoric(state, playerId, card, targetCard, action) {
  if (!card) return;
  const handler = getEffect(card.effectId || card.id);
  if (handler?.onRhetoric) handler.onRhetoric(state, playerId, card, targetCard, action);
}

// A Universals modifier attaches to a target card/queue slot.
export function dispatchAttach(state, playerId, card, target) {
  if (!card) return;
  const handler = getEffect(card.effectId || card.id);
  if (handler?.onAttach) handler.onAttach(state, playerId, card, target);
}

// End of a full round — the active Domain generates points per its rules.
export function dispatchRoundEnd(state) {
  const domain = getActiveDomainCard(state);
  if (!domain) return;
  const handler = getEffect(domain.effectId || domain.id);
  if (handler?.onRoundEnd) handler.onRoundEnd(state, 'domain', domain);
  emit(state, 'round_end', { round: state.roundCount });
}

// A player attempts to change the Domain. Cancelable by active effects (locks).
export function dispatchDomainChangeAttempt(state, playerId, newDomainCard) {
  if (!newDomainCard) return false;
  const before = emitBefore(state, 'domain_change_attempted', { playerId, newDomainCard });
  return !before.cancelled;
}