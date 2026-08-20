import React from 'react';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

// Name-based alignment fallback map for all 9 paradigm constructs
const PARADIGM_COLOR_MAP = {
  // Grounding Paradigms (Green)
  empiricism: ALIGNMENT_COLORS.A,
  foundationalism: ALIGNMENT_COLORS.A,
  infallibilism: ALIGNMENT_COLORS.A,

  // System Paradigms (Cyan)
  rationalism: ALIGNMENT_COLORS.B,
  coherentism: ALIGNMENT_COLORS.B,
  fallibilism: ALIGNMENT_COLORS.B,

  // Adaptation Paradigms (Purple)
  pragmatism: ALIGNMENT_COLORS.C,
  infinitism: ALIGNMENT_COLORS.C,
  contextualism: ALIGNMENT_COLORS.C,
};

function getParadigmInfo(paradigm) {
  if (paradigm?.alignment && ALIGNMENT_COLORS[paradigm.alignment]) {
    return ALIGNMENT_COLORS[paradigm.alignment];
  }
  const key = (paradigm?.id || paradigm?.name || '').toLowerCase();
  return PARADIGM_COLOR_MAP[key] || ALIGNMENT_COLORS.C;
}

export default function ParadigmCarouselCard({ paradigm, isCenter, isSelected, onClick }) {
  const alignmentInfo = getParadigmInfo(paradigm);
  const accent = alignmentInfo?.glow || '#a855f7';

  return (
    <div
      onClick={onClick}
      className={`game-card-premium holo-frame relative flex h-full max-h-[460px] w-full max-w-[320px] cursor-pointer flex-col overflow-hidden break-words rounded-2xl border border-t-white/20 bg-cosmic-deep/90 p-5 backdrop-blur-xl transition-all duration-300 ${
        isSelected ? 'ring-2 ring-offset-2 ring-offset-[#050308]' : ''
      }`}
      style={{
        '--accent-color': accent,
        boxShadow: isSelected
          ? `0 0 32px ${accent}50, inset 0 1px 0 rgba(255,255,255,0.2)`
          : isCenter
          ? `0 0 20px ${accent}20`
          : 'none',
      }}
    >
      {/* Header Alignment Badge */}
      <div className="flex items-center justify-between">
        <span
          className="rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ borderColor: `${accent}50`, backgroundColor: `${accent}15`, color: accent }}
        >
          {alignmentInfo?.name || 'Construct'}
        </span>
        {isSelected && (
          <span className="animate-pulse font-mono text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>
            ● EQUIPPED
          </span>
        )}
      </div>

      {/* Central Concept Block */}
      <div className="relative my-4 flex min-h-28 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-cosmic-deep/80 p-4 text-center">
        <div className="game-card-grid pointer-events-none absolute inset-0 opacity-40" />
        <div
          className="relative z-10 text-lg font-bold uppercase leading-tight tracking-[0.08em]"
          style={{ color: accent, textShadow: `0 0 12px ${accent}50` }}
        >
          {paradigm.name}
        </div>
      </div>

      {/* Mechanics / Lore Description */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-white/10 bg-cosmic-deep/55 p-3 text-xs leading-relaxed text-term-text">
        {paradigm.description || paradigm.text || 'No description available for this construct.'}
      </div>

      {/* Footer Select Button */}
      <button
        className="mt-4 w-full rounded-lg border py-2 text-xs font-bold uppercase tracking-[0.16em] transition-all hover:-translate-y-0.5"
        style={{
          borderColor: `${accent}60`,
          backgroundColor: isSelected ? accent : `${accent}15`,
          color: isSelected ? '#020617' : accent,
        }}
      >
        {isSelected ? 'SELECTED' : 'SELECT & INSPECT'}
      </button>
    </div>
  );
}