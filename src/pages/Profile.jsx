import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Pencil, Eye, X } from 'lucide-react';

import CosmicBackground from '@/components/CosmicBackground';
import GlassPanel from '@/components/GlassPanel';
import { getSavedBuilds, deleteBuild, updateBuild } from '@/lib/buildStorage';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';
import { getVictoryProfile } from '@/data/victoryProfiles';
import { getParadigmsByIds } from '@/data/epistemologies';
import RichText from '@/components/RichText';

// Player Profile — saved builds library. Visual-only restyle.
export default function Profile() {
  const navigate = useNavigate();
  const [builds, setBuilds] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => { setBuilds(getSavedBuilds()); }, []);
  const refresh = useCallback(() => setBuilds(getSavedBuilds()), []);

  const handleDelete = useCallback((id) => {
    deleteBuild(id);
    setDeleteConfirmId(null);
    refresh();
  }, [refresh]);

  const handleRename = useCallback((id) => {
    if (renameValue.trim()) { updateBuild(id, { name: renameValue.trim() }); refresh(); }
    setRenamingId(null);
  }, [renameValue, refresh]);

  const handleEdit = useCallback((id) => { navigate(`/build?edit=${id}`); }, [navigate]);

  return (
    <div className="min-h-screen cosmic-shell layered-page text-term-text font-mono p-4 md:p-8 relative overflow-hidden">
      <CosmicBackground density={36} />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="page-heading flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/')} className="text-term-dim hover:text-term-green transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-ui-xl text-term-green font-bold tracking-[0.2em]"
            style={{ textShadow: '0 0 16px rgba(0,255,65,0.4)' }}
          >
            PLAYER PROFILE
          </h1>
        </div>

        <div className="text-term-faint text-ui-sm mb-4 tracking-wide">
          {builds.length} SAVED BUILD{builds.length !== 1 ? 'S' : ''}
        </div>

        {builds.length === 0 ? (
          <GlassPanel className="p-8 text-center">
            <div className="text-term-dim text-ui-md mb-4">NO SAVED BUILDS</div>
            <button
              onClick={() => navigate('/build')}
              className="px-6 py-3 rounded text-ui-md font-bold tracking-[0.15em] glass-panel cosmic-sheen transition-all hover:scale-105"
              style={{ borderColor: '#00ff4140', color: '#00ff41' }}
            >
              CREATE A BUILD
            </button>
          </GlassPanel>
        ) : (
          <div className="space-y-4">
            {builds.map((build) => {
              const paradigms = getParadigmsByIds(build.paradigms.map((p) => p.id));
              const alignments = paradigms.map((p) => p.alignment);
              const victoryProfile = getVictoryProfile(alignments);
              const isExpanded = expandedId === build.id;
              const isRenaming = renamingId === build.id;
              const isDeleting = deleteConfirmId === build.id;

              return (
                <GlassPanel key={build.id} className="overflow-hidden">
                  <div className="p-4 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {isRenaming ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            className="flex-1 px-2 py-1 bg-term-card/60 border border-term-purple/30 rounded text-ui-md text-term-text font-mono focus:border-term-green focus:outline-none"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename(build.id);
                              if (e.key === 'Escape') setRenamingId(null);
                            }}
                          />
                          <button
                            onClick={() => handleRename(build.id)}
                            className="px-3 py-1 border border-term-green/40 text-term-green rounded text-ui-sm hover:bg-term-green/10 transition-all"
                          >
                            SAVE
                          </button>
                        </div>
                      ) : (
                        <div className="font-bold text-ui-lg text-term-green truncate">{build.name}</div>
                      )}
                      <div className="flex gap-3 mt-2 flex-wrap">
                        {paradigms.map((p) => {
                          const info = ALIGNMENT_COLORS[p.alignment];
                          return (
                            <div key={p.id} className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ background: info.glow, boxShadow: `0 0 6px ${info.glow}` }} />
                              <span className="text-ui-sm font-bold" style={{ color: info.glow }}>{p.name}</span>
                            </div>
                          );
                        })}
                      </div>
                      {victoryProfile && (
                        <div className="flex gap-4 mt-2">
                          {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
                            <div key={key} className="flex items-center gap-1">
                              <span className="text-ui-xs" style={{ color: info.glow }}>{info.name}</span>
                              <span className="text-ui-sm font-bold" style={{ color: info.glow }}>{victoryProfile[key]}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : build.id)}
                        className="p-2 border border-term-purple/20 rounded text-term-dim hover:text-term-blue hover:border-term-blue/50 transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(build.id)}
                        className="p-2 border border-term-purple/20 rounded text-term-dim hover:text-term-green hover:border-term-green/50 transition-all"
                        title="Edit Build"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setRenamingId(build.id); setRenameValue(build.name); }}
                        className="p-2 border border-term-purple/20 rounded text-term-dim hover:text-term-blue hover:border-term-blue/50 transition-all"
                        title="Rename"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(build.id)}
                        className="p-2 border border-term-purple/20 rounded text-term-dim hover:text-red-500 hover:border-red-500/50 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-term-purple/15 p-4 bg-black/20 space-y-4">
                      {paradigms.map((p, i) => {
                        const info = ALIGNMENT_COLORS[p.alignment];
                        return (
                          <div key={p.id} className="border-l-2 pl-4" style={{ borderColor: info.glow }}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-ui-md" style={{ color: info.glow }}>
                                {i + 1}. {p.name}
                              </span>
                              <span className="text-term-faint text-ui-xs">— {p.category} — {info.name}</span>
                            </div>
                            <RichText text={p.text} alignment={p.alignment} />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {isDeleting && (
                    <div className="border-t border-term-purple/15 p-4 bg-red-950/20 flex items-center justify-between gap-4">
                      <span className="text-red-400 text-ui-sm">DELETE "{build.name}"?</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(build.id)}
                          className="px-4 py-1.5 border border-red-500/50 text-red-500 rounded text-ui-sm font-bold hover:bg-red-500/20 transition-all"
                        >
                          DELETE
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-4 py-1.5 border border-term-purple/20 text-term-dim rounded text-ui-sm hover:text-term-text transition-all"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  )}
                </GlassPanel>
              );
            })}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => navigate('/build')}
            className="w-full px-6 py-3 rounded text-ui-md font-bold tracking-[0.15em] glass-panel cosmic-sheen transition-all hover:scale-[1.01]"
            style={{ borderColor: '#a855f740', color: '#a855f7' }}
          >
            + CREATE NEW BUILD
          </button>
        </div>
      </div>
    </div>
  );
}