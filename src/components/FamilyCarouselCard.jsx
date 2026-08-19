import React from 'react';
import { Check } from 'lucide-react';

// FamilyCarouselCard — a family box for the 3D carousel.
// Shows the family name, its 3 paradigms, and which one is selected for this family.
// One paradigm per family (selection is keyed by family id).
export default function FamilyCarouselCard({ family, paradigms, selectedParadigmId, isCenter }) {
  const selected = selectedParadigmId
    ? paradigms.find((p) => p.id === selectedParadigmId)
    : null;

  return (
    <div className="w-full h-full p-6 border-2 border-term-border rounded bg-term-card flex flex-col">
      <div className="text-term-blue font-bold text-ui-xl text-center tracking-wider mb-5">
        {family.name}
      </div>

      {/* Selected paradigm highlight */}
      {selected ? (
        <div className="mb-4 p-3 border-2 border-term-green/40 rounded bg-term-green/5">
          <div className="text-term-faint text-ui-xs tracking-wider mb-1 font-bold">SELECTED</div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-term-green shrink-0" />
            <span className="font-bold text-ui-lg text-term-green">{selected.name}</span>
          </div>
        </div>
      ) : (
        <div className="mb-4 p-3 border-2 border-dashed border-term-border rounded text-center">
          <span className="text-term-faint text-ui-sm">— NONE SELECTED —</span>
        </div>
      )}

      {/* All paradigms list */}
      <div className="space-y-2 flex-1">
        {paradigms.map((p) => {
          const isSelected = p.id === selectedParadigmId;
          return (
            <div
              key={p.id}
              className={`flex items-center justify-between px-4 py-2.5 rounded text-ui-md ${
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

      {/* Click hint */}
      {isCenter && (
        <div className="text-center text-term-purple text-ui-sm mt-4 pt-3 border-t border-term-border font-bold tracking-wider">
          [ CLICK TO BROWSE ]
        </div>
      )}
    </div>
  );
}