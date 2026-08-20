import React from 'react';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

// PointsBar — split HUD modules (Left Wing: Victory Standard, Right Wing: Tally & Hand)
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
    <div className={`flex w-full items-center justify-between gap-4 font-mono ${isOpponent ? 'text-ui-sm' : 'text-ui-md'}`}>
      {/* Left Wing: Victory Standard Progress */}
      <div className="flex flex-1 max-w-xs md:max-w-sm flex-col gap-1 rounded-xl border border-white/10 bg-cosmic-deep/80 p-2.5 backdrop-blur-md">
        <div className="text-term-text tracking-[0.2em] text-[11px] font-bold">
          {isOpponent ? 'OPPONENT' : 'YOU'} · VICTORY STANDARD
        </div>
        {required.map(([key, target]) => {
          const info = ALIGNMENT_COLORS[key];
          const cur = points[key] || 0;
          const pct = Math.min(100, (cur / target) * 100);
          return (
            <div key={key} className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
              <span
                style={{ color: info.glow, textShadow: `0 0 6px ${info.glow}60` }}
                className="min-w-0 max-w-[6.5rem] truncate text-left text-[11px] font-bold"
              >
                {info.name}
              </span>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900/80 border border-white/5">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: info.glow }}
                />
              </div>
              <span style={{ color: info.glow }} className="text-right text-[11px] font-bold tabular-nums">
                {cur}/{target}
              </span>
            </div>
          );
        })}
        {/* Weighted Overall Progress */}
        <div className="mt-0.5 grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
          <span className="min-w-0 max-w-[6.5rem] truncate text-left text-[11px] font-bold tracking-[0.12em] text-term-text">
            WEIGHTED
          </span>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900/80 border border-white/5">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #00ff41, #00ffff, #a855f7)' }}
            />
          </div>
          <span className="text-right text-[11px] font-bold tabular-nums text-term-text">
            {totalEarned}/{totalTarget}
          </span>
        </div>
      </div>

      {/* Center Bay Gap: Open space for Hand Cards */}
      <div className="hidden flex-1 md:block" />

      {/* Right Wing: General Tally & Hand Readout */}
      <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-cosmic-deep/80 p-2.5 backdrop-blur-md">
        <div className="flex flex-col gap-1">
          <div className="text-term-text tracking-[0.18em] text-[11px] font-bold">GENERAL TALLY</div>
          <div className="flex gap-2">
            {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
              <div key={key} className="flex flex-col items-center gap-0.5">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full border transition-all"
                  style={{
                    borderColor: `${info.glow}60`,
                    backgroundColor: `${info.glow}15`,
                  }}
                >
                  <span
                    style={{ color: info.glow, textShadow: `0 0 6px ${info.glow}80` }}
                    className="text-[12px] font-bold"
                  >
                    {points[key] || 0}
                  </span>
                </div>
                <span style={{ color: info.glow }} className="text-[9px] font-bold uppercase tracking-wider">
                  {info.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {handCount != null && (
          <div className="border-l border-white/10 pl-3 text-term-text text-[11px] font-bold tracking-[0.15em]">
            HAND: <span className="text-term-blue">{handCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}