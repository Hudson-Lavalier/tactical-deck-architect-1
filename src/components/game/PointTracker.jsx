import React from 'react';
import { ALIGNMENT_COLORS } from './terminalTheme';
import { POINT_LIMIT } from '@/data/gameConstants';

// PointTracker — displays a player's point breakdown and victory profile.
export default function PointTracker({ player, isOpponent = false }) {
  if (!player) return null;

  const { points, victoryProfile } = player;
  const total = points.A + points.B + points.C;

  return (
    <div className={`flex flex-col gap-1 font-mono ${isOpponent ? 'text-[10px]' : 'text-xs'}`}>
      <div className="text-[#555] tracking-wider">
        {isOpponent ? 'OPPONENT' : 'YOU'} — {total}/{POINT_LIMIT}
      </div>

      <div className="flex gap-3">
        {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
          <div key={key} className="flex items-center gap-1">
            <span style={{ color: info.glow }} className="font-bold">{info.label}</span>
            <span style={{ color: info.glow }}>
              {points[key]}
              {victoryProfile && (
                <span className="text-[#555]">/{victoryProfile[key]}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-[#111] rounded overflow-hidden">
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