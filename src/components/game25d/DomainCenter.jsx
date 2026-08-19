import React from 'react';
import Card from '@/components/game/Card';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

// DomainCenter — the shared domain as the tilted board's centerpiece.
// Radial alignment bloom + faint circuit-node texture behind the card.
export default function DomainCenter({ domain, modifiers, onDomainClick }) {
  const accent = domain ? ALIGNMENT_COLORS[domain.alignment]?.glow : '#a855f7';

  return (
    <div className="flex flex-col items-center gap-1.5 relative shrink-0 h-full min-h-0">
      {domain && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[26rem] rounded-full pointer-events-none -z-10"
          style={{ background: `radial-gradient(circle, ${accent}30, transparent 70%)` }}
        />
      )}

      <div className="text-term-dim font-mono text-[11px] tracking-[0.2em]">── SHARED DOMAIN ──</div>

      <div className="flex items-center justify-center gap-2 flex-1 min-h-0">
        <div className="flex flex-col gap-1">
          {modifiers?.opponent?.map((mod, i) => (
            <Card key={mod.id || i} card={mod} size="medium" />
          ))}
        </div>

        {domain ? (
          <div className="relative">
            {/* Circuit-node texture peeking around the card edges */}
            <div
              className="absolute -inset-2 rounded pointer-events-none opacity-25"
              style={{
                backgroundImage: `radial-gradient(circle, ${accent}80 1px, transparent 1.5px)`,
                backgroundSize: '12px 12px',
              }}
            />
            <Card card={domain} size="xlarge" onClick={onDomainClick} />
          </div>
        ) : (
          <div
            className="w-60 h-72 rounded glass-card flex items-center justify-center"
            style={{ borderColor: 'rgba(168,85,247,0.3)', borderStyle: 'dashed' }}
          >
            <div className="text-center">
              <div className="text-term-purple font-mono text-sm">[ NO DOMAIN ]</div>
              <div className="text-term-faint font-mono text-[9px] mt-1">PLACE DOMAIN</div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {modifiers?.player?.map((mod, i) => (
            <Card key={mod.id || i} card={mod} size="medium" />
          ))}
        </div>
      </div>

      {domain && (
        <div className="text-term-dim font-mono text-[10px]">
          ACTIVE:{' '}
          <span style={{ color: accent, textShadow: `0 0 8px ${accent}60` }}>
            {ALIGNMENT_COLORS[domain.alignment]?.name}
          </span>
        </div>
      )}
    </div>
  );
}