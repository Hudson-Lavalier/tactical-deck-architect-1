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
    <div className="relative z-10 flex h-full min-h-0 w-full min-w-0 flex-col items-center gap-1.5 overflow-visible" style={{ '--accent-color': accent }}>
      <div className="accent-bloom pointer-events-none absolute -inset-[15%] -z-10 rounded-full" />

      <div className="text-term-text font-mono text-[14px] font-bold tracking-[0.2em]">── TWOFOLD DOMAIN ──</div>

      <div className="grid min-h-0 w-full flex-1 grid-cols-[minmax(0,1fr)_minmax(3.5rem,0.7fr)_minmax(0,1fr)] items-center justify-center gap-1 overflow-visible md:gap-2">
        {/* Left attached (Grounding) */}
        <div className="flex w-full min-w-0 flex-col items-center gap-1">
          <div className="text-center font-mono text-[9px] tracking-[0.15em] text-term-faint">LEFT · GROUNDING</div>
          {attached.left ? (
            <div className={`relative w-full max-w-24 ${attached.activeSide === 'left' ? '' : 'opacity-60'}`}>
              {attached.activeSide === 'left' && (
                <div className="accent-halo pointer-events-none absolute -inset-1 rounded" style={{ '--accent-color': ALIGNMENT_COLORS.A.glow }} />
              )}
              <Card card={attached.left} size="medium" onClick={() => onDomainClick(attached.left)} />
            </div>
          ) : (
            <div className="game-persistent-empty flex aspect-[5/7] w-full max-w-24 items-center justify-center rounded border-dashed glass-card" style={{ borderColor: 'rgba(0,255,65,0.2)' }}>
              <span className="text-term-faint font-mono text-[10px]">[ A ]</span>
            </div>
          )}
        </div>

        {/* Center — small Twofold card */}
        <div className="flex w-full min-w-0 flex-col items-center gap-1">
          <div className="text-center font-mono text-[9px] tracking-[0.15em] text-term-faint">TWOFOLD</div>
          <div className="w-full max-w-20">
            <Card card={domain} size="small" onClick={() => onDomainClick(domain)} />
          </div>
        </div>

        {/* Right attached (System) */}
        <div className="flex w-full min-w-0 flex-col items-center gap-1">
          <div className="text-center font-mono text-[9px] tracking-[0.15em] text-term-faint">RIGHT · SYSTEM</div>
          {attached.right ? (
            <div className={`relative w-full max-w-24 ${attached.activeSide === 'right' ? '' : 'opacity-60'}`}>
              {attached.activeSide === 'right' && (
                <div className="accent-halo pointer-events-none absolute -inset-1 rounded" style={{ '--accent-color': ALIGNMENT_COLORS.B.glow }} />
              )}
              <Card card={attached.right} size="medium" onClick={() => onDomainClick(attached.right)} />
            </div>
          ) : (
            <div className="game-persistent-empty flex aspect-[5/7] w-full max-w-24 items-center justify-center rounded border-dashed glass-card" style={{ borderColor: 'rgba(0,255,255,0.2)' }}>
              <span className="text-term-faint font-mono text-[10px]">[ B ]</span>
            </div>
          )}
        </div>
      </div>

      {/* Switch control */}
      <button
        onClick={onSwitch}
        disabled={!canSwitch}
        className="accent-border rounded px-3 py-1.5 text-ui-xs font-bold glass-card cosmic-sheen transition-[transform,box-shadow] hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ color: accent }}
      >
        SWITCH DOMAIN ({switchesLeft}/2){!canSwitch && switchesLeft === 0 ? ' — USED' : ''}
      </button>
    </div>
  );
}