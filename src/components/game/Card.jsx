import React from 'react';
import { ALIGNMENT_COLORS, ALIGNMENT_GLOW, ALIGNMENT_TEXT } from './terminalTheme';

// Card component — renders a single card in the retro terminal style.
// Text-and-formatting heavy per the prototype spec.
// Framework supports future PNG art via card.artUrl.
export default function Card({ card, faceDown = false, size = 'normal', onClick, selected = false, disabled = false }) {
  if (!card && !faceDown) return null;

  const sizes = {
    small: 'w-16 h-24 text-[8px]',
    normal: 'w-28 h-40 text-[10px]',
    large: 'w-40 h-56 text-xs',
  };

  const sizeClass = sizes[size] || sizes.normal;

  // Face-down card (hidden info in queue)
  if (faceDown) {
    return (
      <div
        className={`${sizeClass} rounded border border-[#1a1a2e] bg-[#0d0d12] flex items-center justify-center relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(168,85,247,0.1) 2px, rgba(168,85,247,0.1) 4px)' }}
        />
        <span className="text-[#a855f7] font-mono font-bold opacity-40">?</span>
      </div>
    );
  }

  const alignment = card.alignment ? ALIGNMENT_COLORS[card.alignment] : null;
  const glowClass = card.alignment ? ALIGNMENT_GLOW[card.alignment] : '';
  const textClass = card.alignment ? ALIGNMENT_TEXT[card.alignment] : '';

  return (
    <div
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClass} rounded border-2 bg-[#0d0d12] relative overflow-hidden cursor-pointer
        transition-all duration-200 hover:scale-105
        ${glowClass}
        ${selected ? 'ring-2 ring-offset-2 ring-offset-[#000000] ring-[#00ff41] scale-105' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 3px)' }}
      />

      {/* Card content */}
      <div className="p-2 h-full flex flex-col font-mono">
        {/* Header */}
        <div className="flex justify-between items-start mb-1">
          <span className={`${textClass} font-bold`}>
            {alignment?.label || '?'}
          </span>
          {card.artUrl && (
            <span className="text-[#888] text-[8px]">[IMG]</span>
          )}
        </div>

        {/* Card name */}
        <div className={`${textClass} font-bold leading-tight mb-1 break-words`}>
          {card.name || 'UNNAMED'}
        </div>

        {/* Divider */}
        <div className="border-t border-[#1a1a2e] my-1"></div>

        {/* Card text */}
        <div className="text-[#e0e0e0] text-[8px] leading-tight flex-1 overflow-hidden break-words">
          {card.text || ''}
        </div>

        {/* Category footer */}
        {card.category && (
          <div className="text-[#555] text-[7px] mt-auto truncate">
            {card.category.replace(/_/g, ' ').toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}