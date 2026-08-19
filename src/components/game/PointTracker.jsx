import React from 'react';
import { ALIGNMENT_COLORS } from './terminalTheme';

// PointTracker — two distinct displays:
//  (1) Victory Standard: only the alignments the player needs to win, each
//      with a target and a per-alignment progress bar, plus an overall victory
//      progress bar that fills from required points earned (capped per type).
//  (2) General tally: all three alignments as plain numbers, no denominator —
//      so non-required points never read as "X / 0" (unobtainable).
// There is no global point cap; the only ceiling is the victory threshold.
export default function PointTracker({ player, isOpponent = false }) {
  if (!player) return null;

  const { points, victoryProfile } = player;

  const required = victoryProfile
    ? Object.entries(victoryProfile).filter(([, target]) => target > 0)
    : [];

  const totalTarget = required.reduce((sum, [, t]) => sum + t, 0);
  const totalEarned = required.reduce((sum, [k, t]) => sum + Math.min(points[k] || 0, t), 0);
  const overallPct = totalTarget > 0 ? Math.min(100, (totalEarned / totalTarget) * 100) : 0;

  return (
    <div className={`flex flex-col gap-1.5 font-mono ${isOpponent ? 'text-ui-xs' : 'text-ui-sm'}`}>
      <div className="text-term-faint tracking-[0.15em] font-bold">
        {isOpponent ? 'OPPONENT' : 'YOU'}
      </div>

      {/* Victory Standard */}
      {required.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="text-term-faint text-[9px] tracking-[0.15em]">VICTORY STANDARD</div>
          {required.map(([key, target]) => {
            const info = ALIGNMENT_COLORS[key];
            const cur = Math.min(points[key] || 0, target);
            const pct = Math.min(100, ((points[key] || 0) / target) * 100);
            return (
              <div key={key} className="flex items-center gap-2">
                <span style={{ color: info.glow, textShadow: `0 0 6px ${info.glow}50` }} className="font-bold w-16 shrink-0">{info.name}</span>
                <span style={{ color: info.glow }} className="font-bold w-12 shrink-0">{cur}/{target}</span>
                <div className="flex-1 h-1 bg-term-purple/10 rounded overflow-hidden min-w-[60px]">
                  <div className="h-full transition-all duration-300" style={{ width: `${pct}%`, background: info.glow, boxShadow: `0 0 6px ${info.glow}80` }} />
                </div>
              </div>
            );
          })}
          {/* Overall victory progress */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-term-faint text-[9px] tracking-[0.15em] w-16 shrink-0">PROGRESS</span>
            <span className="text-term-faint w-12 shrink-0">{totalEarned}/{totalTarget}</span>
            <div className="flex-1 h-1.5 bg-term-purple/10 rounded overflow-hidden min-w-[60px]">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${overallPct}%`,
                  background: 'linear-gradient(90deg, #00ff41, #00ffff, #a855f7)',
                  boxShadow: '0 0 8px rgba(168,85,247,0.4)',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* General tally — plain numbers, no denominator */}
      <div className="flex gap-3">
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