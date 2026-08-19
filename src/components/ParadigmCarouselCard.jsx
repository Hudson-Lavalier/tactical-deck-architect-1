import React from 'react';
import { Check } from 'lucide-react';
import RichText from '@/components/RichText';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

// ParadigmCarouselCard — a paradigm card for the 3D carousel.
// Shows the paradigm name, type, category, selection indicator, and full scrollable text.
// isSelected = true when this paradigm is the one chosen for its family.
export default function ParadigmCarouselCard({ paradigm, isCenter, isSelected, onClick }) {
  if (!paradigm) return null;
  const alignmentInfo = ALIGNMENT_COLORS[paradigm.alignment];

  return (
    <div
      onClick={isCenter ? onClick : undefined}
      className={`w-full h-full p-6 border-2 rounded flex flex-col transition-all duration-300 ${
        isSelected
          ? 'border-term-green shadow-[0_0_30px_rgba(0,255,65,0.3)] bg-term-card'
          : 'border-term-border bg-term-card'
      } ${isCenter ? 'cursor-pointer hover:border-term-border-hover' : ''}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-ui-xl" style={{ color: alignmentInfo.glow }}>
            {paradigm.name}
          </div>
          <div className="text-term-faint text-ui-sm mt-1">{paradigm.category}</div>
        </div>
        {isSelected && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-term-green text-ui-sm font-bold tracking-wider">SELECTED</span>
            <Check className="w-6 h-6 text-term-green" />
          </div>
        )}
      </div>

      {/* Type indicator */}
      <div className="mb-3 pb-3 border-b border-term-border">
        <span className="font-bold text-ui-md" style={{ color: alignmentInfo.glow }}>
          {alignmentInfo.name}
        </span>
      </div>

      {/* Full text — scrollable */}
      <div className="flex-1 overflow-y-auto pr-1 min-h-0">
        <RichText text={paradigm.text} alignment={paradigm.alignment} />
      </div>

      {/* Click hint */}
      {isCenter && !isSelected && (
        <div className="text-center text-term-green text-ui-sm mt-3 pt-3 border-t border-term-border font-bold tracking-wider">
          [ CLICK TO SELECT ]
        </div>
      )}
      {isCenter && isSelected && (
        <div className="text-center text-term-faint text-ui-sm mt-3 pt-3 border-t border-term-border font-bold tracking-wider">
          [ SELECTED — CLICK ANOTHER TO REPLACE ]
        </div>
      )}
    </div>
  );
}