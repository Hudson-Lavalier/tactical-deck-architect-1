import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import CosmicBackground from '@/components/CosmicBackground';
import GlassPanel from '@/components/GlassPanel';
import { CARD_CATEGORIES } from '@/data/cardTypes';
import { ALL_CARDS } from '@/data/cards';
import { CARD_OVERVIEWS } from '@/data/cardOverviews';
import Carousel3D from '@/components/Carousel3D';
import RichText from '@/components/RichText';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

// Card Info — large carousel with viewport-capped card sizing.
export default function CardInfo() {
  const navigate = useNavigate();
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const categories = Object.values(CARD_CATEGORIES);
  const activeCategory = categories.find((c) => c.id === activeCategoryId) || categories[0];
  const cards = ALL_CARDS[activeCategory?.id] || [];
  const overview = CARD_OVERVIEWS[activeCategory?.id];

  const handleTabClick = useCallback((id) => setActiveCategoryId(id), []);

  // Viewport-capped card dimensions so the full card always fits on screen.
  const [dims, setDims] = useState(() => computeDims());
  useEffect(() => {
    const onResize = () => setDims(computeDims());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="min-h-screen cosmic-shell text-term-text font-mono p-4 md:p-6 flex flex-col relative overflow-hidden">
      <CosmicBackground density={60} />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="text-term-dim hover:text-term-green transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1
            className="text-ui-xl text-term-blue font-bold tracking-[0.2em]"
            style={{ textShadow: '0 0 16px rgba(0,255,255,0.4)' }}
          >
            CARD INFO
          </h1>
        </div>

        {/* Category tabs — compact glass pill bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {categories.map((cat) => {
            const count = (ALL_CARDS[cat.id] || []).length;
            const isActive = cat.id === activeCategory.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleTabClick(cat.id)}
                className={`px-4 py-2 rounded text-ui-sm font-bold tracking-[0.1em] transition-all ${
                  isActive
                    ? 'text-term-blue bg-term-blue/10 border border-term-blue/40'
                    : 'text-term-faint border border-transparent hover:text-term-dim glass-card'
                }`}
              >
                {cat.name.toUpperCase()}
                <span className="ml-1.5 text-ui-xs opacity-60">[{count}]</span>
              </button>
            );
          })}
        </div>

        {/* Active category label */}
        <div className="text-term-faint text-ui-sm tracking-[0.15em] mb-3 font-bold text-center">
          ── {activeCategory.name.toUpperCase()} — {activeCategory.system.toUpperCase()} SYSTEM ──
        </div>

        {/* Category overview / summary (verbatim from the card-type document) */}
        {overview && (
          <div className="mb-3 glass-card cosmic-sheen p-3 max-h-[160px] overflow-y-auto">
            <div className="text-term-faint text-ui-xs tracking-[0.15em] mb-2 font-bold">── OVERVIEW ──</div>
            <RichText text={overview} />
          </div>
        )}

        {/* Cards carousel OR empty state */}
        {cards.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <GlassPanel className="p-12 text-center max-w-xl">
              <div className="text-term-faint text-ui-lg italic mb-3">
                [ AWAITING USER DEFINITION — NO CARDS INVENTED ]
              </div>
              <div className="text-term-dim text-ui-md">
                Cards will appear here as they are defined per the master doc.
              </div>
            </GlassPanel>
          </div>
        ) : (
          <div className="flex-1 flex items-center">
            <Carousel3D
              key={activeCategory.id}
              items={cards}
              renderItem={(card, isCenter) => (
                <CardCarouselCard card={card} isCenter={isCenter} />
              )}
              itemWidth={dims.cardW}
              itemHeight={dims.cardH}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function computeDims() {
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  // Cap card to ~55% viewport height; constrain width so 3 cards always fit.
  const cardH = Math.min(Math.round(vh * 0.55), 560);
  const cardW = Math.min(Math.round(cardH * 0.72), Math.round((vw - 120) / 3));
  return { cardW: Math.max(280, cardW), cardH: Math.max(320, cardH) };
}

// Card carousel item — glass frame with alignment-tinted depth.
function CardCarouselCard({ card, isCenter }) {
  const alignmentInfo = card.alignment ? ALIGNMENT_COLORS[card.alignment] : null;
  const accent = alignmentInfo?.glow || '#a855f7';

  return (
    <div
      className="w-full h-full p-5 rounded glass-card cosmic-sheen flex flex-col relative overflow-hidden"
      style={{
        borderColor: `${accent}30`,
        boxShadow: isCenter ? `0 0 28px ${accent}1a, inset 0 1px 0 rgba(255,255,255,0.04)` : 'inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2 relative">
        <div>
          <div className="font-bold text-ui-lg leading-tight" style={{ color: accent, textShadow: `0 0 10px ${accent}40` }}>
            {card.name || 'UNNAMED'}
          </div>
          {alignmentInfo && (
            <div className="text-ui-sm font-bold mt-0.5" style={{ color: accent }}>
              {alignmentInfo.name}
            </div>
          )}
        </div>
        {card.subcategory && (
          <div className="text-term-faint text-ui-xs text-right shrink-0">
            {card.subcategory}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t my-2 relative" style={{ borderColor: `${accent}20` }} />

      {/* Card text — scrollable, hidden scrollbar */}
      <div className="flex-1 overflow-y-auto pr-1 min-h-0 relative">
        {card.text ? (
          <RichText text={card.text} alignment={card.alignment} />
        ) : (
          <div className="text-term-faint text-ui-md italic">[ NO TEXT DEFINED ]</div>
        )}
      </div>

      {/* Category footer */}
      {card.category && (
        <div className="text-term-faint text-ui-xs mt-2 pt-2 border-t relative" style={{ borderColor: `${accent}15` }}>
          {card.category.replace(/_/g, ' ').toUpperCase()}
        </div>
      )}
    </div>
  );
}