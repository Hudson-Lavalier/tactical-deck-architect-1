import React from 'react';
import Card from './Card';

// Queue — horizontal lane: 4 columns left-to-right.
// Leftmost column = row 1 (1 turn, resolves first).
// Each column stacks up to 3 cards vertically (preserving the row/col model).
export default function Queue({ queuedCards, isActive, className = '' }) {
  const rows = [1, 2, 3, 4]; // row 1 = 1 turn (leftmost)

  const cardsByRow = {};
  for (const queued of queuedCards) {
    if (!cardsByRow[queued.row]) cardsByRow[queued.row] = [];
    cardsByRow[queued.row].push(queued);
  }

  return (
    <div className={`flex flex-col gap-1 min-w-0 ${isActive ? '' : 'opacity-60'} ${className}`}>
      <div className="text-term-faint font-mono text-[9px] tracking-[0.15em] text-center">
        QUEUE [{queuedCards.length}/6]
      </div>

      <div className="flex flex-row gap-1.5 justify-center items-end">
        {rows.map((row) => (
          <div key={row} className="flex flex-col gap-1">
            {[0, 1, 2].map((col) => {
              const cards = cardsByRow[row] || [];
              const queued = cards[col];

              if (queued) {
                return (
                  <div key={col} className="relative">
                    <Card card={queued.card} faceDown={queued.faceDown} size="small" />
                    {queued.faceDown && (
                      <div className="absolute -top-1 -right-1 text-[8px] font-mono text-term-purple bg-cosmic-deep px-1 rounded">
                        {queued.turnsRemaining}T
                      </div>
                    )}
                  </div>
                );
              }

              // Render 2 placeholder slots per column (queue limit 6 → 2×4=8 capacity).
              // A rare 3rd card in a row still renders above these.
              if (col < 2) {
                return (
                  <div key={col} className="w-20 h-28 rounded glass-card flex items-center justify-center"
                    style={{ borderColor: 'rgba(168,85,247,0.08)' }}
                  >
                    <span className="text-term-faint font-mono text-[8px]">{row}T</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}