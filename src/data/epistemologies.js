// Epistemology system — character selection.
// 3 families, each with 3 paradigms.
//
// Abilities are transcribed ONLY from the user's documentation where concrete
// drafts exist. Paradigms whose abilities are still in the drafting-question
// phase (Structure of Justification) are marked PENDING_USER_DEFINITION with
// no invented effects.
//
// Source: "EPISTEMOLOGY CHARACTER ABILITY WORKSHEET" and follow-up drafts.

export const EPISTEMOLOGY_FAMILIES = {
  ORIENTATION: {
    id: 'orientation',
    name: 'Orientation of Inquiry',
    description:
      'Governs drawing mechanics, hand management, and doubles the point-manipulation effects of matching Action cards.',
    territory: 'Card Access & Offense',
  },
  STRUCTURE: {
    id: 'structure',
    name: 'Structure of Justification',
    description:
      'Governs how the board is protected, how structures are maintained, and provides defenses against Rhetoric or removal.',
    territory: 'Sustain & Defense',
  },
  KNOWLEDGE: {
    id: 'knowledge',
    name: 'Knowledge Standards',
    description:
      'Governs point protection, point correction, terrain/rule overrides, and interactions with Theory of Time.',
    territory: 'Points & Victory',
  },
};

export const EPISTEMOLOGIES = {
  // ── Orientation of Inquiry ──────────────────────────────────
  empiricism: {
    id: 'empiricism',
    family: 'orientation',
    name: 'Empiricism',
    alignment: 'A',
    abilityName: 'Empirical Data',
    abilityType: 'activated',
    cooldown: 'every_other_personal_turn',
    effect:
      'Every other personal turn, during your draw step, you may choose one main draw pile and examine its top three cards. Add one of those cards to your hand and shuffle the other two back into the pile. This replaces your normal draw for the turn.',
    mainStrength: 'Best exact-card selection',
    mainLimitation: 'Locked to one chosen pile',
  },
  rationalism: {
    id: 'rationalism',
    family: 'orientation',
    name: 'Rationalism',
    alignment: 'B',
    abilityName: 'Rational Deliberation',
    abilityType: 'activated',
    cooldown: 'every_other_personal_turn',
    effect:
      'Every other personal turn, during your draw step, examine the top card of both main draw piles. Choose one and add it to your hand. You may either leave the other card on top of its pile or place it in that pile\u2019s discard area. This replaces your normal draw for the turn.',
    mainStrength: 'Best domain planning and deck control',
    mainLimitation: 'Only sees one card from each pile',
  },
  pragmatism: {
    id: 'pragmatism',
    family: 'orientation',
    name: 'Pragmatism',
    alignment: 'C',
    abilityName: 'Practical Adjustment',
    abilityType: 'activated',
    cooldown: 'every_other_personal_turn',
    effect:
      'Every other personal turn, before a draw occurs, secretly choose A, B, or C and select yourself or your opponent. The next time the selected player draws from a main pile, reveal cards from that pile until a card of the chosen type is revealed. That player draws the revealed card. Shuffle the other revealed cards back into the pile. If the selected player does not draw before the beginning of your next turn, the effect expires. Using this ability begins its cooldown even if no draw occurs.',
    mainStrength: 'Best alignment control and interference',
    mainLimitation: 'Does not choose the exact card',
  },

  // ── Structure of Justification ──────────────────────────────
  // These paradigms exist in the documentation only as drafting questions.
  // No concrete effects have been defined by the user yet.
  foundationalism: {
    id: 'foundationalism',
    family: 'structure',
    name: 'Foundationalism',
    alignment: 'A',
    abilityName: null,
    abilityType: null,
    effect: null,
    pendingUserDefinition: true,
    designDirection:
      'Protect through one central anchor. Establishes a specific card/slot as the Foundation; other defensive benefits depend on that Foundation remaining active.',
  },
  coherentism: {
    id: 'coherentism',
    family: 'structure',
    name: 'Coherentism',
    alignment: 'B',
    abilityName: null,
    abilityType: null,
    effect: null,
    pendingUserDefinition: true,
    designDirection:
      'Protect through mutual support. No single card is privileged; cards become stronger or harder to remove when they form a connected structure.',
  },
  infinitism: {
    id: 'infinitism',
    family: 'structure',
    name: 'Infinitism',
    alignment: 'C',
    abilityName: null,
    abilityType: null,
    effect: null,
    pendingUserDefinition: true,
    designDirection:
      'Protect through continuation. When one card resolves, leaves play, or is interrupted, another card or effect may continue the chain.',
  },

  // ── Knowledge Standards ─────────────────────────────────────
  infallibilism: {
    id: 'infallibilism',
    family: 'knowledge',
    name: 'Infallibilism',
    alignment: 'A',
    abilityName: 'Certainty of Alignment',
    abilityType: 'passive',
    cooldown: null,
    effect:
      'While a terrain is active, your points matching that terrain\u2019s type cannot be removed, stolen, or converted by an opponent.',
    mainStrength: 'Certainty through environmental alignment',
    mainLimitation: 'Protection changes when terrain changes',
  },
  fallibilism: {
    id: 'fallibilism',
    family: 'knowledge',
    name: 'Fallibilism',
    alignment: 'B',
    abilityName: 'Error Recovery',
    abilityType: 'activated',
    cooldown: 'every_other_personal_turn',
    effect:
      'Once every other personal turn, when an opponent would remove or convert one of your points, you may convert that point into either remaining type instead.',
    mainStrength: 'Survival through correction',
    mainLimitation: 'Limited to once every other turn',
  },
  contextualism: {
    id: 'contextualism',
    family: 'knowledge',
    name: 'Contextualism',
    alignment: 'C',
    abilityName: 'Shared Context',
    abilityType: 'passive',
    cooldown: null,
    effect:
      'While both players control Moral Grounding cards of the same type, neither player may remove, steal, or convert points of that type.',
    mainStrength: 'Rules determined by shared conditions',
    mainLimitation: 'Requires both players to share Moral Grounding type',
  },
};

// Helper: get all paradigms for a family
export function getParadigmsByFamily(familyId) {
  return Object.values(EPISTEMOLOGIES).filter((p) => p.family === familyId);
}

// Helper: get alignment array from 3 selected paradigm ids
export function getAlignmentsFromSelection(orientationId, structureId, knowledgeId) {
  return [
    EPISTEMOLOGIES[orientationId]?.alignment,
    EPISTEMOLOGIES[structureId]?.alignment,
    EPISTEMOLOGIES[knowledgeId]?.alignment,
  ].filter(Boolean);
}