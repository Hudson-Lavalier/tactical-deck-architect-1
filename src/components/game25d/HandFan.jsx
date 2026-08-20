import React from 'react';
import Card from '@/components/game/Card';
import { HAND_LIMIT } from '@/data/gameConstants';

// HandFan — player's hand fanned in an arc, emerging from the bottom edge
// of the tilted plane. No nested perspective (the board tilt handles depth).
export default function HandFan({ cards, onSelectCard, selectedCardId, disabled }) {
  const handCount = cards.length;
  const fanAngle = Math.min(handCount * 3, 22);
  const visible = cards.slice(0, HAND_LIMIT);
  const midPoint = (Math.min(handCount, HAND_LIMIT) - 1) / 2;

  return (
    <div className="flex min-h-[8rem] items-end justify-center gap-1.5 pb-1">
      {visible.map((card, index) => {
        const offset = index - midPoint;
        const angle = midPoint !== 0 ? (offset / midPoint) * fanAngle : 0;
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
              size="small"
              onClick={() => !disabled && onSelectCard?.(card)}
              selected={isSelected}
              disabled={disabled}
            />
          </div>
        );
      })}

      {handCount === 0 && (
        <div className="text-term-text font-mono text-sm font-bold py-8 tracking-[0.15em]">[ HAND EMPTY ]</div>
      )}
    </div>
  );
}