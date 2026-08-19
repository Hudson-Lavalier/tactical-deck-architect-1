// Victory profiles — the 12-point requirement based on 3 Epistemology selections.
// Each selection provides one A, B, or C alignment. The final ratio dictates the win condition.
// Directly transcribed from the canonical framework — no values invented.

export const VICTORY_PROFILES = {
  'AAA': { A: 12, B: 0,  C: 0  },
  'BBB': { A: 0,  B: 12, C: 0  },
  'CCC': { A: 0,  B: 0,  C: 12 },
  'AAB': { A: 8,  B: 4,  C: 0  },
  'AAC': { A: 8,  B: 0,  C: 4  },
  'BBA': { A: 4,  B: 8,  C: 0  },
  'BBC': { A: 0,  B: 8,  C: 4  },
  'CCA': { A: 4,  B: 0,  C: 8  },
  'CCB': { A: 0,  B: 4,  C: 8  },
  'ABC': { A: 4,  B: 4,  C: 4  }, // Balanced — no primary type
};

// Given an array of 3 alignments (e.g. ['A','B','C']), return the victory profile.
export function getVictoryProfile(alignments) {
  const key = alignments.slice().sort().join('');
  return VICTORY_PROFILES[key] || null;
}

// Check if a player's current points exactly match their victory profile.
export function checkVictory(currentPoints, victoryProfile) {
  if (!victoryProfile) return false;
  return (
    currentPoints.A === victoryProfile.A &&
    currentPoints.B === victoryProfile.B &&
    currentPoints.C === victoryProfile.C
  );
}