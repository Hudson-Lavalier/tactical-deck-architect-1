import React from 'react';
import { ArrowLeft } from 'lucide-react';

// TopBar — thin header strip on the tilted plane.
export default function TopBar({ turn, isPlayerTurn, inResponseWindow, onBack }) {
  return (
    <div className="flex justify-between items-center px-2">
      <button onClick={onBack} className="text-term-dim hover:text-term-green transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="text-term-faint text-ui-sm tracking-[0.15em] text-center">
        TURN {turn} — {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT TURN'}
        {!isPlayerTurn && !inResponseWindow && (
          <span className="text-term-purple animate-pulse ml-2">[ THINKING... ]</span>
        )}
      </div>
      <div className="w-5" />
    </div>
  );
}