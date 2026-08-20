import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Layers, 
  Save, 
  RotateCcw, 
  Download, 
  Flame, 
  Zap, 
  Scale, 
  ChevronRight, 
  Target, 
  Sparkle, 
  Compass, 
  CheckCircle2 
} from 'lucide-react';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';
import { getVictoryProfile } from '@/data/victoryProfiles';
import { getParadigmsByIds, EPISTEMOLOGIES, EPISTEMOLOGY_FAMILIES } from '@/data/epistemologies';

/**
 * DeckCommandHud — Futuristic cosmic glassmorphic lower build HUD & rules console.
 * Incorporates:
 * 1. Glassmorphic Deck Command Bar (.glass-card-hud) with dynamic obsidian gradients and neon domain border.
 * 2. Stylized large-typography title input with glow focus and char counter.
 * 3. Interactive paradigm selection chips with family indicators and alignment color glows.
 * 4. Dynamic Build Rule & Victory Matrix HUD with live meters, alignment ratios, and orientation bonus badges.
 * 5. Centered Tactical Action Dock with tactile hover scaling and glowing press states.
 */
export default function DeckCommandHud({
  selectedIds = [],
  buildName = '',
  onNameChange,
  onConfirm,
  onClear,
  onExport,
  onSelectFamily,
  onSelectParadigm,
  isEdit = false,
  activeDomainName = null
}) {
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' | 'rules' | 'synergy'

  const paradigms = useMemo(() => getParadigmsByIds(selectedIds), [selectedIds]);
  const alignments = useMemo(() => paradigms.map((p) => p.alignment), [paradigms]);
  const victoryProfile = useMemo(() => (alignments.length === 3 ? getVictoryProfile(alignments) : null), [alignments]);
  const orientationParadigm = useMemo(() => paradigms.find((p) => p.family === 'orientation'), [paradigms]);

  // Alignment counts
  const alignmentCounts = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0 };
    alignments.forEach((a) => {
      if (counts[a] !== undefined) counts[a]++;
    });
    return counts;
  }, [alignments]);

  // Determine dominant alignment theme color
  const dominantTheme = useMemo(() => {
    if (alignmentCounts.A > alignmentCounts.B && alignmentCounts.A > alignmentCounts.C) return ALIGNMENT_COLORS.A;
    if (alignmentCounts.B > alignmentCounts.A && alignmentCounts.B > alignmentCounts.C) return ALIGNMENT_COLORS.B;
    if (alignmentCounts.C > alignmentCounts.A && alignmentCounts.C > alignmentCounts.B) return ALIGNMENT_COLORS.C;
    return { glow: '#a855f7', name: 'Synthesized Matrix', label: 'Cosmic' };
  }, [alignmentCounts]);

  const allFamilies = Object.values(EPISTEMOLOGY_FAMILIES);
  const isComplete = selectedIds.length === 3;
  const canSave = isComplete && buildName.trim().length > 0;

  return (
    <section 
      aria-label="Deck Command & Philosophy Configuration HUD"
      className="glass-card-hud relative mt-8 w-full rounded-2xl border backdrop-blur-2xl transition-all duration-500 font-mono shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
      style={{
        '--hud-accent': dominantTheme.glow,
        background: 'linear-gradient(165deg, rgba(16, 12, 30, 0.94) 0%, rgba(6, 4, 14, 0.96) 50%, rgba(10, 16, 28, 0.94) 100%)',
        borderColor: `color-mix(in srgb, ${dominantTheme.glow} 32%, rgba(255,255,255,0.12))`,
        boxShadow: `0 0 35px color-mix(in srgb, ${dominantTheme.glow} 15%, transparent), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 30px rgba(0,0,0,0.6)`
      }}
    >
      {/* Top Ambient Glow Edge */}
      <div 
        className="pointer-events-none absolute -top-px left-10 right-10 h-px transition-all duration-700"
        style={{
          background: `linear-gradient(90deg, transparent, ${dominantTheme.glow}, transparent)`
        }}
      />

      <div className="p-4 sm:p-6 md:p-7 flex flex-col gap-6">

        {/* ── SECTION 1: BUILD IDENTITY COMMAND BAR ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: dominantTheme.glow }} />
              <label 
                htmlFor="build-title-input" 
                className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-term-faint flex items-center gap-2"
              >
                <span>Philosophical Build Designation</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-term-text">
                  {isEdit ? 'ARCHIVE REVISION' : 'CONSTRUCT REGISTRY'}
                </span>
              </label>
            </div>
            
            {/* Stylized Large Typography Input */}
            <div className="relative group">
              <input
                id="build-title-input"
                type="text"
                value={buildName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="NAME YOUR PHILOSOPHICAL CONSTRUCT..."
                maxLength={36}
                className="w-full bg-black/40 border border-white/10 group-hover:border-white/20 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg font-bold text-white tracking-[0.08em] placeholder:text-term-faint/40 focus:outline-none transition-all duration-300 pr-16"
                style={{
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = dominantTheme.glow;
                  e.currentTarget.style.boxShadow = `0 0 15px color-mix(in srgb, ${dominantTheme.glow} 40%, transparent), inset 0 2px 6px rgba(0,0,0,0.8)`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = 'inset 0 2px 6px rgba(0,0,0,0.6)';
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] tabular-nums font-bold text-term-faint pointer-events-none">
                <span className={buildName.length >= 32 ? 'text-amber-400' : 'text-term-dim'}>{buildName.length}</span>
                <span className="opacity-40">/36</span>
              </div>
            </div>
          </div>

          {/* Quick HUD State Status */}
          <div className="flex flex-wrap items-center gap-2 lg:self-end">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs">
              <span className="text-term-faint uppercase tracking-wider text-[10px]">Matrix Status:</span>
              {isComplete ? (
                <span className="font-bold flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  STABILIZED (3/3)
                </span>
              ) : (
                <span className="font-bold text-amber-400 animate-pulse">
                  INCOMPLETE ({selectedIds.length}/3)
                </span>
              )}
            </div>
            
            {activeDomainName && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs">
                <span className="text-term-faint uppercase tracking-wider text-[10px]">Domain:</span>
                <span className="font-bold text-term-blue">{activeDomainName}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── SECTION 2: INTERACTIVE PARADIGM SELECTION CHIPS ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-term-purple" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-term-text">
                Epistemological Pillars (3 Required)
              </span>
            </div>
            <span className="text-[10px] text-term-faint tracking-widest uppercase">
              Click pill to swap or inspect
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {allFamilies.map((fam, idx) => {
              const selectedId = selectedIds.find(id => {
                const p = EPISTEMOLOGIES[id];
                return p && p.family === fam.id;
              });
              const paradigm = selectedId ? EPISTEMOLOGIES[selectedId] : null;
              const alignmentInfo = paradigm?.alignment ? ALIGNMENT_COLORS[paradigm.alignment] : null;
              const chipColor = alignmentInfo?.glow || '#64748b';

              return (
                <div
                  key={fam.id}
                  onClick={() => onSelectFamily && onSelectFamily(fam.id)}
                  className={`group relative overflow-hidden rounded-xl border p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] ${
                    paradigm
                      ? 'bg-gradient-to-br from-white/[0.07] to-transparent'
                      : 'bg-black/30 border-dashed border-white/15 hover:border-white/30'
                  }`}
                  style={{
                    borderColor: paradigm ? `color-mix(in srgb, ${chipColor} 50%, rgba(255,255,255,0.15))` : undefined,
                    boxShadow: paradigm ? `0 4px 16px color-mix(in srgb, ${chipColor} 12%, transparent)` : 'none'
                  }}
                >
                  {/* Subtle hover background highlight */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                    style={{ backgroundColor: chipColor }}
                  />

                  {/* Header: Family indicator & order */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-term-faint">
                      {idx + 1}. {fam.name}
                    </span>
                    {paradigm ? (
                      <span 
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded border"
                        style={{
                          borderColor: `${chipColor}60`,
                          backgroundColor: `${chipColor}15`,
                          color: chipColor
                        }}
                      >
                        {alignmentInfo?.name || paradigm.alignment}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-term-faint px-1.5 py-0.5 rounded bg-white/5">
                        EMPTY SLOT
                      </span>
                    )}
                  </div>

                  {/* Paradigm Content / Name */}
                  <div className="my-1">
                    {paradigm ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-wide" style={{ color: chipColor }}>
                          {paradigm.name}
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-term-dim italic flex items-center gap-1.5">
                        <Sparkle size={12} className="text-term-faint" />
                        <span>Select Paradigm...</span>
                      </div>
                    )}
                  </div>

                  {/* Footer status link */}
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-term-faint">
                    <span className="truncate max-w-[150px]">
                      {paradigm ? `Alignment: [${paradigm.alignment}]` : 'Tap to browse category'}
                    </span>
                    <ChevronRight size={12} className="text-term-faint group-hover:text-white transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 3: DYNAMIC BUILD RULE & VICTORY MATRIX HUD ── */}
        <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
          {/* Navigation sub-tabs */}
          <div className="flex items-center border-b border-white/10 bg-black/60 px-4 py-2 text-xs">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-3 py-1 rounded-lg font-bold tracking-wider uppercase transition-all ${
                  activeTab === 'matrix'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-term-faint hover:text-term-text'
                }`}
              >
                Victory Matrix (12 Pt Standard)
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`px-3 py-1 rounded-lg font-bold tracking-wider uppercase transition-all ${
                  activeTab === 'rules'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-term-faint hover:text-term-text'
                }`}
              >
                Live Battle Rules
              </button>
              {orientationParadigm && (
                <button
                  onClick={() => setActiveTab('synergy')}
                  className={`px-3 py-1 rounded-lg font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                    activeTab === 'synergy'
                      ? 'bg-white/10 text-amber-300 shadow-sm'
                      : 'text-amber-400/70 hover:text-amber-300'
                  }`}
                >
                  <Zap size={12} />
                  <span>Orientation Bonus</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub-tab content */}
          <div className="p-4 md:p-5">
            {activeTab === 'matrix' && (
              <div className="space-y-4">
                {victoryProfile ? (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-term-text flex items-center gap-2">
                          <Target size={14} className="text-term-green" />
                          <span>Exact 12-Point Match Standard</span>
                        </div>
                        <p className="text-[11px] text-term-faint">
                          Derived dynamically from your 3 chosen epistemological alignments.
                        </p>
                      </div>
                      
                      {/* Ratio tag */}
                      <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-[11px]">
                        <span className="text-term-faint">Ratio:</span>
                        <span className="font-bold text-[#00ff41]">{victoryProfile.A}A</span>
                        <span className="text-term-faint">/</span>
                        <span className="font-bold text-[#00ffff]">{victoryProfile.B}B</span>
                        <span className="text-term-faint">/</span>
                        <span className="font-bold text-[#a855f7]">{victoryProfile.C}C</span>
                      </div>
                    </div>

                    {/* Visual Progress Meters for Each Alignment */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => {
                        const target = victoryProfile[key] || 0;
                        const percentage = (target / 12) * 100;

                        return (
                          <div 
                            key={key} 
                            className="rounded-xl border border-white/10 bg-cosmic-deep/70 p-3 flex flex-col justify-between"
                            style={{
                              boxShadow: target > 0 ? `0 2px 10px color-mix(in srgb, ${info.glow} 8%, transparent)` : 'none'
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold" style={{ color: info.glow }}>
                                {info.name} [{key}]
                              </span>
                              <span className="text-sm font-bold tabular-nums" style={{ color: info.glow }}>
                                {target} / 12 pts
                              </span>
                            </div>

                            {/* Progress bar meter */}
                            <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/10">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: info.glow,
                                  boxShadow: target > 0 ? `0 0 8px ${info.glow}` : 'none'
                                }}
                              />
                            </div>

                            <div className="mt-2 text-[10px] text-term-faint flex justify-between">
                              <span>Target requirement</span>
                              <span>{Math.round(percentage)}% of victory</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center text-center">
                    <Compass size={28} className="text-term-faint mb-2 opacity-50" />
                    <div className="text-sm font-bold text-term-text tracking-wide mb-1">
                      VICTORY PROFILE UNCONFIGURED
                    </div>
                    <p className="text-xs text-term-faint max-w-md">
                      Equip 1 paradigm from each of the 3 families above to formulate your personalized 12-point victory conditions.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="font-bold text-term-green flex items-center gap-1.5">
                    <Scale size={13} />
                    <span>Resolution & Timing</span>
                  </div>
                  <p className="text-term-dim text-[11px]">
                    Action cards enter the Resolution Queue and trigger according to Domain speeds. Fast cards resolve ahead of standard plays.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="font-bold text-term-blue flex items-center gap-1.5">
                    <Shield size={13} />
                    <span>Response Windows</span>
                  </div>
                  <p className="text-term-dim text-[11px]">
                    Whenever an opponent queues an Action or Domain, you may play Rhetoric cards instantaneously to intercept or modify outcomes.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="font-bold text-term-purple flex items-center gap-1.5">
                    <Layers size={13} />
                    <span>Dual Draw Piles</span>
                  </div>
                  <p className="text-term-dim text-[11px]">
                    Draw each turn from either Metaphysics (Reality & Time) or Meta-Ethics (Grounding, Judgment & Universals) to sculpt your hand.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Flame size={13} />
                    <span>Exact Tally Victory</span>
                  </div>
                  <p className="text-term-dim text-[11px]">
                    Victory requires reaching the EXACT point configuration dictated by your 3 equipped Epistemologies. Overshooting does not win!
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'synergy' && orientationParadigm && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-amber-400" />
                  <span className="font-bold text-amber-300 text-sm">
                    {orientationParadigm.name} Active Orientation Bonus
                  </span>
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded border ml-auto"
                    style={{
                      borderColor: ALIGNMENT_COLORS[orientationParadigm.alignment]?.glow,
                      color: ALIGNMENT_COLORS[orientationParadigm.alignment]?.glow
                    }}
                  >
                    {ALIGNMENT_COLORS[orientationParadigm.alignment]?.name} Alignment
                  </span>
                </div>
                <p className="text-term-text text-[12px] leading-relaxed">
                  Your <strong className="text-white">{ALIGNMENT_COLORS[orientationParadigm.alignment]?.name}</strong> action cards that steal, remove, or alter 1 point will automatically escalate to affecting <strong className="text-amber-300 font-bold">2 points</strong> on the game board.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── SECTION 4: CENTERED TACTICAL ACTION DOCK ── */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          
          {/* Secondary Utilities */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            {onClear && (
              <button
                onClick={onClear}
                type="button"
                className="px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-red-500/40 bg-black/30 hover:bg-red-500/10 text-term-faint hover:text-red-400 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all duration-200"
                title="Reset current paradigm slots"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}

            {onExport && (
              <button
                onClick={onExport}
                type="button"
                className="px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-black/30 hover:bg-white/5 text-term-dim hover:text-white text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all duration-200"
                title="Export configuration as JSON file"
              >
                <Download size={13} />
                <span>Export JSON</span>
              </button>
            )}
          </div>

          {/* Primary Save / Confirm CTA */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
            {!isComplete && (
              <span className="text-[11px] text-amber-400/90 font-mono text-center sm:text-right">
                Equip {3 - selectedIds.length} more paradigm{3 - selectedIds.length !== 1 ? 's' : ''} to save
              </span>
            )}
            
            <button
              onClick={onConfirm}
              disabled={!canSave}
              type="button"
              className={`w-full sm:w-auto min-w-[200px] px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                canSave
                  ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] shadow-lg'
                  : 'border border-white/10 bg-white/5 text-term-faint cursor-not-allowed opacity-50'
              }`}
              style={
                canSave
                  ? {
                      backgroundColor: dominantTheme.glow,
                      color: '#020617',
                      boxShadow: `0 0 20px color-mix(in srgb, ${dominantTheme.glow} 50%, transparent)`,
                    }
                  : undefined
              }
            >
              <Save size={16} />
              <span>{isEdit ? 'UPDATE FRAMEWORK' : 'SAVE TO MATRIX'}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
