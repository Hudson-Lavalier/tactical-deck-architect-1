import React from 'react';
import Card from './Card';

// Persistent slots — dedicated horizontal battlefield row (3 slots, scaled up).
export default function PersistentSlots({ slots, onSlotClick, disabled }) {
  const slotLabels = {
    left: 'THEORY OF TIME',
    middle: 'MORAL REALITY',
    right: 'MORAL GROUNDING',
  };

  return (
    <div className="flex gap-3 justify-center">
      {Object.entries(slots).map(([slot, card]) => (
        <div key={slot} className="flex flex-col items-center gap-1">
          <div className="text-term-faint font-mono text-[9px] tracking-[0.15em]">
            {slotLabels[slot]}
          </div>
          {card ? (
            <Card card={card} size="medium" onClick={() => !disabled && onSlotClick?.(slot, card)} />
          ) : (
            <div className="w-24 h-36 rounded glass-card flex items-center justify-center"
              style={{ borderColor: 'rgba(168,85,247,0.15)', borderStyle: 'dashed' }}
            >
              <span className="text-term-faint font-mono text-[9px]">[ ]</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}