import React from 'react';
import { ALIGNMENT_COLORS, ALIGNMENT_GLOW, ALIGNMENT_TEXT } from './terminalTheme';

// Card — renders a single card in the cosmic terminal style.
// Glass frame with alignment-tinted depth + top sheen.
export default function Card({ card, faceDown = false, size = 'normal', onClick, selected = false, disabled = false }) {
  if (!card && !faceDown) return null;

  const sizes = {
    small: 'w-16 h-24 text-[8px]',
    normal: 'w-28 h-40 text-[10px]',
    large: 'w-40 h-56 text-xs',
  };

  const sizeClass = sizes[size] || sizes.normal;

  if (faceDown) {
    return (
      <div className={`${sizeClass} rounded glass-card flex items-center justify-center relative overflow-hidden`}
        style={{ borderColor: 'rgba(168,85,247,0.2)' }}
      >
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(168,85,247,0.12) 2px, rgba(168,85,247,0.12) 4px)' }}
        />
        <span className="text-term-purple font-mono font-bold opacity-40">?</span>
      </div>
    );
  }

  const alignment = card.alignment ? ALIGNMENT_COLORS[card.alignment] : null;
  const glowClass = card.alignment ? ALIGNMENT_GLOW[card.alignment] : '';
  const textClass = card.alignment ? ALIGNMENT_TEXT[card.alignment] : '';
  const accent = alignment?.glow || '#a855f7';

  return (
    <div
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClass} rounded glass-card cosmic-sheen relative overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${glowClass} ${selected ? 'ring-2 ring-offset-2 ring-offset-[#050308] scale-105' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ borderColor: `${accent}40` }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 3px)' }}
      />

      <div className="p-2 h-full flex flex-col font-mono relative">
        <div className="flex justify-between items-start mb-1">
          <span className={`${textClass} font-bold`}>
            {alignment?.name || '?'}
          </span>
          {card.artUrl && <span className="text-term-dim text-[8px]">[IMG]</span>}
        </div>

        <div className={`${textClass} font-bold leading-tight mb-1 break-words`}>
          {card.name || 'UNNAMED'}
        </div>

        <div className="border-t my-1 relative" style={{ borderColor: `${accent}20` }} />

        <div className="text-term-text text-[8px] leading-tight flex-1 overflow-hidden break-words">
          {card.text || ''}
        </div>

        {card.category && (
          <div className="text-term-faint text-[7px] mt-auto truncate">
            {card.category.replace(/_/g, ' ').toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}