import React from 'react';
import { DRAW_PILES } from '@/data/gameConstants';

// DrawDecks — Metaphysics & Meta-Ethics decks stacked vertically (far-left).
export default function DrawDecks({ piles, onDraw, disabled }) {
  const decks = [
    { id: DRAW_PILES.METAPHYSICS, label: 'METAPHYSICS', count: piles.metaphysics.length, color: '#00ff41' },
    { id: DRAW_PILES.META_ETHICS, label: 'META-ETHICS', count: piles.meta_ethics.length, color: '#00ffff' },
  ];

  return (
    <div className="game-draw-decks flex flex-col gap-6 shrink-0">
      <div className="text-term-text font-mono text-[12px] font-bold tracking-[0.2em] text-center">DRAW</div>
      {decks.map((d) => (
        <div
          key={d.id}
          onClick={() => !disabled && onDraw?.(d.id)}
          className={`game-draw-deck relative w-20 h-28 rounded-lg glass-card cosmic-sheen flex flex-col items-center justify-center transition-[transform,box-shadow] ${
            disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
          }`}
          style={{
            borderColor: disabled ? `${d.color}20` : `${d.color}60`,
            boxShadow: disabled ? 'none' : `0 0 16px ${d.color}25`,
          }}
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