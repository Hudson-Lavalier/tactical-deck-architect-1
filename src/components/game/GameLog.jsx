import React, { useState } from 'react';

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

export default function GameLog({ log }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="border border-[#1a1a2e] rounded bg-[#0a0a0a] p-2 font-mono text-[10px]">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-[#555] tracking-wider w-full text-left flex justify-between items-center hover:text-[#888] transition-colors"
      >
        <span>── GAME LOG ──</span>
        <span>{collapsed ? '[+]' : '[-]'}</span>
      </button>
      {!collapsed && (
        <div className="h-28 overflow-y-auto mt-1">
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
                {entry.cardId && <span className="text-[#666]">[{entry.cardId}]</span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}