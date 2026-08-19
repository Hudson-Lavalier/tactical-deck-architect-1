import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CARD_CATEGORIES } from '@/data/cardTypes';
import { ALL_CARDS } from '@/data/cards';

// Card Info — gallery explaining all cards.
// Per framework: shows visual image of card, text, and mechanical effects.
// Currently empty — no cards are invented. Will populate as user defines cards.
export default function CardInfo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#000000] text-[#e0e0e0] font-mono p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/')} className="text-[#888] hover:text-[#00ff41] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl text-[#00ffff] font-bold tracking-widest"
            style={{ textShadow: '0 0 10px rgba(0,255,255,0.4)' }}
          >
            CARD INFO
          </h1>
        </div>

        {/* Category sections */}
        <div className="space-y-6">
          {Object.values(CARD_CATEGORIES).map((category) => {
            const cards = ALL_CARDS[category.id] || [];
            return (
              <div key={category.id} className="border border-[#1a1a2e] rounded p-4 bg-[#0a0a0a]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-lg text-[#a855f7] font-bold">{category.name}</h2>
                    <div className="text-[#555] text-[10px]">{category.system} SYSTEM</div>
                  </div>
                  <div className="text-[#555] text-xs font-bold">
                    [{cards.length} CARDS]
                  </div>
                </div>
                <p className="text-[#888] text-xs mb-3">{category.role}</p>

                {cards.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {cards.map((card) => (
                      <div key={card.id} className="p-2 border border-[#1a1a2e] rounded bg-[#0d0d12]">
                        <div className="text-[#e0e0e0] text-xs font-bold">{card.name}</div>
                        <div className="text-[#555] text-[9px]">{card.alignment} — {category.name}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#444] text-xs italic py-4 text-center">
                    [ AWAITING USER DEFINITION — NO CARDS INVENTED ]
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}