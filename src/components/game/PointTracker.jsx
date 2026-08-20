import React from 'react';
import { ALIGNMENT_COLORS } from './terminalTheme';

// PointTracker — centered, stacked layout to prevent overlap.
//  (1) Victory Standard: only required alignments, each on its own line
//      (name + count centered, bar beneath), plus an overall victory bar.
//  (2) General tally: all three alignments as plain numbers, no denominator.
// No global point cap — the only ceiling is the victory threshold.
export default function PointTracker({ player, isOpponent = false }) {
  if (!player) return null;

  const { points, victoryProfile } = player;

  const required = victoryProfile
    ? Object.entries(victoryProfile).filter(([, target]) => target > 0)
    : [];

  const totalTarget = required.reduce((sum, [, t]) => sum + t, 0);
  const totalEarned = required.reduce((sum, [k, t]) => sum + Math.min(points[k] || 0, t), 0);
  const overallPct = totalTarget > 0 ? Math.min(100, (totalEarned / totalTarget) * 100) : 0;

  const sizeText = isOpponent ? 'text-ui-xs' : 'text-ui-sm';
  const barW = isOpponent ? 'w-[150px]' : 'w-[220px]';

  return (
    <div className={`flex flex-col items-center gap-1.5 font-mono ${sizeText}`}>
      <div className="text-term-faint tracking-[0.2em] font-bold">{isOpponent ? 'OPPONENT' : 'YOU'}</div>

      {/* Victory Standard */}
      {required.length > 0 && (
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-term-faint tracking-[0.2em] text-[10px]">VICTORY STANDARD</div>
          {required.map(([key, target]) => {
            const info = ALIGNMENT_COLORS[key];
            const cur = points[key] || 0;
            const pct = Math.min(100, (cur / target) * 100);
            return (
              <div key={key} className="flex flex-col items-center gap-0.5">
                <div className="flex items-center gap-2">
                  <span style={{ color: info.glow, textShadow: `0 0 6px ${info.glow}50` }} className="font-bold">{info.name}</span>
                  <span style={{ color: info.glow }} className="font-bold">{cur}/{target}</span>
                </div>
                <div className={`${barW} h-1.5 bg-term-purple/10 rounded overflow-hidden`}>
                  <div className="h-full transition-all duration-300" style={{ width: `${pct}%`, background: info.glow, boxShadow: `0 0 6px ${info.glow}80` }} />
                </div>
              </div>
            );
          })}
          {/* Overall victory progress */}
          <div className="flex flex-col items-center gap-0.5 mt-0.5">
            <div className="text-term-faint text-[10px] tracking-[0.15em]">{totalEarned}/{totalTarget}</div>
            <div className={`${barW} h-2 bg-term-purple/10 rounded overflow-hidden`}>
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #00ff41, #00ffff, #a855f7)', boxShadow: '0 0 8px rgba(168,85,247,0.4)' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* General tally — plain numbers, no denominator */}
      <div className="flex gap-3 justify-center">
        {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
          <div key={key} className="flex items-center gap-1">
            <span style={{ color: info.glow, textShadow: `0 0 6px ${info.glow}50` }} className="font-bold">{info.name}</span>
            <span style={{ color: info.glow }} className="font-bold">{points[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}