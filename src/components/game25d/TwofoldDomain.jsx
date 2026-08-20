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
    <div className="flex flex-col items-center gap-1.5 relative shrink-0 h-full min-h-0">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24rem] h-[24rem] rounded-full pointer-events-none -z-10"
        style={{ background: `radial-gradient(circle, ${accent}28, transparent 70%)` }}
      />

      <div className="text-term-text font-mono text-[14px] font-bold tracking-[0.2em]">── TWOFOLD DOMAIN ──</div>

      <div className="flex items-center justify-center gap-3 flex-1 min-h-0">
        {/* Left attached (Grounding) */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-term-faint font-mono text-[9px] tracking-[0.15em]">LEFT · GROUNDING</div>
          {attached.left ? (
            <div className={`relative ${attached.activeSide === 'left' ? '' : 'opacity-60'}`}>
              {attached.activeSide === 'left' && (
                <div className="absolute -inset-1 rounded pointer-events-none" style={{ boxShadow: `0 0 14px ${ALIGNMENT_COLORS.A.glow}80` }} />
              )}
              <Card card={attached.left} size="medium" onClick={onDomainClick} />
            </div>
          ) : (
            <div className="w-24 h-36 rounded glass-card flex items-center justify-center" style={{ borderColor: 'rgba(0,255,65,0.2)', borderStyle: 'dashed' }}>
              <span className="text-term-faint font-mono text-[10px]">[ A ]</span>
            </div>
          )}
        </div>

        {/* Center — small Twofold card */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-term-faint font-mono text-[9px] tracking-[0.15em]">TWOFOLD</div>
          <Card card={domain} size="small" onClick={onDomainClick} />
        </div>

        {/* Right attached (System) */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-term-faint font-mono text-[9px] tracking-[0.15em]">RIGHT · SYSTEM</div>
          {attached.right ? (
            <div className={`relative ${attached.activeSide === 'right' ? '' : 'opacity-60'}`}>
              {attached.activeSide === 'right' && (
                <div className="absolute -inset-1 rounded pointer-events-none" style={{ boxShadow: `0 0 14px ${ALIGNMENT_COLORS.B.glow}80` }} />
              )}
              <Card card={attached.right} size="medium" onClick={onDomainClick} />
            </div>
          ) : (
            <div className="w-24 h-36 rounded glass-card flex items-center justify-center" style={{ borderColor: 'rgba(0,255,255,0.2)', borderStyle: 'dashed' }}>
              <span className="text-term-faint font-mono text-[10px]">[ B ]</span>
            </div>
          )}
        </div>
      </div>

      {/* Switch control */}
      <button
        onClick={onSwitch}
        disabled={!canSwitch}
        className="px-3 py-1.5 rounded text-ui-xs font-bold glass-card cosmic-sheen transition-[transform,box-shadow] hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: `${accent}40`, color: accent }}
      >
        SWITCH DOMAIN ({switchesLeft}/2){!canSwitch && switchesLeft === 0 ? ' — USED' : ''}
      </button>
    </div>
  );
}