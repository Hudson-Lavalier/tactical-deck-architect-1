import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Card from './Card';

const DRAG_THRESHOLD = 5;

export default function HandView({ cards, onSelectCard, onPlayCard, onClose }) {
  const scrollerRef = useRef(null);
  const frameRef = useRef(0);
  const dragRafRef = useRef(0);
  const momentumRafRef = useRef(0);
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
        const itemCenter = rect.left + rect.width / 2;
        const distance = Math.min(1, Math.abs(itemCenter - center) / 280);
        item.style.transform = `translate3d(0, ${distance * 14}px, 0) scale(${1.06 - distance * 0.1})`;
        item.style.opacity = String(1 - distance * 0.28);
        item.style.zIndex = String(Math.round((1 - distance) * 20));
      });
    };

    const schedule = () => {
      if (!frameRef.current) frameRef.current = requestAnimationFrame(updateCards);
    };

    scroller.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    // Initial center on middle card
    if (cards && cards.length > 0) {
      const middleIdx = Math.floor(cards.length / 2);
      const middleCard = scroller.children[middleIdx];
      middleCard?.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
    }
    schedule();

    return () => {
      scroller.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
      if (momentumRafRef.current) cancelAnimationFrame(momentumRafRef.current);
    };
  }, [cards]);

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    // Interrupt momentum scroll on pointer down
    if (momentumRafRef.current) {
      cancelAnimationFrame(momentumRafRef.current);
      momentumRafRef.current = 0;
    }

    const now = performance.now();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      currentX: event.clientX,
      lastX: event.clientX,
      lastTime: now,
      velocityX: 0,
      scrollLeft: scrollerRef.current?.scrollLeft || 0,
      moved: false,
    };
    setDragging(true);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const now = performance.now();
    const elapsed = Math.max(1, now - drag.lastTime);
    const instantVelocity = (event.clientX - drag.lastX) / elapsed; // px per ms

    // Exponential moving average for velocity smoothing
    drag.velocityX = drag.velocityX * 0.6 + instantVelocity * 0.4;
    drag.lastX = event.clientX;
    drag.lastTime = now;
    drag.currentX = event.clientX;

    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) >= DRAG_THRESHOLD && !drag.moved) {
      drag.moved = true;
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }
    if (!drag.moved) return;
    event.preventDefault();

    // High refresh rate rAF batching
    if (!dragRafRef.current) {
      dragRafRef.current = requestAnimationFrame(() => {
        dragRafRef.current = 0;
        const currentDrag = dragRef.current;
        if (!currentDrag || !scrollerRef.current) return;
        const currentDelta = currentDrag.currentX - currentDrag.startX;
        scrollerRef.current.scrollLeft = currentDrag.scrollLeft - currentDelta;
      });
    }
  };

  const finishPointer = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (dragRafRef.current) {
      cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = 0;
    }

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    suppressClickRef.current = drag.moved;
    const moved = drag.moved;
    const velocityX = drag.velocityX; // px per ms

    dragRef.current = null;
    setDragging(false);

    // Inertial momentum animation loop
    if (moved && Math.abs(velocityX) > 0.08) {
      let velocity = velocityX * 1000; // px per sec
      let lastTimestamp = performance.now();

      const stepMomentum = (timestamp) => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const rawDelta = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;
        const delta = Math.min(rawDelta, 0.1);

        scroller.scrollLeft -= velocity * delta;

        // Smooth physical friction decay
        const decay = Math.exp(-6.0 * delta);
        velocity *= decay;

        if (Math.abs(velocity) > 15) {
          momentumRafRef.current = requestAnimationFrame(stepMomentum);
        } else {
          momentumRafRef.current = 0;
        }
      };

      momentumRafRef.current = requestAnimationFrame(stepMomentum);
    }

    if (suppressClickRef.current) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 50);
    }
  };

  const selectCard = (card) => {
    if (suppressClickRef.current) return;
    if (playMode) onPlayCard?.(card);
    else onSelectCard?.(card);
  };

  const scrollByCard = (direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    if (momentumRafRef.current) {
      cancelAnimationFrame(momentumRafRef.current);
      momentumRafRef.current = 0;
    }

    const firstCard = scroller.firstElementChild;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 220;
    const gap = 16;
    scroller.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/90 p-4 font-mono backdrop-blur-md">
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center">
        {/* Top Header Controls */}
        <div className="mb-4 flex w-full items-center justify-between px-4 md:px-8">
          <div className="text-ui-lg font-bold tracking-[0.25em] text-term-text">── HAND VIEW ──</div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlayMode((active) => !active)}
              className={`hud-control rounded-lg border px-4 py-2 text-ui-xs font-bold uppercase tracking-[0.14em] transition-all hover:-translate-y-0.5 ${
                playMode
                  ? 'border-term-green/60 bg-term-green/15 text-term-green shadow-[0_0_12px_rgba(0,255,65,0.2)]'
                  : 'border-term-blue/40 bg-term-blue/10 text-term-blue'
              }`}
            >
              {playMode ? '▶ PLAY MODE' : '🔍 INSPECT MODE'}
            </button>
            <button
              onClick={onClose}
              className="hud-control flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-cosmic-deep/80 text-ui-md font-bold text-term-text transition-all hover:-translate-y-0.5 hover:text-term-green"
              aria-label="Close hand view"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {cards.length === 0 ? (
          <div className="py-20 text-ui-md italic text-term-faint">[ HAND EMPTY ]</div>
        ) : (
          <div className="relative flex w-full flex-col items-center">
            {/* Smooth Inertial Card Drawer */}
            <div
              ref={scrollerRef}
              className={`flex w-full items-center gap-4 overflow-x-auto overflow-y-hidden px-[40vw] py-8 select-none ${
                dragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{
                touchAction: 'pan-y',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={finishPointer}
              onPointerCancel={finishPointer}
            >
              {cards.map((card, index) => (
                <div
                  key={card.id || index}
                  className="shrink-0 transition-[transform,opacity] duration-150 ease-out"
                  style={{ transformOrigin: 'center' }}
                >
                  <Card card={card} size="handView" onClick={() => selectCard(card)} />
                </div>
              ))}
            </div>

            {/* Centered Navigation Row Beneath the Card Drawer */}
            <div className="mt-4 flex items-center justify-center gap-8">
              <button
                onClick={() => scrollByCard(-1)}
                className="hud-control rounded-lg p-2 text-term-dim transition-all hover:-translate-y-0.5 hover:text-term-green"
                aria-label="Previous card"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <div className="font-mono text-ui-xs font-bold uppercase tracking-[0.2em] text-term-faint">
                {cards.length} {cards.length === 1 ? 'CARD' : 'CARDS'} IN HAND
              </div>
              <button
                onClick={() => scrollByCard(1)}
                className="hud-control rounded-lg p-2 text-term-dim transition-all hover:-translate-y-0.5 hover:text-term-green"
                aria-label="Next card"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
