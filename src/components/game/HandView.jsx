import React, { useRef, useState, useEffect, useCallback } from 'react';
import Card from './Card';

// HandView — blurred full-screen overlay showing the player's hand as a fan.
// A horizontal scroll-snap row; the card nearest the scroll center is
// straightened + enlarged, neighbors stay bent. Clicking a card opens its
// CardDetail (via onSelectCard). Close returns to the board.
export default function HandView({ cards, onSelectCard, onClose }) {
  const scrollerRef = useRef(null);
  const [center, setCenter] = useState(0);
  const rafRef = useRef(0);

  const recompute = useCallback(() => {
    rafRef.current = 0;
    const el = scrollerRef.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    const items = el.children;
    for (let i = 0; i < items.length; i++) {
      const c = items[i];
      const cx = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(cx - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    setCenter(best);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(recompute);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    recompute();
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [recompute]);

  const mid = Math.max(0, cards.length - 1) / 2;

  return (
    <div className="fixed inset-0 z-40 font-mono flex flex-col items-center justify-center" onClick={onClose}>
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="relative z-10 w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <div className="text-term-text text-ui-lg font-bold tracking-[0.25em] mb-6" style={{ textShadow: '0 0 12px rgba(0,255,65,0.3)' }}>
          ── HAND VIEW ──
        </div>

        {cards.length === 0 ? (
          <div className="text-term-faint text-ui-md italic">[ HAND EMPTY ]</div>
        ) : (
          <div
            ref={scrollerRef}
            className="w-full overflow-x-auto overflow-y-hidden flex items-center gap-4 px-[20vw] py-10"
            style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
          >
            {cards.map((card, i) => {
              const offset = i - center;
              const angle = offset * 6;
              const ty = Math.abs(offset) * 10;
              const scale = i === center ? 1.18 : 1;
              return (
                <div
                  key={card.id || i}
                  className="shrink-0"
                  style={{
                    scrollSnapAlign: 'center',
                    transform: `rotate(${angle}deg) translateY(${ty}px) scale(${scale})`,
                    transformOrigin: 'bottom center',
                    transition: 'transform 200ms ease-out',
                  }}
                >
                  <Card card={card} size="large" onClick={() => onSelectCard?.(card)} />
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded text-ui-sm glass-card cosmic-sheen transition-[transform,box-shadow] hover:scale-105"
            style={{ borderColor: '#00ff4140', color: '#00ff41' }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}