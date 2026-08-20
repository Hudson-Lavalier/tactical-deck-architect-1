import React, { useState } from 'react';
import Card from './Card';
import { ALIGNMENT_COLORS } from './terminalTheme';

// TwofoldAttachModal — pick a Grounding domain (left) and a System domain
// (right) from hand to attach to Twofold Reality. Either may be skipped.
export default function TwofoldAttachModal({ hand, onConfirm, onClose }) {
  const [leftId, setLeftId] = useState(null);
  const [rightId, setRightId] = useState(null);

  const groundingDomains = hand.filter((c) => c.category === 'domain' && c.alignment === 'A');
  const systemDomains = hand.filter((c) => c.category === 'domain' && c.alignment === 'B');

  const left = hand.find((c) => c.id === leftId);
  const right = hand.find((c) => c.id === rightId);

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 font-mono" onClick={onClose}>
      <div className="layered-panel p-6 max-w-2xl w-[90vw]" style={{ borderColor: '#a855f740' }} onClick={(e) => e.stopPropagation()}>
        <div className="text-term-purple text-ui-md tracking-[0.15em] mb-4 text-center font-bold">── ATTACH DOMAINS TO TWOFOLD REALITY ──</div>

        <div className="grid grid-cols-2 gap-4">
          {/* Left — Grounding */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-term-faint text-ui-xs tracking-[0.15em] font-bold">LEFT · GROUNDING</div>
            {left ? <Card card={left} size="medium" /> : <div className="w-24 h-36 rounded glass-card flex items-center justify-center" style={{ borderColor: 'rgba(0,255,65,0.2)', borderStyle: 'dashed' }}><span className="text-term-faint text-[10px]">[ NONE ]</span></div>}
            <div className="flex flex-wrap gap-1 justify-center max-h-24 overflow-y-auto">
              {groundingDomains.length === 0 ? (
                <span className="text-term-faint text-ui-xs">[ NO GROUNDING DOMAINS IN HAND ]</span>
              ) : groundingDomains.map((c) => (
                <button key={c.id} onClick={() => setLeftId(c.id)} className={`px-2 py-1 rounded text-ui-xs glass-card transition hover:scale-105 ${leftId === c.id ? 'ring-2' : ''}`} style={{ borderColor: leftId === c.id ? ALIGNMENT_COLORS.A.glow : '#33333340', color: ALIGNMENT_COLORS.A.glow }}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right — System */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-term-faint text-ui-xs tracking-[0.15em] font-bold">RIGHT · SYSTEM</div>
            {right ? <Card card={right} size="medium" /> : <div className="w-24 h-36 rounded glass-card flex items-center justify-center" style={{ borderColor: 'rgba(0,255,255,0.2)', borderStyle: 'dashed' }}><span className="text-term-faint text-[10px]">[ NONE ]</span></div>}
            <div className="flex flex-wrap gap-1 justify-center max-h-24 overflow-y-auto">
              {systemDomains.length === 0 ? (
                <span className="text-term-faint text-ui-xs">[ NO SYSTEM DOMAINS IN HAND ]</span>
              ) : systemDomains.map((c) => (
                <button key={c.id} onClick={() => setRightId(c.id)} className={`px-2 py-1 rounded text-ui-xs glass-card transition hover:scale-105 ${rightId === c.id ? 'ring-2' : ''}`} style={{ borderColor: rightId === c.id ? ALIGNMENT_COLORS.B.glow : '#33333340', color: ALIGNMENT_COLORS.B.glow }}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <button onClick={() => onConfirm(leftId, rightId)} className="px-6 py-2 rounded text-ui-sm glass-card transition-[transform,box-shadow] hover:scale-105" style={{ borderColor: '#a855f740', color: '#a855f7' }}>
            CONFIRM
          </button>
          <button onClick={onClose} className="px-6 py-2 rounded text-ui-sm glass-card transition-[transform,box-shadow] hover:scale-105" style={{ borderColor: '#33333340', color: '#888888' }}>
            SKIP
          </button>
        </div>
      </div>
    </div>
  );
}