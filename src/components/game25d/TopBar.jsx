import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// TopBar — thin header strip on the tilted plane.
// END GAME button (with confirmation handled by the parent) + mute toggle.
export default function TopBar({ turn, isPlayerTurn, inResponseWindow, onEndGame, muted, onToggleMute }) {
  return (
    <div className="flex h-full items-center justify-between rounded-lg border border-term-purple/20 bg-black/25 px-2 shadow-[inset_0_0_16px_rgba(0,0,0,.4)]">
      <button
        onClick={onEndGame}
        className="px-3 py-1 rounded text-ui-xs font-bold glass-card transition-[transform,box-shadow] hover:scale-105"
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
        className="p-1.5 rounded glass-card transition-[transform,box-shadow] hover:scale-105"
        style={{ borderColor: '#33333380' }}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX className="w-4 h-4 text-term-faint" /> : <Volume2 className="w-4 h-4 text-term-green" />}
      </button>
    </div>
  );
}