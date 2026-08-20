import React from 'react';

export default function TurnBanner() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[64] flex items-center justify-center bg-black/45 animate-turn-curtain">
      <div className="w-full border-y border-term-purple/40 bg-cosmic-deep/95 py-6 text-center shadow-[0_0_45px_rgba(168,85,247,0.25)] animate-turn-banner">
        <div className="text-ui-xs font-bold tracking-[0.35em] text-term-faint">TURN PASSED</div>
        <div className="mt-1 text-3xl font-bold tracking-[0.22em] text-term-purple">OPPONENT&apos;S TURN</div>
      </div>
    </div>
  );
}