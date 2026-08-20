import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Carousel3D — 2D slide carousel.
// Shows the centered card plus its two immediate neighbors (faint); all other
// items are hidden. A single track translateX animates the slide for smooth,
// consistent motion — no per-item layout transitions, no 3D perspective clipping.
// Navigation: prev/next buttons, drag, or click a visible side item.
// itemWidth/itemHeight accept numbers (px) for viewport-capped sizing.
export default function Carousel3D({
  items,
  renderItem,
  onItemClick,
  onCenterChange,
  itemWidth = 220,
  itemHeight = 300,
}) {
  const [centerIndex, setCenterIndex] = useState(0);
  const dragStartX = useRef(null);

  const n = items.length;
  const wNum = typeof itemWidth === 'number' ? itemWidth : 220;
  const hNum = typeof itemHeight === 'number' ? itemHeight : 300;

  const goTo = useCallback(
    (index) => {
      const clamped = Math.max(0, Math.min(n - 1, index));
      setCenterIndex(clamped);
    },
    [n]
  );

  useEffect(() => {
    if (onCenterChange && n > 0) onCenterChange(items[centerIndex], centerIndex);
  }, [centerIndex]); // eslint-disable-line

  const handlePrev = () => goTo(centerIndex - 1);
  const handleNext = () => goTo(centerIndex + 1);

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

  const containerHeight = `${hNum + 80}px`;

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      <div
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: containerHeight }}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="absolute top-0 left-1/2"
          style={{
            display: 'flex',
            transform: `translateX(-${centerIndex * wNum + wNum / 2}px)`,
            transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {items.map((item, i) => {
            const offset = Math.abs(i - centerIndex);
            const visible = offset <= 1;
            const isCenter = i === centerIndex;
            return (
              <div
                key={item.id || i}
                style={{
                  width: `${wNum}px`,
                  height: `${hNum}px`,
                  flexShrink: 0,
                  opacity: visible ? (isCenter ? 1 : 0.4) : 0,
                  pointerEvents: visible ? 'auto' : 'none',
                  transition: 'opacity 0.5s ease',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (isCenter && onItemClick) onItemClick(item, i);
                  else goTo(i);
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
          disabled={centerIndex === 0}
          className="text-term-dim hover:text-term-green transition-colors disabled:opacity-30 disabled:hover:text-term-dim"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <div className="text-term-faint text-ui-sm tracking-wider font-mono">
          {centerIndex + 1} / {n}
        </div>
        <button
          onClick={handleNext}
          disabled={centerIndex === n - 1}
          className="text-term-dim hover:text-term-green transition-colors disabled:opacity-30 disabled:hover:text-term-dim"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}