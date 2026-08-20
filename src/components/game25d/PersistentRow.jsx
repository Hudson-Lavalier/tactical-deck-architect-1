import React from 'react';
import Card from '@/components/game/Card';

// PersistentRow — 3 labeled persistent slots on the tilted plane.
const SLOT_LABELS = {
  left: 'THEORY OF TIME',
  middle: 'MORAL REALITY',
  right: 'MORAL GROUNDING'
};

export default function PersistentRow({ slots, onSlotClick, placementEffect }) {
  return (
    <div className="flex gap-3 justify-center rounded-xl border border-term-purple/15 bg-black/20 px-4 py-1 shadow-[inset_0_0_20px_rgba(0,0,0,.45)]">
      {Object.entries(slots).map(([slot, card]) =>
      <div key={slot} className="flex flex-col items-center gap-1">
          <div className="text-term-text font-mono text-[12px] font-bold tracking-[0.15em] px-10 py-1">{SLOT_LABELS[slot]}</div>
          <div className="inset-well flex h-28 w-48 items-center justify-center" style={{ borderColor: card ? 'rgba(168,85,247,.28)' : 'rgba(168,85,247,.15)', borderStyle: card ? 'solid' : 'dashed' }}>
            {card ? (
              <div className={placementEffect?.slot === slot ? 'animate-card-place' : ''} key={`${card.id}-${placementEffect?.slot === slot ? placementEffect.key : 0}`}>
                <Card card={card} size="small" onClick={() => onSlotClick?.(slot, card)} />
              </div>
            ) : (
              <span className="text-term-faint font-mono text-[10px] font-bold tracking-[.18em]">EMPTY SLOT</span>
            )}
          </div>
        </div>
      )}
    </div>);

}