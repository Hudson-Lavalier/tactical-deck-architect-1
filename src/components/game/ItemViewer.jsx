import React, { useEffect, useRef } from 'react';
import { ALIGNMENT_COLORS } from './terminalTheme';
import RichText from '@/components/RichText';

export default function ItemViewer({ card, onClose }) {
  const cardRef = useRef(null);
  const frameRef = useRef(0);
  const motionRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const boundsRef = useRef(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const animate = () => {
      const motion = motionRef.current;
      motion.currentX += (motion.targetX - motion.currentX) * 0.16;
      motion.currentY += (motion.targetY - motion.currentY) * 0.16;
      element.style.transform = `perspective(1200px) rotateX(${motion.currentX}deg) rotateY(${motion.currentY}deg)`;
      const moving = Math.abs(motion.targetX - motion.currentX) > 0.04 || Math.abs(motion.targetY - motion.currentY) > 0.04;
      if (moving) frameRef.current = requestAnimationFrame(animate);
      else frameRef.current = 0;
    };

    const start = () => {
      if (!frameRef.current) frameRef.current = requestAnimationFrame(animate);
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
      <div ref={cardRef} onClick={(event) => event.stopPropagation()} className="holo-frame cyber-panel accent-border relative flex h-[min(78vh,720px)] w-[min(68vw,620px)] flex-col overflow-hidden rounded-2xl border border-t-white/20 bg-cosmic-deep/90 p-8 backdrop-blur-xl" style={{ '--accent-color': accent, transformStyle: 'preserve-3d' }}>
        <div className="accent-border-soft flex items-start justify-between border-b pb-4">
          <div>
            {alignment && <div className="hud-kicker text-ui-xs font-bold uppercase tracking-[0.22em] text-term-faint">{alignment.name} construct</div>}
            <div className="accent-text-glow mt-2 text-2xl font-bold uppercase leading-tight tracking-[0.06em]" style={{ color: accent }}>{card.name || 'UNNAMED'}</div>
          </div>
          <div className="pr-12 text-right text-ui-xs font-bold uppercase tracking-[0.14em] text-term-faint">{card.category?.replace(/_/g, ' ')}</div>
        </div>
        <div className="cyber-richtext min-h-0 flex-1 overflow-y-auto py-6 pr-2">
          {card.text ? <RichText text={card.text} alignment={card.alignment} className="text-[15px]" /> : <div className="text-ui-md italic text-term-faint">[ NO TEXT DEFINED ]</div>}
        </div>
        <button onClick={onClose} className="hud-control absolute right-4 top-4 flex aspect-square w-8 items-center justify-center rounded-lg border border-white/10 bg-cosmic-deep/80 text-ui-sm font-bold text-term-faint transition-all hover:-translate-y-0.5 hover:text-term-text">✕</button>
      </div>
    </div>
  );
}