import React from 'react';

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
  victory: 'VICTORY',
  deck_exhaustion: 'DECK EXHAUSTION',
};

export default function GameLog({ log }) {
  return (
    <div className="border border-[#1a1a2e] rounded bg-[#0a0a0a] p-2 h-28 overflow-y-auto font-mono text-[10px]">
      <div className="text-[#555] tracking-wider mb-1 sticky top-0 bg-[#0a0a0a]">── GAME LOG ──</div>
      {log.length === 0 ? (
        <div className="text-[#333]">[ NO EVENTS ]</div>
      ) : (
        log.slice(-60).map((entry, i) => (
          <div key={i} className="text-[#666] flex gap-2 leading-tight">
            <span className="text-[#444]">T{entry.turn}</span>
            <span className="text-[#a855f7] w-12">
              {entry.player ? entry.player.toUpperCase().slice(0, 4) : '----'}
            </span>
            <span className="text-[#888]">{EVENT_LABELS[entry.type] || entry.type}</span>
          </div>
        ))
      )}
    </div>
  );
}