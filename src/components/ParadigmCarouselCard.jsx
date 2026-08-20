import React from 'react';
import { Check } from 'lucide-react';
import RichText from '@/components/RichText';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

// ParadigmCarouselCard — glass paradigm card for the drill-down carousel.
export default function ParadigmCarouselCard({ paradigm, isCenter, isSelected, onClick }) {
  if (!paradigm) return null;
  const alignmentInfo = ALIGNMENT_COLORS[paradigm.alignment];
  const accent = alignmentInfo.glow;

  return (
    <div
      onClick={isCenter ? onClick : undefined}
      className={`game-card-premium holo-frame accent-border relative flex h-full max-h-[460px] w-full max-w-[320px] flex-col overflow-hidden break-words rounded-2xl border border-t-white/20 bg-slate-950 p-5 opacity-100 transition-all duration-300 ${isCenter ? 'pointer-events-auto cursor-pointer' : ''} ${isSelected ? 'animate-selection-pulse' : ''}`}
      style={{ '--accent-color': accent }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2 relative">
        <div>
          <div className="accent-text-glow max-w-full truncate text-base font-bold uppercase leading-tight tracking-[0.05em] md:text-lg" style={{ color: accent }}>
            {paradigm.name}
          </div>
          <div className="mt-0.5 truncate text-[10px] font-bold uppercase text-term-faint md:text-xs">{paradigm.category}</div>
        </div>
        {isSelected && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-term-green text-ui-xs font-bold tracking-[0.15em]">SELECTED</span>
            <Check className="w-5 h-5 text-term-green" />
          </div>
        )}
      </div>

      <div className="accent-border-soft relative mb-2 border-b pb-2">
        <span className="font-bold text-ui-md" style={{ color: accent }}>{alignmentInfo.name}</span>
      </div>

      <div className="relative min-h-0 max-h-[220px] flex-1 overflow-y-auto break-words pr-1 text-xs leading-normal md:text-sm">
        <RichText text={paradigm.text} alignment={paradigm.alignment} />
      </div>

      {isCenter && !isSelected && (
        <div className="text-center text-term-green text-ui-sm mt-2 pt-2 border-t border-term-green/15 font-bold tracking-[0.15em] relative">
          [ CLICK TO SELECT ]
        </div>
      )}
      {isCenter && isSelected && (
        <div className="text-center text-term-faint text-ui-sm mt-2 pt-2 border-t border-term-purple/15 font-bold tracking-[0.15em] relative">
          [ SELECTED — CLICK ANOTHER TO REPLACE ]
        </div>
      )}
    </div>
  );
}