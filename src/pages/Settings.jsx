import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Settings — difficulty, audio, video, and UI adjustments.
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
    <div className="min-h-screen bg-term-bg text-term-text font-mono p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/')} className="text-term-dim hover:text-term-green transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-ui-xl text-term-dim font-bold tracking-widest">SETTINGS</h1>
        </div>

        <div className="space-y-4">
          {/* Difficulty */}
          <div className="border-2 border-term-border rounded p-5 bg-term-panel">
            <h2 className="text-term-purple text-ui-lg font-bold tracking-wider mb-3">DIFFICULTY</h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  className={`flex-1 py-3 border-2 rounded text-ui-md font-bold tracking-wider transition-all ${
                    difficulty === level
                      ? 'border-term-purple text-term-purple bg-term-purple/10'
                      : 'border-term-border text-term-faint hover:border-term-border-hover hover:text-term-dim'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="mt-3 text-term-dim text-ui-sm">{difficultyLabels[difficulty]}</div>
          </div>

          {/* Audio */}
          <div className="border-2 border-term-border rounded p-5 bg-term-panel">
            <h2 className="text-term-purple text-ui-lg font-bold tracking-wider mb-2">AUDIO</h2>
            <div className="text-term-faint text-ui-sm">[ AWAITING CONFIGURATION ]</div>
          </div>

          {/* Video */}
          <div className="border-2 border-term-border rounded p-5 bg-term-panel">
            <h2 className="text-term-purple text-ui-lg font-bold tracking-wider mb-2">VIDEO</h2>
            <div className="text-term-faint text-ui-sm">[ AWAITING CONFIGURATION ]</div>
          </div>
        </div>
      </div>
    </div>
  );
}