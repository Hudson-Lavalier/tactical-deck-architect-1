import React, { useEffect, useRef, useState } from 'react';
import Card from './Card';

const DRAG_THRESHOLD = 5;

export default function HandView({ cards, onSelectCard, onClose }) {
  const scrollerRef = useRef(null);
  const frameRef = useRef(0);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const updateCards = () => {
      frameRef.current = 0;
      const center = scroller.getBoundingClientRect().left + scroller.clientWidth / 2;
      Array.from(scroller.children).forEach((item) => {
        const rect = item.getBoundingClientRect();
        const distance = Math.min(1, Math.abs(rect.left + rect.width / 2 - center) / 240);
        item.style.transform = `translate3d(0, ${distance * 14}px, 0) scale(${1.06 - distance * 0.1})`;
        item.style.opacity = String(1 - distance * 0.25);
        item.style.zIndex = String(Math.round((1 - distance) * 10));
      });
    };

    const schedule = () => {
      if (!frameRef.current) frameRef.current = requestAnimationFrame(updateCards);
    };

    scroller.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      scroller.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [cards]);

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: scrollerRef.current.scrollLeft, moved: false };
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
    scrollerRef.current.scrollLeft = drag.scrollLeft - delta;
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

  const selectCard = (card) => {
    if (!suppressClickRef.current) onSelectCard?.(card);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/85 font-mono" onClick={onClose}>
      <div className="relative z-10 flex w-full flex-col items-center" onClick={(event) => event.stopPropagation()}>
        <div className="mb-6 text-ui-lg font-bold tracking-[0.25em] text-term-text">── HAND VIEW ──</div>
        {cards.length === 0 ? (
          <div className="text-ui-md italic text-term-faint">[ HAND EMPTY ]</div>
        ) : (
          <div
            ref={scrollerRef}
            className={`flex w-full items-center gap-4 overflow-x-auto overflow-y-hidden px-[44vw] py-12 select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ scrollSnapType: 'x proximity', touchAction: 'pan-y' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointer}
            onPointerCancel={finishPointer}
          >
            {cards.map((card, index) => (
              <div key={card.id || index} className="shrink-0 transition-[transform,opacity] duration-150 ease-out" style={{ scrollSnapAlign: 'center', transformOrigin: 'center' }}>
                <Card card={card} size="large" onClick={() => selectCard(card)} />
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose} className="mt-6 rounded border border-term-green/30 px-6 py-2 text-ui-sm font-bold text-term-green">CLOSE</button>
      </div>
    </div>
  );
}