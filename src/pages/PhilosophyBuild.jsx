import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { EPISTEMOLOGY_FAMILIES, EPISTEMOLOGIES, getParadigmsByFamily, getParadigmsByIds } from '@/data/epistemologies';
import Carousel3D from '@/components/Carousel3D';
import FamilyCarouselCard from '@/components/FamilyCarouselCard';
import ParadigmCarouselCard from '@/components/ParadigmCarouselCard';
import BuildInfoPanel from '@/components/BuildInfoPanel';
import { saveBuild, updateBuild, getBuildById } from '@/lib/buildStorage';

// Philosophy Build — 3D nested carousel with free selection.
// User picks ANY 3 paradigms from ANY family (no one-per-family restriction).
// Confirm Build saves to localStorage and navigates to Profile (NOT the game).
export default function PhilosophyBuild() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [buildName, setBuildName] = useState('');
  const [editId, setEditId] = useState(null);
  const [centeredFamilyId, setCenteredFamilyId] = useState('orientation');

  // Check for edit mode (?edit=id)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('edit');
    if (id) {
      const build = getBuildById(id);
      if (build) {
        setEditId(id);
        setBuildName(build.name);
        setSelectedIds(build.paradigms.map((p) => p.id));
        // Set the centered family to the first selected paradigm's family
        if (build.paradigms[0]) {
          setCenteredFamilyId(build.paradigms[0].family);
        }
      }
    }
  }, []);

  const families = Object.values(EPISTEMOLOGY_FAMILIES);
  const centeredFamily = families.find((f) => f.id === centeredFamilyId) || families[0];
  const paradigmsInFamily = getParadigmsByFamily(centeredFamily.id);

  const handleFamilyCenterChange = useCallback((item) => {
    if (item) setCenteredFamilyId(item.id);
  }, []);

  const handleParadigmClick = useCallback((paradigm) => {
    setSelectedIds((prev) => {
      if (prev.includes(paradigm.id)) {
        return prev.filter((id) => id !== paradigm.id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, paradigm.id];
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedIds.length !== 3 || !buildName.trim()) return;
    const paradigms = getParadigmsByIds(selectedIds).map((p) => ({
      id: p.id,
      family: p.family,
      name: p.name,
      alignment: p.alignment,
    }));
    if (editId) {
      updateBuild(editId, { name: buildName.trim(), paradigms });
    } else {
      saveBuild({ name: buildName.trim(), paradigms });
    }
    navigate('/profile');
  }, [selectedIds, buildName, editId, navigate]);

  return (
    <div className="min-h-screen bg-term-bg text-term-text font-mono p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/')} className="text-term-dim hover:text-term-green transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-ui-xl text-term-purple font-bold tracking-widest"
            style={{ textShadow: '0 0 10px rgba(168,85,247,0.4)' }}
          >
            PHILOSOPHY BUILD
          </h1>
          <div className="text-term-faint text-ui-sm ml-auto">
            {editId ? '[ EDITING BUILD ]' : '[ NEW BUILD ]'}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-term-dim text-ui-md mb-6 text-center">
          Rotate the carousels to browse. Click a paradigm to select it. Pick any 3 from any family.
        </div>

        {/* Family Carousel */}
        <div className="mb-6">
          <div className="text-term-faint text-ui-xs tracking-wider mb-2 font-bold text-center">── PARADIGM FAMILIES ──</div>
          <Carousel3D
            items={families}
            renderItem={(family) => (
              <FamilyCarouselCard
                family={family}
                paradigms={getParadigmsByFamily(family.id)}
                selectedIds={selectedIds}
              />
            )}
            onCenterChange={handleFamilyCenterChange}
            itemWidth={260}
            itemHeight={320}
          />
        </div>

        {/* Paradigm Carousel */}
        <div className="mb-6">
          <div className="text-term-faint text-ui-xs tracking-wider mb-2 font-bold text-center">
            ── {centeredFamily.name.toUpperCase()} ──
          </div>
          <Carousel3D
            key={centeredFamily.id}
            items={paradigmsInFamily}
            renderItem={(paradigm, isCenter) => (
              <ParadigmCarouselCard
                paradigm={paradigm}
                isCenter={isCenter}
                isSelected={selectedIds.includes(paradigm.id)}
                selectionNumber={selectedIds.indexOf(paradigm.id) + 1}
                onClick={() => handleParadigmClick(paradigm)}
              />
            )}
            itemWidth={300}
            itemHeight={450}
          />
        </div>

        {/* Info Panel */}
        <BuildInfoPanel
          selectedIds={selectedIds}
          buildName={buildName}
          onNameChange={setBuildName}
          onConfirm={handleConfirm}
          isEdit={!!editId}
        />
      </div>
    </div>
  );
}