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
    <header className="game-topbar mx-auto grid min-h-[90px] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 rounded-xl border border-white/10 bg-cosmic-deep/80 px-3.5 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="min-w-0">
        <PointsBar player={opponent} isOpponent />
      </div>

      <div className="flex w-[clamp(13rem,16vw,19rem)] flex-col items-center gap-2">
        <div className="hud-title text-center text-[10px] font-bold uppercase tracking-[0.16em] text-term-text xl:text-xs">
          Turn {turn} · {inResponseWindow ? 'Response' : phase || 'Draw'}
        </div>
        <div className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-term-faint xl:text-xs">
          {isPlayerTurn ? 'Your turn' : 'Opponent turn'}
          {!isPlayerTurn && !inResponseWindow && <span className="ml-1 animate-pulse text-term-purple">[Thinking]</span>}
        </div>
        <button onClick={onToggleMute} className="hud-control rounded-md border border-white/10 bg-cosmic-deep/75 p-1.5 transition-all hover:-translate-y-0.5 active:translate-y-0" title={muted ? 'Unmute' : 'Mute'} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted ? <VolumeX className="h-4 w-4 text-term-faint" /> : <Volume2 className="h-4 w-4 text-term-green" />}
        </button>
      </div>

      <div className="min-w-0">
        <PointsBar player={player} handCount={playerHandCount} />
      </div>
    </header>
  );
}