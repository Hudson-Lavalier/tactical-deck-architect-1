import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import {
  EPISTEMOLOGY_FAMILIES,
  EPISTEMOLOGIES,
  getParadigmsByFamily,
  getAlignmentsFromSelection,
} from '@/data/epistemologies';
import Carousel3D from '@/components/Carousel3D';
import FamilyCarouselCard from '@/components/FamilyCarouselCard';
import ParadigmCarouselCard from '@/components/ParadigmCarouselCard';
import BuildInfoPanel from '@/components/BuildInfoPanel';
import { saveBuild, updateBuild, getBuildById } from '@/lib/buildStorage';

// Philosophy Build — drill-down carousel with one-paradigm-per-family selection.
// Main view: family carousel. Click a family → full-screen overlay with that
// family's paradigms. Pick one (replaces any existing choice for that family).
// Overlay stays open until the player backs out manually.
// Victory profile + build name/confirm live at the bottom.
export default function PhilosophyBuild() {
  const navigate = useNavigate();
  // selection keyed by family id: { orientation, structure, knowledge }
  const [selection, setSelection] = useState({});
  const [buildName, setBuildName] = useState('');
  const [editId, setEditId] = useState(null);
  const [activeFamilyId, setActiveFamilyId] = useState(null); // drill-down overlay

  // Check for edit mode (?edit=id)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('edit');
    if (id) {
      const build = getBuildById(id);
      if (build) {
        setEditId(id);
        setBuildName(build.name);
        const sel = {};
        build.paradigms.forEach((p) => {
          sel[p.family] = p.id;
        });
        setSelection(sel);
      }
    }
  }, []);

  const families = Object.values(EPISTEMOLOGY_FAMILIES);
  const activeFamily = families.find((f) => f.id === activeFamilyId);
  const paradigmsInActiveFamily = activeFamily ? getParadigmsByFamily(activeFamily.id) : [];

  const selectedIds = families.map((f) => selection[f.id]).filter(Boolean);
  const allSelected = selectedIds.length === 3;

  const handleParadigmClick = useCallback((paradigm) => {
    setSelection((prev) => ({ ...prev, [paradigm.family]: paradigm.id }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (!allSelected || !buildName.trim()) return;
    const paradigms = families.map((f) => {
      const p = EPISTEMOLOGIES[selection[f.id]];
      return { id: p.id, family: p.family, name: p.name, alignment: p.alignment };
    });
    if (editId) {
      updateBuild(editId, { name: buildName.trim(), paradigms });
    } else {
      saveBuild({ name: buildName.trim(), paradigms });
    }
    navigate('/profile');
  }, [selection, buildName, editId, navigate, allSelected, families]);

  return (
    <div className="min-h-screen bg-term-bg text-term-text font-mono p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/')} className="text-term-dim hover:text-term-green transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1
            className="text-ui-xl text-term-purple font-bold tracking-widest"
            style={{ textShadow: '0 0 10px rgba(168,85,247,0.4)' }}
          >
            PHILOSOPHY BUILD
          </h1>
          <div className="text-term-faint text-ui-sm ml-auto">
            {editId ? '[ EDITING BUILD ]' : '[ NEW BUILD ]'}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-term-dim text-ui-md mb-8 text-center">
          Click a family to browse its paradigms. Select one from each family.
        </div>

        {/* Family Carousel */}
        <div className="mb-10">
          <div className="text-term-faint text-ui-sm tracking-wider mb-3 font-bold text-center">
            ── PARADIGM FAMILIES ──
          </div>
          <Carousel3D
            items={families}
            renderItem={(family, isCenter) => (
              <FamilyCarouselCard
                family={family}
                paradigms={getParadigmsByFamily(family.id)}
                selectedParadigmId={selection[family.id]}
                isCenter={isCenter}
              />
            )}
            onItemClick={(family) => setActiveFamilyId(family.id)}
            itemWidth={340}
            itemHeight={460}
          />
        </div>

        {/* Bottom: Victory profile + selected paradigms + build name/confirm */}
        <BuildInfoPanel
          selectedIds={selectedIds}
          buildName={buildName}
          onNameChange={setBuildName}
          onConfirm={handleConfirm}
          isEdit={!!editId}
        />
      </div>

      {/* Drill-down overlay — paradigm carousel for the active family */}
      {activeFamily && (
        <div className="fixed inset-0 bg-term-bg z-50 flex flex-col p-4 md:p-8">
          {/* Overlay header */}
          <div className="flex items-center gap-3 mb-6 max-w-6xl mx-auto w-full">
            <button
              onClick={() => setActiveFamilyId(null)}
              className="flex items-center gap-2 text-term-dim hover:text-term-green transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-ui-md font-bold tracking-wider">BACK TO FAMILIES</span>
            </button>
            <h2
              className="text-ui-xl text-term-blue font-bold tracking-widest"
              style={{ textShadow: '0 0 10px rgba(0,255,255,0.4)' }}
            >
              {activeFamily.name.toUpperCase()}
            </h2>
            <div className="text-term-faint text-ui-sm ml-auto">
              {selection[activeFamily.id]
                ? `[ SELECTED: ${EPISTEMOLOGIES[selection[activeFamily.id]].name.toUpperCase()} ]`
                : '[ SELECT A PARADIGM ]'}
            </div>
          </div>

          {/* Paradigm carousel — large */}
          <div className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full">
            <Carousel3D
              key={activeFamily.id}
              items={paradigmsInActiveFamily}
              renderItem={(paradigm, isCenter) => (
                <ParadigmCarouselCard
                  paradigm={paradigm}
                  isCenter={isCenter}
                  isSelected={selection[paradigm.family] === paradigm.id}
                  onClick={() => handleParadigmClick(paradigm)}
                />
              )}
              itemWidth={420}
              itemHeight={560}
            />
          </div>
        </div>
      )}
    </div>
  );
}