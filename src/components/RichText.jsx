import React from 'react';

// RichText — renders text with highlighted section headers.
// Paragraphs ending with ":" and shorter than 80 chars are treated as headers
// and rendered bold + type-colored. Other paragraphs are body text.
export default function RichText({ text, alignment, className = '' }) {
  const colorClass = alignment === 'A'
    ? 'text-type-grounding'
    : alignment === 'B'
    ? 'text-type-system'
    : alignment === 'C'
    ? 'text-type-adaptation'
    : 'text-term-purple';

  const paragraphs = text.split('\n\n');

  return (
    <div className={`space-y-2 ${className}`}>
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();
        const isHeader = trimmed.endsWith(':') && trimmed.length < 80;
        if (isHeader) {
          return (
            <div key={i} className={`font-bold ${colorClass} text-ui-sm`}>
              {para}
            </div>
          );
        }
        return (
          <div key={i} className="text-term-text text-ui-sm leading-relaxed">
            {para}
          </div>
        );
      })}
    </div>
  );
}