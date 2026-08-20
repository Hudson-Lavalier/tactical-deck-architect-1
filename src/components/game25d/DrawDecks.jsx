import React from 'react';
import { DRAW_PILES } from '@/data/gameConstants';

// DrawDecks — Metaphysics & Meta-Ethics decks stacked vertically (far-left).
export default function DrawDecks({ piles, onDraw, disabled }) {
  const decks = [
    { id: DRAW_PILES.METAPHYSICS, label: 'METAPHYSICS', count: piles.metaphysics.length, color: '#00ff41' },
    { id: DRAW_PILES.META_ETHICS, label: 'META-ETHICS', count: piles.meta_ethics.length, color: '#00ffff' },
  ];

  return (
    <div className="game-draw-decks flex w-full min-w-0 max-w-24 shrink flex-col items-center gap-3 md:gap-5">
      <div className="text-term-text font-mono text-[12px] font-bold tracking-[0.2em] text-center">DRAW</div>
      {decks.map((d) => (
        <div
          key={d.id}
          onClick={() => !disabled && onDraw?.(d.id)}
          className={`game-draw-deck accent-border relative flex aspect-[5/7] w-full max-w-24 flex-col items-center justify-center rounded-lg glass-card cosmic-sheen transition-[transform,box-shadow] ${
            disabled ? 'cursor-not-allowed opacity-40' : 'accent-glow cursor-pointer'
          }`}
          style={{ '--accent-color': d.color }}
        >
          <div className="font-mono text-[10px] font-bold tracking-[0.1em] text-center leading-tight" style={{ color: d.color }}>
            {d.label}
          </div>
          <div className="text-term-text font-mono text-base font-bold mt-2">{d.count}</div>
          {!disabled && (
            <div className="text-term-text font-mono text-[9px] font-bold mt-1 tracking-[0.15em]">[ DRAW ]</div>
          )}
        </div>
      ))}
    </div>
  );
}