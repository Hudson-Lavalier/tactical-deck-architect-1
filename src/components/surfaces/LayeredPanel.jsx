import React from 'react';

export default function LayeredPanel({ children, accent = '#a855f7', className = '' }) {
  return <div className={`layered-panel ${className}`} style={{ '--section-accent': accent }}>{children}</div>;
}