import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Play, Settings, BookOpen, Layers, User, X } from 'lucide-react';

import CosmicBackground from '@/components/CosmicBackground';
import GlassPanel from '@/components/GlassPanel';
import { getSavedBuilds } from '@/lib/buildStorage';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';
import { getVictoryProfile } from '@/data/victoryProfiles';
import { getParadigmsByIds } from '@/data/epistemologies';

// Home screen — main menu. Cosmic terminal aesthetic.
export default function Home() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState(() => parseInt(sessionStorage.getItem('gameDifficulty') || '3'));
  const [testMode, setTestMode] = useState(() => sessionStorage.getItem('testMode') === 'true');
  const [showBuildSelect, setShowBuildSelect] = useState(false);

  const handlePlayMatch = () => setShowBuildSelect(true);

  const handleToggleTestMode = () => {
    const next = !testMode;
    setTestMode(next);
    sessionStorage.setItem('testMode', String(next));
  };

  const handleSelectBuild = (build) => {
    sessionStorage.setItem('gameDifficulty', difficulty.toString());
    sessionStorage.setItem('selectedBuild', JSON.stringify(build));
    setShowBuildSelect(false);
    navigate('/play');
  };

  return (
    <div className="min-h-screen cosmic-shell bg-cosmic-deep text-term-text font-mono relative overflow-hidden">
      <CosmicBackground density={90} />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
        {/* Title with orbital motif */}
        <div className="mb-12 text-center relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-term-purple/10 animate-cosmic-float pointer-events-none" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-term-blue/10 pointer-events-none" />
          <Terminal className="w-12 h-12 text-term-green mx-auto mb-4 relative" style={{ filter: 'drop-shadow(0 0 12px rgba(0,255,65,0.5))' }} />
          <h1 className="text-ui-xl md:text-5xl font-bold text-term-green tracking-[0.25em] mb-1 relative"
            style={{ textShadow: '0 0 24px rgba(0,255,65,0.45)' }}
          >
            PHILOSOPHY
          </h1>
          <h2 className="text-ui-lg md:text-2xl font-bold text-term-purple tracking-[0.4em] relative"
            style={{ textShadow: '0 0 18px rgba(168,85,247,0.5)' }}
          >
            CARD GAME
          </h2>
          <div className="text-term-faint text-ui-xs mt-3 tracking-[0.3em] relative">
            [ TITLE PENDING ]
          </div>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <GlassPanel className="cyber-panel mb-1 border-t border-t-white/20 bg-cosmic-deep/80 p-3 backdrop-blur-xl" sheen={false}>
            <div className="text-term-faint text-ui-xs tracking-[0.2em] mb-2 text-center font-bold">DIFFICULTY</div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-2 rounded text-ui-sm font-bold transition-[color,background-color,border-color] ${
                    difficulty === level
                      ? 'text-term-green bg-term-green/10 border border-term-green/40'
                      : 'text-term-faint border border-transparent hover:text-term-dim'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="cyber-panel mb-1 border-t border-t-white/20 bg-cosmic-deep/80 p-3 backdrop-blur-xl" sheen={false}>
            <button
              onClick={handleToggleTestMode}
              className={`w-full py-2 rounded text-ui-sm font-bold tracking-[0.15em] transition-[color,background-color,border-color] ${
                testMode
                  ? 'text-term-purple bg-term-purple/10 border border-term-purple/40'
                  : 'text-term-faint border border-transparent hover:text-term-dim'
              }`}
            >
              TEST MODE: {testMode ? 'ON' : 'OFF'}
            </button>
          </GlassPanel>

          <button
            onClick={handlePlayMatch}
            className="cyber-panel hud-control group flex items-center gap-3 rounded-xl border border-t-white/20 bg-cosmic-deep/80 px-6 py-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]"
            style={{ borderColor: 'rgba(0,255,65,0.35)' }}
          >
            <Play className="w-5 h-5 text-term-green" style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,65,0.5))' }} />
            <span className="font-bold tracking-[0.15em] text-term-green text-ui-md">PLAY MATCH</span>
          </button>

          <MenuButton to="/build" icon={Layers} label="PHILOSOPHY BUILD" color="#a855f7" />
          <MenuButton to="/cards" icon={BookOpen} label="CARD INFO" color="#c084fc" />
          <MenuButton to="/profile" icon={User} label="PLAYER PROFILE" color="#00ff41" />
          <MenuButton to="/settings" icon={Settings} label="SETTINGS" color="#888888" />
        </div>

        <div className="mt-10 text-term-faint text-ui-xs tracking-[0.2em]">
          v0.2.0 — PROTOTYPE BUILD
        </div>
      </div>

      {showBuildSelect && (
        <BuildSelectDialog onSelect={handleSelectBuild} onClose={() => setShowBuildSelect(false)} navigate={navigate} />
      )}
    </div>
  );
}

function MenuButton({ to, icon: Icon, label, color }) {
  return (
    <Link
      to={to}
      className="cyber-panel hud-control group flex items-center gap-3 rounded-xl border border-t-white/20 bg-cosmic-deep/80 px-6 py-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]"
      style={{ borderColor: `${color}30` }}
    >
      <Icon className="w-5 h-5" style={{ color, filter: `drop-shadow(0 0 5px ${color}80)` }} />
      <span className="font-bold tracking-[0.15em] text-ui-md" style={{ color }}>{label}</span>
    </Link>
  );
}

function BuildSelectDialog({ onSelect, onClose, navigate }) {
  const [builds] = useState(() => getSavedBuilds());

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 font-mono p-4">
      <GlassPanel className="max-w-2xl w-full max-h-[80vh] flex flex-col" accent="#00ff41" glow>
        <div className="flex justify-between items-center p-4 border-b border-term-purple/15">
          <div className="text-term-green text-ui-lg font-bold tracking-[0.15em]">SELECT A BUILD</div>
          <button onClick={onClose} className="text-term-dim hover:text-term-green transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {builds.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-term-dim text-ui-md mb-4">NO SAVED BUILDS FOUND</div>
              <button
                onClick={() => navigate('/build')}
                className="px-6 py-3 rounded text-ui-md font-bold tracking-[0.15em] glass-panel cosmic-sheen transition-all hover:scale-105"
                style={{ borderColor: '#a855f740', color: '#a855f7' }}
              >
                GO TO PHILOSOPHY BUILD
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {builds.map((build) => {
                const paradigms = getParadigmsByIds(build.paradigms.map((p) => p.id));
                const alignments = paradigms.map((p) => p.alignment);
                const victoryProfile = getVictoryProfile(alignments);
                return (
                  <button
                    key={build.id}
                    onClick={() => onSelect(build)}
                    className="w-full text-left p-4 rounded glass-card cosmic-sheen transition-all hover:scale-[1.01]"
                  >
                    <div className="font-bold text-ui-md text-term-green mb-2">{build.name}</div>
                    <div className="flex gap-3 flex-wrap mb-2">
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
                      <div className="flex gap-4">
                        {Object.entries(ALIGNMENT_COLORS).map(([key, info]) => (
                          <span key={key} className="text-ui-xs" style={{ color: info.glow }}>
                            {info.name} {victoryProfile[key]}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  );
}