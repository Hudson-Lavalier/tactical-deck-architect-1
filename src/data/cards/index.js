// Card database — placeholder index.
//
// ════════════════════════════════════════════════════════════════════
// ⚠️  NO CARDS ARE INVENTED HERE.
//
// The user has explicitly forbidden inventing any card content.
// Each category file below defines the STRUCTURE expected by the engine
// but contains an EMPTY array awaiting the user's card definitions.
//
// To add cards, the user will provide definitions and they will be
// inserted into the corresponding array below — verbatim, no invention.
// ════════════════════════════════════════════════════════════════════

import { CARD_CATEGORIES } from '../cardTypes';

// Each import below pulls from a category-specific file.
// All are empty until the user provides card definitions.
import { terrainCards } from './terrain';
import { theoryOfTimeCards } from './theoryOfTime';
import { universalsCards } from './universals';
import { moralRealityCards } from './moralReality';
import { moralGroundingCards } from './moralGrounding';
import { moralJudgmentCards } from './moralJudgment';
import { rhetoricCards } from './rhetoric';

export const ALL_CARDS = {
  [CARD_CATEGORIES.TERRAIN.id]: terrainCards,
  [CARD_CATEGORIES.THEORY_OF_TIME.id]: theoryOfTimeCards,
  [CARD_CATEGORIES.UNIVERSALS.id]: universalsCards,
  [CARD_CATEGORIES.MORAL_REALITY.id]: moralRealityCards,
  [CARD_CATEGORIES.MORAL_GROUNDING.id]: moralGroundingCards,
  [CARD_CATEGORIES.MORAL_JUDGMENT.id]: moralJudgmentCards,
  [CARD_CATEGORIES.RHETORIC.id]: rhetoricCards,
};

export function getCardsByCategory(categoryId) {
  return ALL_CARDS[categoryId] || [];
}

export function getCardById(id) {
  for (const cards of Object.values(ALL_CARDS)) {
    const found = cards.find((c) => c.id === id);
    if (found) return found;
  }
  return null;
}

// Build the two draw piles per the framework:
//   Metaphysics pile: Terrain, Theory of Time, Universals
//   Meta-Ethics pile: Moral Reality, Moral Grounding, Moral Judgment
// (Rhetoric is drawn separately on a cadence, not from these piles.)
export function buildDrawPiles() {
  const metaphysics = [
    ...terrainCards,
    ...theoryOfTimeCards,
    ...universalsCards,
  ];
  const metaEthics = [
    ...moralRealityCards,
    ...moralGroundingCards,
    ...moralJudgmentCards,
  ];
  return { metaphysics, metaEthics, rhetoric: [...rhetoricCards] };
}