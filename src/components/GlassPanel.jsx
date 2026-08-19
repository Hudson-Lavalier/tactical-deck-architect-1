import React from 'react';

// GlassPanel — reusable glassmorphism surface.
// Translucent dark panel with hairline border, inner glow, and optional accent edge.
// `accent` (hex) tints the border glow for alignment theming.
export default function GlassPanel({
  children,
  className = '',
  accent,
  glow = false,
  ...props
}) {
  const style = {};
  if (accent) {
    style.borderColor = `${accent}40`;
    style.boxShadow = glow
      ? `inset 0 1px 0 rgba(255,255,255,0.04), 0 0 24px ${accent}25, 0 12px 40px rgba(0,0,0,0.5)`
      : `inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 40px rgba(0,0,0,0.45)`;
  }

  return (
    <div className={`glass-panel relative cosmic-sheen ${className}`} style={style} {...props}>
      {children}
    </div>
  );
}