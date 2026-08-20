import React from 'react';

// BoardSurface — Restored Original 6-Row Layout
export default function BoardSurface({ children, accent = '#00ffff' }) {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-slate-950 p-2 md:p-3">
      <div
        className="game-board-surface cosmic-sheen relative grid h-full w-full gap-1 overflow-visible rounded-2xl border-t border-t-white/20 p-2 backdrop-blur-xl md:gap-2 md:p-3"
        style={{
          '--accent-color': accent,
          gridTemplateColumns: 'minmax(0, 1fr)',
          gridTemplateRows: 'auto auto auto minmax(0, 1fr) minmax(0, auto) auto',
          background: 'linear-gradient(155deg, rgba(15,23,42,0.86), rgba(2,6,23,0.82) 48%, rgba(12,8,24,0.88))',
        }}
      >
        <div className="game-board-edge pointer-events-none absolute inset-0 rounded-2xl" />
        {children}
      </div>
    </div>
  );
}