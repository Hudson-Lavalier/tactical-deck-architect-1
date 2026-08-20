import React, { useState, useEffect } from 'react';
import InteractiveChoiceModal from './InteractiveChoiceModal';
import { ALIGNMENT_COLORS } from './terminalTheme';

/**
 * CardEffectInteractionModal
 * Renders the interactive choice modal for any pending card effect trigger.
 */
export default function CardEffectInteractionModal({ interaction, onResolve, onCancel }) {
  const options = interaction?.options || [];
  const cards = interaction?.cards || [];
  const multiSelect = interaction?.multiSelect || false;
  const maxSelections = interaction?.maxSelections || 1;
  const card = interaction?.card;
  const title = interaction?.title;
  const subtitle = interaction?.subtitle;
  const type = interaction?.type;

  const [selectedOptionId, setSelectedOptionId] = useState(options[0]?.id || null);
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || null);
  const [selectedCardIds, setSelectedCardIds] = useState([]);

  useEffect(() => {
    if (options.length > 0) {
      setSelectedOptionId(options[0].id);
    } else {
      setSelectedOptionId(null);
    }

    if (cards.length > 0) {
      setSelectedCardId(cards[0].id);
    } else {
      setSelectedCardId(null);
    }

    setSelectedCardIds([]);
  }, [interaction]);

  if (!interaction) return null;

  const handleToggleCard = (cardId) => {
    setSelectedCardIds((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId);
      }
      if (prev.length >= maxSelections) {
        return [...prev.slice(1), cardId];
      }
      return [...prev, cardId];
    });
  };

  const handleConfirm = () => {
    onResolve({
      type,
      selectedOptionId,
      selectedCardId,
      selectedCardIds,
      interaction,
    });
  };

  const isConfirmDisabled = multiSelect
    ? selectedCardIds.length === 0
    : (options.length > 0 && !selectedOptionId) || (cards.length > 0 && !selectedCardId && options.length === 0);

  return (
    <InteractiveChoiceModal
      title={title || `${card?.name?.toUpperCase() || 'CARD EFFECT'} CHOICE`}
      subtitle={subtitle || 'SELECT AN OPTION OR TARGET'}
      accentColor={card?.alignment ? ALIGNMENT_COLORS[card.alignment]?.glow : '#a855f7'}
      activeCard={card}
      options={options}
      cards={cards}
      selectedOptionId={selectedOptionId}
      selectedCardId={selectedCardId}
      selectedCardIds={selectedCardIds}
      onSelectOption={(id) => setSelectedOptionId(id)}
      onSelectCard={(id) => setSelectedCardId(id)}
      onToggleCardSelection={handleToggleCard}
      multiSelect={multiSelect}
      maxSelections={maxSelections}
      confirmLabel="RESOLVE EFFECT"
      cancelLabel="DISMISS"
      confirmDisabled={isConfirmDisabled}
      onConfirm={handleConfirm}
      onCancel={onCancel}
    />
  );
}
