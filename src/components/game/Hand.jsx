import React from 'react';
import Card from './Card';
import { HAND_LIMIT } from '@/data/gameConstants';

// Hand — player's hand, fanned. Cosmic cards.
export default function Hand({ cards, onSelectCard, selectedCardId, disabled }) {
  const handCount = cards.length;
  const fanAngle = Math.min(handCount * 3, 25);
  const maxVisible = HAND_LIMIT;

  return (
    <div className="flex items-end justify-center gap-1.5 pb-2 min-h-[11rem] perspective-[1000px]">
      {cards.slice(0, maxVisible).map((card, index) => {
        const midPoint = (Math.min(handCount, maxVisible) - 1) / 2;
        const offset = index - midPoint;
        const angle = (offset / midPoint) * fanAngle;
        const yOffset = Math.abs(offset) * 4;
        const isSelected = selectedCardId === card.id;

        return (
          <div
            key={card.id || index}
            style={{
              transform: `rotate(${angle}deg) translateY(${isSelected ? -20 : yOffset}px)`,
              transformOrigin: 'bottom center',
              zIndex: isSelected ? 100 : index,
            }}
            className="transition-all duration-200"
          >
            <Card
              card={card}
              size="normal"
              onClick={() => !disabled && onSelectCard?.(card)}
              selected={isSelected}
              disabled={disabled}
            />
          </div>
        );
      })}

      {handCount === 0 && (
        <div className="text-term-faint font-mono text-xs py-8 tracking-[0.15em]">
          [ HAND EMPTY ]
        </div>
      )}
    </div>
  );
}