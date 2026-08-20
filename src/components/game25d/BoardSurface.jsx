import React from 'react';

// BoardSurface — the single 2.5D tilted glass plane.
// One forced-perspective surface (top recedes, bottom near) holding all 8
// grid regions. Children are placed via grid-area by the parent (GameBoard).
export default function BoardSurface({ children, accent = '#00ffff' }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-visible p-2 md:p-3 lg:p-4" style={{ perspective: '2000px' }}>
      <div
        className="game-board-surface cosmic-sheen relative grid h-full w-full gap-1 overflow-visible rounded-2xl p-2 md:gap-2 md:p-3"
        style={{
          '--accent-color': accent,
          transform: 'rotateX(2deg)',
          transformOrigin: 'center 52%',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gridTemplateRows: 'auto auto auto minmax(0, 1fr) minmax(0, auto) auto',
          gridTemplateAreas:
            '"topbar" "help" "opp-points" "battlefield" "hand" "player-points"',
          background: 'linear-gradient(160deg, rgba(24,18,38,0.92), rgba(12,12,22,0.88))',
        }}
      >
        <div className="game-board-edge pointer-events-none absolute inset-0 rounded-2xl" />
        {children}
      </div>
    </div>
  );
}