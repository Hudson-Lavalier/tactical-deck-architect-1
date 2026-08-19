import React from 'react';
import Card from '@/components/game/Card';

// PersistentRow — 3 labeled persistent slots on the tilted plane.
const SLOT_LABELS = {
  left: 'THEORY OF TIME',
  middle: 'MORAL REALITY',
  right: 'MORAL GROUNDING',
};

export default function PersistentRow({ slots, onSlotClick }) {
  return (
    <div className="flex gap-3 justify-center">
      {Object.entries(slots).map(([slot, card]) => (
        <div key={slot} className="flex flex-col items-center gap-1">
          <div className="text-term-text font-mono text-[12px] font-bold tracking-[0.15em]">{SLOT_LABELS[slot]}</div>
          {card ? (
            <Card card={card} size="medium" onClick={() => onSlotClick?.(slot, card)} />
          ) : (
            <div
              className="w-24 h-36 rounded glass-card flex items-center justify-center"
              style={{ borderColor: 'rgba(168,85,247,0.15)', borderStyle: 'dashed' }}
            >
              <span className="text-term-text font-mono text-[11px] font-bold">[ ]</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}