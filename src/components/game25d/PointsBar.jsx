import React from 'react';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

// PointsBar — 2.5D-styled point readout: Victory Standard bars + circular
// General Tally icons + hand count. Sits on the tilted plane.
// Fonts doubled for legibility on the bottom/opponent tabs.
export default function PointsBar({ player, isOpponent = false, handCount }) {
  if (!player) return null;

  const { points, victoryProfile } = player;
  const required = victoryProfile
    ? Object.entries(victoryProfile).filter(([, target]) => target > 0)
    : [];

  const totalTarget = required.reduce((sum, [, t]) => sum + t, 0);
  const totalEarned = required.reduce((sum, [k, t]) => sum + Math.min(points[k] || 0, t), 0);
  const overallPct = totalTarget > 0 ? Math.min(100, (totalEarned / totalTarget) * 100) : 0;

  const barW = isOpponent ? 'w-24' : 'w-32';

  return (
    <div className={`flex items-center gap-6 font-mono ${isOpponent ? 'text-ui-md' : 'text-ui-lg'}`}>
      {/* Victory Standard */}
      <div className="flex flex-col gap-1.5">
        <div className="text-term-text tracking-[0.2em] text-[24px] font-bold">
          {isOpponent ? 'OPPONENT' : 'YOU'} · VICTORY STANDARD
        </div>
        {required.map(([key, target]) => {
          const info = ALIGNMENT_COLORS[key];
          const cur = points[key] || 0;
          const pct = Math.min(100, (cur / target) * 100);
          return (
            <div key={key} className="flex items-center gap-2">
              <span style={{ color: info.glow, textShadow: `0 0 6px ${info.glow}50` }} className="font-bold w-24 text-[20px]">
                {info.name}
              </span>
              <div className={`${barW} h-2 bg-term-purple/10 rounded overflow-hidden`}>
                <div
                  className="h-full transition-[width,box-shadow] duration-300"
                  style={{ width: `${pct}%`, background: info.glow, boxShadow: `0 0 6px ${info.glow}80` }}
                />
              </div>
              <span style={{ color: info.glow }} className="font-bold text-[20px] w-16">
                {cur}/{target}
              </span>
            </div>
          );
        })}
        {/* Weighted overall */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-term-text text-[20px] font-bold tracking-[0.15em] w-24">WEIGHTED</span>
          <div className={`${barW} h-2.5 bg-term-purple/10 rounded overflow-hidden`}>
            <div
              className="h-full transition-[width,box-shadow] duration-300"
              style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #00ff41, #00ffff, #a855f7)', boxShadow: '0 0 8px rgba(168,85,247,0.4)' }}
            />
          </div>
          <span className="text-term-text text-[20px] font-bold w-16">{totalEarned}/{totalTarget}</span>
        </div>
      </div>

      <div className="h-20 w-px bg-term-purple/20" />

      {/* General Tally — circular icons */}
      <div className="flex flex-col gap-1.5">
        <div className="text-term-text tracking-[0.2em] text-[24px] font-bold">GENERAL TALLY</div>
        <div className="flex gap-3">
          {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ border: `1px solid ${info.glow}80`, boxShadow: `0 0 8px ${info.glow}40`, background: `${info.glow}15` }}
              >
                <span style={{ color: info.glow, textShadow: `0 0 6px ${info.glow}60` }} className="font-bold text-[24px]">
                  {points[key]}
                </span>
              </div>
              <span style={{ color: info.glow }} className="text-[18px] font-bold">{info.label}</span>
            </div>
          ))}
        </div>
      </div>

      {handCount != null && (
        <div className="ml-2 text-term-text text-[20px] font-bold tracking-[0.15em]">HAND: {handCount}</div>
      )}
    </div>
  );
}