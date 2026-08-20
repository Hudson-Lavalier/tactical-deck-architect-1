import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import PointsBar from './PointsBar';

export default function TopBar({
  turn,
  isPlayerTurn,
  inResponseWindow,
  phase,
  muted,
  onToggleMute,
  opponent,
  player,
  playerHandCount,
}) {
  return (
    <header className="game-topbar mx-auto grid min-h-[clamp(4.25rem,6.2vh,5.5rem)] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-xl border border-white/10 bg-cosmic-deep/85 px-3 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl md:gap-4 md:px-3.5 md:py-2">
      <div className="min-w-0">
        <PointsBar player={opponent} isOpponent />
      </div>

      <div className="flex w-[clamp(11rem,15vw,18rem)] flex-col items-center gap-1">
        <div className="hud-title text-center text-[clamp(0.55rem,0.68vw,0.75rem)] font-bold uppercase tracking-[0.14em] text-term-text">
          Turn {turn} · {inResponseWindow ? 'Response' : phase || 'Draw'}
        </div>
        <div className="text-center text-[clamp(0.55rem,0.65vw,0.72rem)] font-bold uppercase tracking-[0.12em] text-term-faint">
          {isPlayerTurn ? 'Your turn' : 'Opponent turn'}
          {!isPlayerTurn && !inResponseWindow && <span className="ml-1 animate-pulse text-term-purple">[Thinking]</span>}
        </div>
        <button onClick={onToggleMute} className="hud-control rounded-md border border-white/10 bg-cosmic-deep/75 p-1 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0" title={muted ? 'Unmute' : 'Mute'} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted ? <VolumeX className="h-3.5 w-3.5 text-term-faint" /> : <Volume2 className="h-3.5 w-3.5 text-term-green" />}
        </button>
      </div>

      <div className="min-w-0">
        <PointsBar player={player} handCount={playerHandCount} />
      </div>
    </header>
  );
}