import React from 'react';
import Card from './Card';
import { ALIGNMENT_COLORS } from './terminalTheme';
import { determinePlayMode } from '@/engine/resolutionEngine';

// CardDetail — enhanced modal: shows full details, resolution timing, and
// phase-appropriate action buttons (Place in Slot / Change Domain / Play to Queue).
const CATEGORY_SLOT = {
  theory_of_time: 'left',
  moral_reality: 'middle',
  moral_grounding: 'right',
};

export default function CardDetail({
  card,
  state,
  phase,
  isPlayerTurn,
  boardDevUsed,
  actionsPlayed,
  actionAllowance,
  onPlacePersistent,
  onChangeDomain,
  onPlayAction,
  onClose,
}) {
  if (!card) return null;

  const alignment = card.alignment ? ALIGNMENT_COLORS[card.alignment] : null;
  const accent = alignment?.glow || '#a855f7';

  // Compute resolution timing for action cards (moral_judgment / universals)
  let timing = null;
  if (card.category === 'moral_judgment' || card.category === 'universals') {
    try {
      const playMode = determinePlayMode(state, card);
      if (playMode.immediate) {
        timing = 'Resolves immediately';
      } else {
        timing = `Resolves in ${playMode.row} turn${playMode.row > 1 ? 's' : ''}`;
      }
    } catch {
      timing = null;
    }
  }

  const canBoardDev = isPlayerTurn && phase === 'board_dev' && !boardDevUsed;
  const canAction = isPlayerTurn && phase === 'action' && actionsPlayed < actionAllowance;

  const isDomain = card.category === 'domain';
  const persistentSlot = CATEGORY_SLOT[card.category];
  const isAction = card.category === 'moral_judgment' || card.category === 'universals';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 font-mono" onClick={onClose}>
      <div className="glass-panel cosmic-sheen p-6 max-w-md w-[90vw]" style={{ borderColor: `${accent}40`, boxShadow: `0 0 32px ${accent}20` }} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center mb-4">
          <Card card={card} size="large" />
        </div>
        <div className="text-term-text text-sm mb-2 text-center font-bold">{card.name || 'UNNAMED CARD'}</div>
        <div className="text-term-dim text-xs mb-4 text-center leading-relaxed whitespace-pre-line">{card.text || card.description || '[ NO DESCRIPTION ]'}</div>

        {/* Resolution timing */}
        {timing && (
          <div className="mb-4 px-3 py-2 rounded glass-card text-center" style={{ borderColor: `${accent}30` }}>
            <span className="text-term-faint text-[10px] tracking-[0.15em]">RESOLUTION TIMING: </span>
            <span style={{ color: accent }} className="text-xs font-bold">{timing}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          {isDomain && (
            <button
              onClick={() => onChangeDomain?.(card)}
              disabled={!canBoardDev}
              className="px-4 py-2 rounded text-xs glass-card cosmic-sheen transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: `${accent}40`, color: accent }}
            >
              CHANGE DOMAIN{canBoardDev ? '' : ' — BOARD DEV ONLY'}
            </button>
          )}
          {persistentSlot && (
            <button
              onClick={() => onPlacePersistent?.(card, persistentSlot)}
              disabled={!canBoardDev}
              className="px-4 py-2 rounded text-xs glass-card cosmic-sheen transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: `${accent}40`, color: accent }}
            >
              PLACE IN SLOT{canBoardDev ? '' : (boardDevUsed ? ' — ALREADY USED' : ' — BOARD DEV ONLY')}
            </button>
          )}
          {isAction && (
            <button
              onClick={() => onPlayAction?.(card)}
              disabled={!canAction}
              className="px-4 py-2 rounded text-xs glass-card cosmic-sheen transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: `${accent}40`, color: accent }}
            >
              PLAY TO QUEUE{canAction ? ` (${actionsPlayed}/${actionAllowance})` : ' — ACTION PHASE ONLY'}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-xs glass-card transition-all hover:scale-105"
            style={{ borderColor: '#33333340', color: '#888888' }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}