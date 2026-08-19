import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Carousel3D — reusable 3D cylindrical carousel.
// Items rotate around a vertical axis (rotateY + translateZ).
// Navigation: prev/next buttons, drag, or click side items.
// Scroll wheel is intentionally NOT wired — it hijacks page scroll.
// Rotation always takes the SHORTEST path to the target item.
// itemWidth/itemHeight accept numbers (px) OR CSS strings (e.g. "62vh")
// so parents can pass viewport-capped dimensions that always fit on screen.
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
  // Numeric fallback for radius math when CSS strings are passed
  const wNum = typeof itemWidth === 'number' ? itemWidth : 380;
  const hNum = typeof itemHeight === 'number' ? itemHeight : 500;
  const radius = customRadius || Math.max(wNum / (2 * Math.tan(Math.PI / n)) + 50, 180);

  const dim = (v, fallback) => (typeof v === 'number' ? `${v}px` : v || fallback);

  const rotateTo = useCallback(
    (index) => {
      const normalized = ((index % n) + n) % n;
      const targetBase = -normalized * angleStep;
      setRotation((prev) => {
        const delta = targetBase - prev;
        const k = Math.round(-delta / 360);
        return targetBase + k * 360;
      });
      setCenterIndex(normalized);
    },
    [n, angleStep]
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

  const containerHeight = typeof itemHeight === 'number' ? `${itemHeight + 80}px` : `calc(${itemHeight} + 80px)`;

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      <div
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ perspective: '1600px', height: containerHeight }}
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
            const opacity = Math.max(0.22, 1 - offset * 0.32);

            return (
              <div
                key={item.id || i}
                className="absolute top-0 left-0 transition-all duration-700"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  width: dim(itemWidth, `${wNum}px`),
                  height: dim(itemHeight, `${hNum}px`),
                  marginLeft: `-${wNum / 2}px`,
                  marginTop: `-${hNum / 2}px`,
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
      <div className="flex items-center gap-8 mt-1">
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