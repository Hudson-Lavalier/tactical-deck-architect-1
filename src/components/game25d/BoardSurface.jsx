import React from 'react';

// BoardSurface — Full-Width Flex Container (Fixes grid truncation & restores centering)
export default function BoardSurface({ children, accent = '#00ffff' }) {
  return (
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-slate-950 p-2 md:p-4">
      <div
        className="game-board-surface relative flex h-full w-full flex-col justify-between gap-2 overflow-hidden rounded-2xl p-3 antialiased"
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