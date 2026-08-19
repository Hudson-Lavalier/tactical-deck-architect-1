import React from 'react';
import Card from './Card';

// Queue — 4x3 grid behind the domain. Glass placeholders.
export default function Queue({ queuedCards, isActive }) {
  const rows = [1, 2, 3, 4];

  const cardsByRow = {};
  for (const queued of queuedCards) {
    if (!cardsByRow[queued.row]) cardsByRow[queued.row] = [];
    cardsByRow[queued.row].push(queued);
  }

  return (
    <div className={`flex flex-col gap-1 ${isActive ? '' : 'opacity-50'}`}>
      <div className="text-term-faint font-mono text-[8px] tracking-[0.15em] text-center">
        QUEUE [{queuedCards.length}/6]
      </div>

      {rows.map((row) => (
        <div key={row} className="flex gap-1 justify-center">
          {[0, 1, 2].map((col) => {
            const cards = cardsByRow[row] || [];
            const queued = cards[col];

            if (queued) {
              return (
                <div key={col} className="relative">
                  <Card card={queued.card} faceDown={queued.faceDown} size="small" />
                  {queued.faceDown && (
                    <div className="absolute -top-1 -right-1 text-[7px] font-mono text-term-purple bg-cosmic-deep px-1 rounded">
                      {queued.turnsRemaining}T
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={col} className="w-16 h-24 rounded glass-card flex items-center justify-center"
                style={{ borderColor: 'rgba(168,85,247,0.08)' }}
              >
                <span className="text-term-faint font-mono text-[7px]">{row}T</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}