import React from 'react';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

export default function PointsBar({ player, isOpponent = false, handCount }) {
  if (!player) return null;

  const { points, victoryProfile } = player;
  const required = victoryProfile
    ? Object.entries(victoryProfile).filter(([, target]) => target > 0)
    : [];

  const totalTarget = required.reduce((sum, [, t]) => sum + t, 0);
  const totalEarned = required.reduce((sum, [k, t]) => sum + Math.min(points[k] || 0, t), 0);
  const overallPct = totalTarget > 0 ? Math.min(100, (totalEarned / totalTarget) * 100) : 0;

  return (
    <div className={`grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center justify-center gap-4 font-mono ${isOpponent ? 'text-ui-sm' : 'text-ui-md'}`}>
      <div className="flex w-full min-w-0 flex-col gap-1">
        <div className="text-term-text tracking-[0.2em] text-[12px] font-bold">
          {isOpponent ? 'OPPONENT' : 'YOU'} · VICTORY STANDARD
        </div>
        {required.map(([key, target]) => {
          const info = ALIGNMENT_COLORS[key];
          const cur = points[key] || 0;
          const pct = Math.min(100, (cur / target) * 100);
          return (
            <div key={key} className="grid w-full min-w-0 grid-cols-[auto_1fr_auto] items-center gap-2" style={{ '--accent-color': info.glow }}>
              <span style={{ color: info.glow }} className="accent-text-glow min-w-0 max-w-[7rem] truncate text-left text-[12px] font-bold">
                {info.name}
              </span>
              <div className="h-1.5 w-full min-w-0 overflow-hidden rounded bg-term-purple/10">
                <div
                  className="h-full transition-[width,box-shadow] duration-300"
                  style={{ width: `${pct}%`, background: info.glow, boxShadow: '0 0 6px color-mix(in srgb, var(--accent-color) 50%, transparent)' }}
                />
              </div>
              <span style={{ color: info.glow }} className="text-right text-[12px] font-bold tabular-nums">
                {cur}/{target}
              </span>
            </div>
          );
        })}
        <div className="mt-0.5 grid w-full min-w-0 grid-cols-[auto_1fr_auto] items-center gap-2">
          <span className="min-w-0 max-w-[7rem] truncate text-left text-[12px] font-bold tracking-[0.15em] text-term-text">WEIGHTED</span>
          <div className="h-2 w-full min-w-0 overflow-hidden rounded bg-term-purple/10">
            <div
              className="h-full transition-[width,box-shadow] duration-300"
              style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #00ff41, #00ffff, #a855f7)', boxShadow: '0 0 8px rgba(168,85,247,0.4)' }}
            />
          </div>
          <span className="text-right text-[12px] font-bold tabular-nums text-term-text">{totalEarned}/{totalTarget}</span>
        </div>
      </div>

      <div className="h-12 w-px bg-term-purple/20" />

      <div className="flex flex-col gap-1">
        <div className="text-term-text tracking-[0.2em] text-[12px] font-bold">GENERAL TALLY</div>
        <div className="flex gap-2">
          {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
            <div key={key} className="flex flex-col items-center gap-0.5" style={{ '--accent-color': info.glow }}>
              <div className="accent-border accent-bg-subtle accent-glow flex aspect-square w-7 items-center justify-center rounded-full border">
                <span style={{ color: info.glow }} className="accent-text-glow text-[13px] font-bold">
                  {points[key]}
                </span>
              </div>
              <span style={{ color: info.glow }} className="text-[10px] font-bold">{info.label}</span>
            </div>
          ))}
        </div>
      </div>

      {handCount != null && (
        <div className="ml-1 text-term-text text-[12px] font-bold tracking-[0.15em]">HAND: {handCount}</div>
      )}
    </div>
  );
}