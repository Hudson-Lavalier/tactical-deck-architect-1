// Game constants defined by the canonical framework.
// No card content is invented here — only structural limits and timing rules.

export const HAND_LIMIT = 10;
export const QUEUE_LIMIT = 6;          // max queued cards per player
export const QUEUE_ROWS = 4;           // 4 rows extending backward from domain
export const QUEUE_COLS = 3;           // 3 slots per row
export const POINT_LIMIT = 12;         // max total points a player can hold
export const VICTORY_TOTAL = 12;       // exact point total required to win

export const PERSISTENT_SLOTS = 3;     // Theory of Time, Moral Reality, Moral Grounding

// Alignment types
export const ALIGNMENT = {
  A: 'A', // Grounding
  B: 'B', // System
  C: 'C', // Adaptation
};

export const ALIGNMENT_NAMES = {
  A: 'Grounding',
  B: 'System',
  C: 'Adaptation',
};

export const POINT_TYPES = {
  A: 'grounding',
  B: 'system',
  C: 'adaptation',
};

// Draw piles
export const DRAW_PILES = {
  METAPHYSICS: 'metaphysics',
  META_ETHICS: 'meta_ethics',
};

// Queue row meanings (rows as timers)
// Row 1 = 1 turn remaining (resolves next turn)
// Row 2 = 2 turns remaining
// Row 3 = 3 turns remaining
// Row 4 = 4 turns remaining
export const ROW_TURN_MAP = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
};

// Resolution speed governed by domain alignment
export const RESOLUTION_SPEED = {
  ADVANTAGED: 'immediate',    // matches domain — bypasses queue
  NEUTRAL: 'row1',            // neutral or C-type on A/B terrain — Row 1 delay
  DISADVANTAGED: 'row2',      // opposing domain — Row 2 delay
};

// Rhetoric draw cadence
export const RHETORIC_DRAW_INTERVAL = 5; // every 5th personal turn