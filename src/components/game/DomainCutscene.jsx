import React from 'react';
import Card from './Card';
import ParticleBurst from './ParticleBurst';
import { ALIGNMENT_COLORS } from './terminalTheme';

export default function DomainCutscene({ card }) {
  if (!card) return null;
  const accent = ALIGNMENT_COLORS[card.alignment]?.glow || '#a855f7';

  return (
    <div className="pointer-events-none fixed inset-0 z-[65] flex items-center justify-center bg-black/60 animate-domain-curtain">
      <div className="absolute inset-0 animate-domain-edge" style={{ boxShadow: `inset 0 0 90px ${accent}` }} />
      <ParticleBurst color={accent} />
      <div className="h-72 animate-domain-slam" style={{ filter: `drop-shadow(0 0 30px ${accent})` }}>
        <Card card={card} size="xlarge" />
      </div>
    </div>
  );
}