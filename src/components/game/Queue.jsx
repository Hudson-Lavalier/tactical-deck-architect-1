import React from 'react';
import Card from './Card';

// Queue component — 4x3 grid behind the domain.
// Row 1 (front): 1 turn remaining
// Row 2: 2 turns remaining
// Row 3: 3 turns remaining
// Row 4 (back): 4 turns remaining
// Max 6 queued cards per player.
export default function Queue({ queuedCards, isActive }) {
  const rows = [1, 2, 3, 4];

  // Group cards by row
  const cardsByRow = {};
  for (const queued of queuedCards) {
    if (!cardsByRow[queued.row]) cardsByRow[queued.row] = [];
    cardsByRow[queued.row].push(queued);
  }

  return (
    <div className={`flex flex-col gap-1 ${isActive ? '' : 'opacity-50'}`}>
      <div className="text-[#555] font-mono text-[8px] tracking-wider text-center">
        QUEUE [{queuedCards.length}/6]
      </div>

      {rows.map((row) => (
        <div key={row} className="flex gap-1 justify-center">
          {/* 3 slots per row */}
          {[0, 1, 2].map((col) => {
            const cards = cardsByRow[row] || [];
            const queued = cards[col];

            if (queued) {
              return (
                <div key={col} className="relative">
                  <Card
                    card={queued.card}
                    faceDown={queued.faceDown}
                    size="small"
                  />
                  {queued.faceDown && (
                    <div className="absolute -top-1 -right-1 text-[7px] font-mono text-[#a855f7] bg-[#000] px-1 rounded">
                      {queued.turnsRemaining}T
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={col}
                className="w-16 h-24 rounded border border-dashed border-[#111] bg-[#050505] flex items-center justify-center"
              >
                <span className="text-[#222] font-mono text-[7px]">{row}T</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}