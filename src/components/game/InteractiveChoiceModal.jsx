import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import { ALIGNMENT_COLORS } from './terminalTheme';

/**
 * InteractiveChoiceModal
 * A unified, highly polished modal replacing the rigid ResponseWindow and providing
 * interactive target selection / card choice / branching options for all card effects.
 */
export default function InteractiveChoiceModal({
  title = 'CHOICE REQUIRED',
  subtitle = '',
  accentColor,
  activeCard = null,
  cards = [],
  options = [],
  selectedCardId = null,
  selectedOptionId = null,
  onSelectCard,
  onSelectOption,
  onConfirm,
  onCancel,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  confirmDisabled = false,
  timerSeconds = null, // Set number for countdown auto-pass (used in response window)
  onTimerExpire = null,
  multiSelect = false,
  selectedCardIds = [],
  onToggleCardSelection = null,
  maxSelections = 1,
}) {
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const onTimerExpireRef = useRef(onTimerExpire);
  onTimerExpireRef.current = onTimerExpire;
  const timerStartRef = useRef(0);
  const totalDurationRef = useRef(timerSeconds);

  useEffect(() => {
    if (timerSeconds === null || timerSeconds === undefined) {
      setTimeLeft(null);
      return;
    }
    totalDurationRef.current = timerSeconds;
    timerStartRef.current = performance.now();
    setTimeLeft(timerSeconds);

    const interval = setInterval(() => {
      const now = performance.now();
      const elapsedSeconds = (now - timerStartRef.current) / 1000;
      const remaining = Math.max(0, totalDurationRef.current - elapsedSeconds);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        if (onTimerExpireRef.current) onTimerExpireRef.current();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [timerSeconds]);

  const resolvedAccent = accentColor || (activeCard?.alignment ? ALIGNMENT_COLORS[activeCard.alignment]?.glow : '#a855f7') || '#a855f7';

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 font-mono backdrop-blur-md animate-fadeIn"
      onClick={() => onCancel && onCancel()}
    >
      <div
        className="glass-panel relative w-full max-w-2xl overflow-hidden rounded-2xl border bg-cosmic-deep/90 p-6 shadow-2xl transition-all"
        style={{
          borderColor: `${resolvedAccent}55`,
          boxShadow: `0 0 40px ${resolvedAccent}25`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 text-center">
          <div
            className="text-ui-md font-bold tracking-[0.2em] uppercase"
            style={{ color: resolvedAccent, textShadow: `0 0 12px ${resolvedAccent}66` }}
          >
            {title} {timeLeft !== null && timeLeft !== undefined && `── ${timeLeft.toFixed(1)}s`}
          </div>
          {subtitle && (
            <div className="mt-1 text-ui-xs font-semibold uppercase tracking-[0.14em] text-term-faint">
              {subtitle}
            </div>
          )}
        </div>

        {/* Optional Active/Triggering Card Display */}
        {activeCard && (
          <div className="mb-4 flex flex-col items-center justify-center">
            <div className="mb-1 text-ui-xs font-bold uppercase tracking-[0.18em] text-term-faint">
              SOURCE / TARGET CARD
            </div>
            <Card card={activeCard} size="medium" />
          </div>
        )}

        {/* Options Selection (e.g. Discard mode, Slot choice, Point type, Construct mode) */}
        {options.length > 0 && (
          <div className="mb-5 flex flex-col gap-2.5">
            {options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const optAccent = opt.color || resolvedAccent;
              return (
                <button
                  key={opt.id}
                  onClick={() => onSelectOption && onSelectOption(opt.id)}
                  disabled={opt.disabled}
                  className={`relative flex items-center justify-between rounded-xl border p-3.5 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-white bg-white/10 shadow-[0_0_16px_rgba(255,255,255,0.15)] scale-[1.01]'
                      : 'border-white/10 bg-black/40 hover:border-white/30 hover:bg-white/5'
                  } ${opt.disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                  style={isSelected ? { borderColor: optAccent, boxShadow: `0 0 16px ${optAccent}33` } : {}}
                >
                  <div className="flex flex-col">
                    <div
                      className="text-ui-xs font-bold uppercase tracking-[0.14em]"
                      style={{ color: isSelected ? optAccent : '#ffffff' }}
                    >
                      {opt.label}
                    </div>
                    {opt.description && (
                      <div className="mt-0.5 text-[11px] leading-tight text-term-faint">
                        {opt.description}
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: optAccent, boxShadow: `0 0 8px ${optAccent}` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Card Choices Grid (e.g. Hand cards, Queue cards, Discard targets) */}
        {cards.length > 0 && (
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between px-1 text-ui-xs font-bold uppercase tracking-[0.15em] text-term-faint">
              <span>AVAILABLE CHOICES</span>
              {multiSelect && (
                <span style={{ color: resolvedAccent }}>
                  SELECTED: {selectedCardIds.length} / {maxSelections}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 overflow-y-auto max-h-[42vh] p-2">
              {cards.map((c) => {
                const isSelected = multiSelect
                  ? selectedCardIds.includes(c.id)
                  : selectedCardId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (multiSelect && onToggleCardSelection) {
                        onToggleCardSelection(c.id);
                      } else if (onSelectCard) {
                        onSelectCard(c.id);
                      }
                    }}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'scale-105 ring-2 ring-offset-2 ring-offset-black'
                        : 'hover:scale-[1.02] opacity-85 hover:opacity-100'
                    }`}
                    style={isSelected ? { ringColor: resolvedAccent } : {}}
                  >
                    <Card card={c} size="small" selected={isSelected} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {cards.length === 0 && options.length === 0 && !activeCard && (
          <div className="my-6 text-center text-ui-xs font-bold uppercase tracking-[0.18em] text-term-faint">
            [ NO SELECTIONS AVAILABLE ]
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-4 flex gap-3 justify-center">
          {onConfirm && (
            <button
              onClick={onConfirm}
              disabled={confirmDisabled}
              className="hud-control rounded-lg border px-7 py-2.5 text-ui-xs font-bold uppercase tracking-[0.16em] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                borderColor: `${resolvedAccent}80`,
                backgroundColor: `${resolvedAccent}15`,
                color: resolvedAccent,
                boxShadow: `0 0 16px ${resolvedAccent}25`,
              }}
            >
              {confirmLabel}
            </button>
          )}
          {onCancel && (
            <button
              onClick={onCancel}
              className="hud-control rounded-lg border border-white/15 bg-white/5 px-6 py-2.5 text-ui-xs font-bold uppercase tracking-[0.16em] text-term-faint transition-all duration-300 hover:-translate-y-0.5 hover:text-term-text"
            >
              {cancelLabel}
            </button>
          )}
        </div>

        {/* Optional Progress Countdown Bar */}
        {timeLeft !== null && timeLeft !== undefined && timerSeconds && (
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full transition-all duration-100 ease-linear"
              style={{
                width: `${(timeLeft / timerSeconds) * 100}%`,
                background: `linear-gradient(90deg, #00ff41, ${resolvedAccent})`,
                boxShadow: `0 0 10px ${resolvedAccent}`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
