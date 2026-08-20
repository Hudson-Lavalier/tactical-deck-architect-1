import React, { useMemo } from 'react';

export default function ParticleBurst({ color = '#a855f7', className = '' }) {
  const particles = useMemo(() => Array.from({ length: 18 }, (_, index) => ({
    angle: (360 / 18) * index,
    distance: 54 + (index % 4) * 14,
    delay: (index % 3) * 24,
    size: 3 + (index % 3),
  })), []);

  return (
    <div className={`pointer-events-none absolute left-1/2 top-1/2 z-[70] ${className}`} aria-hidden="true">
      {particles.map((particle, index) => (
        <span
          key={index}
          className="game-particle"
          style={{
            '--particle-color': color,
            '--particle-x': `${Math.cos((particle.angle * Math.PI) / 180) * particle.distance}px`,
            '--particle-y': `${Math.sin((particle.angle * Math.PI) / 180) * particle.distance}px`,
            '--particle-delay': `${particle.delay}ms`,
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
    </div>
  );
}