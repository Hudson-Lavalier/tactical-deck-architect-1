import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TAP_THRESHOLD = 6;

export default function Carousel3D({
  items,
  renderItem,
  onItemClick,
  onCenterChange,
  itemWidth = 320,
  itemHeight = 460,
  loop = true,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerRef = useRef(null);
  const count = items.length;
  const width = Math.min(320, Number(itemWidth) || 320);
  const height = Math.min(460, Number(itemHeight) || 460);

  const normalizeIndex = (index) => {
    if (!count) return 0;
    if (loop) return ((index % count) + count) % count;
    return Math.max(0, Math.min(count - 1, index));
  };

  const focusIndex = (index) => setActiveIndex(normalizeIndex(index));

  const relativeOffset = (index) => {
    let offset = index - activeIndex;
    if (loop && count > 1) {
      if (offset > count / 2) offset -= count;
      if (offset < -count / 2) offset += count;
    }
    return offset;
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [count]);

  useEffect(() => {
    if (count && onCenterChange) onCenterChange(items[activeIndex], activeIndex);
  }, [activeIndex, count, items, onCenterChange]);

  const handlePointerDown = (event, index) => {
    pointerRef.current = {
      pointerId: event.pointerId,
      index,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!pointerRef.current || pointerRef.current.pointerId !== event.pointerId) return;
    pointerRef.current.lastX = event.clientX;
    pointerRef.current.lastY = event.clientY;
  };

  const handlePointerUp = (event) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const endX = event.clientX ?? pointer.lastX;
    const endY = event.clientY ?? pointer.lastY;
    const deltaX = endX - pointer.startX;
    const deltaY = endY - pointer.startY;
    const movement = Math.hypot(deltaX, deltaY);
    pointerRef.current = null;

    if (movement < TAP_THRESHOLD) {
      if (pointer.index === activeIndex) onItemClick?.(items[pointer.index], pointer.index);
      else focusIndex(pointer.index);
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      const steps = Math.max(1, Math.round(Math.abs(deltaX) / Math.max(80, width * 0.45)));
      focusIndex(activeIndex + (deltaX < 0 ? steps : -steps));
    }
  };

  const handlePointerCancel = (event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pointerRef.current = null;
  };

  if (!count) return null;

  return (
    <div className="relative flex w-full select-none flex-col items-center">
      <div
        className="relative mx-auto flex h-[500px] w-full max-w-6xl items-center justify-center overflow-hidden py-4"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d', touchAction: 'pan-y' }}
      >
        {items.map((item, index) => {
          const offset = relativeOffset(index);
          const distance = Math.abs(offset);
          const angle = offset * 28;
          const translateX = offset * (width * 0.45);
          const translateZ = -distance * 110 + (offset === 0 ? 40 : 0);
          const scale = Math.max(0.65, 1 - distance * 0.18);
          const opacity = Math.max(0, 1 - distance * 0.35);
          const zIndex = 100 - distance;
          const isActive = offset === 0;

          return (
            <div
              key={item.id || index}
              data-carousel-index={index}
              className={`absolute left-1/2 top-1/2 overflow-hidden break-words transition-[transform,opacity,filter] duration-500 ease-out ${isActive ? 'pointer-events-auto' : opacity > 0 ? 'pointer-events-auto' : 'pointer-events-none'}`}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                maxWidth: '320px',
                maxHeight: '460px',
                opacity,
                zIndex,
                transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${angle}deg) scale(${scale})`,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                filter: isActive ? 'none' : 'saturate(0.68) brightness(0.72)',
                cursor: 'pointer',
              }}
              onPointerDown={(event) => handlePointerDown(event, index)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
            >
              <div className={`relative h-full max-h-[460px] w-full max-w-[320px] overflow-hidden break-words ${isActive ? 'pointer-events-auto' : ''}`}>
                {renderItem(item, isActive)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-1 flex items-center gap-8">
        <button onClick={() => focusIndex(activeIndex - 1)} className="hud-control rounded-lg p-1 text-term-dim transition-all hover:-translate-y-0.5 hover:text-term-green" aria-label="Previous item">
          <ChevronLeft className="h-8 w-8" />
        </button>
        <div className="font-mono text-ui-sm tracking-[0.18em] text-term-faint">{activeIndex + 1} / {count}</div>
        <button onClick={() => focusIndex(activeIndex + 1)} className="hud-control rounded-lg p-1 text-term-dim transition-all hover:-translate-y-0.5 hover:text-term-green" aria-label="Next item">
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}