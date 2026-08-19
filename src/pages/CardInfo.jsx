import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { CARD_CATEGORIES } from '@/data/cardTypes';
import { ALL_CARDS } from '@/data/cards';
import Carousel3D from '@/components/Carousel3D';
import RichText from '@/components/RichText';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

// Card Info — large full-width carousel.
// Simple horizontal category tabs at top; cards in the selected category
// render in a big 3D carousel that fills most of the screen.
export default function CardInfo() {
  const navigate = useNavigate();
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const categories = Object.values(CARD_CATEGORIES);
  const activeCategory = categories.find((c) => c.id === activeCategoryId) || categories[0];
  const cards = ALL_CARDS[activeCategory?.id] || [];

  const handleTabClick = useCallback((id) => {
    setActiveCategoryId(id);
  }, []);

  return (
    <div className="min-h-screen bg-term-bg text-term-text font-mono p-4 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate('/')} className="text-term-dim hover:text-term-green transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1
          className="text-ui-xl text-term-blue font-bold tracking-widest"
          style={{ textShadow: '0 0 10px rgba(0,255,255,0.4)' }}
        >
          CARD INFO
        </h1>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map((cat) => {
          const count = (ALL_CARDS[cat.id] || []).length;
          const isActive = cat.id === activeCategory.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleTabClick(cat.id)}
              className={`px-5 py-2.5 border-2 rounded text-ui-md font-bold tracking-wider transition-all ${
                isActive
                  ? 'border-term-blue text-term-blue bg-term-blue/10'
                  : 'border-term-border text-term-faint hover:border-term-border-hover hover:text-term-dim'
              }`}
            >
              {cat.name.toUpperCase()}
              <span className="ml-2 text-ui-xs opacity-70">[{count}]</span>
            </button>
          );
        })}
      </div>

      {/* Active category label */}
      <div className="text-term-faint text-ui-sm tracking-wider mb-4 font-bold text-center">
        ── {activeCategory.name.toUpperCase()} — {activeCategory.system.toUpperCase()} SYSTEM ──
      </div>

      {/* Cards carousel OR empty state */}
      {cards.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="border-2 border-term-border rounded bg-term-panel p-12 text-center max-w-xl">
            <div className="text-term-faint text-ui-lg italic mb-3">
              [ AWAITING USER DEFINITION — NO CARDS INVENTED ]
            </div>
            <div className="text-term-dim text-ui-md">
              Cards will appear here as they are defined per the master doc.
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center">
          <Carousel3D
            key={activeCategory.id}
            items={cards}
            renderItem={(card, isCenter) => (
              <CardCarouselCard card={card} isCenter={isCenter} />
            )}
            itemWidth={480}
            itemHeight={640}
          />
        </div>
      )}
    </div>
  );
}

// Card carousel item — shows full card text with highlighted headers.
function CardCarouselCard({ card, isCenter }) {
  const alignmentInfo = card.alignment ? ALIGNMENT_COLORS[card.alignment] : null;
  return (
    <div className="w-full h-full p-6 border-2 border-term-border rounded bg-term-card flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-ui-xl" style={{ color: alignmentInfo?.glow || '#e0e0e0' }}>
            {card.name || 'UNNAMED'}
          </div>
          {alignmentInfo && (
            <div className="text-ui-sm font-bold mt-1" style={{ color: alignmentInfo.glow }}>
              {alignmentInfo.name}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-term-border my-3" />

      {/* Card text */}
      <div className="flex-1 overflow-y-auto pr-1 min-h-0">
        {card.text ? (
          <RichText text={card.text} alignment={card.alignment} />
        ) : (
          <div className="text-term-faint text-ui-md italic">[ NO TEXT DEFINED ]</div>
        )}
      </div>

      {/* Category footer */}
      {card.category && (
        <div className="text-term-faint text-ui-sm mt-3 pt-3 border-t border-term-border">
          {card.category.replace(/_/g, ' ').toUpperCase()}
        </div>
      )}
    </div>
  );
}