import React from 'react';
import Card from '@/components/game/Card';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

// TwofoldDomain — special rendering for the Twofold Reality domain.
// A small center card (Twofold Reality) flanked by its two attached domain
// cards (left / right). A SWITCH control under the domain shows switches
// remaining this turn and opens the side-selection modal.
export default function TwofoldDomain({ domain, domainAttached, onDomainClick, onSwitch, isPlayerTurn, domainPlacedBy }) {
  const accent = ALIGNMENT_COLORS[domain.alignment]?.glow || '#a855f7';
  const attached = domainAttached || { left: null, right: null, activeSide: null, switchesThisTurn: 0 };
  const switchesLeft = Math.max(0, 2 - (attached.switchesThisTurn || 0));
  const canSwitch = isPlayerTurn && domainPlacedBy === 'player' && switchesLeft > 0;

  return (
    <div className="relative z-10 mx-auto flex h-full min-h-0 w-full min-w-0 flex-col items-center justify-center gap-1.5 overflow-visible" style={{ '--accent-color': accent }}>
      <div className="hud-kicker text-center font-mono text-[12px] font-bold uppercase tracking-[0.25em] text-term-text">Twofold Domain</div>

      <div className="grid min-h-0 w-full flex-1 grid-cols-[minmax(0,1fr)_minmax(3.5rem,0.7fr)_minmax(0,1fr)] items-center justify-center gap-1 overflow-visible md:gap-2">
        {/* Left attached (Grounding) */}
        <div className="flex w-full min-w-0 flex-col items-center gap-1">
          <div className="text-center font-mono text-[9px] tracking-[0.15em] text-term-faint">LEFT · GROUNDING</div>
          {attached.left ? (
            <div className={`relative z-20 mx-auto aspect-[5/7] w-full max-w-24 overflow-visible ${attached.activeSide === 'left' ? 'opacity-100' : 'opacity-70'}`}>
              {attached.activeSide === 'left' && (
                <div className="accent-halo pointer-events-none absolute -inset-1 rounded" style={{ '--accent-color': ALIGNMENT_COLORS.A.glow }} />
              )}
              <Card card={attached.left} size="medium" onClick={() => onDomainClick(attached.left)} />
            </div>
          ) : (
            <div className="game-persistent-empty holo-slot flex aspect-[5/7] w-full max-w-24 items-center justify-center rounded-xl" style={{ '--accent-color': ALIGNMENT_COLORS.A.glow }}>
              <span className="holo-slot-core font-mono text-[9px] font-bold uppercase tracking-[0.16em]">Grounding socket</span>
            </div>
          )}
        </div>

        {/* Center — small Twofold card */}
        <div className="flex w-full min-w-0 flex-col items-center gap-1">
          <div className="text-center font-mono text-[9px] tracking-[0.15em] text-term-faint">TWOFOLD</div>
          <div className="game-domain-card relative z-20 mx-auto aspect-[5/7] w-full max-w-20 overflow-visible opacity-100">
            <Card card={domain} size="small" onClick={() => onDomainClick(domain)} />
          </div>
        </div>

        {/* Right attached (System) */}
        <div className="flex w-full min-w-0 flex-col items-center gap-1">
          <div className="text-center font-mono text-[9px] tracking-[0.15em] text-term-faint">RIGHT · SYSTEM</div>
          {attached.right ? (
            <div className={`relative z-20 mx-auto aspect-[5/7] w-full max-w-24 overflow-visible ${attached.activeSide === 'right' ? 'opacity-100' : 'opacity-70'}`}>
              {attached.activeSide === 'right' && (
                <div className="accent-halo pointer-events-none absolute -inset-1 rounded" style={{ '--accent-color': ALIGNMENT_COLORS.B.glow }} />
              )}
              <Card card={attached.right} size="medium" onClick={() => onDomainClick(attached.right)} />
            </div>
          ) : (
            <div className="game-persistent-empty holo-slot flex aspect-[5/7] w-full max-w-24 items-center justify-center rounded-xl" style={{ '--accent-color': ALIGNMENT_COLORS.B.glow }}>
              <span className="holo-slot-core font-mono text-[9px] font-bold uppercase tracking-[0.16em]">System socket</span>
            </div>
          )}
        </div>
      </div>

      {/* Switch control */}
      <button
        onClick={onSwitch}
        disabled={!canSwitch}
        className="accent-border hud-control rounded-lg px-3 py-1.5 text-ui-xs font-bold uppercase tracking-[0.16em] glass-card cosmic-sheen transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ color: accent }}
      >
        SWITCH DOMAIN ({switchesLeft}/2){!canSwitch && switchesLeft === 0 ? ' — USED' : ''}
      </button>
    </div>
  );
}