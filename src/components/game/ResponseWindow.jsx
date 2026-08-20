import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';

// ResponseWindow — counter an active card with rhetoric. 3s countdown.
export default function ResponseWindow({ activeCard, rhetoricCards, onCounter, onPass, timerSeconds = 3 }) {
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [selectedRhetoric, setSelectedRhetoric] = useState(null);
  const onPassRef = useRef(onPass);
  onPassRef.current = onPass;

  useEffect(() => {
    if (timeLeft <= 0) {
      onPassRef.current();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => Math.max(0, t - 0.1)), 100);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-40 font-mono">
      <div className="layered-panel p-6 max-w-2xl" style={{ borderColor: 'rgba(168,85,247,0.4)', boxShadow: '0 0 32px rgba(168,85,247,0.2)' }}>
        <div className="text-term-purple text-sm tracking-[0.15em] mb-4 text-center">
          ── RESPONSE WINDOW ── {timeLeft.toFixed(1)}s
        </div>

        <div className="flex justify-center mb-4">
          <div className="flex flex-col items-center">
            <div className="text-term-faint text-xs mb-2 tracking-[0.15em]">ACTIVE CARD</div>
            <Card card={activeCard} size="large" />
          </div>
        </div>

        {rhetoricCards.length > 0 ? (
          <div className="mb-4">
            <div className="text-term-faint text-xs mb-2 text-center tracking-[0.15em]">YOUR RHETORIC</div>
            <div className="flex gap-2 justify-center">
              {rhetoricCards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  size="small"
                  selected={selectedRhetoric === card.id}
                  onClick={() => setSelectedRhetoric(card.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-term-faint text-xs text-center mb-4 tracking-[0.15em]">
            [ NO RHETORIC CARDS — PASS ]
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => selectedRhetoric && onCounter(selectedRhetoric, 'counter')}
            disabled={!selectedRhetoric}
            className="px-6 py-2 rounded text-xs glass-card cosmic-sheen transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ borderColor: '#00ffff40', color: '#00ffff' }}
          >
            COUNTER
          </button>
          <button
            onClick={onPass}
            className="px-6 py-2 rounded text-xs glass-card transition-all hover:scale-105"
            style={{ borderColor: '#33333340', color: '#888888' }}
          >
            PASS
          </button>
        </div>

        <div className="mt-4 w-full h-1 bg-term-purple/10 rounded overflow-hidden">
          <div
            className="h-full transition-all duration-100"
            style={{
              width: `${(timeLeft / timerSeconds) * 100}%`,
              background: 'linear-gradient(90deg, #00ff41, #a855f7)',
              boxShadow: '0 0 8px rgba(168,85,247,0.4)',
            }}
          />
        </div>
      </div>
    </div>
  );
}