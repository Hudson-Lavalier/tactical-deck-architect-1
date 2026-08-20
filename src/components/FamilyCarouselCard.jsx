import React from 'react';
import { Check } from 'lucide-react';

// FamilyCarouselCard — glass card for the family carousel.
export default function FamilyCarouselCard({ family, paradigms, selectedParadigmId, isCenter }) {
  const selected = selectedParadigmId ? paradigms.find((p) => p.id === selectedParadigmId) : null;

  return (
    <div className="w-full h-full p-5 rounded glass-card cosmic-sheen flex flex-col relative overflow-hidden"
      style={{ borderColor: isCenter ? 'rgba(0,255,255,0.25)' : 'rgba(168,85,247,0.12)' }}
    >
      <div className="text-term-blue font-bold text-ui-lg text-center tracking-[0.15em] mb-4 relative"
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
        <div className="mb-4 p-3 border border-dashed border-term-purple/20 rounded text-center">
          <span className="text-term-faint text-ui-sm">— NONE SELECTED —</span>
        </div>
      )}

      <div className="space-y-2 flex-1 relative">
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