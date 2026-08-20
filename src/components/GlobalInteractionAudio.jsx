import { useEffect } from 'react';
import { sfx } from '@/lib/audio';

export default function GlobalInteractionAudio() {
  useEffect(() => {
    const onInteraction = (event) => {
      if (event.target.closest('button, a, [data-card-interactive="true"]')) sfx('click');
    };
    document.addEventListener('click', onInteraction, true);
    return () => document.removeEventListener('click', onInteraction, true);
  }, []);
  return null;
}