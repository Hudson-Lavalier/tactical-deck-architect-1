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
    <div className="min-h-screen bg-[#000000] text-[#e0e0e0] font-mono p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/')} className="text-[#888] hover:text-[#00ff41] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl text-[#888] font-bold tracking-widest">SETTINGS</h1>
        </div>

        <div className="space-y-4">
          {/* Difficulty */}
          <div className="border border-[#1a1a2e] rounded p-4 bg-[#0a0a0a]">
            <h2 className="text-[#a855f7] text-sm font-bold tracking-wider mb-3">DIFFICULTY</h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  className={`flex-1 py-2 border-2 rounded text-xs font-bold tracking-wider transition-all ${
                    difficulty === level
                      ? 'border-[#a855f7] text-[#a855f7] bg-[#a855f7]/10'
                      : 'border-[#333] text-[#555] hover:border-[#555] hover:text-[#888]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="mt-2 text-[#555] text-xs">{difficultyLabels[difficulty]}</div>
          </div>

          {/* Audio */}
          <div className="border border-[#1a1a2e] rounded p-4 bg-[#0a0a0a]">
            <h2 className="text-[#a855f7] text-sm font-bold tracking-wider mb-2">AUDIO</h2>
            <div className="text-[#444] text-xs">[ AWAITING CONFIGURATION ]</div>
          </div>

          {/* Video */}
          <div className="border border-[#1a1a2e] rounded p-4 bg-[#0a0a0a]">
            <h2 className="text-[#a855f7] text-sm font-bold tracking-wider mb-2">VIDEO</h2>
            <div className="text-[#444] text-xs">[ AWAITING CONFIGURATION ]</div>
          </div>
        </div>
      </div>
    </div>
  );
}