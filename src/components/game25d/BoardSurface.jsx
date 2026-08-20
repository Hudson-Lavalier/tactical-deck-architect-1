import React, { useState, useEffect, useRef } from 'react';

// BoardSurface — 1920x1080 Virtual Canvas Auto-Scaler.
// Scales the entire board uniformly to fit any monitor height/width without squishing.
export default function BoardSurface({ children, accent = '#00ffff' }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const targetW = 1920;
      const targetH = 1080;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Calculate uniform scale ratio to fit 1920x1080 inside current screen
      const scaleW = vw / targetW;
      const scaleH = vh / targetH;
      const fitScale = Math.min(scaleW, scaleH);

      setScale(fitScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Fixed 1920x1080 Canvas scaled down uniformly for smaller screens */}
      <div
        className="relative flex items-center justify-center overflow-visible"
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          className="game-board-surface cosmic-sheen relative grid h-full w-full gap-2 overflow-visible rounded-2xl border-t border-t-white/20 p-4 backdrop-blur-xl"
          style={{
            '--accent-color': accent,
            transform: 'rotateX(2deg)',
            transformOrigin: 'center 52%',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gridTemplateRows: '48px 32px 75px 1fr 150px 75px',
            gridTemplateAreas:
              '"topbar" "help" "opp-points" "battlefield" "hand" "player-points"',
            background:
              'linear-gradient(155deg, rgba(15,23,42,0.86), rgba(2,6,23,0.82) 48%, rgba(12,8,24,0.88))',
          }}
        >
          <div className="game-board-edge pointer-events-none absolute inset-0 rounded-2xl" />
          {children}
        </div>
      </div>
    </div>
  );
}