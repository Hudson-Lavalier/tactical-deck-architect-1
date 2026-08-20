import React, { useEffect, useRef } from 'react';
import Card from './Card';

export default function HandView({ cards, onSelectCard, onClose }) {
  const scrollerRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const updateCards = () => {
      frameRef.current = 0;
      const center = scroller.getBoundingClientRect().left + scroller.clientWidth / 2;
      const items = Array.from(scroller.children);
      const distances = items.map((item) => {
        const rect = item.getBoundingClientRect();
        return Math.min(1, Math.abs(rect.left + rect.width / 2 - center) / 260);
      });
      items.forEach((item, index) => {
        const distance = distances[index];
        item.style.transform = `translate3d(0, ${distance * 18}px, 0) scale(${1.12 - distance * 0.12})`;
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

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/85 font-mono" onClick={onClose}>
      <div className="relative z-10 flex w-full flex-col items-center" onClick={(event) => event.stopPropagation()}>
        <div className="mb-6 text-ui-lg font-bold tracking-[0.25em] text-term-text">── HAND VIEW ──</div>
        {cards.length === 0 ? (
          <div className="text-ui-md italic text-term-faint">[ HAND EMPTY ]</div>
        ) : (
          <div ref={scrollerRef} className="flex w-full items-center gap-5 overflow-x-auto overflow-y-hidden px-[42vw] py-12" style={{ scrollSnapType: 'x mandatory' }}>
            {cards.map((card, index) => (
              <div key={card.id || index} className="shrink-0 transition-[transform,opacity] duration-150 ease-out" style={{ scrollSnapAlign: 'center', transformOrigin: 'center' }}>
                <Card card={card} size="large" onClick={() => onSelectCard?.(card)} />
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose} className="mt-6 rounded border border-term-green/30 px-6 py-2 text-ui-sm font-bold text-term-green">CLOSE</button>
      </div>
    </div>
  );
}