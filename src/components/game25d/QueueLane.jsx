import React from 'react';
import Card from '@/components/game/Card';

// QueueLane — 4-column horizontal lane inside a bordered grid frame.
// Leftmost column = row 1 (1 turn, resolves first). Up to 2 cards per column.
export default function QueueLane({ queuedCards, isActive, accent = '#888888', label = 'QUEUE', hidden = false }) {
  const rows = [1, 2, 3, 4];

  const cardsByRow = {};
  for (const queued of queuedCards) {
    if (!cardsByRow[queued.row]) cardsByRow[queued.row] = [];
    cardsByRow[queued.row].push(queued);
  }

  return (
    <div className={`flex flex-col gap-1 min-w-0 ${isActive ? '' : 'opacity-55'}`}>
      <div className="text-term-text font-mono text-[12px] font-bold tracking-[0.15em] text-center">
        {label} [{queuedCards.length}/6]
      </div>
      <div className="rounded-lg p-1.5" style={{ border: `1px solid ${accent}40`, boxShadow: `inset 0 0 18px ${accent}10` }}>
        <div className="flex flex-row gap-1 justify-center items-end">
          {rows.map((row) => (
            <div key={row} className="flex flex-col gap-1">
              {[0, 1].map((col) => {
                const cards = cardsByRow[row] || [];
                const queued = cards[col];
                if (queued) {
                  return (
                    <div key={col} className="relative">
                      <Card card={queued.card} faceDown={hidden} size="small" />
                      {queued.faceDown && (
                        <div
                          className="absolute -top-1 -right-1 text-[10px] font-mono bg-cosmic-deep px-1 rounded"
                          style={{ color: accent }}
                        >
                          {queued.turnsRemaining}T
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <div
                    key={col}
                    className="w-20 h-28 rounded glass-card flex items-center justify-center"
                    style={{ borderColor: `${accent}15` }}
                  >
                    <span className="text-term-faint font-mono text-[10px]">{row}T</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}