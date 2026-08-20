// Terminal theme tokens — retro hacker/terminal aesthetic.
// Deep blacks, neon purples, phosphor greens, electric blues.
// Applied via Tailwind classes in components.

export const TERMINAL_COLORS = {
  bg: '#000000',
  bgAlt: '#0a0a0a',
  bgPanel: '#0d0d12',
  purple: '#a855f7',
  purpleBright: '#c084fc',
  green: '#00ff41',
  greenDim: '#00cc66',
  blue: '#00ffff',
  blueDim: '#0080ff',
  text: '#e0e0e0',
  textDim: '#888888',
  border: '#1a1a2e',
};

// Alignment color mapping for card glow effects
export const ALIGNMENT_COLORS = {
  A: { glow: '#00ff41', name: 'Grounding', label: 'A' },
  B: { glow: '#00ffff', name: 'System', label: 'B' },
  C: { glow: '#a855f7', name: 'Adaptation', label: 'C' },
};

export const ALIGNMENT_GLOW = {
  A: 'shadow-[0_0_12px_rgba(0,255,65,0.5)] border-[#00ff41]',
  B: 'shadow-[0_0_12px_rgba(0,255,255,0.5)] border-[#00ffff]',
  C: 'shadow-[0_0_12px_rgba(168,85,247,0.5)] border-[#a855f7]',
};

export const ALIGNMENT_TEXT = {
  A: 'text-[#00ff41]',
  B: 'text-[#00ffff]',
  C: 'text-[#a855f7]',
};