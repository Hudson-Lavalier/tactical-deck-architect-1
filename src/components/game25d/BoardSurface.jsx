import React from 'react';

// BoardSurface — Dual Top-HUD Layout (Clears bottom vertical height)
export default function BoardSurface({ children, accent = '#00ffff' }) {
  return (
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-slate-950 p-2 md:p-3">
      <div
        className="game-board-surface relative grid h-full w-full gap-2 overflow-hidden rounded-2xl p-3 antialiased"
        style={{
          '--accent-color': accent,
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
          gridTemplateAreas: `
            "topbar topbar"
            "opp-points player-points"
            "battlefield battlefield"
            "hand hand"
          `,
          background: 'radial-gradient(circle at 50% 50%, rgba(15,23,42,0.92) 0%, rgba(2,6,23,0.98) 100%)',
        }}
      >
        {children}
      </div>
    </div>
  );
}