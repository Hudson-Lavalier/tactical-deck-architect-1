import { hasEffect } from './effects/registry';

const PARTIAL_IDS = new Set([
  'causal_completeness','constructive_cognition','ontological_independence','bridge_between_realms','black_hole_domain',
  'equal_reality','accumulated_reality','moral_facts','moral_truth','realized_truth','factual_appearance','missing_properties',
  'systematic_error','moral_practice_after_error','moral_diversity','framework_relative_truth','no_privileged_framework',
  'contextual_judgment','ordinary_inquiry','natural_explanation','real_moral_facts','irreducible_morality',
  'distinct_moral_properties','rational_or_intuitive_access','morality_is_constructed','valid_construction',
  'agents_and_standards','binding_outcome'
]);

export function getCardAuditStatus(card) {
  if (!card?.id) return 'needs_work';
  if (!hasEffect(card.id)) return 'needs_work';
  return PARTIAL_IDS.has(card.id) ? 'partial' : 'working';
}

export function needsWork(card) {
  return getCardAuditStatus(card) !== 'working';
}