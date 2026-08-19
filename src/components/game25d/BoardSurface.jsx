import React from 'react';

// BoardSurface — the single 2.5D tilted glass plane.
// One forced-perspective surface (top recedes, bottom near) holding all 8
// grid regions. Children are placed via grid-area by the parent (GameBoard).
export default function BoardSurface({ children, accent = '#00ffff' }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '2000px' }}>
      <div
        className="relative grid gap-2 p-3 rounded-2xl cosmic-sheen"
        style={{
          width: '92%',
          height: '100%',
          transform: 'rotateX(13deg) translateY(-14px)',
          transformOrigin: 'center 55%',
          gridTemplateColumns: '1fr',
          gridTemplateRows: 'auto auto auto auto 1fr auto auto auto',
          gridTemplateAreas:
            '"topbar" "help" "opp-points" "opp-persistent" "battlefield" "player-persistent" "hand" "player-points"',
          background: 'linear-gradient(160deg, rgba(16,12,26,0.90), rgba(8,8,16,0.85))',
          border: `1px solid ${accent}40`,
          boxShadow: `0 0 24px ${accent}18, inset 0 0 40px rgba(0,0,0,0.45)`,
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