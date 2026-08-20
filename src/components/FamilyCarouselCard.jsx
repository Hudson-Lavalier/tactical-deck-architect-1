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
      className={`game-card-premium holo-frame relative flex h-full max-h-[460px] w-full max-w-[320px] cursor-pointer flex-col overflow-hidden break-words rounded-2xl border border-t-white/20 bg-cosmic-deep/90 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 ${
        isCenter ? 'ring-1 ring-white/30' : ''
      }`}
      style={{
        '--accent-color': accent,
        boxShadow: isCenter
          ? `0 0 32px ${accent}45, inset 0 1px 0 rgba(255,255,255,0.18)`
          : `0 0 16px ${accent}20`,
      }}
    >
      {/* Top Family Header */}
      <div className="flex items-start justify-between border-b pb-3" style={{ borderColor: `${accent}35` }}>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
            {theme.label}
          </div>
          <div className="mt-0.5 text-base font-bold uppercase tracking-[0.1em] text-term-text" style={{ textShadow: `0 0 10px ${accent}50` }}>
            {family.name}
          </div>
        </div>
        {hasSelection ? (
          <div className="rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em]" style={{ borderColor: accent, backgroundColor: `${accent}25`, color: accent }}>
            ● EQUIPPED
          </div>
        ) : (
          <div className="rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-term-faint" style={{ borderColor: `${accent}30` }}>
            SELECT
          </div>
        )}
      </div>

      {/* Description */}
      <div className="my-3 text-xs leading-relaxed text-term-dim">
        {family.description || 'Click to browse paradigms and lock in a construct for this branch.'}
      </div>

      {/* Sub-Paradigm Construct Badges */}
      <div className="mt-auto flex min-h-0 flex-1 flex-col justify-end gap-2 pt-2">
        <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-term-faint">Branch Constructs</div>
        <div className="flex flex-col gap-1.5">
          {paradigms.map((p) => {
            const alignInfo = p.alignment ? ALIGNMENT_COLORS[p.alignment] : null;
            const pColor = alignInfo?.glow || accent;
            const isSelected = selectedParadigmId === p.id;

            return (
              <div
                key={p.id || p.name}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-all ${
                  isSelected ? 'bg-white/10 font-bold' : 'bg-cosmic-deep/60'
                }`}
                style={{
                  borderColor: isSelected ? pColor : `${pColor}35`,
                  boxShadow: isSelected ? `0 0 12px ${pColor}40` : 'none',
                }}
              >
                <span style={{ color: pColor, textShadow: isSelected ? `0 0 8px ${pColor}50` : 'none' }}>
                  {p.name}
                </span>
                {alignInfo && (
                  <span className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: pColor }}>
                    [{alignInfo.name}]
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Call-to-Action Footer */}
      <div
        className="mt-4 flex w-full items-center justify-center rounded-lg border py-2 text-xs font-bold uppercase tracking-[0.16em] transition-all group-hover:brightness-125"
        style={{
          borderColor: `${accent}50`,
          backgroundColor: `${accent}15`,
          color: accent,
        }}
      >
        BROWSE {family.name.toUpperCase()} ➔
      </div>
    </div>
  );
}