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
import { normalizeCards, normalizeCard } from '../../engine/schema/cardSchema';

// Each import below pulls from a category-specific file.
// All are empty until the user provides card definitions.
import { domainCards } from './domain';
import { theoryOfTimeCards } from './theoryOfTime';
import { universalsCards } from './universals';
import { moralRealityCards } from './moralReality';
import { moralGroundingCards } from './moralGrounding';
import { moralJudgmentCards } from './moralJudgment';
import { rhetoricCards } from './rhetoric';
import { testCards } from './testCards';

export const ALL_CARDS = {
  [CARD_CATEGORIES.DOMAIN.id]: normalizeCards(domainCards),
  [CARD_CATEGORIES.THEORY_OF_TIME.id]: normalizeCards(theoryOfTimeCards),
  [CARD_CATEGORIES.UNIVERSALS.id]: normalizeCards(universalsCards),
  [CARD_CATEGORIES.MORAL_REALITY.id]: normalizeCards(moralRealityCards),
  [CARD_CATEGORIES.MORAL_GROUNDING.id]: normalizeCards(moralGroundingCards),
  [CARD_CATEGORIES.MORAL_JUDGMENT.id]: normalizeCards(moralJudgmentCards),
  [CARD_CATEGORIES.RHETORIC.id]: normalizeCards(rhetoricCards),
};

export function getCardsByCategory(categoryId) {
  return ALL_CARDS[categoryId] || [];
}

export function getCardById(id) {
  for (const cards of Object.values(ALL_CARDS)) {
    const found = cards.find((c) => c.id === id);
    if (found) return normalizeCard(found);
  }
  return null;
}

// Build the two draw piles per the framework:
//   Metaphysics pile: Domain, Theory of Time, Universals
//   Meta-Ethics pile: Moral Reality, Moral Grounding, Moral Judgment
// (Rhetoric is drawn separately on a cadence, not from these piles.)
//
// Test action cards (temporary: true) are mixed in for testing so one-use
// action cards appear in draws. They can be purged later by filtering
// `temporary: true`.
export function buildDrawPiles() {
  const normTestCards = normalizeCards(testCards);
  const testUniversals = normTestCards.filter((c) => c.category === 'universals');
  const testJudgment = normTestCards.filter((c) => c.category === 'moral_judgment');
  const testRhetoric = normTestCards.filter((c) => c.category === 'rhetoric');

  const metaphysics = [
    ...ALL_CARDS[CARD_CATEGORIES.DOMAIN.id],
    ...ALL_CARDS[CARD_CATEGORIES.THEORY_OF_TIME.id],
    ...ALL_CARDS[CARD_CATEGORIES.UNIVERSALS.id],
    ...testUniversals,
  ];
  const metaEthics = [
    ...ALL_CARDS[CARD_CATEGORIES.MORAL_REALITY.id],
    ...ALL_CARDS[CARD_CATEGORIES.MORAL_GROUNDING.id],
    ...ALL_CARDS[CARD_CATEGORIES.MORAL_JUDGMENT.id],
    ...testJudgment,
  ];
  return {
    metaphysics,
    metaEthics,
    rhetoric: [...ALL_CARDS[CARD_CATEGORIES.RHETORIC.id], ...testRhetoric],
  };
}