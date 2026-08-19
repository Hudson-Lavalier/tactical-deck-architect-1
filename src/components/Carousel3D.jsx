import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Carousel3D — coverflow-style 3D carousel.
// Depth comes from rotateY tilt + scale + a small center-card pop only —
// NEVER from a forward translateZ on side cards, which perspective-magnifies
// them past their CSS box and causes clipping/blow-out. Side offset and scale
// are derived from the passed itemWidth/itemHeight so cards always stay
// inside the overflow-hidden frame at any viewport.
export default function Carousel3D({
  items,
  renderItem,
  onItemClick,
  onCenterChange,
  itemWidth = 320,
  itemHeight = 420,
}) {
  const [centerIndex, setCenterIndex] = useState(0);
  // committed rotation "steps" (fractional index) — source of truth for the layout.
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(null);
  const frameRef = useRef(null);

  const n = items.length;
  const wNum = typeof itemWidth === 'number' ? itemWidth : 320;
  const hNum = typeof itemHeight === 'number' ? itemHeight : 420;
  const dim = (v, fallback) => (typeof v === 'number' ? `${v}px` : v || fallback);

  // Side-card offset derived from card width so it always fits within the frame's gutters.
  const sideOffset = wNum * 0.56;
  const sideScale = 0.8;
  const centerPopZ = 40;

  const rotateTo = useCallback(
    (index) => {
      const normalized = ((index % n) + n) % n;
      const currentCenter = ((rotationRef.current % n) + n) % n;
      let delta = normalized - currentCenter;
      if (delta > n / 2) delta -= n;
      if (delta < -n / 2) delta += n;
      const next = rotationRef.current + delta;
      rotationRef.current = next;
      setRotation(next);
      setCenterIndex(normalized);
    },
    [n]
  );

  useEffect(() => {
    if (onCenterChange && n > 0) {
      onCenterChange(items[centerIndex], centerIndex);
    }
  }, [centerIndex]); // eslint-disable-line

  const handlePrev = () => rotateTo(centerIndex - 1);
  const handleNext = () => rotateTo(centerIndex + 1);

  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX;
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const handlePointerMove = (e) => {
    if (dragStartX.current === null) return;
    setDragOffset(e.clientX - dragStartX.current);
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
  // Fractional drag steps — how far along the "index" axis the drag has moved.
  const dragSteps = isDragging ? -dragOffset / sideOffset : 0;
  const effectiveRotation = rotation + dragSteps;

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      <div
        ref={frameRef}
        className="relative w-full overflow-hidden touch-none"
        style={{ height: `${hNum + 48}px`, perspective: '1400px' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translate(-50%, -50%)`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {items.map((item, i) => {
            // shortest-path fractional distance from the current rotation
            let d = i - effectiveRotation;
            d = ((d + n / 2) % n + n) % n - n / 2;
            const absD = Math.abs(d);
            const isCenter = absD < 0.5;
            const clampedD = Math.max(-2, Math.min(2, d));
            const opacity = absD > 2.2 ? 0 : Math.max(0.18, 1 - absD * 0.42);
            const scale = 1 - Math.min(absD, 1) * (1 - sideScale);
            const tiltDeg = Math.max(-1, Math.min(1, clampedD)) * 25;
            const translateX = clampedD * sideOffset;
            const translateZ = isCenter ? centerPopZ : -Math.min(absD, 1) * 60;

            return (
              <div
                key={item.id || i}
                className="absolute"
                style={{
                  width: dim(itemWidth, `${wNum}px`),
                  height: dim(itemHeight, `${hNum}px`),
                  marginLeft: `-${wNum / 2}px`,
                  marginTop: `-${hNum / 2}px`,
                  top: 0,
                  left: 0,
                  transformStyle: 'preserve-3d',
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${-tiltDeg}deg) scale(${scale})`,
                  transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease-out',
                  opacity,
                  zIndex: isCenter ? 10 : Math.round(10 - absD * 3),
                  pointerEvents: absD > 1.2 ? 'none' : 'auto',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (isDragging) return;
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