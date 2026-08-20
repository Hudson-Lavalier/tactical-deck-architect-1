import React from 'react';

// BoardSurface — Full-Viewport Responsive Stage (No bitmap scaling, no top sheen glare)
export default function BoardSurface({ children, accent = '#00ffff' }) {
  return (
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-slate-950 p-2 md:p-3">
      <div
        className="game-board-surface relative grid h-full w-full gap-1.5 overflow-hidden rounded-2xl p-2.5 antialiased md:gap-2 md:p-3"
        style={{
          '--accent-color': accent,
          gridTemplateColumns: '100%',
          gridTemplateRows: 'auto auto auto minmax(0, 1fr) auto auto',
          gridTemplateAreas:
            '"topbar" "help" "opp-points" "battlefield" "hand" "player-points"',
          background: 'radial-gradient(circle at 50% 50%, rgba(15,23,42,0.92) 0%, rgba(2,6,23,0.98) 100%)',
        }}
      >
        {children}
      </div>
    </div>
  );
}