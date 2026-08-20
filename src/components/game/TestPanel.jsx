import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CARD_CATEGORIES } from '@/data/cardTypes';
import { ALL_CARDS } from '@/data/cards';
import { ALIGNMENT_COLORS } from './terminalTheme';

// TestPanel — in-game cheat panel (test mode). Grants any card to self or
// opponent and toggles an opponent domain lock. Rendered near the game log.
export default function TestPanel({ onGrant, opponentLocked, onToggleOpponentLock, onClose }) {
  const [target, setTarget] = useState('player');
  const [activeCat, setActiveCat] = useState('domain');

  const cards = ALL_CARDS[activeCat] || [];

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 max-w-[90vw] z-40 glass-panel glass-blur flex flex-col" style={{ borderRadius: '16px 0 0 16px', borderRight: 'none' }}>
      <div className="flex justify-between items-center p-3 border-b border-term-purple/15">
        <span className="text-term-purple text-ui-sm tracking-[0.15em] font-bold font-mono">TEST PANEL</span>
        <button onClick={onClose} className="text-term-dim hover:text-term-purple transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 border-b border-term-purple/15">
        <div className="text-term-faint text-ui-xs tracking-[0.15em] mb-2 font-bold">GRANT TO</div>
        <div className="flex gap-2">
          <button onClick={() => setTarget('player')} className={`flex-1 py-1.5 rounded text-ui-xs font-bold transition ${target === 'player' ? 'text-term-green bg-term-green/10 border border-term-green/40' : 'text-term-faint border border-transparent glass-card'}`}>SELF</button>
          <button onClick={() => setTarget('opponent')} className={`flex-1 py-1.5 rounded text-ui-xs font-bold transition ${target === 'opponent' ? 'text-term-purple bg-term-purple/10 border border-term-purple/40' : 'text-term-faint border border-transparent glass-card'}`}>OPPONENT</button>
        </div>
      </div>

      <div className="p-3 border-b border-term-purple/15">
        <div className="flex flex-wrap gap-1">
          {Object.values(CARD_CATEGORIES).map((cat) => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`px-2 py-1 rounded text-ui-xs font-bold transition ${activeCat === cat.id ? 'text-term-blue bg-term-blue/10 border border-term-blue/40' : 'text-term-faint border border-transparent glass-card'}`}>
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="text-term-faint text-ui-xs tracking-[0.15em] mb-2 font-bold">CLICK A CARD TO GRANT</div>
        {cards.length === 0 ? (
          <div className="text-term-faint text-ui-xs italic">[ NO CARDS IN THIS CATEGORY ]</div>
        ) : (
          <div className="space-y-1.5">
            {cards.map((card) => {
              const accent = ALIGNMENT_COLORS[card.alignment]?.glow || '#a855f7';
              return (
                <button
                  key={card.id}
                  onClick={() => onGrant(target, card)}
                  className="w-full text-left glass-card p-2 rounded hover:scale-[1.01] transition-[transform,box-shadow]"
                  style={{ borderColor: `${accent}30` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ui-sm" style={{ color: accent }}>{card.name}</span>
                    <span className="text-term-faint text-ui-xs uppercase">{card.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-term-purple/15">
        <button
          onClick={onToggleOpponentLock}
          className="w-full py-2 rounded text-ui-sm font-bold glass-card transition-[transform,box-shadow] hover:scale-[1.01]"
          style={{ borderColor: opponentLocked ? '#ff444480' : '#33333380', color: opponentLocked ? '#ff6666' : '#888888' }}
        >
          {opponentLocked ? 'OPPONENT DOMAIN LOCK: ON' : 'OPPONENT DOMAIN LOCK: OFF'}
        </button>
        <div className="text-term-faint text-ui-xs mt-1 text-center">Prevents opponent from changing the domain</div>
      </div>
    </div>
  );
}