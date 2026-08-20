import React from 'react';

// CategoryCarouselCard — a card type category box for the 3D carousel.
// Shows the category name, system, role, and mechanics.
export default function CategoryCarouselCard({ category, cardCount, isCenter }) {
  return (
    <div className="w-full h-full p-5 border-2 border-term-border rounded bg-term-card flex flex-col">
      {/* System badge */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-term-faint text-ui-xs font-bold tracking-wider">
          {category.system.toUpperCase()}
        </span>
        <span className="text-term-faint text-ui-xs font-bold">[{cardCount} CARDS]</span>
      </div>

      {/* Category name */}
      <div className="text-term-purple font-bold text-ui-lg mb-2 tracking-wide">
        {category.name}
      </div>

      {/* Role */}
      <div className="text-term-dim text-ui-sm mb-3 pb-3 border-b border-term-border">
        {category.role}
      </div>

      {/* Mechanics */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="text-term-faint text-ui-xs tracking-wider mb-2 font-bold">MECHANICS</div>
        <div className="space-y-1.5">
          {category.mechanics.map((mech, i) => (
            <div key={i} className="text-term-text text-ui-sm leading-relaxed flex gap-2">
              <span className="text-term-purple shrink-0">▸</span>
              <span>{mech}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Slot info */}
      {category.slot && (
        <div className="text-term-faint text-ui-xs mt-3 pt-3 border-t border-term-border">
          SLOT: {category.slot.toUpperCase()}
        </div>
      )}
    </div>
  );
}