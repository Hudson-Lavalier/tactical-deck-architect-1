import React from 'react';
import Card from '@/components/game/Card';
import { HAND_LIMIT } from '@/data/gameConstants';

// HandFan — expanded card sizing fanned inside the central bay.
export default function HandFan({ cards, onSelectCard, selectedCardId, disabled }) {
  const handCount = cards.length;
  const fanAngle = Math.min(handCount * 3.5, 20);
  const visible = cards.slice(0, HAND_LIMIT);
  const midPoint = (Math.min(handCount, HAND_LIMIT) - 1) / 2;

  return (
    <div className="game-hand-fan relative z-30 mx-auto flex min-h-[clamp(8rem,16vh,13rem)] w-full items-end justify-center gap-1.5 overflow-visible px-4 pb-1">
      {visible.map((card, index) => {
        const offset = index - midPoint;
        const angle = midPoint !== 0 ? (offset / midPoint) * fanAngle : 0;
        const yOffset = Math.abs(offset) * 5;
        const isSelected = selectedCardId === card.id;

        return (
          <div
            key={card.id || index}
            style={{
              transform: `rotate(${angle}deg) translateY(${isSelected ? -32 : yOffset}px)`,
              transformOrigin: 'bottom center',
              zIndex: isSelected ? 100 : index,
            }}
            className="w-[clamp(5.5rem,8vw,9.5rem)] shrink-0 overflow-visible opacity-100 transition-all duration-300 ease-out hover:-translate-y-6"
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
        <div className="hud-status py-8 font-mono text-xs font-bold uppercase tracking-[0.22em] text-term-faint">
          Hand archive empty
        </div>
      )}
    </div>
  );
}