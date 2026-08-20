import React from 'react';

export default function SectionFrame({ title, eyebrow, accent = '#a855f7', actions, children, className = '' }) {
  return (
    <section className={`section-frame ${className}`} style={{ '--section-accent': accent }}>
      {(title || eyebrow || actions) && (
        <header className="section-frame__header">
          <div className="min-w-0">
            {eyebrow && <div className="section-frame__eyebrow">{eyebrow}</div>}
            {title && <h2 className="section-frame__title">{title}</h2>}
          </div>
          {actions && <div className="section-frame__actions">{actions}</div>}
        </header>
      )}
      <div className="section-frame__body">{children}</div>
    </section>
  );
}