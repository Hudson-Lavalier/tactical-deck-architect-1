import React, { useEffect, useRef, useState } from 'react';
import Card from './Card';

const DRAG_THRESHOLD = 5;

export default function HandView({ cards, onSelectCard, onPlayCard, onClose }) {
  const scrollerRef = useRef(null);
  const frameRef = useRef(0);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [playMode, setPlayMode] = useState(false);

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
    const middleCard = scroller.children[Math.floor(cards.length / 2)];
    middleCard?.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
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
    if (suppressClickRef.current) return;
    if (playMode) onPlayCard?.(card);
    else onSelectCard?.(card);
  };

  const scrollByCard = (direction) => {
    const scroller = scrollerRef.current;
    const card = scroller?.firstElementChild;
    if (!scroller || !card) return;
    const gap = parseFloat(window.getComputedStyle(scroller).columnGap) || 0;
    scroller.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/85 font-mono">
      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="mb-4 flex w-full max-w-6xl items-center justify-between px-6">
          <div className="text-ui-lg font-bold tracking-[0.25em] text-term-text">── HAND VIEW ──</div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlayMode((active) => !active)}
              className={`hud-control rounded-lg border px-4 py-2 text-ui-xs font-bold uppercase tracking-[0.14em] transition-all ${playMode ? 'border-term-green/50 bg-term-green/10 text-term-green' : 'border-term-blue/40 bg-term-blue/10 text-term-blue'}`}
            >
              {playMode ? 'Play mode' : 'Inspect mode'}
            </button>
            <button onClick={onClose} className="hud-control flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-ui-md font-bold text-term-text" aria-label="Close hand view">×</button>
          </div>
        </div>
        {cards.length === 0 ? (
          <div className="text-ui-md italic text-term-faint">[ HAND EMPTY ]</div>
        ) : (
          <div className="relative w-full">
            <button
              onClick={() => scrollByCard(-1)}
              className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full border border-white/20 bg-cosmic-deep/90 p-3 text-xl font-bold text-white shadow-xl transition-colors hover:bg-slate-800"
              aria-label="Previous card"
            >
              &lt;
            </button>
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
                  <Card card={card} size="handView" onClick={() => selectCard(card)} />
                </div>
              ))}
            </div>
            <button
              onClick={() => scrollByCard(1)}
              className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full border border-white/20 bg-cosmic-deep/90 p-3 text-xl font-bold text-white shadow-xl transition-colors hover:bg-slate-800"
              aria-label="Next card"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}