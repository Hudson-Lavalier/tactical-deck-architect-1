import React from 'react';

// BoardSurface — Dual Top-HUD Layout (Opponent Top-Left, Player Top-Right, Zero Bottom Bar)
export default function BoardSurface({ children, accent = '#00ffff' }) {
  return (
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-slate-950 p-2 md:p-3">
      <div
        className="game-board-surface relative grid h-full w-full grid-cols-1 grid-rows-[auto_auto_auto_minmax(0,1fr)_auto] gap-2 overflow-hidden rounded-2xl p-3 antialiased [&>:nth-child(1)]:grid-in-[topbar] [&>:nth-child(2)]:grid-in-[help] [&>:nth-child(3)]:grid-in-[top-hud] [&>:nth-child(3)]:justify-self-start [&>:nth-child(4)]:grid-in-[battlefield] [&>:nth-child(5)]:grid-in-[hand] [&>:nth-child(6)]:grid-in-[top-hud] [&>:nth-child(6)]:justify-self-end"
        style={{
          '--accent-color': accent,
          gridTemplateAreas: `
            "topbar"
            "help"
            "top-hud"
            "battlefield"
            "hand"
          `,
          background: 'radial-gradient(circle at 50% 50%, rgba(15,23,42,0.92) 0%, rgba(2,6,23,0.98) 100%)',
        }}
      >
        {children}
      </div>
    </div>
  );
}