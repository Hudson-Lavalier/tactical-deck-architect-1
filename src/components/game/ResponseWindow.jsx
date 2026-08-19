import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';

// ResponseWindow — shows the active card and lets the player counter with rhetoric.
// 3-second countdown timer. When it expires, auto-passes.
// The window only appears for the player who has the rhetoric card.
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 font-mono">
      <div className="border-2 border-[#a855f7] bg-[#0a0a0a] p-6 rounded max-w-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)]">
        <div className="text-[#a855f7] text-sm tracking-wider mb-4 text-center">
          ── RESPONSE WINDOW ── {timeLeft.toFixed(1)}s
        </div>

        {/* Active card */}
        <div className="flex justify-center mb-4">
          <div className="flex flex-col items-center">
            <div className="text-[#555] text-xs mb-2">ACTIVE CARD</div>
            <Card card={activeCard} size="large" />
          </div>
        </div>

        {/* Available rhetoric */}
        {rhetoricCards.length > 0 ? (
          <div className="mb-4">
            <div className="text-[#555] text-xs mb-2 text-center">YOUR RHETORIC</div>
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
          <div className="text-[#555] text-xs text-center mb-4">
            [ NO RHETORIC CARDS — PASS ]
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => selectedRhetoric && onCounter(selectedRhetoric, 'counter')}
            disabled={!selectedRhetoric}
            className="px-6 py-2 border-2 border-[#00ffff] text-[#00ffff] rounded text-xs hover:bg-[#00ffff] hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            COUNTER
          </button>
          <button
            onClick={onPass}
            className="px-6 py-2 border-2 border-[#555] text-[#555] rounded text-xs hover:bg-[#555] hover:text-black transition-all"
          >
            PASS
          </button>
        </div>

        {/* Timer bar */}
        <div className="mt-4 w-full h-1 bg-[#111] rounded overflow-hidden">
          <div
            className="h-full transition-all duration-100"
            style={{
              width: `${(timeLeft / timerSeconds) * 100}%`,
              background: 'linear-gradient(90deg, #00ff41, #a855f7)',
            }}
          />
        </div>
      </div>
    </div>
  );
}