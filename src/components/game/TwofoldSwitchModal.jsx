import React from 'react';
import Card from './Card';
import { ALIGNMENT_COLORS } from './terminalTheme';

// TwofoldSwitchModal — pick which attached domain is active.
// Mirrors the CardDetail modal styling. Switching does not end the turn.
export default function TwofoldSwitchModal({ domainAttached, switchesLeft, onSwitch, onClose }) {
  const attached = domainAttached || { left: null, right: null, activeSide: null };
  const disabled = switchesLeft <= 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 font-mono" onClick={onClose}>
      <div className="glass-panel glass-blur cosmic-sheen p-6 max-w-lg w-[90vw]" style={{ borderColor: '#a855f740' }} onClick={(e) => e.stopPropagation()}>
        <div className="text-term-purple text-ui-md tracking-[0.15em] mb-2 text-center font-bold">── SWITCH ACTIVE DOMAIN ──</div>
        <div className="text-term-faint text-ui-xs text-center mb-4 tracking-[0.15em]">
          SWITCHES REMAINING: <span className="text-term-purple font-bold">{switchesLeft}/2</span>
        </div>

        <div className="flex justify-center gap-6 mb-6">
          {['left', 'right'].map((side) => {
            const card = attached[side];
            const isActive = attached.activeSide === side;
            const accent = side === 'left' ? ALIGNMENT_COLORS.A.glow : ALIGNMENT_COLORS.B.glow;
            return (
              <div key={side} className="flex flex-col items-center gap-2">
                <div className="text-term-faint text-ui-xs tracking-[0.15em] font-bold">{side.toUpperCase()}</div>
                {card ? (
                  <div className={`relative ${isActive ? 'ring-2 ring-offset-2 ring-offset-[#050308]' : 'opacity-70'}`} style={{ '--tw-ring-color': accent }}>
                    <Card card={card} size="medium" />
                    {isActive && <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 rounded" style={{ background: accent, color: '#050308' }}>ACTIVE</div>}
                  </div>
                ) : (
                  <div className="w-24 h-36 rounded glass-card flex items-center justify-center" style={{ borderColor: `${accent}20`, borderStyle: 'dashed' }}>
                    <span className="text-term-faint text-[10px]">[ NONE ]</span>
                  </div>
                )}
                <button
                  onClick={() => onSwitch(side)}
                  disabled={disabled || !card || isActive}
                  className="px-3 py-1.5 rounded text-ui-xs glass-card transition-[transform,box-shadow] hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ borderColor: `${accent}40`, color: accent }}
                >
                  {isActive ? 'ACTIVE' : 'MAKE ACTIVE'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button onClick={onClose} className="px-6 py-2 rounded text-ui-sm glass-card transition-[transform,box-shadow] hover:scale-105" style={{ borderColor: '#33333340', color: '#888888' }}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}