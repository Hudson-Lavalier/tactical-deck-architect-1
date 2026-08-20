import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import PointsBar from './PointsBar';

export default function TopBar({
  turn,
  isPlayerTurn,
  inResponseWindow,
  onEndGame,
  muted,
  onToggleMute,
  opponent,
  player,
  playerHandCount,
  showPlayerActions,
  onOpenHand,
  onEndTurn,
}) {
  const controlClass = 'hud-control shrink-0 rounded-md border border-white/10 bg-cosmic-deep/75 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] transition-all hover:-translate-y-0.5 active:translate-y-0';

  return (
    <header className="game-topbar mx-auto grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-white/10 bg-cosmic-deep/80 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="min-w-0">
        <PointsBar player={opponent} isOpponent />
      </div>

      <div className="flex min-w-max flex-col items-center gap-1">
        <div className="hud-title text-center text-[10px] font-bold uppercase tracking-[0.16em] text-term-text xl:text-xs">
          Turn {turn} — {isPlayerTurn ? 'Your turn' : 'Opponent turn'}
          {!isPlayerTurn && !inResponseWindow && <span className="ml-1 animate-pulse text-term-purple">[Thinking]</span>}
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <button onClick={onEndGame} className={`${controlClass} text-red-300`} style={{ borderColor: '#ff444466' }}>End game</button>
          {showPlayerActions && (
            <>
              <button onClick={onOpenHand} className={`${controlClass} text-term-blue`} style={{ borderColor: '#00ffff55' }}>Hand view</button>
              <button onClick={onEndTurn} className={`${controlClass} text-term-green`} style={{ borderColor: '#00ff4155' }}>End turn</button>
            </>
          )}
          <button onClick={onToggleMute} className={`${controlClass} px-1.5`} title={muted ? 'Unmute' : 'Mute'} aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted ? <VolumeX className="h-3.5 w-3.5 text-term-faint" /> : <Volume2 className="h-3.5 w-3.5 text-term-green" />}
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <PointsBar player={player} handCount={playerHandCount} />
      </div>
    </header>
  );
}