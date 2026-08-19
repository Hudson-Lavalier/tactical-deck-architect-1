import React from 'react';
import { DRAW_PILES } from '@/data/gameConstants';

// DrawPiles component — the Metaphysics and Meta-Ethics decks.
// Positioned far left per the board layout.
export default function DrawPiles({ piles, onDraw, disabled }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[#555] font-mono text-[8px] tracking-wider text-center">
        DRAW PILES
      </div>

      {/* Metaphysics pile */}
      <div
        onClick={() => !disabled && onDraw?.(DRAW_PILES.METAPHYSICS)}
        className={`relative w-20 h-28 rounded border border-[#00ff41] bg-[#0d0d12] flex flex-col items-center justify-center cursor-pointer hover:border-[#00ff41] hover:shadow-[0_0_10px_rgba(0,255,65,0.3)] transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <div className="text-[#00ff41] font-mono text-[8px] font-bold">META</div>
        <div className="text-[#00ff41] font-mono text-[8px] font-bold">PHYSICS</div>
        <div className="text-[#888] font-mono text-xs mt-2">{piles.metaphysics.length}</div>
      </div>

      {/* Meta-Ethics pile */}
      <div
        onClick={() => !disabled && onDraw?.(DRAW_PILES.META_ETHICS)}
        className={`relative w-20 h-28 rounded border border-[#00ffff] bg-[#0d0d12] flex flex-col items-center justify-center cursor-pointer hover:border-[#00ffff] hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <div className="text-[#00ffff] font-mono text-[8px] font-bold">META</div>
        <div className="text-[#00ffff] font-mono text-[8px] font-bold">ETHICS</div>
        <div className="text-[#888] font-mono text-xs mt-2">{piles.meta_ethics.length}</div>
      </div>
    </div>
  );
}