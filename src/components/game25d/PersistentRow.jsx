import React from 'react';
import Card from '@/components/game/Card';

// PersistentRow — 3 labeled persistent slots on the tilted plane.
const SLOT_LABELS = {
  left: 'THEORY OF TIME',
  middle: 'MORAL REALITY',
  right: 'MORAL GROUNDING'
};

export default function PersistentRow({ slots, onSlotClick, placementEffect }) {
  const displayOrder = ['middle', 'left', 'right'];

  return (
    <div className="game-persistent-row mx-auto grid w-full min-w-0 grid-cols-3 place-items-center items-center justify-center gap-1 overflow-visible md:gap-2">
      {displayOrder.map((slot) => {
        const card = slots[slot];
        return (
          <div key={slot} className="flex w-full min-w-0 flex-col items-center gap-1">
            <div className="game-slot-label min-h-6 w-full px-1 py-1 text-center font-mono text-[clamp(0.5rem,0.6vw,0.7rem)] font-bold uppercase leading-tight tracking-[0.16em] text-term-faint">{SLOT_LABELS[slot]}</div>
            {card ? (
              <div className={`relative z-20 mx-auto aspect-[5/7] w-full max-w-24 overflow-visible opacity-100 ${placementEffect?.slot === slot ? 'animate-card-place' : ''}`} key={`${card.id}-${placementEffect?.slot === slot ? placementEffect.key : 0}`}>
                <Card card={card} size="medium" onClick={() => onSlotClick?.(slot, card)} />
              </div>
            ) : (
              <div className="game-persistent-empty holo-slot flex aspect-[5/7] w-full max-w-24 items-center justify-center rounded-xl">
                <span className="holo-slot-core font-mono text-[9px] font-bold uppercase tracking-[0.18em]">Vacant</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}