import React, { useState } from 'react';
import Card from './Card';
import ItemViewer from './ItemViewer';
import { ALIGNMENT_COLORS } from './terminalTheme';
import { determinePlayMode } from '@/engine/resolutionEngine';

const CATEGORY_SLOT = { theory_of_time: 'left', moral_reality: 'middle', moral_grounding: 'right' };

export default function CardDetail({
  card, readOnly = false, state, phase, isPlayerTurn, boardDevUsed,
  actionsPlayed, actionAllowance, onPlacePersistent, onChangeDomain,
  onAttachTwofold, onPlayAction, onClose,
}) {
  const [showViewer, setShowViewer] = useState(false);
  if (!card) return null;

  const alignment = card.alignment ? ALIGNMENT_COLORS[card.alignment] : null;
  const accent = alignment?.glow || '#a855f7';
  const isDomain = card.category === 'domain';
  const twofoldActive = (state?.domain?.effectId || state?.domain?.id) === 'twofold_reality' && state?.domainPlacedBy === 'player';
  const canAttachTwofold = twofoldActive && (card.alignment === 'A' || card.alignment === 'B');
  const persistentSlot = CATEGORY_SLOT[card.category];
  const isAction = card.category === 'moral_judgment' || card.category === 'universals';
  const canChangeDomain = isPlayerTurn && phase === 'main' && !boardDevUsed && actionsPlayed === 0;
  const canPlace = isPlayerTurn && phase === 'main' && !boardDevUsed;
  const canAction = isPlayerTurn && phase === 'main' && actionsPlayed < actionAllowance;
  const actionClass = 'hud-control accent-border rounded-lg border bg-cosmic-deep/75 px-4 py-2 text-ui-xs font-bold uppercase tracking-[0.14em] backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_16px_color-mix(in_srgb,var(--accent-color)_25%,transparent)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40';

  let timing = null;
  if (isAction) {
    try {
      const playMode = determinePlayMode(state, card);
      timing = playMode.immediate ? 'Resolves immediately' : `Resolves in ${playMode.row} turn${playMode.row > 1 ? 's' : ''}`;
    } catch { timing = null; }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 p-4 font-mono backdrop-blur-sm" onClick={onClose}>
        <div className="cyber-panel accent-border grid h-[90vh] max-h-[calc(100vh-2rem)] w-full max-w-3xl grid-cols-[auto_1fr] items-center gap-7 rounded-2xl border border-t-white/20 bg-cosmic-deep/85 p-7 text-center backdrop-blur-xl" style={{ '--accent-color': accent }} onClick={(event) => event.stopPropagation()}>
          <button className="justify-self-center" onClick={() => setShowViewer(true)} aria-label={`Open full details for ${card.name}`}>
            <Card card={card} size="inspection" />
          </button>
          <div className="flex h-full min-w-0 w-full flex-col items-center">
            <div className="hud-kicker text-ui-xs font-bold uppercase tracking-[0.24em] text-term-faint">{alignment?.name || 'Unaligned'} construct</div>
            <div className="accent-text-glow mt-2 text-2xl font-bold uppercase leading-tight tracking-[0.06em]" style={{ color: accent }}>{card.name || 'UNNAMED CARD'}</div>
            <div className="mt-1 text-ui-xs font-bold uppercase tracking-[0.18em] text-term-faint">{card.category?.replace(/_/g, ' ')}</div>
            <div className="accent-border-soft my-4 h-px w-full border-t" />
            <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-y-auto whitespace-pre-line px-2 text-ui-sm font-semibold leading-relaxed text-term-text">{card.text || card.description || '[ NO DESCRIPTION ]'}</div>
            {timing && <div className="accent-border accent-bg-subtle mt-4 w-full max-w-md rounded-lg border px-3 py-2 text-ui-xs font-bold uppercase tracking-[0.12em]" style={{ color: accent }}>Resolution timing · {timing}</div>}
            <div className="mt-auto flex w-full max-w-md flex-col gap-2">
              {!readOnly && isDomain && twofoldActive && (
                <>
                  {canAttachTwofold && <button onClick={() => onAttachTwofold?.(card)} disabled={!canChangeDomain} className={actionClass} style={{ color: accent }}>ATTACH AS {card.alignment === 'A' ? 'LEFT' : 'RIGHT'} FLANK</button>}
                  <button onClick={() => onChangeDomain?.(card, { replaceTwofold: true })} disabled={!canChangeDomain} className="hud-control rounded-lg border border-red-400/35 bg-cosmic-deep/75 px-4 py-2 text-ui-xs font-bold uppercase tracking-[0.14em] text-red-300 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40">REPLACE DOMAIN</button>
                </>
              )}
              {!readOnly && isDomain && !twofoldActive && (
                <button onClick={() => onChangeDomain?.(card)} disabled={!canChangeDomain} className={actionClass} style={{ color: accent }}>CHANGE DOMAIN</button>
              )}
              {!readOnly && persistentSlot && <button onClick={() => onPlacePersistent?.(card, persistentSlot)} disabled={!canPlace} className={actionClass} style={{ color: accent }}>PLACE IN SLOT</button>}
              {!readOnly && isAction && <button onClick={() => onPlayAction?.(card)} disabled={!canAction} className={actionClass} style={{ color: accent }}>PLAY TO QUEUE ({actionsPlayed}/{actionAllowance})</button>}
              <button onClick={onClose} className="hud-control rounded-lg border border-white/10 bg-cosmic-deep/70 px-4 py-2 text-ui-xs font-bold uppercase tracking-[0.16em] text-term-faint transition-all duration-300 hover:-translate-y-0.5 hover:text-term-text">Close</button>
            </div>
          </div>
        </div>
      </div>
      {showViewer && <ItemViewer card={card} onClose={() => setShowViewer(false)} />}
    </>
  );
}