import React from 'react';

// HelpPanel — persistent, always-visible guidance strip.
// Shows the current phase, what's allowed, and remaining actions.
const PHASE_INFO = {
  draw: { label: 'DRAW PHASE', instruction: 'Click a draw pile to draw 1 card.' },
  board_dev: { label: 'BOARD DEVELOPMENT', instruction: 'Select a card to place 1 persistent card OR change Domain.' },
  action: { label: 'ACTION PHASE', instruction: 'Select a card to play it to the queue, or End Turn.' },
  response: { label: 'RESPONSE WINDOW', instruction: 'Counter the active card or pass.' },
};

export default function HelpPanel({ phase, isPlayerTurn, boardDevUsed, actionsPlayed, actionAllowance }) {
  const info = PHASE_INFO[phase] || { label: (phase || '').toUpperCase(), instruction: '' };

  let remaining = '';
  if (phase === 'board_dev') remaining = boardDevUsed ? '(0 board dev remaining)' : '(1 board dev remaining)';
  if (phase === 'action') {
    const left = Math.max(0, actionAllowance - actionsPlayed);
    remaining = `(${left} action${left !== 1 ? 's' : ''} left)`;
  }

  const accent = isPlayerTurn ? '#00ff41' : '#a855f7';

  return (
    <div
      className="shrink-0 px-4 py-1.5 rounded glass-card cosmic-sheen flex items-center justify-between"
      style={{ borderColor: `${accent}30` }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-bold tracking-[0.2em] text-ui-sm shrink-0" style={{ color: accent }}>
          {info.label}
        </span>
        <span className="text-term-dim text-ui-sm shrink-0">—</span>
        <span className="text-term-text text-ui-sm truncate">{info.instruction}</span>
      </div>
      {remaining && <span className="text-term-faint text-ui-sm font-mono shrink-0 ml-2">{remaining}</span>}
    </div>
  );
}