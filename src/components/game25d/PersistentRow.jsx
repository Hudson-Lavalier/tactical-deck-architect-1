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
    <div className="game-persistent-row grid w-full min-w-0 grid-cols-3 place-items-center gap-1 md:gap-2">
      {displayOrder.map((slot) => {
        const card = slots[slot];
        return (
          <div key={slot} className="flex w-full min-w-0 flex-col items-center gap-1">
            <div className="game-slot-label min-h-6 w-full px-1 py-1 text-center font-mono text-[clamp(0.5rem,0.6vw,0.75rem)] font-bold leading-tight tracking-[0.08em] text-term-text">{SLOT_LABELS[slot]}</div>
            {card ? (
              <div className={`w-full max-w-24 ${placementEffect?.slot === slot ? 'animate-card-place' : ''}`} key={`${card.id}-${placementEffect?.slot === slot ? placementEffect.key : 0}`}>
                <Card card={card} size="medium" onClick={() => onSlotClick?.(slot, card)} />
              </div>
            ) : (
              <div
                className="game-persistent-empty flex aspect-[5/7] w-full max-w-24 items-center justify-center rounded glass-card"
                style={{ borderColor: 'rgba(168,85,247,0.15)', borderStyle: 'dashed' }}
              >
                <span className="text-term-text font-mono text-[11px] font-bold">[ ]</span>
              </div>
            )}
          </div>
        );
      })}
    </div>);

}