import React, { useMemo } from 'react';
import Card from '@/components/game/Card';
import { HAND_LIMIT } from '@/data/gameConstants';

export default function HandFan({ cards = [], onSelectCard, selectedCardId, disabled, visible = true }) {
  const visibleCards = useMemo(() => (Array.isArray(cards) ? cards.slice(0, HAND_LIMIT) : []), [cards]);
  const count = visibleCards.length;
  const midPoint = (count - 1) / 2;
  const fanAngle = Math.min(count * 3, 22);

  const cardLayouts = useMemo(() => {
    return visibleCards.map((card, index) => {
      const offset = index - midPoint;
      const angle = midPoint !== 0 ? (offset / midPoint) * fanAngle : 0;
      const yOffset = Math.abs(offset) * 2.5;
      return { angle, yOffset };
    });
  }, [visibleCards, midPoint, fanAngle]);

  return (
    <div className={`game-hand-fan relative z-30 mx-auto flex w-full items-end justify-center gap-1 overflow-visible select-none transition-all duration-300 ease-in-out md:gap-1.5 lg:gap-2 ${visible ? 'min-h-[clamp(5.5rem,10.5vh,8.5rem)] max-h-[13vh] translate-y-0 px-2 pb-1 pt-1 opacity-100 pointer-events-auto' : 'h-0 translate-y-[150%] p-0 opacity-0 pointer-events-none'}`}>
      {visibleCards.map((card, index) => {
        const layout = cardLayouts[index] || { angle: 0, yOffset: 0 };
        const isSelected = selectedCardId === card?.id;

        return (
          <div
            key={card.instanceId || `${card.id || 'card'}-${index}`}
            style={{
              transform: `translate3d(0, ${isSelected ? -14 : layout.yOffset}px, 0) rotate(${layout.angle}deg)`,
              transformOrigin: 'bottom center',
              willChange: 'transform',
              zIndex: isSelected ? 100 : index,
            }}
            className="relative w-[clamp(3.75rem,5.2vw,6.5rem)] shrink-0 overflow-visible opacity-100 transition-transform duration-200 ease-out hover:z-50"
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

      {(!cards || cards.length === 0) && (
        <div className="hud-status py-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-term-faint">Hand archive empty</div>
      )}
    </div>
  );
}