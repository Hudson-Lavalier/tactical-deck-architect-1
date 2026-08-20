import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

import CosmicBackground from '@/components/CosmicBackground';
import GlassPanel from '@/components/GlassPanel';
import { CARD_CATEGORIES } from '@/data/cardTypes';
import { ALL_CARDS } from '@/data/cards';
import { CARD_OVERVIEWS } from '@/data/cardOverviews';
import Carousel3D from '@/components/Carousel3D';
import RichText from '@/components/RichText';
import ItemViewer from '@/components/game/ItemViewer';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';

export default function CardInfo() {
  const navigate = useNavigate();
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [showOverview, setShowOverview] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const categories = Object.values(CARD_CATEGORIES);
  const activeCategory = categories.find((category) => category.id === activeCategoryId) || categories[0];
  const cards = ALL_CARDS[activeCategory?.id] || [];
  const overview = CARD_OVERVIEWS[activeCategory?.id];

  const alignmentCounts = cards.reduce((counts, card) => {
    if (card.alignment) counts[card.alignment] = (counts[card.alignment] || 0) + 1;
    return counts;
  }, {});

  const [dims, setDims] = useState(() => computeDims());

  const handleTabClick = useCallback((id) => setActiveCategoryId(id), []);

  useEffect(() => {
    const onResize = () => setDims(computeDims());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="cosmic-shell relative flex min-h-screen flex-col overflow-x-hidden p-4 font-mono text-term-text md:p-6">
      <CosmicBackground density={60} />

      <div className="relative z-10 flex flex-1 flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="hud-control rounded-lg p-1 text-term-dim transition-all hover:-translate-y-0.5 hover:text-term-green">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-ui-xl font-bold uppercase tracking-[0.2em] text-term-blue drop-shadow-[0_0_8px_rgba(0,255,255,0.45)]">Card Info</h1>
        </div>

        {/* Category Tab Bar */}
        <div className="cyber-panel mb-3 flex flex-wrap justify-center gap-2 rounded-2xl border border-white/10 border-t-white/20 bg-cosmic-deep/75 p-2 backdrop-blur-xl">
          {categories.map((category) => {
            const count = (ALL_CARDS[category.id] || []).length;
            const isActive = category.id === activeCategory.id;
            return (
              <button
                key={category.id}
                onClick={() => handleTabClick(category.id)}
                className={`hud-control relative rounded-lg border-t border-t-white/10 px-4 py-2 text-ui-sm font-bold uppercase tracking-[0.12em] backdrop-blur-md transition-all duration-300 ${
                  isActive
                    ? 'border border-term-blue/40 bg-term-blue/10 text-term-blue shadow-[inset_0_-2px_0_rgba(0,255,255,0.8),0_0_14px_rgba(0,255,255,0.12)]'
                    : 'border border-transparent text-term-faint glass-card hover:-translate-y-0.5 hover:text-term-text'
                }`}
              >
                {category.name}<span className="ml-1.5 text-ui-xs opacity-70">[{count}]</span>
              </button>
            );
          })}
        </div>

        {/* Inline Category HUD Header & Metadata Strip */}
        <div className="cyber-panel mb-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 border-t-white/20 bg-cosmic-deep/80 px-4 py-2.5 backdrop-blur-xl">
          {/* Active Category Title & Overview Trigger */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-ui-sm font-bold uppercase tracking-[0.2em] text-term-blue">
              {activeCategory.name} <span className="text-term-faint">·</span> {activeCategory.system} SYSTEM
            </div>
            {overview && (
              <button
                onClick={() => setShowOverview(true)}
                className="hud-control flex items-center gap-1.5 rounded-lg border border-term-blue/40 bg-term-blue/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-term-blue transition-all hover:-translate-y-0.5 hover:bg-term-blue/20"
              >
                <BookOpen className="h-3.5 w-3.5" /> OVERVIEW
              </button>
            )}
          </div>

          {/* Embedded Stats Chips (Cards, Grounding, System, Adaptation) */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]">
              <span className="text-term-faint">CARDS:</span>
              <span className="text-term-blue">{cards.length}</span>
            </div>

            {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
              <div
                key={key}
                className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{ color: info.glow }}
              >
                <span className="opacity-75">{info.name}:</span>
                <span>{alignmentCounts[key] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Centered 3D Carousel */}
        {cards.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <GlassPanel className="cyber-panel max-w-xl border-t border-t-white/20 p-12 text-center backdrop-blur-xl">
              <div className="mb-3 text-ui-lg italic text-term-faint">Awaiting card definitions</div>
              <div className="text-ui-md text-term-dim">Cards will appear here as they are defined.</div>
            </GlassPanel>
          </div>
        ) : (
          <div className="relative flex flex-1 items-center justify-center overflow-hidden py-2">
            <Carousel3D
              key={activeCategory.id}
              items={cards}
              renderItem={(card, isCenter) => <CardCarouselCard card={card} isCenter={isCenter} />}
              onItemClick={(card) => setSelectedCard(card)}
              itemWidth={dims.cardW}
              itemHeight={dims.cardH}
            />
          </div>
        )}
      </div>

      {/* Full Category Overview Modal */}
      {showOverview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 font-mono backdrop-blur-xl" onClick={() => setShowOverview(false)}>
          <div className="cyber-panel relative flex max-h-[84vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-term-blue/30 border-t-white/20 bg-slate-950/90 p-6" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 border-b border-white/10 pb-4 pr-12">
              <div className="text-ui-xs font-bold uppercase tracking-[0.22em] text-term-faint">Category documentation</div>
              <h2 className="mt-2 text-ui-xl font-bold uppercase tracking-[0.12em] text-term-blue">{activeCategory.name}</h2>
            </div>
            <div className="card-overview-copy min-h-0 flex-1 overflow-y-auto pr-3 text-ui-sm leading-relaxed text-term-text md:text-ui-md"><RichText text={overview} /></div>
            <button onClick={() => setShowOverview(false)} className="hud-control absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-cosmic-deep/80 font-bold text-term-faint hover:text-term-text" aria-label="Close overview">✕</button>
          </div>
        </div>
      )}

      {/* 3D Item Inspection Modal */}
      {selectedCard && <ItemViewer card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  );
}

function CardCarouselCard({ card, isCenter }) {
  const alignmentInfo = card.alignment ? ALIGNMENT_COLORS[card.alignment] : null;
  const accent = alignmentInfo?.glow || '#a855f7';
  return (
    <div
      className={`group game-card-premium holo-frame relative flex h-full max-h-[460px] w-full max-w-[320px] flex-col overflow-hidden break-words rounded-2xl border border-t-white/20 bg-cosmic-deep/90 p-4 opacity-100 backdrop-blur-xl transition-all duration-300 ${
        isCenter ? 'pointer-events-auto' : ''
      }`}
      style={{ '--accent-color': accent, boxShadow: 'none' }}
    >
      <div
        className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${accent}33 0%, rgba(12, 10, 20, 0.95) 85%)`,
        }}
      />

      <div className="relative z-10 flex min-w-0 items-start justify-between gap-2">
        <span className="accent-border accent-bg-subtle max-w-[65%] truncate rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] md:text-xs" style={{ color: accent }}>{alignmentInfo?.name || 'Unaligned'}</span>
        <span className="max-w-[35%] truncate text-right text-[10px] font-bold uppercase tracking-[0.12em] text-term-faint md:text-xs">{card.subcategory || card.category?.replace(/_/g, ' ')}</span>
      </div>
      <div className="game-card-concept relative z-10 my-3 flex min-h-24 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-cosmic-deep/80 px-3 py-4 text-center">
        <div className="game-card-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative z-10 max-w-full truncate text-base font-bold uppercase leading-tight tracking-[0.06em] md:text-lg" style={{ color: accent }}>{card.name || 'UNNAMED'}</div>
      </div>
      <div className="cyber-richtext relative z-10 min-h-0 max-h-[220px] flex-1 overflow-y-auto break-words rounded-xl border border-white/10 bg-cosmic-deep/55 p-3 pr-2 text-xs leading-normal md:text-sm">
        {card.text ? <RichText text={card.text} alignment={card.alignment} /> : <div className="text-ui-md italic text-term-faint">No text defined</div>}
      </div>
      {card.category && <div className="holo-slot-core relative z-10 mt-3 truncate border-t border-white/10 pt-2 text-ui-xs font-bold uppercase tracking-[0.16em]">{card.category.replace(/_/g, ' ')}</div>}
    </div>
  );
}

function computeDims() {
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const cardH = Math.min(460, Math.max(320, Math.round(vh * 0.5)));
  const cardW = Math.min(320, Math.max(280, Math.round(cardH * 0.7), Math.round((vw - 120) / 5)));
  return { cardW, cardH };
}