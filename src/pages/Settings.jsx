import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Volume2, VolumeX } from 'lucide-react';

import CosmicBackground from '@/components/CosmicBackground';
import SectionFrame from '@/components/surfaces/SectionFrame';
import { THEMES, applyTheme, getTheme } from '@/lib/theme';
import { isMuted, setMuted, sfx } from '@/lib/audio';

export default function Settings() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState(3);
  const [theme, setTheme] = useState(getTheme);
  const [muted, setMutedState] = useState(isMuted);

  useEffect(() => {
    const stored = sessionStorage.getItem('gameDifficulty');
    if (stored) setDifficulty(parseInt(stored));
  }, []);

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
    sessionStorage.setItem('gameDifficulty', level.toString());
  };

  const handleThemeChange = (id) => {
    setTheme(applyTheme(id));
    sfx('switch');
  };

  const handleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) sfx('click');
  };

  const difficultyLabels = {
    1: 'NOVICE — NPC plays randomly',
    2: 'EASY — NPC mostly random',
    3: 'NORMAL — Balanced',
    4: 'HARD — NPC plays smart',
    5: 'EXPERT — NPC relentless',
  };

  return (
    <div className="min-h-screen cosmic-shell layered-page text-term-text font-mono p-4 md:p-8 relative overflow-hidden">
      <CosmicBackground density={36} />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="page-heading flex items-center gap-3 mb-7">
          <button onClick={() => navigate('/')} className="premium-control rounded-lg p-2 text-term-faint hover:text-term-green"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <div className="text-term-faint text-ui-xs tracking-[0.2em]">SYSTEM CONFIGURATION</div>
            <h1 className="text-ui-xl text-term-text font-bold tracking-[0.2em]">SETTINGS</h1>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <SectionFrame title="Interface Theme" eyebrow="Visual protocol" accent="#a855f7" className="md:col-span-2">
            <div className="grid gap-3 md:grid-cols-3">
              {THEMES.map((item) => {
                const selected = theme === item.id;
                return (
                  <button key={item.id} onClick={() => handleThemeChange(item.id)} className={`relative min-h-36 overflow-hidden rounded-lg border p-4 text-left transition-transform hover:-translate-y-1 ${selected ? 'border-term-purple/70' : 'border-term-purple/20'}`}>
                    <div className={`absolute inset-0 theme-preview theme-preview--${item.id}`} />
                    <div className="relative z-10">
                      <div className="mb-8 flex items-start justify-between gap-3">
                        <span className="font-bold tracking-[0.12em] text-term-text">{item.name}</span>
                        {selected && <Check className="h-4 w-4 text-term-green" />}
                      </div>
                      <p className="text-ui-xs leading-relaxed text-term-faint">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionFrame>

          <SectionFrame title="Difficulty" eyebrow="Opponent behavior" accent="#00ffff">
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((level) => <button key={level} onClick={() => handleDifficultyChange(level)} className={`premium-control rounded-md py-3 font-bold ${difficulty === level ? 'border-term-blue/60 text-term-blue' : 'text-term-faint'}`}>{level}</button>)}
            </div>
            <div className="inset-well mt-3 p-3 text-ui-sm text-term-faint">{difficultyLabels[difficulty]}</div>
          </SectionFrame>

          <SectionFrame title="Audio" eyebrow="Synthesized effects" accent="#00ff41">
            <button onClick={handleMute} className="premium-control flex w-full items-center justify-between rounded-lg p-4 text-left">
              <div>
                <div className="font-bold tracking-[0.12em] text-term-text">MASTER SOUND</div>
                <div className="mt-1 text-ui-xs text-term-faint">UI, card, response, point, domain, and victory cues</div>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${muted ? 'border-red-400/40 text-red-300' : 'border-term-green/50 text-term-green'}`}>
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </div>
            </button>
          </SectionFrame>
        </div>
      </div>
    </div>
  );
}