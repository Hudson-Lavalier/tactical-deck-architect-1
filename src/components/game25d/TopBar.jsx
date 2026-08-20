import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// TopBar — thin header strip on the tilted plane.
// END GAME button (with confirmation handled by the parent) + mute toggle.
export default function TopBar({ turn, isPlayerTurn, inResponseWindow, onEndGame, muted, onToggleMute }) {
  return (
    <div className="game-topbar mx-auto grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-white/10 bg-cosmic-deep/70 px-2 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <button
        onClick={onEndGame}
        className="hud-control justify-self-start rounded-lg px-3 py-1 text-ui-xs font-bold uppercase tracking-[0.16em] glass-card transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
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
        className="hud-control justify-self-end rounded-lg p-1.5 glass-card transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
        style={{ borderColor: '#33333380' }}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX className="w-4 h-4 text-term-faint" /> : <Volume2 className="w-4 h-4 text-term-green" />}
      </button>
    </div>
  );
}