import React from 'react';

// CategoryCarouselCard — a card type category box for the 3D carousel.
// Shows the category name, system, role, and mechanics.
export default function CategoryCarouselCard({ category, cardCount, isCenter }) {
  return (
    <div className="game-card-premium holo-frame relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-t-white/20 bg-cosmic-deep/85 p-5 backdrop-blur-xl" style={{ '--accent-color': isCenter ? '#a855f7' : '#888888' }}>
      {/* System badge */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-term-faint text-ui-xs font-bold tracking-wider">
          {category.system.toUpperCase()}
        </span>
        <span className="text-term-faint text-ui-xs font-bold">[{cardCount} CARDS]</span>
      </div>

      {/* Category name */}
      <div className="accent-text-glow mb-2 text-ui-lg font-bold uppercase tracking-[0.08em] text-term-purple">
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