import React from 'react';
import { ALIGNMENT_COLORS, ALIGNMENT_GLOW, ALIGNMENT_TEXT } from './terminalTheme';

// Card — renders a single card in the cosmic terminal style.
// Glass frame with alignment-tinted depth + top sheen.
// Size tiers scaled up to fill the viewport (desktop-first).
const SIZES = {
  small:  { box: 'w-20 h-28', name: 'text-[9px]',  body: 'text-[7px]',  cat: 'text-[6px]',  label: 'text-[8px]'  },
  medium: { box: 'w-24 h-36', name: 'text-[10px]', body: 'text-[8px]',  cat: 'text-[7px]',  label: 'text-[9px]'  },
  normal: { box: 'w-28 h-40', name: 'text-[11px]', body: 'text-[9px]',  cat: 'text-[7px]',  label: 'text-[10px]' },
  large:  { box: 'w-32 h-48', name: 'text-[13px]', body: 'text-[10px]', cat: 'text-[8px]',  label: 'text-[11px]' },
  xlarge: { box: 'w-60 h-full max-h-[18rem]', name: 'text-[18px]', body: 'text-[13px]', cat: 'text-[10px]', label: 'text-[14px]' },
};

export default function Card({ card, faceDown = false, size = 'normal', onClick, selected = false, disabled = false }) {
  if (!card && !faceDown) return null;

  const s = SIZES[size] || SIZES.normal;

  if (faceDown) {
    return (
      <div className={`${s.box} rounded glass-card flex items-center justify-center relative overflow-hidden`}
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
      className={`${s.box} rounded glass-card cosmic-sheen relative overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${glowClass} ${selected ? 'ring-2 ring-offset-2 ring-offset-[#050308] scale-105' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ borderColor: `${accent}40` }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 3px)' }}
      />

      <div className="p-2 h-full flex flex-col font-mono relative">
        <div className="flex justify-between items-start mb-1">
          <span className={`${textClass} ${s.label} font-bold`}>
            {alignment?.name || '?'}
          </span>
          {card.artUrl && <span className="text-term-dim text-[8px]">[IMG]</span>}
        </div>

        <div className={`${textClass} ${s.name} font-bold leading-tight mb-1 break-words`}>
          {card.name || 'UNNAMED'}
        </div>

        <div className="border-t my-1 relative" style={{ borderColor: `${accent}20` }} />

        <div className={`text-term-text ${s.body} leading-tight flex-1 overflow-hidden break-words`}>
          {card.text || ''}
        </div>

        {card.category && (
          <div className={`text-term-faint ${s.cat} mt-auto truncate`}>
            {card.category.replace(/_/g, ' ').toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}