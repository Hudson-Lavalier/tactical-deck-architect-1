import React from 'react';
import { DRAW_PILES } from '@/data/gameConstants';

// DrawDecks — compact scaled Archives decks
export default function DrawDecks({ piles, onDraw, disabled }) {
  const decks = [
    { id: DRAW_PILES.METAPHYSICS, label: 'METAPHYSICS', count: piles.metaphysics.length, color: '#00ff41' },
    { id: DRAW_PILES.META_ETHICS, label: 'META-ETHICS', count: piles.meta_ethics.length, color: '#00ffff' },
  ];

  return (
    <div className="game-draw-decks mx-auto flex w-full max-w-[clamp(4.5rem,6vw,6.5rem)] shrink flex-col items-center justify-center gap-2 overflow-visible md:gap-3">
      <div className="hud-kicker text-center font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-term-text">
        Archives
      </div>
      {decks.map((d) => (
        <div
          key={d.id}
          onClick={() => !disabled && onDraw?.(d.id)}
          className={`game-draw-deck accent-border relative z-20 flex aspect-[5/7] w-full flex-col items-center justify-center rounded-lg p-2 glass-card cosmic-sheen transition-all duration-300 ease-out ${
            disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer opacity-100 hover:-translate-y-1 active:scale-95'
          }`}
          style={{ '--accent-color': d.color }}
        >
          <div className="max-w-full truncate text-center font-mono text-[9px] font-bold leading-tight tracking-[0.14em]" style={{ color: d.color }}>
            {d.label}
          </div>
          <div className="text-term-text font-mono text-sm font-bold mt-1">{d.count}</div>
          {!disabled && (
            <div className="mt-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-term-faint">Access</div>
          )}
        </div>
      ))}
    </div>
  );
}