import React from 'react';
import Card from './Card';
import { ALIGNMENT_COLORS } from './terminalTheme';

export default function TwofoldFlankModal({ card, attached, onChoose, onClose }) {
  const accent = ALIGNMENT_COLORS[card?.alignment]?.glow || '#a855f7';
  const allowedSide = card?.alignment === 'A' ? 'left' : card?.alignment === 'B' ? 'right' : null;

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/85 p-4 font-mono" onClick={onClose}>
      <div className="layered-panel w-full max-w-xl p-6" style={{ borderColor: `${accent}55` }} onClick={(event) => event.stopPropagation()}>
        <div className="text-center text-ui-lg font-bold tracking-[0.16em]" style={{ color: accent }}>ATTACH AS TWOFOLD FLANK</div>
        <div className="mt-2 text-center text-ui-xs text-term-faint">Choose a side. An occupied flank will be discarded and replaced.</div>
        <div className="mt-6 grid grid-cols-2 gap-5">
          {['left', 'right'].map((side) => {
            const existing = attached?.[side];
            const legal = side === allowedSide;
            return (
              <button key={side} onClick={() => legal && onChoose(side)} disabled={!legal} className="flex flex-col items-center gap-3 rounded-lg border border-term-purple/20 bg-cosmic-deep/70 p-4 transition-[border-color,transform] hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-35" style={{ borderColor: legal ? `${accent}55` : '#33333355' }}>
                <span className="text-ui-sm font-bold tracking-[0.18em]" style={{ color: side === 'left' ? ALIGNMENT_COLORS.A.glow : ALIGNMENT_COLORS.B.glow }}>{side.toUpperCase()} FLANK</span>
                {existing ? <Card card={existing} size="medium" /> : <div className="flex h-36 w-24 items-center justify-center rounded border border-dashed border-term-purple/30 text-ui-xs text-term-faint">EMPTY</div>}
                <span className="text-ui-xs font-bold" style={{ color: legal ? accent : '#888888' }}>{legal ? (existing ? 'REPLACE THIS FLANK' : 'ATTACH HERE') : (side === 'left' ? 'GROUNDING ONLY' : 'SYSTEM ONLY')}</span>
              </button>
            );
          })}
        </div>
        <button onClick={onClose} className="mx-auto mt-5 block px-5 py-2 text-ui-xs font-bold text-term-faint">CANCEL</button>
      </div>
    </div>
  );
}