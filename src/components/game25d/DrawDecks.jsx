import React from 'react';
import { DRAW_PILES } from '@/data/gameConstants';

// DrawDecks — Metaphysics & Meta-Ethics decks stacked vertically (far-left).
export default function DrawDecks({ piles, onDraw, disabled }) {
  const decks = [
    { id: DRAW_PILES.METAPHYSICS, label: 'METAPHYSICS', count: piles.metaphysics.length, color: '#00ff41' },
    { id: DRAW_PILES.META_ETHICS, label: 'META-ETHICS', count: piles.meta_ethics.length, color: '#00ffff' },
  ];

  return (
    <div className="game-draw-decks mx-auto flex w-full min-w-0 max-w-[clamp(3.5rem,5.2vw,6.5rem)] shrink flex-col items-center justify-center gap-1.5 overflow-visible md:gap-3">
      <div className="hud-kicker text-center font-mono text-[clamp(0.55rem,0.65vw,0.72rem)] font-bold uppercase tracking-[0.2em] text-term-text">Archives</div>
      {decks.map((d) => (
        <div
          key={d.id}
          onClick={() => !disabled && onDraw?.(d.id)}
          className={`game-draw-deck accent-border relative z-20 flex aspect-[5/7] w-full max-w-[clamp(3.5rem,5.2vw,6.5rem)] flex-col items-center justify-center rounded-xl p-1.5 glass-card cosmic-sheen transition-transform duration-200 ease-out md:p-2.5 ${
            disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer opacity-100 hover:-translate-y-1.5 active:translate-y-0 active:scale-95'
          }`}
          style={{ '--accent-color': d.color }}
        >
          <div className="max-w-full truncate text-center font-mono text-[clamp(0.48rem,0.58vw,0.65rem)] font-bold leading-tight tracking-[0.14em]" style={{ color: d.color }}>
            {d.label}
          </div>
          <div className="text-term-text font-mono text-[clamp(0.85rem,1.1vw,1.15rem)] font-bold mt-1">{d.count}</div>
          {!disabled && (
            <div className="mt-0.5 font-mono text-[clamp(0.42rem,0.5vw,0.55rem)] font-bold uppercase tracking-[0.14em] text-term-faint">Access</div>
          )}
        </div>
      ))}
    </div>
  );
}