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
      className={`w-full h-full p-5 rounded layered-panel flex flex-col transition-all duration-300 relative overflow-hidden ${
        isCenter ? 'cursor-pointer' : ''
      }`}
      style={{
        borderColor: isSelected ? `${accent}60` : isCenter ? `${accent}25` : 'rgba(168,85,247,0.12)',
        boxShadow: isSelected ? `0 0 28px ${accent}30, inset 0 1px 0 rgba(255,255,255,0.04)` : 'inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2 relative">
        <div>
          <div className="font-bold text-ui-lg leading-tight" style={{ color: accent, textShadow: `0 0 10px ${accent}40` }}>
            {paradigm.name}
          </div>
          <div className="text-term-faint text-ui-sm mt-0.5">{paradigm.category}</div>
        </div>
        {isSelected && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-term-green text-ui-xs font-bold tracking-[0.15em]">SELECTED</span>
            <Check className="w-5 h-5 text-term-green" />
          </div>
        )}
      </div>

      <div className="mb-2 pb-2 border-b relative" style={{ borderColor: `${accent}20` }}>
        <span className="font-bold text-ui-md" style={{ color: accent }}>{alignmentInfo.name}</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 min-h-0 relative">
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