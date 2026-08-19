// Card type definitions — structure only, no card content.
// These define the SHAPE of each card category per the canonical framework.
// Actual card instances are to be defined by the user in the cards/ directory.

export const CARD_CATEGORIES = {
  // ── Metaphysics System ──
  TERRAIN: {
    id: 'terrain',
    name: 'Fundamental Nature of Reality',
    system: 'Metaphysics',
    role: 'Establishes the shared playing field in the center of the board.',
    slot: 'domain',
    mechanics: [
      'Determines resolution speed of Action cards (Immediate, 1-Turn delay, 2-Turn delay).',
      'Generates 1 point of its matching type for BOTH players at the end of every full round.',
      'Placing or changing the Domain immediately ends the active player\u2019s turn.',
    ],
    alignmentTypes: ['A', 'B', 'C'],
  },
  THEORY_OF_TIME: {
    id: 'theory_of_time',
    name: 'Theories of Time',
    system: 'Metaphysics',
    role: 'Controls card-play allowances and tempo.',
    slot: 'persistent',
    mechanics: [
      'Sits in a persistent slot on the player\u2019s board.',
      'Dictates under what conditions players can play additional cards or bypass timing restrictions.',
      'Grounding/System Time focuses on immediate pacing bonuses.',
      'Adaptation Time accumulates capacity the longer the Domain remains unchanged.',
    ],
    alignmentTypes: ['A', 'B', 'C'],
  },
  UNIVERSALS: {
    id: 'universals',
    name: 'Universals and Properties',
    system: 'Metaphysics',
    role: 'Modifiers.',
    slot: 'modifier',
    mechanics: [
      'Attaches to Terrain, persistent cards, or active queues.',
      'Alters how those effects function (remove a penalty, strengthen an effect, extend a duration).',
    ],
    alignmentTypes: ['A', 'B', 'C'],
  },

  // ── Meta-Ethics System ──
  MORAL_REALITY: {
    id: 'moral_reality',
    name: 'Moral Reality',
    system: 'Meta-Ethics',
    role: 'Controls whether effects are accepted, rejected, preserved, or limited.',
    slot: 'persistent',
    mechanics: [
      'Sits in a persistent slot on the player\u2019s board.',
      'Interacts with the face-down queue and active effects.',
      'Grounding (Realism) preserves and stabilizes effects.',
      'System (Error Theory) cancels and invalidates effects.',
      'Adaptation (Relativism) redirects effects or restricts them to specific frameworks.',
    ],
    alignmentTypes: ['A', 'B', 'C'],
  },
  MORAL_GROUNDING: {
    id: 'moral_grounding',
    name: 'Moral Grounding',
    system: 'Meta-Ethics',
    role: 'Controls the economy of points.',
    slot: 'persistent',
    mechanics: [
      'Sits in a persistent slot on the player\u2019s board.',
      'Governs whether points can be generated, removed, prevented, restricted, or authorized.',
      'Both players\u2019 Moral Grounding cards affect the shared Domain simultaneously and their effects can stack.',
    ],
    alignmentTypes: ['A', 'B', 'C'],
  },
  MORAL_JUDGMENT: {
    id: 'moral_judgment',
    name: 'Moral Judgment & Language',
    system: 'Meta-Ethics',
    role: 'The main one-time-use action deck.',
    slot: 'action',
    mechanics: [
      'Played into the face-down queue (or immediately) to steal points, convert points, impose unwanted points, and disrupt the opponent\u2019s 12-point ratio.',
      'This family also contains the cards required to successfully change the Domain.',
    ],
    alignmentTypes: ['A', 'B', 'C'],
  },

  // ── Rhetoric System ──
  RHETORIC: {
    id: 'rhetoric',
    name: 'Rhetoric',
    system: 'Rhetoric',
    role: 'Interruption and response.',
    slot: 'response',
    mechanics: [
      'Players automatically draw 1 Rhetoric card every 5th personal turn.',
      'Player 2 starts with 1 Rhetoric to balance turn advantage.',
      'Played directly onto targeted active cards to cancel, protect, delay, or counter.',
      'Allows unlimited counter-chains until neither player wishes to respond.',
    ],
    alignmentTypes: ['A', 'B', 'C'],
  },
};

// Card schema shape (for when the user defines actual cards)
export const CARD_SCHEMA = {
  id: 'string',
  name: 'string',
  category: 'string',         // one of CARD_CATEGORIES
  alignment: 'A | B | C',
  text: 'string',              // the printed card text
  effect: 'object',            // structured effect data (to be defined per card)
  artUrl: 'string | null',     // future PNG support
};