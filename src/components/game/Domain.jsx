import React from 'react';
import Card from './Card';
import { ALIGNMENT_COLORS } from './terminalTheme';

// Domain component — the shared terrain card in the center of the board.
// Player's effects go RIGHT, opponent's effects go LEFT.
export default function Domain({ domain, modifiers, onDomainClick }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[#888] font-mono text-[10px] tracking-widest">
        ── SHARED DOMAIN ──
      </div>

      <div className="flex items-center gap-2">
        {/* Opponent modifiers (LEFT) */}
        <div className="flex flex-col gap-1">
          {modifiers?.opponent?.map((mod, i) => (
            <Card key={mod.id || i} card={mod} size="small" />
          ))}
        </div>

        {/* Domain card */}
        {domain ? (
          <Card card={domain} size="large" onClick={onDomainClick} />
        ) : (
          <div className="w-40 h-56 rounded border-2 border-dashed border-[#a855f7] bg-[#0a0a0a] flex items-center justify-center">
            <div className="text-center">
              <div className="text-[#a855f7] font-mono text-xs">[ NO DOMAIN ]</div>
              <div className="text-[#555] font-mono text-[8px] mt-1">PLACE TERRAIN</div>
            </div>
          </div>
        )}

        {/* Player modifiers (RIGHT) */}
        <div className="flex flex-col gap-1">
          {modifiers?.player?.map((mod, i) => (
            <Card key={mod.id || i} card={mod} size="small" />
          ))}
        </div>
      </div>

      {domain && (
        <div className="text-[#888] font-mono text-[9px]">
          ACTIVE: <span style={{ color: ALIGNMENT_COLORS[domain.alignment]?.glow }}>
            {ALIGNMENT_COLORS[domain.alignment]?.name}
          </span>
        </div>
      )}
    </div>
  );
}