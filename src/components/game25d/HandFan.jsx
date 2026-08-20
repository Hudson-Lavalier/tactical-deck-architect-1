import React from 'react';
import Card from '@/components/game/Card';
import { HAND_LIMIT } from '@/data/gameConstants';

export default function HandFan({ cards, onSelectCard, selectedCardId, disabled }) {
  const handCount = cards.length;
  const visible = cards.slice(0, HAND_LIMIT);

  const overlapClass =
    handCount > 8
      ? '-ml-7 md:-ml-9'
      : handCount > 5
      ? '-ml-4 md:-ml-6'
      : handCount > 3
      ? '-ml-2'
      : '';

  return (
    <div className="game-hand-fan col-span-2 relative z-30 mx-auto flex h-full max-h-36 w-full max-w-lg items-end justify-center overflow-visible px-2 pb-0 md:max-w-xl">
      <div className="flex items-end justify-center overflow-visible">
        {visible.map((card, index) => {
          const midPoint = (visible.length - 1) / 2;
          const offset = index - midPoint;
          const angle = midPoint !== 0 ? (offset / midPoint) * Math.min(visible.length * 2.2, 16) : 0;
          const yOffset = Math.abs(offset) * 2.5;
          const isSelected = selectedCardId === card.id;

          return (
            <div
              key={card.id || index}
              style={{
                transform: `rotate(${angle}deg) translateY(${isSelected ? -28 : yOffset}px)`,
                transformOrigin: 'bottom center',
                zIndex: isSelected ? 100 : index,
              }}
              className={`group/handcard w-[clamp(3.5rem,4.5vw,5.25rem)] shrink-0 overflow-visible transition-all duration-200 ease-out ${
                index > 0 ? overlapClass : ''
              }`}
            >
              <div className="transition-transform duration-200 ease-out group-hover/handcard:-translate-y-8 group-hover/handcard:scale-110">
                <Card
                  card={card}
                  size="small"
                  onClick={() => !disabled && onSelectCard?.(card)}
                  selected={isSelected}
                  disabled={disabled}
                />
              </div>
            </div>
          );
        })}
      </div>

      {handCount === 0 && (
        <div className="hud-status py-2 font-mono text-xs font-bold uppercase tracking-[0.22em] text-term-faint">
          Hand archive empty
        </div>
      )}
    </div>
  );
}