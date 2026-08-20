import React, { useRef, useState } from 'react';
import Card from '@/components/game/Card';
import { HAND_LIMIT } from '@/data/gameConstants';

const DRAG_THRESHOLD = 6;

export default function HandFan({ cards, onSelectCard, selectedCardId, disabled }) {
  const scrollRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const handCount = cards.length;
  const fanAngle = Math.min(handCount * 3, 22);
  const visible = cards.slice(0, HAND_LIMIT);
  const midPoint = (visible.length - 1) / 2;

  const handlePointerDown = (event) => {
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: scrollRef.current.scrollLeft, moved: false };
    setDragging(true);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) >= DRAG_THRESHOLD && !drag.moved) {
      drag.moved = true;
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }
    if (!drag.moved) return;
    event.preventDefault();
    scrollRef.current.scrollLeft = drag.scrollLeft - delta;
  };

  const finishPointer = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    suppressClickRef.current = drag.moved;
    dragRef.current = null;
    setDragging(false);
    if (suppressClickRef.current) window.setTimeout(() => { suppressClickRef.current = false; }, 0);
  };

  const handleCardClick = (card) => {
    if (!suppressClickRef.current && !disabled) onSelectCard?.(card);
  };

  return (
    <div
      ref={scrollRef}
      className={`game-hand-fan relative z-30 mx-auto min-h-[clamp(8rem,16vh,13rem)] w-full overflow-x-auto overflow-y-visible px-4 pb-1 select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ touchAction: 'pan-y', scrollSnapType: 'x proximity' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointer}
      onPointerCancel={finishPointer}
    >
      <div className="mx-auto flex min-h-[clamp(8rem,16vh,13rem)] w-max min-w-full items-end justify-center gap-1.5 md:gap-2">
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
                scrollSnapAlign: 'center',
              }}
              className="w-[clamp(5rem,7vw,9rem)] shrink-0 overflow-visible opacity-100 transition-all duration-300 ease-out"
            >
              <Card card={card} size="hand" onClick={() => handleCardClick(card)} selected={isSelected} disabled={disabled} />
            </div>
          );
        })}

        {handCount === 0 && <div className="hud-status py-8 font-mono text-xs font-bold uppercase tracking-[0.22em] text-term-faint">Hand archive empty</div>}
      </div>
    </div>
  );
}