import React from 'react';
import Card from './Card';

// Persistent slots — the front row of 3 permanent card slots.
// Left: Theory of Time
// Middle: Moral Reality
// Right: Moral Grounding
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
          <div className="text-[#555] font-mono text-[8px] tracking-wider">
            {slotLabels[slot]}
          </div>
          {card ? (
            <Card card={card} size="small" onClick={() => !disabled && onSlotClick?.(slot, card)} />
          ) : (
            <div className="w-16 h-24 rounded border border-dashed border-[#1a1a2e] bg-[#0a0a0a] flex items-center justify-center">
              <span className="text-[#333] font-mono text-[8px]">[ ]</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}