import React from 'react';
import Card from './Card';

// CardDetail — modal showing a card's full details. Glass panel.
export default function CardDetail({ card, onSelect, onClose }) {
  if (!card) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 font-mono" onClick={onClose}>
      <div className="glass-panel cosmic-sheen p-6 max-w-md" style={{ borderColor: 'rgba(168,85,247,0.4)', boxShadow: '0 0 32px rgba(168,85,247,0.2)' }} onClick={e => e.stopPropagation()}>
        <div className="flex justify-center mb-4">
          <Card card={card} size="large" />
        </div>
        <div className="text-term-text text-sm mb-2 text-center font-bold">{card.name || 'UNNAMED CARD'}</div>
        <div className="text-term-dim text-xs mb-4 text-center leading-relaxed">{card.text || card.description || '[ NO DESCRIPTION ]'}</div>
        <div className="flex gap-3 justify-center">
          {onSelect && (
            <button
              onClick={onSelect}
              className="px-4 py-2 rounded text-xs glass-card cosmic-sheen transition-all hover:scale-105"
              style={{ borderColor: '#00ff4140', color: '#00ff41' }}
            >
              SELECT
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-xs glass-card transition-all hover:scale-105"
            style={{ borderColor: '#33333340', color: '#888888' }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}