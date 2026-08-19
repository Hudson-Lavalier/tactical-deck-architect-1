import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EPISTEMOLOGY_FAMILIES, EPISTEMOLOGIES, getParadigmsByFamily, getAlignmentsFromSelection } from '@/data/epistemologies';
import { getVictoryProfile } from '@/data/victoryProfiles';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';

// Philosophy Build — character creation suite.
// Player selects 3 Epistemology paradigms (one from each family).
// Shows alignment, victory profile, and ability overview.
export default function PhilosophyBuild() {
  const navigate = useNavigate();
  const [selection, setSelection] = useState({
    orientation: null,
    structure: null,
    knowledge: null,
  });

  const alignments = getAlignmentsFromSelection(
    selection.orientation,
    selection.structure,
    selection.knowledge,
  );
  const victoryProfile = alignments.length === 3 ? getVictoryProfile(alignments) : null;
  const allSelected = alignments.length === 3;

  const handleSelect = (family, paradigmId) => {
    setSelection((prev) => ({ ...prev, [family]: paradigmId }));
  };

  const handleStart = () => {
    if (!allSelected) return;
    // Store selection in sessionStorage for the game to pick up
    sessionStorage.setItem('epistemologySelection', JSON.stringify(selection));
    navigate('/play');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#e0e0e0] font-mono p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/')} className="text-[#888] hover:text-[#00ff41] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl text-[#a855f7] font-bold tracking-widest"
            style={{ textShadow: '0 0 10px rgba(168,85,247,0.4)' }}
          >
            PHILOSOPHY BUILD
          </h1>
        </div>

        {/* Victory profile preview */}
        <div className="mb-8 p-4 border border-[#1a1a2e] rounded bg-[#0a0a0a]">
          <div className="text-[#555] text-xs mb-2 tracking-wider">VICTORY PROFILE</div>
          {victoryProfile ? (
            <div className="flex gap-6">
              {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
                <div key={key} className="flex items-center gap-2">
                  <span style={{ color: info.glow }} className="font-bold text-lg">{info.label}</span>
                  <span style={{ color: info.glow }}>
                    {victoryProfile[key]} {info.name.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#444] text-xs">SELECT ONE PARADIGM FROM EACH FAMILY</div>
          )}
        </div>

        {/* Family sections */}
        <div className="space-y-8">
          {Object.values(EPISTEMOLOGY_FAMILIES).map((family) => (
            <FamilySection
              key={family.id}
              family={family}
              paradigms={getParadigmsByFamily(family.id)}
              selectedId={selection[family.id]}
              onSelect={(paradigmId) => handleSelect(family.id, paradigmId)}
            />
          ))}
        </div>

        {/* Start button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleStart}
            disabled={!allSelected}
            className={`flex items-center gap-2 px-6 py-3 border-2 rounded transition-all ${
              allSelected
                ? 'border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_15px_rgba(0,255,65,0.4)]'
                : 'border-[#333] text-[#333] cursor-not-allowed'
            }`}
          >
            <span className="font-bold tracking-wider">CONFIRM BUILD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FamilySection({ family, paradigms, selectedId, onSelect }) {
  return (
    <div>
      <div className="mb-3">
        <h2 className="text-lg text-[#00ffff] font-bold tracking-wider">{family.name}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {paradigms.map((paradigm) => (
          <ParadigmCard
            key={paradigm.id}
            paradigm={paradigm}
            selected={selectedId === paradigm.id}
            onSelect={() => onSelect(paradigm.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ParadigmCard({ paradigm, selected, onSelect }) {
  const alignmentInfo = ALIGNMENT_COLORS[paradigm.alignment];

  return (
    <div
      onClick={onSelect}
      className={`p-4 border-2 rounded cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
        selected
          ? 'border-[#00ff41] bg-[#0d1a0d] shadow-[0_0_12px_rgba(0,255,65,0.3)]'
          : 'border-[#1a1a2e] bg-[#0a0a0a] hover:border-[#333]'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-bold text-sm" style={{ color: alignmentInfo.glow }}>
            {paradigm.name}
          </div>
          <div className="text-[#555] text-[10px]">ALIGNMENT {paradigm.alignment}</div>
        </div>
        {selected && <Check className="w-4 h-4 text-[#00ff41]" />}
      </div>

      <div className="text-[#aaa] text-[10px] font-bold mb-1">
        {paradigm.category}
      </div>
      <div className="text-[#888] text-[10px] leading-relaxed whitespace-pre-line">
        {paradigm.text}
      </div>
    </div>
  );
}