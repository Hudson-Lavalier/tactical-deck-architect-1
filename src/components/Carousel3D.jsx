import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Carousel3D — draggable cylindrical stage with inertial, eased Y-axis rotation.
export default function Carousel3D({
  items,
  renderItem,
  onItemClick,
  onCenterChange,
  itemWidth = 220,
  itemHeight = 300,
}) {
  const [centerIndex, setCenterIndex] = useState(0);
  const stageRef = useRef(null);
  const motionRef = useRef({ current: 0, target: 0, velocity: 0, dragging: false, moved: false, lastX: 0 });
  const frameRef = useRef(0);
  const n = items.length;
  const requestedWidth = typeof itemWidth === 'number' ? itemWidth : 220;
  const requestedHeight = typeof itemHeight === 'number' ? itemHeight : 300;
  const wNum = Math.min(340, requestedWidth);
  const hNum = Math.min(480, requestedHeight);
  const angleStep = n > 1 ? 360 / n : 0;
  const radius = n > 1
    ? Math.min(350, Math.round((wNum / 2) / Math.tan(Math.PI / Math.max(n, 3))))
    : 0;
  const stageRadius = Math.min(120, Math.max(0, radius));

  const normalize = useCallback((index) => ((index % n) + n) % n, [n]);

  const goTo = useCallback((index) => {
    if (!n) return;
    const wrapped = normalize(index);
    const desired = -wrapped * angleStep;
    const nearestTurn = Math.round((motionRef.current.current - desired) / 360);
    motionRef.current.target = desired + nearestTurn * 360;
    motionRef.current.velocity = 0;
    setCenterIndex(wrapped);
  }, [angleStep, n, normalize]);

  useEffect(() => {
    const tick = () => {
      const motion = motionRef.current;
      motion.current += (motion.target - motion.current) * 0.12;
      if (stageRef.current) stageRef.current.style.transform = `rotateY(${motion.current}deg)`;
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    motionRef.current.current = 0;
    motionRef.current.target = 0;
    setCenterIndex(0);
  }, [n]);

  useEffect(() => {
    if (onCenterChange && n > 0) onCenterChange(items[centerIndex], centerIndex);
  }, [centerIndex, items, n, onCenterChange]);

  const handlePointerDown = (event) => {
    const motion = motionRef.current;
    motion.dragging = true;
    motion.moved = false;
    motion.lastX = event.clientX;
    motion.velocity = 0;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const motion = motionRef.current;
    if (!motion.dragging) return;
    const delta = event.clientX - motion.lastX;
    if (Math.abs(delta) > 2) motion.moved = true;
    motion.lastX = event.clientX;
    motion.velocity = delta * 0.22;
    motion.target += delta * 0.22;
  };

  const handlePointerUp = (event) => {
    const motion = motionRef.current;
    if (!motion.dragging) return;
    motion.dragging = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    if (n === 1) {
      motion.target = 0;
      setCenterIndex(0);
      return;
    }
    const rawIndex = Math.round(-(motion.target + motion.velocity * 5) / angleStep);
    motion.target = -rawIndex * angleStep;
    motion.velocity = 0;
    setCenterIndex(normalize(rawIndex));
  };

  if (!n) return null;

  return (
    <div className="relative flex w-full select-none flex-col items-center overflow-visible">
      <div
        className="relative mx-auto flex h-[520px] w-full max-w-6xl cursor-grab items-center justify-center overflow-hidden active:cursor-grabbing"
        style={{ perspective: '1400px', touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div ref={stageRef} className="relative shrink-0" style={{ width: `${wNum}px`, height: `${hNum}px`, transformStyle: 'preserve-3d' }}>
          {items.map((item, index) => {
            const isCenter = index === centerIndex;
            return (
              <div key={item.id || index} className="absolute inset-0 overflow-hidden" style={{ transform: `rotateY(${index * angleStep}deg) translateZ(${stageRadius}px)`, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}>
                <div
                  className="h-full max-h-[480px] w-full max-w-[340px] overflow-hidden break-words transition-[opacity,transform,filter] duration-500 ease-out"
                  style={{ opacity: isCenter ? 1 : 0.5, transform: isCenter ? 'scale(1.05)' : 'scale(0.82)', filter: isCenter ? 'none' : 'saturate(0.65) brightness(0.7)', cursor: 'pointer', backfaceVisibility: 'hidden' }}
                  onClick={() => {
                    if (motionRef.current.moved) return;
                    if (isCenter) onItemClick?.(item, index);
                    else goTo(index);
                  }}
                >
                  {renderItem(item, isCenter)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-1 flex items-center gap-8">
        <button onClick={() => goTo(centerIndex - 1)} className="hud-control rounded-lg p-1 text-term-dim transition-all hover:-translate-y-0.5 hover:text-term-green"><ChevronLeft className="h-8 w-8" /></button>
        <div className="font-mono text-ui-sm tracking-[0.18em] text-term-faint">{centerIndex + 1} / {n}</div>
        <button onClick={() => goTo(centerIndex + 1)} className="hud-control rounded-lg p-1 text-term-dim transition-all hover:-translate-y-0.5 hover:text-term-green"><ChevronRight className="h-8 w-8" /></button>
      </div>
    </div>
  );
}