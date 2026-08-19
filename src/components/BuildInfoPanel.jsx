import React from 'react';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';
import { getVictoryProfile } from '@/data/victoryProfiles';
import { getParadigmsByIds } from '@/data/epistemologies';

// BuildInfoPanel — comprehensive info panel for Philosophy Build.
// Shows victory profile, selected paradigms, orientation bonus, and game rules.
export default function BuildInfoPanel({ selectedIds, buildName, onNameChange, onConfirm, isEdit }) {
  const paradigms = getParadigmsByIds(selectedIds);
  const alignments = paradigms.map((p) => p.alignment);
  const victoryProfile = alignments.length === 3 ? getVictoryProfile(alignments) : null;
  const orientationParadigm = paradigms.find((p) => p.family === 'orientation');

  return (
    <div className="border-2 border-term-border rounded bg-term-panel p-5 flex flex-col gap-5">
      {/* Victory Profile */}
      <div>
        <div className="text-term-faint text-ui-xs tracking-wider mb-2 font-bold">VICTORY PROFILE</div>
        {victoryProfile ? (
          <div className="flex gap-6 flex-wrap">
            {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="font-bold text-ui-md" style={{ color: info.glow }}>{info.name}</span>
                <span className="text-term-text text-ui-lg font-bold">{victoryProfile[key]}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-term-faint text-ui-sm">SELECT 3 PARADIGMS TO REVEAL</div>
        )}
      </div>

      {/* Selected Paradigms */}
      <div>
        <div className="text-term-faint text-ui-xs tracking-wider mb-2 font-bold">
          SELECTED PARADIGMS ({selectedIds.length}/3)
        </div>
        {paradigms.length === 0 ? (
          <div className="text-term-faint text-ui-sm">NONE SELECTED — ROTATE AND CLICK TO PICK</div>
        ) : (
          <div className="space-y-2">
            {paradigms.map((p, i) => {
              const info = ALIGNMENT_COLORS[p.alignment];
              return (
                <div key={p.id} className="border-l-2 pl-3" style={{ borderColor: info.glow }}>
                  <div className="font-bold text-ui-sm" style={{ color: info.glow }}>
                    {i + 1}. {p.name}
                  </div>
                  <div className="text-term-faint text-ui-xs">{p.category} — {info.name}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Orientation Bonus */}
      {orientationParadigm && (
        <div>
          <div className="text-term-faint text-ui-xs tracking-wider mb-2 font-bold">ORIENTATION BONUS</div>
          <div className="text-term-text text-ui-sm leading-relaxed">
            <span style={{ color: ALIGNMENT_COLORS[orientationParadigm.alignment].glow }} className="font-bold">
              {ALIGNMENT_COLORS[orientationParadigm.alignment].name}
            </span>
            {' Action cards that would steal, remove, or change 1 point instead affect 2 points.'}
          </div>
        </div>
      )}

      {/* Game Rules */}
      <div>
        <div className="text-term-faint text-ui-xs tracking-wider mb-2 font-bold">GAME RULES</div>
        <div className="text-term-dim text-ui-sm space-y-1.5">
          <div>• Reach exactly 12 points matching your victory profile to win.</div>
          <div>• Draw from Metaphysics or Meta-Ethics piles each turn.</div>
          <div>• Queue cards resolve based on domain alignment speed.</div>
          <div>• Rhetoric cards counter active cards in response windows.</div>
          <div>• Deck exhaustion is a tie-breaking end condition.</div>
        </div>
      </div>

      {/* Build Name + Confirm */}
      <div className="border-t border-term-border pt-4">
        <input
          type="text"
          value={buildName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="ENTER BUILD NAME..."
          maxLength={40}
          className="w-full px-3 py-2.5 bg-term-card border border-term-border rounded text-ui-md text-term-text font-mono focus:border-term-green focus:outline-none mb-3 placeholder:text-term-faint"
        />
        <button
          onClick={onConfirm}
          disabled={selectedIds.length !== 3 || !buildName.trim()}
          className={`w-full px-6 py-3 border-2 rounded text-ui-md font-bold tracking-wider transition-all ${
            selectedIds.length === 3 && buildName.trim()
              ? 'border-term-green text-term-green hover:bg-term-green hover:text-term-bg'
              : 'border-term-border text-term-faint cursor-not-allowed'
          }`}
        >
          {isEdit ? 'UPDATE BUILD' : 'CONFIRM BUILD'}
        </button>
        {selectedIds.length < 3 && (
          <div className="text-term-faint text-ui-xs text-center mt-2">
            SELECT {3 - selectedIds.length} MORE PARADIGM{3 - selectedIds.length !== 1 ? 'S' : ''}
          </div>
        )}
      </div>
    </div>
  );
}