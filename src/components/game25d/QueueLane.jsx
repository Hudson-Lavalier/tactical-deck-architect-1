import React from 'react';
import Card from '@/components/game/Card';
import { QUEUE_COLS, QUEUE_LIMIT } from '@/data/gameConstants';

// QueueLane — 4-column horizontal lane inside a bordered grid frame.
// Leftmost column = row 1 (1 turn, resolves first). Up to 2 cards per column.
// Each cell is a fixed-size flex container so cards sit centered (no offset).
export default function QueueLane({ queuedCards, isActive, accent = '#888888', label = 'QUEUE', hidden = false, onCardClick }) {
  const rows = [1, 2, 3, 4];
  const slots = Array.from({ length: QUEUE_COLS }, (_, index) => index);

  const cardsByRow = {};
  for (const queued of queuedCards) {
    if (!cardsByRow[queued.row]) cardsByRow[queued.row] = [];
    cardsByRow[queued.row].push(queued);
  }

  return (
    <div className={`game-queue-lane flex w-full min-w-0 flex-col gap-2 ${isActive ? '' : 'opacity-55'}`}>
      <div className="text-term-text font-mono text-[12px] font-bold tracking-[0.15em] text-center">
        {label} [{queuedCards.length}/{QUEUE_LIMIT}]
      </div>
      <div className="w-full rounded-lg p-2" style={{ border: `1px solid ${accent}40`, boxShadow: `inset 0 0 18px ${accent}10` }}>
        <div className="flex w-full flex-row items-end justify-center gap-2">
          {rows.map((row) =>
          <div key={row} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              {slots.map((col) => {
              const cards = cardsByRow[row] || [];
              const queued = cards[col];
              if (queued) {
                return (
                  <div key={col} className="game-queue-cell relative flex items-center justify-center w-20 h-28">
                      <Card card={queued.card} faceDown={hidden} size="small" onClick={!hidden ? () => onCardClick?.(queued.card) : undefined} />
                      {queued.faceDown &&
                    <div className="absolute -top-1 -right-1 text-[10px] font-mono bg-cosmic-deep px-1 rounded" style={{ color: accent }}>
                          {queued.turnsRemaining}T
                        </div>
                    }
                    </div>);

              }
              return (
                <div key={col} className="game-queue-cell game-queue-empty w-20 h-28 rounded glass-card flex items-center justify-center mx-8 my-3 px-1" style={{ borderColor: `${accent}15` }}>
                    <span className="text-term-faint font-mono text-[10px]">{row}T</span>
                  </div>);

            })}
            </div>
          )}
        </div>
      </div>
    </div>);

}