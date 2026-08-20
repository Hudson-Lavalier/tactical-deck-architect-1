import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import CosmicBackground from '@/components/CosmicBackground';
import GlassPanel from '@/components/GlassPanel';
import {
  EPISTEMOLOGY_FAMILIES,
  EPISTEMOLOGIES,
  getParadigmsByFamily,
} from '@/data/epistemologies';
import Carousel3D from '@/components/Carousel3D';
import FamilyCarouselCard from '@/components/FamilyCarouselCard';
import ParadigmCarouselCard from '@/components/ParadigmCarouselCard';
import BuildInfoPanel from '@/components/BuildInfoPanel';
import ItemViewer from '@/components/game/ItemViewer';
import { saveBuild, updateBuild, getBuildById } from '@/lib/buildStorage';

function getOverlayColor(family) {
  const key = (family?.id || family?.name || '').toLowerCase();
  if (key.includes('knowledge') || key.includes('epistemology')) return '#00ffff';
  if (key.includes('structure') || key.includes('justification')) return '#00ff41';
  if (key.includes('orientation') || key.includes('inquiry')) return '#a855f7';
  return '#00ffff';
}

export default function PhilosophyBuild() {
  const navigate = useNavigate();
  const [selection, setSelection] = useState({});
  const [buildName, setBuildName] = useState('');
  const [editId, setEditId] = useState(null);
  const [activeFamilyId, setActiveFamilyId] = useState(null);
  const [inspectingParadigm, setInspectingParadigm] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('edit');
    if (id) {
      const build = getBuildById(id);
      if (build) {
        setEditId(id);
        setBuildName(build.name);
        const sel = {};
        build.paradigms.forEach((p) => { sel[p.family] = p.id; });
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
    setInspectingParadigm(paradigm);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!allSelected || !buildName.trim()) return;
    const paradigms = families.map((f) => {
      const p = EPISTEMOLOGIES[selection[f.id]];
      return { id: p.id, family: p.family, name: p.name, alignment: p.alignment };
    });
    if (editId) updateBuild(editId, { name: buildName.trim(), paradigms });
    else saveBuild({ name: buildName.trim(), paradigms });
    navigate('/profile');
  }, [selection, buildName, editId, navigate, allSelected, families]);

  const [dims, setDims] = useState(() => computeDims());
  useEffect(() => {
    const onResize = () => setDims(computeDims());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const overlayColor = activeFamily ? getOverlayColor(activeFamily) : '#00ffff';

  return (
    <div className="min-h-screen cosmic-shell text-term-text font-mono p-4 md:p-8 relative overflow-hidden">
      <CosmicBackground density={60} />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/')} className="text-term-dim hover:text-term-green transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1
            className="text-ui-xl text-term-purple font-bold tracking-[0.2em]"
            style={{ textShadow: '0 0 16px rgba(168,85,247,0.4)' }}
          >
            PHILOSOPHY BUILD
          </h1>
          <div className="text-term-faint text-ui-sm ml-auto">
            {editId ? '[ EDITING BUILD ]' : '[ NEW BUILD ]'}
          </div>
        </div>

        <div className="text-term-dim text-ui-md mb-8 text-center tracking-wide">
          Click a family to browse its paradigms. Select one from each family.
        </div>

        {/* Family Carousel */}
        <div className="mb-8">
          <div className="text-term-faint text-ui-sm tracking-[0.15em] mb-3 font-bold text-center">
            PARADIGM FAMILIES
          </div>
          <Carousel3D
            loop
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
            itemWidth={dims.famW}
            itemHeight={dims.famH}
          />
        </div>

        <BuildInfoPanel
          selectedIds={selectedIds}
          buildName={buildName}
          onNameChange={setBuildName}
          onConfirm={handleConfirm}
          isEdit={!!editId}
        />
      </div>

      {/* Drill-down overlay */}
      {activeFamily && (
        <div className="fixed inset-0 cosmic-shell z-50 flex flex-col overflow-hidden">
          <CosmicBackground density={70} />

          {/* Family name header dynamically matched to domain theme */}
          <div className="relative z-10 pt-6 md:pt-8 text-center">
            <h2
              className="text-ui-xl font-bold tracking-[0.2em]"
              style={{
                color: overlayColor,
                textShadow: `0 0 18px ${overlayColor}60`,
              }}
            >
              {activeFamily.name.toUpperCase()}
            </h2>
          </div>

          {/* Back to Families */}
          <button
            onClick={() => setActiveFamilyId(null)}
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 text-term-dim hover:text-term-green transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-ui-md font-bold tracking-[0.15em]">BACK TO FAMILIES</span>
          </button>

          {/* Selected indicator */}
          <div className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 text-term-faint text-ui-sm text-right max-w-[24%]">
            {selection[activeFamily.id]
              ? `[ SELECTED: ${EPISTEMOLOGIES[selection[activeFamily.id]].name.toUpperCase()} ]`
              : '[ SELECT A PARADIGM ]'}
          </div>

          {/* Carousel */}
          <div className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full px-4">
            <Carousel3D
              key={activeFamily.id}
              loop
              items={paradigmsInActiveFamily}
              renderItem={(paradigm, isCenter) => (
                <ParadigmCarouselCard
                  paradigm={paradigm}
                  isCenter={isCenter}
                  isSelected={selection[paradigm.family] === paradigm.id}
                />
              )}
              onItemClick={handleParadigmClick}
              itemWidth={dims.parW}
              itemHeight={dims.parH}
            />
          </div>
        </div>
      )}

      {/* 3D Item Viewer Modal triggered on selection */}
      {inspectingParadigm && (
        <ItemViewer card={inspectingParadigm} onClose={() => setInspectingParadigm(null)} />
      )}
    </div>
  );
}

function computeDims() {
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const cardH = Math.min(460, Math.max(360, vh - 340));
  const cardW = Math.min(320, Math.max(280, Math.round(cardH * 0.7), Math.round(vw * 0.22)));
  return { famW: cardW, famH: cardH, parW: cardW, parH: cardH };
}