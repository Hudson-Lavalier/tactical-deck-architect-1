import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Carousel2D — simple horizontal slide/fade carousel.
// One card centered; neighbors rendered faintly to either side.
// A single track translates via translateX with one consistent transition,
// so rapid prev/next clicks stay smooth and never janky.
// Navigation: prev/next buttons, drag, or click a side item.
export default function Carousel2D({
  items,
  renderItem,
  onItemClick,
  onCenterChange,
  itemWidth = 320,
  itemHeight = 420,
  sidePeek = 0.42, // fraction of side-item width visible
}) {
  const [centerIndex, setCenterIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(null);
  const trackRef = useRef(null);

  const n = items.length;
  const wNum = typeof itemWidth === 'number' ? itemWidth : 320;
  const hNum = typeof itemHeight === 'number' ? itemHeight : 420;
  const dim = (v, fallback) => (typeof v === 'number' ? `${v}px` : v || fallback);

  const rotateTo = useCallback(
    (index) => {
      const normalized = ((index % n) + n) % n;
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

  // Center each item; side items offset by their index distance.
  // We render all items absolutely positioned and translate each by
  // (i - centerIndex) * spacing, so the track itself doesn't move —
  // each item moves independently with one consistent transition.
  const spacing = wNum * (0.62 + sidePeek); // gap between adjacent cards

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      <div
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: `${hNum + 40}px` }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div ref={trackRef} className="absolute inset-0">
          {items.map((item, i) => {
            const isCenter = i === centerIndex;
            let offset = i - centerIndex;
            // wrap to shortest path for visual side placement
            if (offset > n / 2) offset -= n;
            if (offset < -n / 2) offset += n;
            const absOffset = Math.abs(offset);
            const opacity = isCenter ? 1 : Math.max(0.18, 0.5 - absOffset * 0.18);
            const scale = isCenter ? 1 : Math.max(0.7, 0.88 - absOffset * 0.06);
            const extraX = isDragging && isCenter ? dragOffset : 0;

            return (
              <div
                key={item.id || i}
                className="absolute top-1/2 left-1/2 transition-all duration-500 ease-out"
                style={{
                  width: dim(itemWidth, `${wNum}px`),
                  height: dim(itemHeight, `${hNum}px`),
                  transform: `translate(-50%, -50%) translateX(${offset * spacing + extraX}px) scale(${scale})`,
                  opacity: absOffset > 2 ? 0 : opacity,
                  zIndex: isCenter ? 10 : 5 - absOffset,
                  pointerEvents: absOffset > 1 ? 'none' : 'auto',
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