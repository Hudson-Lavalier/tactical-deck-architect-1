import React, { useRef, useEffect } from 'react';
import { ALIGNMENT_COLORS } from './terminalTheme';
import RichText from '@/components/RichText';

// ItemViewer — full-screen overlay presenting a single card exactly as it
// appears in Card Info (large glass frame, full RichText body).
// Tilt follows the cursor via requestAnimationFrame + direct style mutation
// (no per-mousemove React state → no re-render storm / jank).
export default function ItemViewer({ card, onClose }) {
  const ref = useRef(null);
  const rafRef = useRef(0);
  const targetRef = useRef({ rx: 0, ry: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      rafRef.current = 0;
      const { rx, ry } = targetRef.current;
      el.style.transform = `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    };

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      targetRef.current = { rx: -(py - 0.5) * 14, ry: (px - 0.5) * 14 };
      if (!rafRef.current) rafRef.current = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      targetRef.current = { rx: 0, ry: 0 };
      if (!rafRef.current) rafRef.current = requestAnimationFrame(apply);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!card) return null;

  const alignmentInfo = card.alignment ? ALIGNMENT_COLORS[card.alignment] : null;
  const accent = alignmentInfo?.glow || '#a855f7';

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 font-mono"
      onClick={onClose}
    >
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        className="w-[min(62vw,560px)] h-[min(74vh,660px)] p-6 rounded glass-card cosmic-sheen flex flex-col relative overflow-hidden"
        style={{
          borderColor: `${accent}30`,
          boxShadow: `0 0 44px ${accent}26, inset 0 1px 0 rgba(255,255,255,0.05)`,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-2 relative">
          <div>
            <div className="font-bold text-ui-lg leading-tight" style={{ color: accent, textShadow: `0 0 10px ${accent}40` }}>
              {card.name || 'UNNAMED'}
            </div>
            {alignmentInfo && (
              <div className="text-ui-sm font-bold mt-0.5" style={{ color: accent }}>{alignmentInfo.name}</div>
            )}
          </div>
          {card.subcategory && (
            <div className="text-term-faint text-ui-xs text-right shrink-0">{card.subcategory}</div>
          )}
        </div>

        <div className="border-t my-2 relative" style={{ borderColor: `${accent}20` }} />

        <div className="flex-1 overflow-y-auto pr-1 min-h-0 relative">
          {card.text ? (
            <RichText text={card.text} alignment={card.alignment} />
          ) : (
            <div className="text-term-faint text-ui-md italic">[ NO TEXT DEFINED ]</div>
          )}
        </div>

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