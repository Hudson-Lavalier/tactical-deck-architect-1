import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// TopBar — thin header strip on the tilted plane.
// END GAME button (with confirmation handled by the parent) + mute toggle.
export default function TopBar({ turn, isPlayerTurn, inResponseWindow, onEndGame, muted, onToggleMute }) {
  return (
    <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 px-2">
      <button
        onClick={onEndGame}
        className="justify-self-start rounded px-3 py-1 text-ui-xs font-bold glass-card transition-[transform,box-shadow] hover:scale-105"
        style={{ borderColor: '#ff444480', color: '#ff6666' }}
      >
        END GAME
      </button>
      <div className="text-term-text text-ui-md font-bold tracking-[0.15em] text-center">
        TURN {turn} — {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT TURN'}
        {!isPlayerTurn && !inResponseWindow && (
          <span className="text-term-purple animate-pulse ml-2">[ THINKING... ]</span>
        )}
      </div>
      <button
        onClick={onToggleMute}
        className="justify-self-end rounded p-1.5 glass-card transition-[transform,box-shadow] hover:scale-105"
        style={{ borderColor: '#33333380' }}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX className="w-4 h-4 text-term-faint" /> : <Volume2 className="w-4 h-4 text-term-green" />}
      </button>
    </div>
  );
}