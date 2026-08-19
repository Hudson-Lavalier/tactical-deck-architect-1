import React, { useState } from 'react';
import { ScrollText, X } from 'lucide-react';

const EVENT_LABELS = {
  turn_start: 'TURN START',
  turn_end: 'TURN END',
  draw: 'DRAW',
  draw_failed: 'DRAW FAILED',
  rhetoric_draw: 'RHETORIC DRAW',
  place_persistent: 'PLACE PERSISTENT',
  domain_change: 'DOMAIN CHANGE',
  enqueue: 'ENQUEUE',
  queue_full: 'QUEUE FULL',
  queue_collect: 'QUEUE COLLECT',
  queue_advance: 'QUEUE ADVANCE',
  points_added: 'POINTS ADDED',
  points_removed: 'POINTS REMOVED',
  points_stolen: 'POINTS STOLEN',
  points_converted: 'POINTS CONVERTED',
  response_window_open: 'RESPONSE WINDOW OPEN',
  response_window_close: 'RESPONSE WINDOW CLOSE',
  response_window_skip: 'RESPONSE WINDOW SKIP',
  response_pass: 'RESPONSE PASS',
  rhetoric_response: 'RHETORIC RESPONSE',
  card_discarded: 'CARD DISCARDED',
  victory: 'VICTORY',
  deck_exhaustion: 'DECK EXHAUSTION',
};

// GameLog — collapsible hovering panel on the right side.
// Toggle button is always visible on the right edge.
// Panel slides out when expanded.
export default function GameLog({ log }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button — always visible on right edge */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 px-2 py-6 bg-term-panel border-l-2 border-y-2 border-term-border rounded-l-lg hover:border-term-green transition-colors"
        title="Game Log"
      >
        <ScrollText className={`w-5 h-5 ${open ? 'text-term-green' : 'text-term-dim'}`} />
      </button>

      {/* Slide-out panel */}
      {open && (
        <div className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-30 bg-term-panel border-l-2 border-term-border flex flex-col shadow-2xl">
          <div className="flex justify-between items-center p-3 border-b border-term-border">
            <span className="text-term-dim text-ui-sm tracking-wider font-bold font-mono">GAME LOG</span>
            <button onClick={() => setOpen(false)} className="text-term-dim hover:text-term-green transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 font-mono text-ui-xs">
            {log.length === 0 ? (
              <div className="text-term-faint">[ NO EVENTS ]</div>
            ) : (
              log.slice(-100).reverse().map((entry, i) => (
                <div key={i} className="flex gap-2 leading-relaxed mb-1.5">
                  <span className="text-term-faint">T{entry.turn}</span>
                  <span className="text-term-purple w-14 shrink-0">
                    {entry.player ? entry.player.toUpperCase().slice(0, 4) : '----'}
                  </span>
                  <span className="text-term-text">{EVENT_LABELS[entry.type] || entry.type}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}