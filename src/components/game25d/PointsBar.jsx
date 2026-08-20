import React from 'react';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

// PointsBar — 2.5D-styled point readout: Victory Standard bars + circular
// General Tally icons + hand count. Sits on the tilted plane.
export default function PointsBar({ player, isOpponent = false, handCount }) {
  if (!player) return null;

  const { points, victoryProfile } = player;
  const required = victoryProfile
    ? Object.entries(victoryProfile).filter(([, target]) => target > 0)
    : [];

  const totalTarget = required.reduce((sum, [, t]) => sum + t, 0);
  const totalEarned = required.reduce((sum, [k, t]) => sum + Math.min(points[k] || 0, t), 0);
  const overallPct = totalTarget > 0 ? Math.min(100, (totalEarned / totalTarget) * 100) : 0;

  const barW = isOpponent ? 'w-20' : 'w-28';

  return (
    <div className={`flex items-center gap-4 font-mono rounded-lg border border-term-purple/10 bg-black/10 px-3 py-1 ${isOpponent ? 'text-ui-sm' : 'text-ui-md'}`}>
      {/* Victory Standard */}
      <div className="flex flex-col gap-1">
        <div className="text-term-text tracking-[0.2em] text-[12px] font-bold">
          {isOpponent ? 'OPPONENT' : 'YOU'} · VICTORY STANDARD
        </div>
        {required.map(([key, target]) => {
          const info = ALIGNMENT_COLORS[key];
          const cur = points[key] || 0;
          const pct = Math.min(100, (cur / target) * 100);
          return (
            <div key={key} className="flex items-center gap-1.5">
              <span style={{ color: info.glow, textShadow: `0 0 6px ${info.glow}50` }} className="font-bold w-14 text-[12px]">
                {info.name}
              </span>
              <div className={`${barW} h-1.5 bg-term-purple/10 rounded overflow-hidden`}>
                <div
                  className="h-full transition-[width,box-shadow] duration-300"
                  style={{ width: `${pct}%`, background: info.glow, boxShadow: `0 0 6px ${info.glow}80` }}
                />
              </div>
              <span style={{ color: info.glow }} className="font-bold text-[12px] w-9">
                {cur}/{target}
              </span>
            </div>
          );
        })}
        {/* Weighted overall */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-term-text text-[12px] font-bold tracking-[0.15em] w-14">WEIGHTED</span>
          <div className={`${barW} h-2 bg-term-purple/10 rounded overflow-hidden`}>
            <div
              className="h-full transition-[width,box-shadow] duration-300"
              style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #00ff41, #00ffff, #a855f7)', boxShadow: '0 0 8px rgba(168,85,247,0.4)' }}
            />
          </div>
          <span className="text-term-text text-[12px] font-bold w-9">{totalEarned}/{totalTarget}</span>
        </div>
      </div>

      <div className="h-12 w-px bg-term-purple/20" />

      {/* General Tally — circular icons */}
      <div className="flex flex-col gap-1">
        <div className="text-term-text tracking-[0.2em] text-[12px] font-bold">GENERAL TALLY</div>
        <div className="flex gap-2">
          {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
            <div key={key} className="flex flex-col items-center gap-0.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ border: `1px solid ${info.glow}80`, boxShadow: `0 0 8px ${info.glow}40`, background: `${info.glow}15` }}
              >
                <span style={{ color: info.glow, textShadow: `0 0 6px ${info.glow}60` }} className="font-bold text-[13px]">
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