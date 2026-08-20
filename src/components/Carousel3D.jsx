import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TAP_THRESHOLD = 6;
const MOMENTUM_MS = 180;

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
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pointerRef = useRef(null);
  const moveRafRef = useRef(0);
  const pendingMoveRef = useRef(null);
  const count = items.length;
  const width = Math.min(320, Number(itemWidth) || 320);
  const height = Math.min(460, Number(itemHeight) || 460);
  const snapDistance = Math.max(140, width * 0.52);

  // Adapt angle step and radius for 3-card triad sets vs large decks
  const angleStep = count <= 3 ? 44 : 32;
  const radius = count <= 3 ? Math.max(550, width * 1.85) : Math.max(520, width * 1.75);

  const normalizeIndex = (index) => {
    if (!count) return 0;
    if (loop) return ((index % count) + count) % count;
    return Math.max(0, Math.min(count - 1, index));
  };

  const focusIndex = (index) => {
    setDragOffset(0);
    setActiveIndex(normalizeIndex(index));
  };

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
    setDragOffset(0);
  }, [count]);

  useEffect(() => {
    if (count && onCenterChange) onCenterChange(items[activeIndex], activeIndex);
  }, [activeIndex, count, items, onCenterChange]);

  useEffect(() => {
    return () => {
      if (moveRafRef.current) cancelAnimationFrame(moveRafRef.current);
    };
  }, []);

  const handlePointerDown = (event) => {
    const item = event.target.closest('[data-carousel-index]');
    if (!item) return;
    const now = performance.now();
    pointerRef.current = {
      pointerId: event.pointerId,
      index: Number(item.dataset.carouselIndex),
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: now,
      velocityX: 0,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.pointerId !== event.pointerId) return;

    // High polling rate mouse throttling: save latest event coordinates and batch in rAF
    pendingMoveRef.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      pointerId: event.pointerId,
    };

    if (!moveRafRef.current) {
      moveRafRef.current = requestAnimationFrame(() => {
        moveRafRef.current = 0;
        const p = pointerRef.current;
        const pending = pendingMoveRef.current;
        if (!p || !pending || p.pointerId !== pending.pointerId) return;

        const now = performance.now();
        const elapsed = Math.max(1, now - p.lastTime);
        const instantaneousVelocity = (pending.clientX - p.lastX) / elapsed;
        p.velocityX = p.velocityX * 0.68 + instantaneousVelocity * 0.32;
        p.lastX = pending.clientX;
        p.lastTime = now;
        setDragOffset((pending.clientX - p.startX) / snapDistance);
      });
    }
  };

  const finishPointer = (event, cancelled = false) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (moveRafRef.current) {
      cancelAnimationFrame(moveRafRef.current);
      moveRafRef.current = 0;
    }
    pendingMoveRef.current = null;

    const deltaX = event.clientX - pointer.startX;
    const deltaY = event.clientY - pointer.startY;
    const movement = Math.hypot(deltaX, deltaY);
    pointerRef.current = null;
    setIsDragging(false);

    if (cancelled) {
      setDragOffset(0);
      return;
    }

    if (movement < TAP_THRESHOLD) {
      setDragOffset(0);
      if (pointer.index === activeIndex) onItemClick?.(items[pointer.index], pointer.index);
      else focusIndex(pointer.index);
      return;
    }

    if (Math.abs(deltaX) <= Math.abs(deltaY)) {
      setDragOffset(0);
      return;
    }

    const projectedOffset = deltaX / snapDistance + (pointer.velocityX * MOMENTUM_MS) / snapDistance;
    const steps = Math.round(projectedOffset);
    focusIndex(activeIndex - (steps || (deltaX < 0 ? -1 : 1)));
  };

  if (!count) return null;

  return (
    <div className="relative flex w-full select-none flex-col items-center antialiased">
      <div
        className={`relative mx-auto flex h-[500px] w-full max-w-[1800px] items-center justify-center overflow-hidden px-2 py-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ perspective: '1400px', transformStyle: 'preserve-3d', touchAction: 'pan-y' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => finishPointer(event)}
        onPointerCancel={(event) => finishPointer(event, true)}
      >
        {items.map((item, index) => {
          const offset = relativeOffset(index) + dragOffset;
          const distance = Math.abs(offset);
          const angle = offset * angleStep;
          const radians = angle * (Math.PI / 180);

          const translateX = Math.sin(radians) * radius;
          // Locked active card to 0 Z-depth to keep text on 1:1 pixel grid
          const translateZ = Math.cos(radians) * radius - radius;
          const scale = distance < 0.001 ? 1 : Math.max(0.84, 1 - distance * 0.07);
          const zIndex = Math.round(100 - distance * 10);
          const isActive = Math.abs(relativeOffset(index)) < 0.001;
          const isVisible = Math.abs(angle) <= 95;

          return (
            <div
              key={item.id || index}
              data-carousel-index={index}
              className={`absolute left-1/2 top-1/2 overflow-hidden break-words opacity-100 ${
                isDragging ? 'transition-none' : 'transition-[transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
              } ${isVisible ? 'pointer-events-auto visible' : 'pointer-events-none invisible'}`}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                maxWidth: '320px',
                maxHeight: '460px',
                zIndex,
                transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${angle}deg) scale(${scale})`,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'antialiased',
                // Stripped filter on active card to stop offscreen bitmap rasterization
                filter: isActive ? 'none' : `brightness(${Math.max(0.80, 0.94 - distance * 0.04)})`,
                backgroundColor: '#0c0a14',
                borderRadius: '1rem',
              }}
            >
              <div className={`relative h-full max-h-[460px] w-full max-w-[320px] overflow-hidden break-words opacity-100 ${isActive ? 'pointer-events-auto' : ''}`}>
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