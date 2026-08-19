import React from 'react';
import Card from './Card';
import { ALIGNMENT_COLORS } from './terminalTheme';

// Domain — shared domain card with cosmic focal treatment.
export default function Domain({ domain, modifiers, onDomainClick }) {
  const accent = domain ? ALIGNMENT_COLORS[domain.alignment]?.glow : '#a855f7';

  return (
    <div className="flex flex-col items-center gap-2 relative">
      {/* Radial glow behind the domain */}
      {domain && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full pointer-events-none -z-10"
          style={{ background: `radial-gradient(circle, ${accent}20, transparent 70%)` }}
        />
      )}

      <div className="text-term-dim font-mono text-[10px] tracking-[0.2em]">
        ── SHARED DOMAIN ──
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          {modifiers?.opponent?.map((mod, i) => (
            <Card key={mod.id || i} card={mod} size="small" />
          ))}
        </div>

        {domain ? (
          <Card card={domain} size="large" onClick={onDomainClick} />
        ) : (
          <div className="w-40 h-56 rounded glass-card flex items-center justify-center"
            style={{ borderColor: 'rgba(168,85,247,0.3)', borderStyle: 'dashed' }}
          >
            <div className="text-center">
              <div className="text-term-purple font-mono text-xs">[ NO DOMAIN ]</div>
              <div className="text-term-faint font-mono text-[8px] mt-1">PLACE DOMAIN</div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {modifiers?.player?.map((mod, i) => (
            <Card key={mod.id || i} card={mod} size="small" />
          ))}
        </div>
      </div>

      {domain && (
        <div className="text-term-dim font-mono text-[9px]">
          ACTIVE: <span style={{ color: accent, textShadow: `0 0 8px ${accent}60` }}>
            {ALIGNMENT_COLORS[domain.alignment]?.name}
          </span>
        </div>
      )}
    </div>
  );
}