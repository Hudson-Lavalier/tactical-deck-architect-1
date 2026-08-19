import React, { useMemo } from 'react';

// CosmicBackground — reusable deep-space backdrop.
// Layered radial nebula washes + a generated starfield + faint scanlines.
// Fixed full-screen; all other content renders above it.
// Stars are generated once via useMemo for performance.
export default function CosmicBackground({ density = 70 }) {
  const stars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < density; i++) {
      arr.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() < 0.8 ? 1 : 2,
        opacity: 0.2 + Math.random() * 0.6,
        delay: Math.random() * 4,
      });
    }
    return arr;
  }, [density]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden cosmic-shell" style={{ zIndex: 0 }}>
      {/* Nebula washes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 15% 10%, rgba(26, 11, 46, 0.45), transparent 55%), radial-gradient(ellipse 55% 45% at 88% 92%, rgba(10, 22, 40, 0.4), transparent 50%)',
        }}
      />

      {/* Starfield */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-cosmic-pulse"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Faint scanlines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.15) 2px, rgba(0,255,65,0.15) 4px)',
        }}
      />

      {/* Vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  );
}