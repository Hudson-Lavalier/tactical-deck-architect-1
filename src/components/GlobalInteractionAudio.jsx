import React, { useEffect } from 'react';
import { sfx } from '@/lib/audio';

export default function GlobalInteractionAudio() {
  useEffect(() => {
    let lastHover = null;
    const selector = 'button, a, [data-card-interactive="true"]';
    const onInteraction = (event) => {
      if (event.target.closest(selector)) sfx('click');
    };
    const onHover = (event) => {
      const target = event.target.closest(selector);
      if (target && target !== lastHover) {
        lastHover = target;
        sfx('hover');
      }
    };
    const clearHover = (event) => {
      if (lastHover && !event.relatedTarget?.closest?.(selector)) lastHover = null;
    };
    document.addEventListener('click', onInteraction, true);
    document.addEventListener('pointerover', onHover, true);
    document.addEventListener('pointerout', clearHover, true);
    return () => {
      document.removeEventListener('click', onInteraction, true);
      document.removeEventListener('pointerover', onHover, true);
      document.removeEventListener('pointerout', clearHover, true);
    };
  }, []);
  return null;
}