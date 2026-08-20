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
      className="game-queue-lane mx-auto flex w-full min-w-0 flex-col items-center justify-center gap-1 overflow-visible opacity-100"
      style={{ '--accent-color': accent }}
    >
      <div className={`hud-kicker text-center font-mono text-[clamp(0.5rem,0.6vw,0.68rem)] font-bold uppercase tracking-[0.2em] ${isActive ? 'text-term-text' : 'text-term-faint'}`}>
        {label} [{queuedCards.length}/{QUEUE_LIMIT}]
      </div>
      <div className="accent-border relative z-10 mx-auto w-full min-w-0 rounded-xl border bg-cosmic-deep/70 p-1 md:p-1.5">
        <div className="grid min-w-0 grid-cols-4 items-start justify-center gap-1 overflow-hidden">
          {rows.map((row) => (
            <div key={row} className="grid w-full min-h-0 min-w-0 grid-rows-3 place-items-center gap-1 overflow-hidden">
              {slots.map((col) => {
                const cards = cardsByRow[row] || [];
                const queued = cards[col];
                if (queued) {
                  return (
                    <div key={col} className="game-queue-cell relative z-20 mx-auto flex h-auto aspect-[5/7] w-full max-w-[clamp(2.25rem,3.2vw,4rem)] min-w-0 shrink items-center justify-center overflow-hidden rounded-lg opacity-100 [&>*]:max-h-full [&>*]:max-w-full">
                      <Card card={queued.card} faceDown={hidden} size="small" onClick={!hidden ? () => onCardClick?.(queued.card) : undefined} />
                      {queued.faceDown && (
                        <div className="absolute -right-1 -top-1 rounded bg-cosmic-deep px-1 font-mono text-[9px]" style={{ color: accent }}>
                          {queued.turnsRemaining}T
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <div key={col} className="game-queue-cell game-queue-empty holo-slot mx-auto flex h-auto aspect-[5/7] w-full max-w-[clamp(2.25rem,3.2vw,4rem)] min-w-0 shrink items-center justify-center overflow-hidden rounded-lg px-0.5">
                    <span className="holo-slot-core font-mono text-[clamp(0.45rem,0.55vw,0.6rem)] font-bold uppercase tracking-[0.1em]">{row}T</span>
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