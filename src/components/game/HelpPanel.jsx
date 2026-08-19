import React from 'react';

// HelpPanel — persistent, always-visible guidance strip.
// Informs the player of their available options without locking them to a
// strict phase order. The 'main' phase lists everything they may do and the
// remaining counts; 'draw' and 'response' stay directive.
const PHASE_INFO = {
  draw: { label: 'DRAW PHASE', instruction: 'Click a draw pile to draw 1 card.' },
  main: { label: 'MAIN PHASE', instruction: 'Place a persistent card, play actions, or change the Domain — in any order. End Turn when ready.' },
  response: { label: 'RESPONSE WINDOW', instruction: 'Counter the active card or pass.' },
};

export default function HelpPanel({ phase, isPlayerTurn, boardDevUsed, actionsPlayed, actionAllowance }) {
  const info = PHASE_INFO[phase] || { label: (phase || '').toUpperCase(), instruction: '' };

  let remaining = '';
  if (phase === 'main') {
    const boardLeft = boardDevUsed ? 0 : 1;
    const actionLeft = Math.max(0, actionAllowance - actionsPlayed);
    const domainAvail = !boardDevUsed && actionsPlayed === 0;
    remaining = `board dev: ${boardLeft} · actions: ${actionLeft} · domain: ${domainAvail ? 'available' : 'locked'}`;
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