import React from 'react';
import { Check } from 'lucide-react';

// FamilyCarouselCard — glass card for the family carousel.
export default function FamilyCarouselCard({ family, paradigms, selectedParadigmId, isCenter }) {
  const selected = selectedParadigmId ? paradigms.find((p) => p.id === selectedParadigmId) : null;

  return (
    <div className={`game-card-premium holo-frame relative flex h-full max-h-[460px] w-full max-w-[320px] flex-col overflow-hidden break-words rounded-2xl border border-t-white/20 bg-slate-950 p-5 opacity-100 ${isCenter ? 'pointer-events-auto' : ''}`} style={{ '--accent-color': isCenter ? '#00ffff' : '#a855f7' }}>
      <div className="relative mb-4 max-w-full truncate text-center text-base font-bold uppercase tracking-[0.12em] text-term-blue md:text-lg"
        style={{ textShadow: '0 0 12px rgba(0,255,255,0.3)' }}
      >
        {family.name}
      </div>

      {selected ? (
        <div className="mb-4 p-3 rounded border border-term-green/30 bg-term-green/5 relative">
          <div className="text-term-faint text-ui-xs tracking-[0.15em] mb-1 font-bold">SELECTED</div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-term-green shrink-0" />
            <span className="font-bold text-ui-md text-term-green">{selected.name}</span>
          </div>
        </div>
      ) : (
        <div className="holo-slot mb-4 rounded-lg p-3 text-center" style={{ '--accent-color': '#a855f7' }}>
          <span className="holo-slot-core text-ui-sm font-bold uppercase tracking-[0.14em]">None selected</span>
        </div>
      )}

      <div className="relative max-h-[220px] flex-1 space-y-2 overflow-y-auto break-words text-xs leading-normal md:text-sm">
        {paradigms.map((p) => {
          const isSelected = p.id === selectedParadigmId;
          return (
            <div
              key={p.id}
              className={`flex items-center justify-between px-3 py-2 rounded text-ui-md transition-all ${
                isSelected
                  ? 'bg-term-green/10 text-term-green border border-term-green/30'
                  : 'text-term-dim border border-transparent'
              }`}
            >
              <span className="font-bold">{p.name}</span>
              {isSelected && <Check className="w-5 h-5" />}
            </div>
          );
        })}
      </div>

      {isCenter && (
        <div className="text-center text-term-purple text-ui-sm mt-3 pt-3 border-t border-term-purple/15 font-bold tracking-[0.15em] relative">
          [ CLICK TO BROWSE ]
        </div>
      )}
    </div>
  );
}