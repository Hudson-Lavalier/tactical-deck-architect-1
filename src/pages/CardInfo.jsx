import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { CARD_CATEGORIES } from '@/data/cardTypes';
import { ALL_CARDS } from '@/data/cards';
import Carousel3D from '@/components/Carousel3D';
import CategoryCarouselCard from '@/components/CategoryCarouselCard';
import RichText from '@/components/RichText';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

// Card Info — 3D nested carousel library.
// Top carousel: card type categories. Bottom carousel: cards in the centered category.
export default function CardInfo() {
  const navigate = useNavigate();
  const [centeredCategoryId, setCenteredCategoryId] = useState(null);

  const categories = Object.values(CARD_CATEGORIES);
  const centeredCategory = categories.find((c) => c.id === centeredCategoryId) || categories[0];
  const cards = (ALL_CARDS[centeredCategory?.id] || []);

  const handleCategoryCenterChange = useCallback((item) => {
    if (item) setCenteredCategoryId(item.id);
  }, []);

  return (
    <div className="min-h-screen bg-term-bg text-term-text font-mono p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/')} className="text-term-dim hover:text-term-green transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-ui-xl text-term-blue font-bold tracking-widest"
            style={{ textShadow: '0 0 10px rgba(0,255,255,0.4)' }}
          >
            CARD INFO
          </h1>
        </div>

        {/* Category Carousel */}
        <div className="mb-6">
          <div className="text-term-faint text-ui-xs tracking-wider mb-2 font-bold text-center">── CARD CATEGORIES ──</div>
          <Carousel3D
            items={categories}
            renderItem={(category) => (
              <CategoryCarouselCard
                category={category}
                cardCount={(ALL_CARDS[category.id] || []).length}
              />
            )}
            onCenterChange={handleCategoryCenterChange}
            itemWidth={280}
            itemHeight={400}
          />
        </div>

        {/* Cards in Category */}
        <div className="mb-6">
          <div className="text-term-faint text-ui-xs tracking-wider mb-2 font-bold text-center">
            ── {centeredCategory?.name.toUpperCase()} ──
          </div>
          {cards.length === 0 ? (
            <div className="border-2 border-term-border rounded bg-term-panel p-8 text-center">
              <div className="text-term-faint text-ui-md italic">
                [ AWAITING USER DEFINITION — NO CARDS INVENTED ]
              </div>
              <div className="text-term-faint text-ui-sm mt-2">
                Cards will appear here as they are defined per the master doc.
              </div>
            </div>
          ) : (
            <Carousel3D
              key={centeredCategory?.id}
              items={cards}
              renderItem={(card, isCenter) => (
                <CardCarouselCard card={card} isCenter={isCenter} />
              )}
              itemWidth={280}
              itemHeight={420}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Card carousel item — shows full card text with highlighted headers.
function CardCarouselCard({ card, isCenter }) {
  const alignmentInfo = card.alignment ? ALIGNMENT_COLORS[card.alignment] : null;
  return (
    <div className="w-full h-full p-4 border-2 border-term-border rounded bg-term-card flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-bold text-ui-lg" style={{ color: alignmentInfo?.glow || '#e0e0e0' }}>
            {card.name || 'UNNAMED'}
          </div>
          {alignmentInfo && (
            <div className="text-ui-xs font-bold mt-0.5" style={{ color: alignmentInfo.glow }}>
              {alignmentInfo.name}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-term-border my-2" />

      {/* Card text */}
      <div className="flex-1 overflow-y-auto pr-1 min-h-0">
        {card.text ? (
          <RichText text={card.text} alignment={card.alignment} />
        ) : (
          <div className="text-term-faint text-ui-sm italic">[ NO TEXT DEFINED ]</div>
        )}
      </div>

      {/* Category footer */}
      {card.category && (
        <div className="text-term-faint text-ui-xs mt-2 pt-2 border-t border-term-border">
          {card.category.replace(/_/g, ' ').toUpperCase()}
        </div>
      )}
    </div>
  );
}