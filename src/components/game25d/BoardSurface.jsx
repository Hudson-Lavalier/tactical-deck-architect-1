import React from 'react';

// BoardSurface — flat full-viewport glass board.
// Children are arranged in named grid regions without perspective transforms.
export default function BoardSurface({ children, accent = '#00ffff' }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950 p-2 md:p-4">
      <div
        className="game-board-surface relative grid h-full w-full gap-1 overflow-visible rounded-2xl border-t border-t-white/20 p-2 backdrop-blur-xl md:gap-2 md:p-3"
        style={{
          '--accent-color': accent,
          gridTemplateColumns: 'minmax(0, 1fr)',
          gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
          gridTemplateAreas: '"topbar" "help" "battlefield" "hand"',
          background: 'linear-gradient(155deg, rgba(15,23,42,0.86), rgba(2,6,23,0.82) 48%, rgba(12,8,24,0.88))',
        }}
      >
        <div className="game-board-edge pointer-events-none absolute inset-0 rounded-2xl" />
        {children}
      </div>
    </div>
  );
}