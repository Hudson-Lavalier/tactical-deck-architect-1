import React from 'react';

// BoardSurface — 2-Column Grid Layout.
// TopBar & Battlefield span full width (col-span-2).
// Opponent HUD sits Top-Left, Player HUD sits Top-Right. Zero bottom bar.
export default function BoardSurface({ children, accent = '#00ffff' }) {
  return (
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-slate-950 p-2 md:p-3">
      <div
        className="game-board-surface relative grid h-full w-full grid-cols-2 grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-2 overflow-hidden rounded-2xl p-3 antialiased"
        style={{
          '--accent-color': accent,
          background: 'radial-gradient(circle at 50% 50%, rgba(15,23,42,0.92) 0%, rgba(2,6,23,0.98) 100%)',
        }}
      >
        {children}
      </div>
    </div>
  );
}