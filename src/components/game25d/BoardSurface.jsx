import React from 'react';

// BoardSurface — the single 2.5D tilted glass plane.
// One forced-perspective surface (top recedes, bottom near) holding all 8
// grid regions. Children are placed via grid-area by the parent (GameBoard).
export default function BoardSurface({ children, accent = '#00ffff' }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '2000px' }}>
      <div
        className="game-board-plane relative grid gap-2 p-3 rounded-2xl cosmic-sheen"
        style={{
          width: '96%',
          height: '96%',
          transform: 'rotateX(4deg) translateY(-8px)',
          transformOrigin: 'center 55%',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '28px 34px 74px 140px minmax(220px,1fr) 140px 130px 74px',
          gridTemplateAreas:
            '"topbar" "help" "opp-points" "opp-persistent" "battlefield" "player-persistent" "hand" "player-points"',
          background: 'linear-gradient(155deg, color-mix(in srgb, var(--surface-raised) 94%, transparent), var(--surface-base))',
          border: `1px solid ${accent}55`,
          boxShadow: `0 0 30px ${accent}1f, inset 0 0 0 3px rgba(0,0,0,.28), inset 0 0 54px rgba(0,0,0,.48), inset 0 1px 0 rgba(255,255,255,.07)`,
        }}
      >
        {/* Thin glowing edge trace */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `1px solid ${accent}18`, boxShadow: `inset 0 0 18px ${accent}10` }}
        />
        {children}
      </div>
    </div>
  );
}