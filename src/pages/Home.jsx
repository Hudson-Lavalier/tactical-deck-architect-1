import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Play, Settings, BookOpen, Layers, User, X } from 'lucide-react';

import { getSavedBuilds } from '@/lib/buildStorage';
import { ALIGNMENT_COLORS } from '@/components/game/terminalTheme';
import { getVictoryProfile } from '@/data/victoryProfiles';
import { getParadigmsByIds } from '@/data/epistemologies';

// Home screen — main menu.
// Play with Bot is HIDDEN (single-player only, Play Match is the only play option).
// Play Match opens a build selection dialog before starting a game.
export default function Home() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState(() => parseInt(sessionStorage.getItem('gameDifficulty') || '3'));
  const [showBuildSelect, setShowBuildSelect] = useState(false);

  const handlePlayMatch = () => {
    setShowBuildSelect(true);
  };

  const handleSelectBuild = (build) => {
    sessionStorage.setItem('gameDifficulty', difficulty.toString());
    sessionStorage.setItem('selectedBuild', JSON.stringify(build));
    setShowBuildSelect(false);
    navigate('/play');
  };

  return (
    <div className="min-h-screen bg-term-bg text-term-text font-mono relative overflow-hidden">
      {/* Scan line overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.1) 2px, rgba(0,255,65,0.1) 4px)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Title */}
        <div className="mb-10 text-center">
          <Terminal className="w-14 h-14 text-term-green mx-auto mb-4" />
          <h1 className="text-ui-xl md:text-4xl font-bold text-term-green tracking-widest mb-2"
            style={{ textShadow: '0 0 20px rgba(0,255,65,0.5)' }}
          >
            PHILOSOPHY
          </h1>
          <h2 className="text-ui-lg md:text-2xl font-bold text-term-purple tracking-[0.3em]"
            style={{ textShadow: '0 0 15px rgba(168,85,247,0.5)' }}
          >
            CARD GAME
          </h2>
          <div className="text-term-faint text-ui-xs mt-3 tracking-wider">
            [ TITLE PENDING ]
          </div>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {/* Difficulty selector */}
          <div className="mb-1">
            <div className="text-term-faint text-ui-xs tracking-wider mb-1.5 text-center font-bold">DIFFICULTY</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-2 border-2 rounded text-ui-sm font-bold transition-all ${
                    difficulty === level
                      ? 'border-term-green text-term-green bg-term-green/10'
                      : 'border-term-border text-term-faint hover:border-term-border-hover'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handlePlayMatch}
            className="group flex items-center gap-3 px-6 py-3.5 border-2 rounded transition-all duration-200 hover:scale-105 border-term-green bg-term-green/5"
          >
            <Play className="w-5 h-5 text-term-green" />
            <span className="font-bold tracking-wider text-term-green text-ui-md">PLAY MATCH</span>
          </button>
          <MenuButton to="/build" icon={Layers} label="PHILOSOPHY BUILD" color="#a855f7" />
          <MenuButton to="/cards" icon={BookOpen} label="CARD INFO" color="#c084fc" />
          <MenuButton to="/profile" icon={User} label="PLAYER PROFILE" color="#00ff41" />
          <MenuButton to="/settings" icon={Settings} label="SETTINGS" color="#888888" />
        </div>

        <div className="mt-10 text-term-faint text-ui-xs tracking-wider">
          v0.2.0 — PROTOTYPE BUILD
        </div>
      </div>

      {/* Build selection dialog */}
      {showBuildSelect && (
        <BuildSelectDialog
          onSelect={handleSelectBuild}
          onClose={() => setShowBuildSelect(false)}
          navigate={navigate}
        />
      )}
    </div>
  );
}

function MenuButton({ to, icon: Icon, label, color }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 px-6 py-3.5 border-2 rounded transition-all duration-200 hover:scale-105"
      style={{ borderColor: color }}
    >
      <Icon className="w-5 h-5" style={{ color }} />
      <span className="font-bold tracking-wider text-ui-md" style={{ color }}>{label}</span>
    </Link>
  );
}

function BuildSelectDialog({ onSelect, onClose, navigate }) {
  const [builds] = useState(() => getSavedBuilds());

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 font-mono p-4">
      <div className="border-2 border-term-green bg-term-panel rounded max-w-2xl w-full max-h-[80vh] flex flex-col shadow-[0_0_40px_rgba(0,255,65,0.2)]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-term-border">
          <div className="text-term-green text-ui-lg font-bold tracking-wider">SELECT A BUILD</div>
          <button onClick={onClose} className="text-term-dim hover:text-term-green transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Builds list */}
        <div className="flex-1 overflow-y-auto p-4">
          {builds.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-term-dim text-ui-md mb-4">NO SAVED BUILDS FOUND</div>
              <button
                onClick={() => navigate('/build')}
                className="px-6 py-3 border-2 border-term-purple text-term-purple rounded text-ui-md font-bold tracking-wider hover:bg-term-purple hover:text-term-bg transition-all"
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
                    className="w-full text-left p-4 border-2 border-term-border rounded bg-term-card hover:border-term-green transition-all"
                  >
                    <div className="font-bold text-ui-md text-term-green mb-2">{build.name}</div>
                    <div className="flex gap-3 flex-wrap mb-2">
                      {paradigms.map((p) => {
                        const info = ALIGNMENT_COLORS[p.alignment];
                        return (
                          <div key={p.id} className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ background: info.glow }} />
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
      </div>
    </div>
  );
}