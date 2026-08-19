import React, { useRef, useState } from 'react';
import { ALIGNMENT_COLORS } from './terminalTheme';
import RichText from '@/components/RichText';

// ItemViewer — full-screen overlay presenting a single card exactly as it
// appears in the Card Info screen (large glass frame, full RichText body),
// with a 3D tilt that follows the cursor for an "item viewer" feel.
export default function ItemViewer({ card, onClose }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState('perspective(1200px) rotateX(0deg) rotateY(0deg)');

  if (!card) return null;

  const alignmentInfo = card.alignment ? ALIGNMENT_COLORS[card.alignment] : null;
  const accent = alignmentInfo?.glow || '#a855f7';

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;  // 0..1
    const py = (e.clientY - rect.top) / rect.height;  // 0..1
    const rotY = (px - 0.5) * 18;   // -9..9
    const rotX = -(py - 0.5) * 18;  // -9..9
    setTransform(`perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`);
  };

  const handleLeave = () => setTransform('perspective(1200px) rotateX(0deg) rotateY(0deg)');

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 font-mono"
      onClick={onClose}
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={(e) => e.stopPropagation()}
        className="w-[min(62vw,560px)] h-[min(74vh,660px)] p-6 rounded glass-card cosmic-sheen flex flex-col relative overflow-hidden transition-[transform,box-shadow] duration-150 ease-out cursor-default"
        style={{
          borderColor: `${accent}30`,
          boxShadow: `0 0 44px ${accent}26, inset 0 1px 0 rgba(255,255,255,0.05)`,
          transform,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-2 relative">
          <div>
            <div className="font-bold text-ui-lg leading-tight" style={{ color: accent, textShadow: `0 0 10px ${accent}40` }}>
              {card.name || 'UNNAMED'}
            </div>
            {alignmentInfo && (
              <div className="text-ui-sm font-bold mt-0.5" style={{ color: accent }}>
                {alignmentInfo.name}
              </div>
            )}
          </div>
          {card.subcategory && (
            <div className="text-term-faint text-ui-xs text-right shrink-0">{card.subcategory}</div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t my-2 relative" style={{ borderColor: `${accent}20` }} />

        {/* Full card text — scrollable */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-0 relative">
          {card.text ? (
            <RichText text={card.text} alignment={card.alignment} />
          ) : (
            <div className="text-term-faint text-ui-md italic">[ NO TEXT DEFINED ]</div>
          )}
        </div>

        {/* Category footer */}
        {card.category && (
          <div className="text-term-faint text-ui-xs mt-2 pt-2 border-t relative" style={{ borderColor: `${accent}15` }}>
            {card.category.replace(/_/g, ' ').toUpperCase()}
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-term-faint hover:text-term-text text-ui-xs font-bold transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}