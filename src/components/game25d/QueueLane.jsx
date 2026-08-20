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
    <div
      className="game-queue-lane mx-auto flex w-full min-w-0 flex-col items-center justify-center gap-2 overflow-visible opacity-100"
      style={{ '--accent-color': accent }}
    >
      <div className={`hud-kicker text-center font-mono text-[clamp(0.55rem,0.65vw,0.72rem)] font-bold uppercase tracking-[0.2em] ${isActive ? 'text-term-text' : 'text-term-faint'}`}>
        {label} [{queuedCards.length}/{QUEUE_LIMIT}]
      </div>
      <div className="accent-border relative z-10 mx-auto w-full min-w-0 rounded-xl border bg-cosmic-deep/60 p-1.5 backdrop-blur-sm md:p-2">
        <div className="grid min-w-0 grid-cols-4 place-items-center items-center justify-center gap-1 overflow-visible md:gap-2">
          {rows.map((row) => (
            <div key={row} className="grid w-full min-w-0 grid-rows-3 place-items-center items-center justify-center gap-1 overflow-visible md:gap-2">
              {slots.map((col) => {
                const cards = cardsByRow[row] || [];
                const queued = cards[col];
                if (queued) {
                  return (
                    <div key={col} className="game-queue-cell relative z-20 mx-auto flex aspect-[5/7] w-full max-w-20 items-center justify-center overflow-visible opacity-100">
                      <Card card={queued.card} faceDown={hidden} size="small" onClick={!hidden ? () => onCardClick?.(queued.card) : undefined} />
                      {queued.faceDown && (
                        <div className="absolute -right-1 -top-1 rounded bg-cosmic-deep px-1 font-mono text-[10px]" style={{ color: accent }}>
                          {queued.turnsRemaining}T
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <div key={col} className="game-queue-cell game-queue-empty holo-slot mx-auto flex aspect-[5/7] w-full max-w-20 items-center justify-center rounded-lg px-1">
                    <span className="holo-slot-core font-mono text-[9px] font-bold uppercase tracking-[0.12em]">{row}T socket</span>
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