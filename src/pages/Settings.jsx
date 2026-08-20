import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import CosmicBackground from '@/components/CosmicBackground';
import GlassPanel from '@/components/GlassPanel';

// Settings — difficulty, audio, video. Visual-only restyle.
export default function Settings() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState(3);

  useEffect(() => {
    const stored = sessionStorage.getItem('gameDifficulty');
    if (stored) setDifficulty(parseInt(stored));
  }, []);

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
    sessionStorage.setItem('gameDifficulty', level.toString());
  };

  const difficultyLabels = {
    1: '[ NOVICE — NPC plays randomly ]',
    2: '[ EASY — NPC mostly random ]',
    3: '[ NORMAL — Balanced ]',
    4: '[ HARD — NPC plays smart ]',
    5: '[ EXPERT — NPC relentless ]',
  };

  return (
    <div className="min-h-screen cosmic-shell text-term-text font-mono p-4 md:p-8 relative overflow-hidden">
      <CosmicBackground density={60} />

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/')} className="text-term-dim hover:text-term-green transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-ui-xl text-term-dim font-bold tracking-[0.2em]">SETTINGS</h1>
        </div>

        <div className="space-y-4">
          <GlassPanel className="p-5">
            <h2 className="text-term-purple text-ui-lg font-bold tracking-[0.15em] mb-3">DIFFICULTY</h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  className={`flex-1 py-3 rounded text-ui-md font-bold tracking-wider transition-all ${
                    difficulty === level
                      ? 'text-term-purple bg-term-purple/10 border border-term-purple/40'
                      : 'text-term-faint border border-transparent hover:text-term-dim'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="mt-3 text-term-dim text-ui-sm">{difficultyLabels[difficulty]}</div>
          </GlassPanel>

          <GlassPanel className="p-5">
            <h2 className="text-term-purple text-ui-lg font-bold tracking-[0.15em] mb-2">AUDIO</h2>
            <div className="text-term-faint text-ui-sm">[ AWAITING CONFIGURATION ]</div>
          </GlassPanel>

          <GlassPanel className="p-5">
            <h2 className="text-term-purple text-ui-lg font-bold tracking-[0.15em] mb-2">VIDEO</h2>
            <div className="text-term-faint text-ui-sm">[ AWAITING CONFIGURATION ]</div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}