import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Carousel3D — a reusable 3D cylindrical carousel.
// Items rotate around a vertical axis (rotateY + translateZ).
// The centered item faces the viewer; side items are angled and dimmed.
// Navigation: prev/next buttons, drag, or click side items.
// Scroll wheel is intentionally NOT wired — it hijacks page scroll.
// Rotation always takes the SHORTEST path to the target item.
export default function Carousel3D({
  items,
  renderItem,
  onItemClick,
  onCenterChange,
  itemWidth = 220,
  itemHeight = 300,
  radius: customRadius,
}) {
  const [centerIndex, setCenterIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const dragStartX = useRef(null);

  const n = items.length;
  const angleStep = 360 / n;
  const radius = customRadius || Math.max(itemWidth / (2 * Math.tan(Math.PI / n)) + 50, 180);

  const rotateTo = useCallback(
    (index) => {
      const normalized = ((index % n) + n) % n;
      const targetBase = -normalized * angleStep;
      setRotation((prev) => {
        // Pick the equivalent rotation (targetBase + k*360) closest to prev
        // so the CSS transition animates the shortest angular path.
        const delta = targetBase - prev;
        const k = Math.round(-delta / 360);
        return targetBase + k * 360;
      });
      setCenterIndex(normalized);
    },
    [n, angleStep]
  );

  // Notify parent when center changes
  useEffect(() => {
    if (onCenterChange && n > 0) {
      onCenterChange(items[centerIndex], centerIndex);
    }
  }, [centerIndex]); // eslint-disable-line

  const handlePrev = () => rotateTo(centerIndex - 1);
  const handleNext = () => rotateTo(centerIndex + 1);

  const handleDragStart = (e) => {
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX ?? null;
  };

  const handleDragEnd = (e) => {
    if (dragStartX.current === null) return;
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? dragStartX.current;
    const diff = endX - dragStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handlePrev();
      else handleNext();
    }
    dragStartX.current = null;
  };

  if (n === 0) return null;

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      <div
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ perspective: '1600px', height: `${itemHeight + 100}px` }}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="absolute top-1/2 left-1/2 transition-transform duration-700 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translate(-50%, -50%) rotateY(${rotation}deg)`,
          }}
        >
          {items.map((item, i) => {
            const angle = i * angleStep;
            const isCenter = i === centerIndex;
            let offset = Math.abs(i - centerIndex);
            if (offset > n / 2) offset = n - offset;
            const opacity = Math.max(0.25, 1 - offset * 0.35);

            return (
              <div
                key={item.id || i}
                className="absolute top-0 left-0 transition-all duration-700"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  width: `${itemWidth}px`,
                  height: `${itemHeight}px`,
                  marginLeft: `-${itemWidth / 2}px`,
                  marginTop: `-${itemHeight / 2}px`,
                  opacity,
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  zIndex: isCenter ? 10 : 1,
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
          <ChevronLeft className="w-9 h-9" />
        </button>
        <div className="text-term-faint text-ui-sm tracking-wider font-mono">
          {centerIndex + 1} / {n}
        </div>
        <button
          onClick={handleNext}
          className="text-term-dim hover:text-term-green transition-colors"
        >
          <ChevronRight className="w-9 h-9" />
        </button>
      </div>
    </div>
  );
}