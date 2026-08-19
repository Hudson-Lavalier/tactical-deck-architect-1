import React from 'react';
import { ALIGNMENT_COLORS } from './terminalTheme';
import { POINT_LIMIT } from '@/data/gameConstants';

// PointTracker — displays a player's point breakdown and victory profile.
// Uses type names (Grounding/System/Adaptation) instead of A/B/C labels.
export default function PointTracker({ player, isOpponent = false }) {
  if (!player) return null;

  const { points, victoryProfile } = player;
  const total = points.A + points.B + points.C;

  return (
    <div className={`flex flex-col gap-1.5 font-mono ${isOpponent ? 'text-ui-xs' : 'text-ui-sm'}`}>
      <div className="text-term-faint tracking-wider font-bold">
        {isOpponent ? 'OPPONENT' : 'YOU'} — {total}/{POINT_LIMIT}
      </div>

      <div className="flex gap-4">
        {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span style={{ color: info.glow }} className="font-bold">{info.name}</span>
            <span style={{ color: info.glow }} className="font-bold">
              {points[key]}
              {victoryProfile && (
                <span className="text-term-faint font-normal">/{victoryProfile[key]}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-term-border rounded overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${(total / POINT_LIMIT) * 100}%`,
            background: 'linear-gradient(90deg, #00ff41, #00ffff, #a855f7)',
          }}
        />
      </div>
    </div>
  );
}