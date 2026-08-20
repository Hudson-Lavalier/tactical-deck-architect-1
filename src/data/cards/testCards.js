// ════════════════════════════════════════════════════════════════
// TEST CARDS — isolated, for game-testing only.
// These are NOT added to the normal draw piles (buildDrawPiles).
// They live in a separate test pile accessed via the Test Mode page.
// Each is marked `test: true` and named with a "TEST" prefix so they
// are easy to find and delete later.
// ════════════════════════════════════════════════════════════════

export const testCards = [
  // ── Universals (Modifiers) ──────────────────────────────────────
  {
    id: 'test_universal_extend_duration',
    name: 'TEST: Extend Duration',
    alignment: 'A',
    category: 'universals',
    subcategory: 'Test',
    test: true,
    temporary: true,
    text: `TEST CARD — DELETE LATER.

Attach to a queued card. That card's queue duration is extended by 1 turn.`,
  },
  {
    id: 'test_universal_boost_generation',
    name: 'TEST: Boost Generation',
    alignment: 'B',
    category: 'universals',
    subcategory: 'Test',
    test: true,
    temporary: true,
    text: `TEST CARD — DELETE LATER.

Attach to a persistent card. That card generates 1 additional point of its type at the next round end.`,
  },
  {
    id: 'test_universal_remove_penalty',
    name: 'TEST: Remove Penalty',
    alignment: 'C',
    category: 'universals',
    subcategory: 'Test',
    test: true,
    temporary: true,
    text: `TEST CARD — DELETE LATER.

Attach to a queued card. Removes any paused or delayed state from that card.`,
  },

  // ── Moral Judgment (Action — one-time-use) ───────────────────────
  {
    id: 'test_judgment_remove_point',
    name: 'TEST: Remove Point',
    alignment: 'A',
    category: 'moral_judgment',
    subcategory: 'Test',
    test: true,
    temporary: true,
    text: `TEST CARD — DELETE LATER.

Remove 1 point from the opponent of the type they have the most of.`,
  },
  {
    id: 'test_judgment_earn_point',
    name: 'TEST: Earn Point',
    alignment: 'B',
    category: 'moral_judgment',
    subcategory: 'Test',
    test: true,
    temporary: true,
    text: `TEST CARD — DELETE LATER.

Add 1 point to yourself matching the active Domain's type.`,
  },
  {
    id: 'test_judgment_draw_two',
    name: 'TEST: Draw Two',
    alignment: 'C',
    category: 'moral_judgment',
    subcategory: 'Test',
    test: true,
    temporary: true,
    text: `TEST CARD — DELETE LATER.

Place this card to immediately draw 2 cards from the Metaphysics pile.`,
  },

  // ── Rhetoric (Response) ──────────────────────────────────────────
  {
    id: 'test_rhetoric_cancel',
    name: 'TEST: Cancel',
    alignment: 'A',
    category: 'rhetoric',
    subcategory: 'Test',
    test: true,
    temporary: true,
    text: `TEST CARD — DELETE LATER.

Cancel the target card's effect.`,
  },
  {
    id: 'test_rhetoric_protect',
    name: 'TEST: Protect',
    alignment: 'B',
    category: 'rhetoric',
    subcategory: 'Test',
    test: true,
    temporary: true,
    text: `TEST CARD — DELETE LATER.

Protect the target card from the next opposing rhetoric card.`,
  },
  {
    id: 'test_rhetoric_delay',
    name: 'TEST: Delay',
    alignment: 'C',
    category: 'rhetoric',
    subcategory: 'Test',
    test: true,
    temporary: true,
    text: `TEST CARD — DELETE LATER.

Add 1 turn to the target card's queue timer.`,
  },
];