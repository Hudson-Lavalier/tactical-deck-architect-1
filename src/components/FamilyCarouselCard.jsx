import React from 'react';
import { Check } from 'lucide-react';

// FamilyCarouselCard — a family box for the 3D carousel.
// Shows the family name and its 3 paradigms with selection indicators.
export default function FamilyCarouselCard({ family, paradigms, selectedIds }) {
  const selectedInFamily = paradigms.filter((p) => selectedIds.includes(p.id)).length;

  return (
    <div className="w-full h-full p-5 border-2 border-term-border rounded bg-term-card flex flex-col">
      <div className="text-term-blue font-bold text-ui-lg text-center tracking-wider mb-4">
        {family.name}
      </div>
      <div className="space-y-2 flex-1">
        {paradigms.map((p) => {
          const isSelected = selectedIds.includes(p.id);
          return (
            <div
              key={p.id}
              className={`flex items-center justify-between px-3 py-2 rounded text-ui-sm ${
                isSelected ? 'bg-term-green/10 text-term-green border border-term-green/30' : 'text-term-dim border border-transparent'
              }`}
            >
              <span className="font-bold">{p.name}</span>
              {isSelected && <Check className="w-4 h-4" />}
            </div>
          );
        })}
      </div>
      {selectedInFamily > 0 && (
        <div className="text-center text-term-green text-ui-xs mt-3 font-bold tracking-wider">
          {selectedInFamily} SELECTED
        </div>
      )}
    </div>
  );
}