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
import Carousel2D from '@/components/Carousel2D';
import FamilyCarouselCard from '@/components/FamilyCarouselCard';
import ParadigmCarouselCard from '@/components/ParadigmCarouselCard';
import BuildInfoPanel from '@/components/BuildInfoPanel';
import { saveBuild, updateBuild, getBuildById } from '@/lib/buildStorage';

// Philosophy Build — drill-down carousel, one-paradigm-per-family.
export default function PhilosophyBuild() {
  const navigate = useNavigate();
  const [selection, setSelection] = useState({});
  const [buildName, setBuildName] = useState('');
  const [editId, setEditId] = useState(null);
  const [activeFamilyId, setActiveFamilyId] = useState(null);

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

  // Viewport-capped carousel sizing
  const [dims, setDims] = useState(() => computeDims());
  useEffect(() => {
    const onResize = () => setDims(computeDims());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
            ── PARADIGM FAMILIES ──
          </div>
          <Carousel2D
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
          {/* Three-zone header: back (left 25%) · title (center) · status (right 25%) */}
          <div className="relative z-10 grid grid-cols-[1fr_2fr_1fr] items-center px-6 py-5 w-full">
            <div className="flex justify-center">
              <button
                onClick={() => setActiveFamilyId(null)}
                className="flex items-center gap-2 text-term-dim hover:text-term-green transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-ui-md font-bold tracking-[0.15em]">BACK TO FAMILIES</span>
              </button>
            </div>
            <div className="text-center">
              <h2
                className="text-ui-xl text-term-blue font-bold tracking-[0.2em]"
                style={{ textShadow: '0 0 16px rgba(0,255,255,0.4)' }}
              >
                {activeFamily.name.toUpperCase()}
              </h2>
            </div>
            <div className="flex justify-center">
              <div className="text-term-faint text-ui-sm font-bold tracking-[0.1em]">
                {selection[activeFamily.id]
                  ? `[ SELECTED: ${EPISTEMOLOGIES[selection[activeFamily.id]].name.toUpperCase()} ]`
                  : '[ SELECT A PARADIGM ]'}
              </div>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center w-full">
            <Carousel2D
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
              itemWidth={dims.parW}
              itemHeight={dims.parH}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function computeDims() {
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const famH = Math.min(Math.round(vh * 0.42), Math.max(300, vh - 380));
  const famW = Math.min(Math.round(famH * 0.86), Math.round(vw * 0.34));
  const parH = Math.min(Math.round(vh * 0.55), Math.max(340, vh - 240));
  const parW = Math.min(Math.round(parH * 0.74), Math.round(vw * 0.4));
  return { famW, famH, parW, parH };
}