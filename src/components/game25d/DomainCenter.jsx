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
    <div className="relative z-10 mx-auto flex h-full min-h-0 w-full min-w-0 flex-col items-center justify-center gap-1.5 overflow-visible" style={{ '--accent-color': accent }}>
      <div className="hud-kicker text-center font-mono text-[12px] font-bold uppercase tracking-[0.25em] text-term-text">Shared Domain</div>

      <div className="grid min-h-0 w-full flex-1 grid-cols-[minmax(0,0.55fr)_minmax(7rem,1fr)_minmax(0,0.55fr)] items-center justify-center gap-1 overflow-visible md:gap-2">
        <div className="flex min-w-0 flex-col items-center justify-center gap-1">
          {modifiers?.opponent?.map((mod, i) => (
            <Card key={mod.id || i} card={mod} size="medium" />
          ))}
        </div>

        {domain ? (
          <div className="game-domain-card relative z-20 mx-auto aspect-[5/7] w-full max-w-44 justify-self-center overflow-visible opacity-100">
            <div className="accent-dot-field pointer-events-none absolute -inset-2 rounded opacity-20" />
            <Card card={domain} size="domain" onClick={() => onDomainClick(domain)} />
          </div>
        ) : (
          <div
            className="game-domain-empty holo-slot accent-border mx-auto flex aspect-[5/7] w-full max-w-44 items-center justify-center justify-self-center rounded-xl"
          >
            <div className="text-center">
              <div className="holo-slot-core font-mono text-xs font-bold uppercase tracking-[0.22em]">Domain Socket</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-term-faint">Awaiting construct</div>
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-col items-center justify-center gap-1">
          {modifiers?.player?.map((mod, i) => (
            <Card key={mod.id || i} card={mod} size="medium" />
          ))}
        </div>
      </div>

      {domain && (
        <div className="hud-status font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-term-faint">
          Active matrix ·{' '}
          <span className="accent-text-glow" style={{ color: accent }}>
            {ALIGNMENT_COLORS[domain.alignment]?.name || 'SPECIAL'}
          </span>
        </div>
      )}
    </div>
  );
}