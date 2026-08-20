import React from 'react';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

function getFamilyTheme(family) {
  const key = (family?.id || family?.name || '').toLowerCase();
  if (key.includes('knowledge') || key.includes('epistemology')) {
    return { color: '#00ffff', label: 'System Domain' };
  }
  if (key.includes('structure') || key.includes('justification')) {
    return { color: '#00ff41', label: 'Grounding Domain' };
  }
  if (key.includes('orientation') || key.includes('inquiry')) {
    return { color: '#a855f7', label: 'Adaptation Domain' };
  }
  return { color: '#a855f7', label: 'Cosmic Domain' };
}

export default function FamilyCarouselCard({ family, paradigms = [], selectedParadigmId, isCenter }) {
  const theme = getFamilyTheme(family);
  const accent = theme.color;
  const hasSelection = Boolean(selectedParadigmId);

  return (
    <div
      className={`group game-card-premium holo-frame relative flex h-full max-h-[460px] w-full max-w-[320px] cursor-pointer flex-col overflow-hidden break-words rounded-2xl border border-t-white/20 bg-cosmic-deep/90 p-4 backdrop-blur-xl transition-all duration-300 ${
        isCenter ? 'ring-1 ring-white/20' : ''
      }`}
      style={{
        '--accent-color': accent,
        boxShadow: 'none',
      }}
    >
      {/* Radial Hover Fill */}
      <div
        className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${accent}33 0%, rgba(12, 10, 20, 0.95) 85%)`,
        }}
      />

      {/* 1. Top Header Badge Row */}
      <div className="relative z-10 flex min-w-0 items-center justify-between gap-2">
        <span
          className="rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ borderColor: `${accent}50`, backgroundColor: `${accent}15`, color: accent }}
        >
          {theme.label}
        </span>
        {hasSelection ? (
          <span className="animate-pulse font-mono text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>
            ● EQUIPPED
          </span>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-term-faint">
            {paradigms.length} CONSTRUCTS
          </span>
        )}
      </div>

      {/* 2. Central Concept Block (Matching Paradigm & CardInfo) */}
      <div className="game-card-concept relative z-10 my-3 flex min-h-24 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-cosmic-deep/80 px-3 py-4 text-center">
        <div className="game-card-grid pointer-events-none absolute inset-0 opacity-40" />
        <div
          className="relative z-10 max-w-full text-base font-bold uppercase leading-tight tracking-[0.06em] md:text-lg"
          style={{ color: accent }}
        >
          {family.name}
        </div>
      </div>

      {/* 3. Description & Branch Constructs Box */}
      <div className="cyber-richtext relative z-10 flex min-h-0 flex-1 flex-col justify-between overflow-y-auto break-words rounded-xl border border-white/10 bg-cosmic-deep/55 p-3 text-xs leading-normal">
        <div className="mb-2 text-term-dim leading-relaxed">
          {family.description || 'Select a paradigm construct from this philosophical branch.'}
        </div>

        <div className="flex flex-col gap-1 border-t border-white/10 pt-2">
          {paradigms.map((p) => {
            const alignInfo = p.alignment ? ALIGNMENT_COLORS[p.alignment] : null;
            const pColor = alignInfo?.glow || accent;
            const isSelected = selectedParadigmId === p.id;

            return (
              <div
                key={p.id || p.name}
                className={`flex items-center justify-between rounded px-2 py-1 text-[11px] ${
                  isSelected ? 'bg-white/10 font-bold' : ''
                }`}
                style={{ color: pColor }}
              >
                <span>{p.name}</span>
                {alignInfo && <span className="text-[9px] opacity-75">[{alignInfo.name}]</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Footer Action Button */}
      <button
        className="relative z-10 mt-3 w-full rounded-lg border py-2 text-xs font-bold uppercase tracking-[0.16em] transition-all"
        style={{
          borderColor: `${accent}60`,
          backgroundColor: `${accent}15`,
          color: accent,
        }}
      >
        BROWSE {family.name.toUpperCase()} ➔
      </button>
    </div>
  );
}