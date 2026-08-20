import React from 'react';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

export default function PointsBar({ player, isOpponent = false, handCount }) {
  if (!player) return null;

  const { points, victoryProfile } = player;
  const required = victoryProfile
    ? Object.entries(victoryProfile).filter(([, target]) => target > 0)
    : [];

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 font-mono">
      <div className="min-w-0">
        <div className={`mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-term-text ${isOpponent ? '' : 'justify-end'}`}>
          <span>{isOpponent ? 'Opponent' : 'Player'} victory standard</span>
          {handCount != null && <span className="shrink-0 text-term-blue">Hand: {handCount}</span>}
        </div>
        <div className="flex min-w-0 items-center gap-2">
          {required.map(([key, target]) => {
            const info = ALIGNMENT_COLORS[key];
            const current = points[key] || 0;
            const percent = Math.min(100, (current / target) * 100);
            return (
              <div key={key} className="min-w-0 flex-1" style={{ '--accent-color': info.glow }}>
                <div className="mb-0.5 flex items-center justify-between gap-1 text-[10px] font-bold leading-none">
                  <span className="truncate" style={{ color: info.glow }}>{info.name}</span>
                  <span className="shrink-0 tabular-nums" style={{ color: info.glow }}>{current}/{target}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${percent}%`, background: info.glow, boxShadow: `0 0 6px ${info.glow}` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 border-l border-white/10 pl-2">
        <div className="mb-1 text-center text-[9px] font-bold uppercase tracking-[0.12em] text-term-faint">General tally</div>
        <div className="flex gap-1.5">
          {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
            <div key={key} className="flex h-6 w-6 items-center justify-center rounded-full border bg-cosmic-deep/75 text-[10px] font-bold tabular-nums" style={{ borderColor: `${info.glow}66`, color: info.glow, boxShadow: `inset 0 0 8px ${info.glow}18` }} title={`${info.name}: ${points[key] || 0}`}>
              {points[key] || 0}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}