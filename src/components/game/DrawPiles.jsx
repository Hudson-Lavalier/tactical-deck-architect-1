import React from 'react';
import { DRAW_PILES } from '@/data/gameConstants';

// DrawPiles — Metaphysics & Meta-Ethics decks. Glass cards with glow.
export default function DrawPiles({ piles, onDraw, disabled }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-term-faint font-mono text-[8px] tracking-[0.2em] text-center">
        DRAW PILES
      </div>

      <div
        onClick={() => !disabled && onDraw?.(DRAW_PILES.METAPHYSICS)}
        className={`relative w-20 h-28 rounded glass-card cosmic-sheen flex flex-col items-center justify-center cursor-pointer transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'}`}
        style={{ borderColor: disabled ? 'rgba(0,255,65,0.15)' : 'rgba(0,255,65,0.35)', boxShadow: disabled ? 'none' : '0 0 12px rgba(0,255,65,0.12)' }}
      >
        <div className="text-term-green font-mono text-[8px] font-bold">META</div>
        <div className="text-term-green font-mono text-[8px] font-bold">PHYSICS</div>
        <div className="text-term-dim font-mono text-xs mt-2">{piles.metaphysics.length}</div>
      </div>

      <div
        onClick={() => !disabled && onDraw?.(DRAW_PILES.META_ETHICS)}
        className={`relative w-20 h-28 rounded glass-card cosmic-sheen flex flex-col items-center justify-center cursor-pointer transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'}`}
        style={{ borderColor: disabled ? 'rgba(0,255,255,0.15)' : 'rgba(0,255,255,0.35)', boxShadow: disabled ? 'none' : '0 0 12px rgba(0,255,255,0.12)' }}
      >
        <div className="text-term-blue font-mono text-[8px] font-bold">META</div>
        <div className="text-term-blue font-mono text-[8px] font-bold">ETHICS</div>
        <div className="text-term-dim font-mono text-xs mt-2">{piles.meta_ethics.length}</div>
      </div>
    </div>
  );
}