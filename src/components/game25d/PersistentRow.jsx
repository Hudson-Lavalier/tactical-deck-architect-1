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
    <div className="game-persistent-row flex w-full items-start justify-evenly gap-3">
      {displayOrder.map((slot) => {
        const card = slots[slot];
        return (
          <div key={slot} className="flex min-w-0 flex-col items-center gap-1">
            <div className="game-slot-label whitespace-nowrap px-1 py-1 text-center font-mono text-[11px] font-bold tracking-[0.1em] text-term-text">{SLOT_LABELS[slot]}</div>
            {card ? (
              <div className={placementEffect?.slot === slot ? 'animate-card-place' : ''} key={`${card.id}-${placementEffect?.slot === slot ? placementEffect.key : 0}`}>
                <Card card={card} size="medium" onClick={() => onSlotClick?.(slot, card)} />
              </div>
            ) : (
              <div
                className="game-persistent-empty w-24 h-36 rounded glass-card flex items-center justify-center"
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