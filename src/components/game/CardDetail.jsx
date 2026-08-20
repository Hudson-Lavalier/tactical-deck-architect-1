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

  let timing = null;
  if (isAction) {
    try {
      const playMode = determinePlayMode(state, card);
      timing = playMode.immediate ? 'Resolves immediately' : `Resolves in ${playMode.row} turn${playMode.row > 1 ? 's' : ''}`;
    } catch { timing = null; }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 p-4 font-mono" onClick={onClose}>
        <div className="glass-panel grid h-[90vh] max-h-[calc(100vh-2rem)] w-full max-w-3xl grid-cols-[auto_1fr] items-center gap-7 p-7 text-center" style={{ borderColor: `${accent}45` }} onClick={(event) => event.stopPropagation()}>
          <button className="justify-self-center" onClick={() => setShowViewer(true)} aria-label={`Open full details for ${card.name}`}>
            <Card card={card} size="inspection" />
          </button>
          <div className="flex h-full min-w-0 w-full flex-col items-center">
            <div className="text-2xl font-bold leading-tight" style={{ color: accent }}>{card.name || 'UNNAMED CARD'}</div>
            <div className="mt-1 text-ui-xs font-bold tracking-[0.18em] text-term-faint">{card.category?.replace(/_/g, ' ').toUpperCase()}</div>
            <div className="my-4 h-px w-full" style={{ background: `${accent}30` }} />
            <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-y-auto whitespace-pre-line px-2 text-ui-sm font-semibold leading-relaxed text-term-text">{card.text || card.description || '[ NO DESCRIPTION ]'}</div>
            {timing && <div className="mt-4 w-full max-w-md rounded border px-3 py-2 text-ui-xs" style={{ borderColor: `${accent}30`, color: accent }}>RESOLUTION TIMING: {timing}</div>}
            <div className="mt-auto flex w-full max-w-md flex-col gap-2">
              {!readOnly && isDomain && twofoldActive && (
                <>
                  {canAttachTwofold && <button onClick={() => onAttachTwofold?.(card)} disabled={!canChangeDomain} className="rounded border px-4 py-2 text-ui-xs font-bold disabled:cursor-not-allowed disabled:opacity-40" style={{ borderColor: `${accent}55`, color: accent }}>ATTACH AS {card.alignment === 'A' ? 'LEFT' : 'RIGHT'} FLANK</button>}
                  <button onClick={() => onChangeDomain?.(card, { replaceTwofold: true })} disabled={!canChangeDomain} className="rounded border px-4 py-2 text-ui-xs font-bold disabled:cursor-not-allowed disabled:opacity-40" style={{ borderColor: '#ff666655', color: '#ff8888' }}>REPLACE DOMAIN</button>
                </>
              )}
              {!readOnly && isDomain && !twofoldActive && (
                <button onClick={() => onChangeDomain?.(card)} disabled={!canChangeDomain} className="rounded border px-4 py-2 text-ui-xs font-bold disabled:cursor-not-allowed disabled:opacity-40" style={{ borderColor: `${accent}55`, color: accent }}>CHANGE DOMAIN</button>
              )}
              {!readOnly && persistentSlot && <button onClick={() => onPlacePersistent?.(card, persistentSlot)} disabled={!canPlace} className="rounded border px-4 py-2 text-ui-xs font-bold disabled:cursor-not-allowed disabled:opacity-40" style={{ borderColor: `${accent}55`, color: accent }}>PLACE IN SLOT</button>}
              {!readOnly && isAction && <button onClick={() => onPlayAction?.(card)} disabled={!canAction} className="rounded border px-4 py-2 text-ui-xs font-bold disabled:cursor-not-allowed disabled:opacity-40" style={{ borderColor: `${accent}55`, color: accent }}>PLAY TO QUEUE ({actionsPlayed}/{actionAllowance})</button>}
              <button onClick={onClose} className="rounded border border-term-border px-4 py-2 text-ui-xs font-bold text-term-faint">CLOSE</button>
            </div>
          </div>
        </div>
      </div>
      {showViewer && <ItemViewer card={card} onClose={() => setShowViewer(false)} />}
    </>
  );
}