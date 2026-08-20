import React from 'react';
import Card from '@/components/game/Card';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';
import TwofoldDomain from './TwofoldDomain';

// DomainCenter — the shared domain as the tilted board's centerpiece.
// Radial alignment bloom + faint circuit-node texture behind the card.
// Twofold Reality renders as a small center card flanked by its two
// attached domains with a switch control.
export default function DomainCenter({ domain, modifiers, onDomainClick, domainAttached, onSwitchTwofold, isPlayerTurn, domainPlacedBy }) {
  const accent = domain ? ALIGNMENT_COLORS[domain.alignment]?.glow : '#a855f7';

  if (domain && (domain.effectId || domain.id) === 'twofold_reality') {
    return (
      <TwofoldDomain
        domain={domain}
        domainAttached={domainAttached}
        onDomainClick={onDomainClick}
        onSwitch={onSwitchTwofold}
        isPlayerTurn={isPlayerTurn}
        domainPlacedBy={domainPlacedBy}
      />
    );
  }

  return (
    <div className="relative z-10 flex h-full min-h-0 w-full min-w-0 flex-col items-center gap-1.5 overflow-visible" style={{ '--accent-color': accent }}>
      {domain && <div className="accent-bloom pointer-events-none absolute -inset-[15%] -z-10 rounded-full" />}

      <div className="text-term-text font-mono text-[14px] font-bold tracking-[0.2em]">── SHARED DOMAIN ──</div>

      <div className="grid min-h-0 w-full flex-1 grid-cols-[minmax(0,0.55fr)_minmax(7rem,1fr)_minmax(0,0.55fr)] items-center justify-center gap-1 overflow-visible md:gap-2">
        <div className="flex flex-col gap-1">
          {modifiers?.opponent?.map((mod, i) => (
            <Card key={mod.id || i} card={mod} size="medium" />
          ))}
        </div>

        {domain ? (
          <div className="relative w-full max-w-44 justify-self-center overflow-visible">
            <div className="accent-dot-field pointer-events-none absolute -inset-2 rounded opacity-25" />
            <Card card={domain} size="domain" onClick={() => onDomainClick(domain)} />
          </div>
        ) : (
          <div
            className="game-domain-empty accent-border flex aspect-[5/7] w-full max-w-44 items-center justify-center justify-self-center rounded border border-dashed glass-card"
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
        <div className="text-term-text font-mono text-[12px] font-bold">
          ACTIVE:{' '}
          <span className="accent-text-glow" style={{ color: accent }}>
            {ALIGNMENT_COLORS[domain.alignment]?.name || 'SPECIAL'}
          </span>
        </div>
      )}
    </div>
  );
}