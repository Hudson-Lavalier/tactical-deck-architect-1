import React from 'react';
import Card from '@/components/game/Card';
import { HAND_LIMIT } from '@/data/gameConstants';

export default function HandFan({ cards, onSelectCard, selectedCardId, disabled, visible = true }) {
  const visibleCards = cards.slice(0, HAND_LIMIT);
  const midPoint = (visibleCards.length - 1) / 2;
  const fanAngle = Math.min(cards.length * 3, 22);

  return (
    <div className={`game-hand-fan relative z-30 mx-auto flex w-full items-end justify-center gap-1.5 overflow-visible select-none transition-all duration-300 ease-in-out md:gap-2 ${visible ? 'h-[clamp(7rem,13vh,10.5rem)] translate-y-0 px-4 pb-1 pt-10 opacity-100 pointer-events-auto' : 'h-0 translate-y-[150%] p-0 opacity-0 pointer-events-none'}`}>
      {visibleCards.map((card, index) => {
        const offset = index - midPoint;
        const angle = midPoint !== 0 ? (offset / midPoint) * fanAngle : 0;
        const yOffset = Math.abs(offset) * 3;
        const isSelected = selectedCardId === card.id;

        return (
          <div
            key={card.id || index}
            style={{
              transform: `rotate(${angle}deg) translateY(${isSelected ? -14 : yOffset}px)`,
              transformOrigin: 'bottom center',
              zIndex: isSelected ? 100 : index,
            }}
            className="relative w-[clamp(4rem,5.5vw,7rem)] shrink-0 overflow-visible opacity-100 transition-all duration-300 ease-out hover:z-50"
          >
            <Card
              card={card}
              size="hand"
              onClick={() => !disabled && onSelectCard?.(card)}
              selected={isSelected}
              disabled={disabled}
            />
          </div>
        );
      })}

      {cards.length === 0 && (
        <div className="hud-status py-8 font-mono text-xs font-bold uppercase tracking-[0.22em] text-term-faint">Hand archive empty</div>
      )}
    </div>
  );
}