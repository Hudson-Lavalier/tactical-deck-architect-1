import React from 'react';
import { ALIGNMENT_COLORS, ALIGNMENT_GLOW, ALIGNMENT_TEXT } from './terminalTheme';

// Card — renders a single card in the cosmic terminal style.
// Glass frame with alignment-tinted depth + top sheen.
// Size tiers scaled up to fill the viewport (desktop-first).
const SIZES = {
  small: { box: 'game-card-small aspect-[5/7] w-16 max-w-full', name: 'text-[10px]', body: 'text-[8px]', cat: 'text-[7px]', label: 'text-[9px]' },
  medium: { box: 'game-card-medium aspect-[5/7] w-20 max-w-full', name: 'text-[11px]', body: 'text-[9px]', cat: 'text-[8px]', label: 'text-[10px]' },
  normal: { box: 'game-card-normal aspect-[5/7] w-24 max-w-full', name: 'text-[13px]', body: 'text-[10px]', cat: 'text-[8px]', label: 'text-[11px]' },
  hand: { box: 'game-card-hand aspect-[5/7] w-28 max-w-full', name: 'text-[14px]', body: 'text-[10px]', cat: 'text-[8px]', label: 'text-[11px]' },
  large: { box: 'game-card-large aspect-[5/7] w-28 max-w-full', name: 'text-[14px]', body: 'text-[10px]', cat: 'text-[8px]', label: 'text-[11px]' },
  handView: { box: 'game-card-hand-view aspect-[5/7] w-48 max-w-[70vw] md:w-56', name: 'text-[18px]', body: 'text-[13px]', cat: 'text-[10px]', label: 'text-[13px]' },
  xlarge: { box: 'game-card-xlarge aspect-[5/7] w-48 max-w-full', name: 'text-[18px]', body: 'text-[13px]', cat: 'text-[10px]', label: 'text-[13px]' },
  inspection: { box: 'game-card-inspection aspect-[5/7] w-48 max-w-full', name: 'text-[18px]', body: 'text-[13px]', cat: 'text-[10px]', label: 'text-[13px]' },
  // Compact tier for the in-board domain card — smaller body text so the
  // full description fits without overflow.
  domain: { box: 'game-card-domain aspect-[5/7] w-44 max-w-full', name: 'text-[15px]', body: 'text-[9px]', cat: 'text-[8px]', label: 'text-[10px]' }
};

// Calculates dynamic font size based on title character count
function getNameStyles(name = '', size = 'normal', defaultClass = '') {
  const len = name.length;

  if (size === 'hand' || size === 'small' || size === 'medium' || size === 'normal' || size === 'large') {
    if (len > 22) return 'text-[8.5px] leading-[9.5px] tracking-tighter';
    if (len > 15) return 'text-[10px] leading-[11px] tracking-tight';
    if (len > 10) return 'text-[12px] leading-[13px] tracking-tight';
  }

  return defaultClass;
}

export default function Card({ card, faceDown = false, size = 'normal', onClick, selected = false, disabled = false }) {
  if (!card && !faceDown) return null;

  const s = SIZES[size] || SIZES.normal;

  if (faceDown) {
    return (
      <div
        className={`${s.box} game-card-premium game-card-back relative z-20 flex items-center justify-center overflow-hidden rounded-xl border-t border-t-white/15 glass-card opacity-100`}
        style={{ '--accent-color': '#a855f7' }}
      >
        <div className="game-card-grid absolute inset-2 rounded-lg opacity-25" />
        <div className="relative flex aspect-square w-1/3 items-center justify-center rounded-full border border-term-purple/30 bg-cosmic-deep/70 text-term-purple shadow-[0_0_18px_rgba(168,85,247,0.22)]">
          <span className="font-mono text-lg font-bold">Φ</span>
        </div>
      </div>
    );
  }

  const alignment = card.alignment ? ALIGNMENT_COLORS[card.alignment] : null;
  const glowClass = card.alignment ? ALIGNMENT_GLOW[card.alignment] : '';
  const textClass = card.alignment ? ALIGNMENT_TEXT[card.alignment] : '';
  const accent = alignment?.glow || '#a855f7';
  const nameStyle = getNameStyles(card.name || '', size, s.name);

  return (
    <div
      onClick={onClick}
      data-card-interactive={onClick ? 'true' : undefined}
      aria-disabled={disabled}
      className={`${s.box} game-card-premium accent-border relative z-20 cursor-pointer overflow-hidden rounded-xl border-t border-t-white/15 glass-card opacity-100 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-[0.98] ${glowClass} ${selected ? 'scale-105 ring-2 ring-offset-2 ring-offset-[#050308]' : ''} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      style={{ '--accent-color': accent }}
    >
      <div className="game-card-rim pointer-events-none absolute inset-0" />
      <div className="relative grid h-full min-h-0 grid-rows-[auto_minmax(0,0.72fr)_minmax(0,1.28fr)] gap-1 p-1.5 font-mono">
        <header className="flex min-w-0 items-center justify-between gap-1">
          <span className={`${textClass} ${s.label} accent-border accent-bg-subtle min-w-0 max-w-[75%] truncate rounded border px-1.5 py-0.5 font-bold uppercase tracking-[0.12em]`}>
            {alignment?.name || 'Unaligned'}
          </span>
          <span className="game-card-tier flex aspect-square w-5 shrink-0 items-center justify-center rounded-full border border-white/15 text-[9px] font-bold text-term-text">◆</span>
        </header>

        <section className="game-card-concept relative flex min-h-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-cosmic-deep/75 px-1.5 py-1 text-center">
          <div className="game-card-grid pointer-events-none absolute inset-0 opacity-35" />
          <div className={`${textClass} ${nameStyle} relative z-10 break-words font-bold uppercase leading-tight tracking-[0.04em]`}>
            {card.name || 'UNNAMED'}
          </div>
        </section>

        <footer className="game-card-footer accent-border-soft flex min-h-0 flex-col overflow-hidden rounded-md border bg-cosmic-deep/55 px-1.5 py-1">
          <div className={`min-h-0 flex-1 overflow-y-auto break-words font-semibold leading-tight text-term-text ${s.body}`}>
            {card.text || ''}
          </div>
          {card.category && (
            <div className={`mt-1 truncate border-t border-white/10 pt-1 font-bold uppercase tracking-[0.1em] text-term-faint ${s.cat}`}>
              {card.category.replace(/_/g, ' ')}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}