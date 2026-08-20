import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function TopBar({ turn, isPlayerTurn, inResponseWindow, onEndGame, muted, onToggleMute }) {
  return (
    <div className="game-topbar col-span-2 flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-cosmic-deep/80 px-4 py-2 shadow-lg backdrop-blur-xl">
      <button
        onClick={onEndGame}
        className="hud-control rounded-lg px-3 py-1 text-ui-xs font-bold uppercase tracking-[0.16em] glass-card transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
        style={{ borderColor: '#ff444480', color: '#ff6666' }}
      >
        END GAME
      </button>

      <div className="hud-title text-center text-ui-md font-bold uppercase tracking-[0.24em] text-term-text">
        TURN {turn} — {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT TURN'}
        {!isPlayerTurn && !inResponseWindow && (
          <span className="text-term-purple animate-pulse ml-2">[ THINKING... ]</span>
        )}
      </div>

      <button
        onClick={onToggleMute}
        className="hud-control rounded-lg p-1.5 glass-card transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
        style={{ borderColor: '#33333380' }}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX className="w-4 h-4 text-term-faint" /> : <Volume2 className="w-4 h-4 text-term-green" />}
      </button>
    </div>
  );
}