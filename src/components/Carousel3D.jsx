import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Carousel3D — cylindrical 3D carousel.
// Fixes applied vs. the old version:
//  - Only the rotating container transitions (transition-transform). Item wrappers
//    never use transition-all, so width/height are never animated (no reflow stutter).
//  - Side-item opacity transitions independently (transition-opacity only).
//  - will-change: transform + backface-visibility: hidden for GPU acceleration.
//  - Radius is capped so small item counts (e.g. 3 families) don't push side cards
//    erratically far back.
//  - Rotation target resolves from the last committed rotation, so rapid prev/next
//    clicks never snap or jump mid-transition.
export default function Carousel3D({
  items,
  renderItem,
  onItemClick,
  onCenterChange,
  itemWidth = 320,
  itemHeight = 420,
  sidePeek = 0.42,
}) {
  const [centerIndex, setCenterIndex] = useState(0);
  // committed rotation (degrees) — the source of truth for the transform.
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(null);

  const n = items.length;
  const wNum = typeof itemWidth === 'number' ? itemWidth : 320;
  const hNum = typeof itemHeight === 'number' ? itemHeight : 420;
  const dim = (v, fallback) => (typeof v === 'number' ? `${v}px` : v || fallback);

  // Cylindrical radius. Cap it so small n doesn't push side cards too far back.
  // For n<=3 use a flat-ish radius derived from card width; otherwise the geometric formula.
  const radius =
    n <= 3
      ? Math.max(wNum * 0.55, 180)
      : Math.min(wNum / (2 * Math.tan(Math.PI / n)) + 40, wNum * 2.4);

  const rotateTo = useCallback(
    (index) => {
      const normalized = ((index % n) + n) % n;
      // Shortest-path delta from the CURRENT committed rotation's center.
      const currentCenter = ((rotationRef.current / (360 / n)) % n + n) % n;
      let delta = normalized - currentCenter;
      if (delta > n / 2) delta -= n;
      if (delta < -n / 2) delta += n;
      const next = rotationRef.current - delta * (360 / n);
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

  const handleDragStart = (e) => {
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX ?? null;
    setIsDragging(true);
  };
  const handleDragMove = (e) => {
    if (dragStartX.current === null) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? dragStartX.current;
    setDragOffset(x - dragStartX.current);
  };
  const handleDragEnd = (e) => {
    if (dragStartX.current === null) return;
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? dragStartX.current;
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
  const angleStep = 360 / n;
  const dragDeg = isDragging ? (dragOffset / wNum) * angleStep : 0;

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      <div
        className="relative w-full overflow-hidden"
        style={{ height: `${hNum + 48}px`, perspective: `${Math.max(radius * 2.6, 900)}px` }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* The rotating cylinder — single transition on transform only. */}
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translate(-50%, -50%) rotateY(${rotation + dragDeg}deg)`,
            transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'transform',
          }}
        >
          {items.map((item, i) => {
            const angle = i * angleStep;
            // distance from center in steps, shortest path
            let d = i - centerIndex;
            if (d > n / 2) d -= n;
            if (d < -n / 2) d += n;
            const absD = Math.abs(d);
            const isCenter = d === 0;
            const opacity = isCenter ? 1 : Math.max(0.16, 0.55 - absD * 0.2);

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
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden',
                  // opacity transitions independently; width/height NEVER transition.
                  transition: 'opacity 0.5s ease-out',
                  opacity: absD > 2 ? 0 : opacity,
                  zIndex: isCenter ? 10 : 5 - absD,
                  pointerEvents: absD > 1 ? 'none' : 'auto',
                  cursor: 'pointer',
                }}
                onClick={() => {
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