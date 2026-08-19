import React from 'react';
import Card from './Card';

// Persistent slots — 3 permanent card slots. Glass placeholders.
export default function PersistentSlots({ slots, onSlotClick, disabled }) {
  const slotLabels = {
    left: 'THEORY OF TIME',
    middle: 'MORAL REALITY',
    right: 'MORAL GROUNDING',
  };

  return (
    <div className="flex gap-2 justify-center">
      {Object.entries(slots).map(([slot, card]) => (
        <div key={slot} className="flex flex-col items-center gap-1">
          <div className="text-term-faint font-mono text-[8px] tracking-[0.15em]">
            {slotLabels[slot]}
          </div>
          {card ? (
            <Card card={card} size="small" onClick={() => !disabled && onSlotClick?.(slot, card)} />
          ) : (
            <div className="w-16 h-24 rounded glass-card flex items-center justify-center"
              style={{ borderColor: 'rgba(168,85,247,0.15)', borderStyle: 'dashed' }}
            >
              <span className="text-term-faint font-mono text-[8px]">[ ]</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}