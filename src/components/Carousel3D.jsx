import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Carousel3D — true cylindrical 3D carousel. Cards sit on a drum
// (rotateY(angle) translateZ(radius)) and the whole drum rotates as one.
// Perspective magnifies whatever is pushed toward the camera, so each
// card's CSS box is pre-shrunk by the exact inverse of that magnification
// factor (P/(P−radius)) — the on-screen (post-transform) size of the
// FRONT card always equals the requested itemWidth/itemHeight, so it can
// never clip. Back-of-drum cards stay dimly visible (never opacity 0) as
// they rotate around. Click uses a ref-based drag guard (not state) so a
// quick tap is never dropped by a stale render closure.
export default function Carousel3D({
  items,
  renderItem,
  onItemClick,
  onCenterChange,
  itemWidth = 320,
  itemHeight = 420,
}) {
  const [centerIndex, setCenterIndex] = useState(0);
  const rotationRef = useRef(0); // committed rotation, degrees
  const [rotation, setRotation] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(null);
  const dragMovedRef = useRef(false);

  const n = items.length;
  const wNum = typeof itemWidth === 'number' ? itemWidth : 320;
  const hNum = typeof itemHeight === 'number' ? itemHeight : 420;
  const dim = (v, fallback) => (typeof v === 'number' ? `${v}px` : v || fallback);

  const P = 1200; // fixed perspective depth (px)
  const angleStep = n > 0 ? 360 / n : 0;

  // Cylindrical radius — geometric formula for even card spacing, capped
  // so it never approaches P (which would blow up the compensation).
  const rawRadius =
    n <= 1 ? 0 : n <= 3 ? wNum * 0.7 : wNum / 2 / Math.tan(Math.PI / n) + wNum * 0.15;
  const radius = Math.min(rawRadius, P * 0.45);

  // Inverse-magnification box scale: shrink the CSS box now so that once
  // the front card is pushed forward by `radius`, perspective magnifies it
  // back to exactly the requested size.
  const boxScale = radius > 0 ? (P - radius) / P : 1;
  const cssW = wNum * boxScale;
  const cssH = hNum * boxScale;

  const rotateTo = useCallback(
    (index) => {
      const normalized = ((index % n) + n) % n;
      const currentCenter = ((rotationRef.current / angleStep) % n + n) % n;
      let delta = normalized - currentCenter;
      if (delta > n / 2) delta -= n;
      if (delta < -n / 2) delta += n;
      const next = rotationRef.current - delta * angleStep;
      rotationRef.current = next;
      setRotation(next);
      setCenterIndex(normalized);
      if (onCenterChange) onCenterChange(items[normalized], normalized);
    },
    [n, angleStep, items, onCenterChange]
  );

  const handlePrev = () => rotateTo(centerIndex - 1);
  const handleNext = () => rotateTo(centerIndex + 1);

  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX;
    dragMovedRef.current = false;
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const handlePointerMove = (e) => {
    if (dragStartX.current === null) return;
    const offset = e.clientX - dragStartX.current;
    if (Math.abs(offset) > 6) dragMovedRef.current = true;
    setDragOffset(offset);
  };
  const endDrag = (e) => {
    if (dragStartX.current === null) return;
    const endX = e.clientX ?? dragStartX.current;
    const diff = endX - dragStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handlePrev();
      else handleNext();
    }
    dragStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  if (n === 0) return null;
  const dragDeg = isDragging ? (dragOffset / wNum) * angleStep : 0;
  const effectiveRotation = rotation + dragDeg;

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      <div
        className="relative w-full overflow-hidden touch-none"
        style={{ height: `${hNum + 48}px`, perspective: `${P}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translate(-50%, -50%) rotateY(${effectiveRotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'transform',
          }}
        >
          {items.map((item, i) => {
            const cardAngle = i * angleStep;
            // total angle relative to camera, normalized to (-180, 180]
            let totalDeg = ((cardAngle + effectiveRotation) % 360 + 360) % 360;
            if (totalDeg > 180) totalDeg -= 360;
            const cosVal = Math.cos((totalDeg * Math.PI) / 180);
            const isCenter = i === centerIndex;
            // Never fully hidden — dims smoothly to a visible floor at the back.
            const opacity = 0.18 + 0.82 * ((cosVal + 1) / 2);

            return (
              <div
                key={item.id || i}
                className="absolute"
                style={{
                  width: dim(itemWidth, `${cssW}px`),
                  height: dim(itemHeight, `${cssH}px`),
                  marginLeft: `-${cssW / 2}px`,
                  marginTop: `-${cssH / 2}px`,
                  top: 0,
                  left: 0,
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  transition: 'opacity 0.5s ease-out',
                  opacity,
                  zIndex: Math.round(1000 + cosVal * 100),
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (dragMovedRef.current) {
                    dragMovedRef.current = false;
                    return;
                  }
                  if (isCenter && onItemClick) onItemClick(item, i);
                  else rotateTo(i);
                }}
              >
                {renderItem(item, isCenter)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-8 mt-2">
        <button
          onClick={handlePrev}
          className="text-term-dim hover:text-term-green transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <div className="text-term-faint text-ui-sm tracking-wider font-mono">
          {centerIndex + 1} / {n}
        </div>
        <button
          onClick={handleNext}
          className="text-term-dim hover:text-term-green transition-colors"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}