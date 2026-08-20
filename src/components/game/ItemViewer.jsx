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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-5 font-mono" onClick={onClose}>
      <div ref={cardRef} onClick={(event) => event.stopPropagation()} className="relative flex h-[min(78vh,720px)] w-[min(68vw,620px)] flex-col overflow-hidden rounded-xl border bg-cosmic-deep p-8" style={{ borderColor: `${accent}55`, boxShadow: `0 0 36px ${accent}20`, transformStyle: 'preserve-3d' }}>
        <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: `${accent}25` }}>
          <div>
            <div className="text-2xl font-bold leading-tight" style={{ color: accent }}>{card.name || 'UNNAMED'}</div>
            {alignment && <div className="mt-1 text-ui-sm font-bold" style={{ color: accent }}>{alignment.name}</div>}
          </div>
          <div className="text-right text-ui-xs font-bold text-term-faint">{card.category?.replace(/_/g, ' ').toUpperCase()}</div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto py-6 pr-2">
          {card.text ? <RichText text={card.text} alignment={card.alignment} /> : <div className="text-ui-md italic text-term-faint">[ NO TEXT DEFINED ]</div>}
        </div>
        <button onClick={onClose} className="absolute right-4 top-4 text-ui-sm font-bold text-term-faint hover:text-term-text">✕</button>
      </div>
    </div>
  );
}