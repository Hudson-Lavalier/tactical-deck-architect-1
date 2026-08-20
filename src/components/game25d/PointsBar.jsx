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
    <div className={`flex w-full items-center font-mono ${isOpponent ? 'justify-start' : 'justify-end'}`}>
      <div className="flex w-full max-w-[clamp(14rem,23vw,20rem)] flex-col gap-1 rounded-xl border border-white/10 bg-cosmic-deep/85 p-2 backdrop-blur-md shadow-md">
        {/* Header Row */}
        <div className="flex items-center justify-between border-b border-white/10 pb-1 gap-2">
          <div className="text-term-text tracking-[0.14em] text-[10px] font-bold">
            {isOpponent ? 'OPPONENT' : 'YOU'} · VICTORY
          </div>

          <div className="flex items-center gap-1">
            {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
              <div
                key={key}
                className="flex h-4 w-4 items-center justify-center rounded-full border"
                style={{ borderColor: `${info.glow}60`, backgroundColor: `${info.glow}15` }}
              >
                <span style={{ color: info.glow }} className="text-[9px] font-bold">
                  {points[key] || 0}
                </span>
              </div>
            ))}

            {!isOpponent && handCount != null && (
              <div className="ml-1 border-l border-white/10 pl-1.5 text-[9px] font-bold text-term-faint">
                HAND: <span className="text-term-blue">{handCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bars */}
        <div className="flex flex-col gap-0.5 pt-0.5">
          {required.map(([key, target]) => {
            const info = ALIGNMENT_COLORS[key];
            const cur = points[key] || 0;
            const pct = Math.min(100, (cur / target) * 100);
            return (
              <div key={key} className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-1.5">
                <span style={{ color: info.glow }} className="min-w-0 max-w-[5rem] truncate text-left text-[9px] font-bold">
                  {info.name}
                </span>
                <div className="h-1 w-full overflow-hidden rounded-full bg-slate-900 border border-white/5">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: info.glow }} />
                </div>
                <span style={{ color: info.glow }} className="text-right text-[9px] font-bold tabular-nums">
                  {cur}/{target}
                </span>
              </div>
            );
          })}

          <div className="mt-0.5 grid w-full grid-cols-[auto_1fr_auto] items-center gap-1.5">
            <span className="min-w-0 max-w-[5rem] truncate text-left text-[9px] font-bold tracking-[0.1em] text-term-text">
              WEIGHTED
            </span>
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-900 border border-white/5">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #00ff41, #00ffff, #a855f7)' }} />
            </div>
            <span className="text-right text-[9px] font-bold tabular-nums text-term-text">
              {totalEarned}/{totalTarget}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}