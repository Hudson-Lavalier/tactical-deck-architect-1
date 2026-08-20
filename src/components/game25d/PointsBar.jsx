import React from 'react';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

export default function PointsBar({ player, isOpponent = false, handCount }) {
  if (!player) return null;

  const { points, victoryProfile } = player;
  const standards = Object.entries(ALIGNMENT_COLORS).map(([key, info]) => ({
    key,
    info,
    current: points[key] || 0,
    target: victoryProfile?.[key] || 0,
  }));
  const required = standards.filter(({ target }) => target > 0);
  const totalTarget = required.reduce((sum, { target }) => sum + target, 0);
  const totalEarned = required.reduce((sum, { current, target }) => sum + Math.min(current, target), 0);
  const weightedPercent = totalTarget > 0 ? Math.min(100, (totalEarned / totalTarget) * 100) : 0;

  return (
    <div className="grid min-h-[80px] min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 font-mono">
      <div className="min-w-0">
        <div className="mb-1.5 flex items-center justify-between gap-2 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] text-term-text xl:text-xs">
          <span>{isOpponent ? 'Opponent' : 'Player'} victory standard</span>
          {handCount != null && <span className="shrink-0 text-term-blue">Hand: {handCount}</span>}
        </div>

        <div className="space-y-1">
          {standards.map(({ key, info, current, target }) => {
            const percent = target > 0 ? Math.min(100, (current / target) * 100) : 0;
            return (
              <div key={key} className="grid min-w-0 grid-cols-[minmax(4.75rem,auto)_minmax(3rem,1fr)_auto] items-center gap-2" style={{ '--accent-color': info.glow }}>
                <span className="truncate whitespace-nowrap text-[10px] font-bold leading-none xl:text-xs" style={{ color: info.glow }}>{info.name}</span>
                <div className="h-1.5 min-w-0 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${percent}%`, background: info.glow, boxShadow: `0 0 6px ${info.glow}` }} />
                </div>
                <span className="shrink-0 whitespace-nowrap text-[10px] font-bold leading-none tabular-nums xl:text-xs" style={{ color: info.glow }}>{current}/{target}</span>
              </div>
            );
          })}

          <div className="grid min-w-0 grid-cols-[minmax(4.75rem,auto)_minmax(3rem,1fr)_auto] items-center gap-2">
            <span className="truncate whitespace-nowrap text-[10px] font-bold uppercase leading-none text-term-text xl:text-xs">Weighted</span>
            <div className="h-1.5 min-w-0 overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-type-grounding via-type-system to-type-adaptation transition-[width] duration-300" style={{ width: `${weightedPercent}%`, boxShadow: '0 0 7px rgba(168,85,247,0.45)' }} />
            </div>
            <span className="shrink-0 whitespace-nowrap text-[10px] font-bold leading-none tabular-nums text-term-text xl:text-xs">{totalEarned}/{totalTarget}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-l border-white/10 pl-3">
        <div className="mb-1.5 whitespace-nowrap text-center text-[9px] font-bold uppercase tracking-[0.12em] text-term-faint xl:text-[10px]">General tally</div>
        <div className="flex gap-1.5">
          {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border bg-cosmic-deep/75 text-xs font-bold tabular-nums" style={{ borderColor: `${info.glow}66`, color: info.glow, boxShadow: `inset 0 0 8px ${info.glow}18` }} title={`${info.name}: ${points[key] || 0}`}>
                {points[key] || 0}
              </div>
              <span className="text-[9px] font-bold leading-none" style={{ color: info.glow }}>{info.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}