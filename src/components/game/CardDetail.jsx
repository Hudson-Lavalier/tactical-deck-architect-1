import React from 'react';
import Card from './Card';

// CardDetail — modal showing a card's full details.
// Click a card in hand to see it up close, then SELECT to play or CLOSE.
export default function CardDetail({ card, onSelect, onClose }) {
  if (!card) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 font-mono" onClick={onClose}>
      <div className="border-2 border-[#a855f7] bg-[#0a0a0a] p-6 rounded max-w-md shadow-[0_0_30px_rgba(168,85,247,0.3)]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-center mb-4">
          <Card card={card} size="large" />
        </div>
        <div className="text-[#e0e0e0] text-sm mb-2 text-center">{card.name || 'UNNAMED CARD'}</div>
        <div className="text-[#888] text-xs mb-4 text-center">{card.text || card.description || '[ NO DESCRIPTION ]'}</div>
        <div className="flex gap-3 justify-center">
          {onSelect && (
            <button
              onClick={onSelect}
              className="px-4 py-2 border-2 border-[#00ff41] text-[#00ff41] rounded text-xs hover:bg-[#00ff41] hover:text-black transition-all"
            >
              SELECT
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 border-[#555] text-[#555] rounded text-xs hover:bg-[#555] hover:text-black transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}