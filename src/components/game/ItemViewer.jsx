import React, { useEffect, useRef } from 'react';
import { ALIGNMENT_COLORS } from './terminalTheme';
import RichText from '@/components/RichText';

export default function ItemViewer({ card, onClose, onSelect, selectLabel, isSelected }) {
  const cardRef = useRef(null);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const motionRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const boundsRef = useRef(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const rawDelta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      // Clamped delta step prevents sudden jumps across tab backgrounding or lag spikes
      const delta = Math.min(Math.max(rawDelta, 0.001), 0.1);

      // Frame-rate independent exponential decay lerp factor
      const lerpFactor = 1 - Math.exp(-14 * delta);

      const motion = motionRef.current;
      motion.currentX += (motion.targetX - motion.currentX) * lerpFactor;
      motion.currentY += (motion.targetY - motion.currentY) * lerpFactor;

      element.style.transform = `perspective(1200px) translate3d(0, 0, 0) rotateX(${motion.currentX}deg) rotateY(${motion.currentY}deg)`;
      const moving = Math.abs(motion.targetX - motion.currentX) > 0.02 || Math.abs(motion.targetY - motion.currentY) > 0.02;
      if (moving) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        frameRef.current = 0;
        lastTimeRef.current = 0;
      }
    };

    const start = () => {
      if (!frameRef.current) {
        lastTimeRef.current = performance.now();
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    const onEnter = () => {
      boundsRef.current = element.getBoundingClientRect();
    };
    const onMove = (event) => {
      const bounds = boundsRef.current;
      if (!bounds) return;
      motionRef.current.targetY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 7;
      motionRef.current.targetX = -((event.clientY - bounds.top) / bounds.height - 0.5) * 7;
      start();
    };
    const onLeave = () => {
      motionRef.current.targetX = 0;
      motionRef.current.targetY = 0;
      start();
    };

    element.addEventListener('pointerenter', onEnter);
    element.addEventListener('pointermove', onMove, { passive: true });
    element.addEventListener('pointerleave', onLeave);
    return () => {
      element.removeEventListener('pointerenter', onEnter);
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', onLeave);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  if (!card) return null;
  const alignment = card.alignment ? ALIGNMENT_COLORS[card.alignment] : null;
  const accent = alignment?.glow || '#a855f7';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-5 font-mono backdrop-blur-sm" onClick={onClose}>
      <div
        ref={cardRef}
        onClick={(event) => event.stopPropagation()}
        className="holo-frame cyber-panel accent-border relative flex h-[min(82vh,740px)] w-[min(68vw,620px)] flex-col overflow-hidden rounded-2xl border border-t-white/20 bg-cosmic-deep/90 p-8 backdrop-blur-xl"
        style={{ '--accent-color': accent, transformStyle: 'preserve-3d' }}
      >
        <div className="accent-border-soft flex items-start justify-between border-b pb-4">
          <div>
            {alignment && <div className="hud-kicker text-ui-xs font-bold uppercase tracking-[0.22em] text-term-faint">{alignment.name} construct</div>}
            <div className="accent-text-glow mt-2 text-2xl font-bold uppercase leading-tight tracking-[0.06em]" style={{ color: accent }}>{card.name || 'UNNAMED'}</div>
          </div>
          <div className="pr-12 text-right text-ui-xs font-bold uppercase tracking-[0.14em] text-term-faint">{card.category?.replace(/_/g, ' ')}</div>
        </div>

        <div className="cyber-richtext min-h-0 flex-1 overflow-y-auto py-6 pr-2">
          {card.text || card.description ? (
            <RichText text={card.text || card.description} alignment={card.alignment} className="text-[15px]" />
          ) : (
            <div className="text-ui-md italic text-term-faint">[ NO TEXT DEFINED ]</div>
          )}
        </div>

        {onSelect && (
          <div className="accent-border-soft flex items-center justify-between border-t pt-4">
            <div className="text-ui-xs font-bold uppercase tracking-[0.15em] text-term-faint">
              {isSelected ? '● CURRENTLY EQUIPPED IN BUILD' : '○ READY TO EQUIP'}
            </div>
            <button
              onClick={() => onSelect(card)}
              className={`hud-control rounded-lg px-6 py-2.5 text-ui-sm font-bold uppercase tracking-[0.16em] transition-all hover:-translate-y-0.5 ${
                isSelected
                  ? 'border border-term-green/60 bg-term-green/20 text-term-green shadow-[0_0_14px_rgba(0,255,65,0.25)]'
                  : 'border border-white/25 bg-white/10 text-term-text hover:border-term-green hover:bg-term-green/20 hover:text-term-green'
              }`}
              style={isSelected ? { borderColor: accent, color: accent, backgroundColor: `${accent}25` } : {}}
            >
              {isSelected ? '✓ EQUIPPED' : (selectLabel || 'SELECT CARD')}
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="hud-control absolute right-4 top-4 flex aspect-square w-8 items-center justify-center rounded-lg border border-white/10 bg-cosmic-deep/80 text-ui-sm font-bold text-term-faint transition-all hover:-translate-y-0.5 hover:text-term-text"
          aria-label="Close card viewer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}