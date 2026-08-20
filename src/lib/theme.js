export const THEME_KEY = 'tda_theme';
export const THEMES = [
  { id: 'cosmic', name: 'Cosmic Command', description: 'Violet nebula depth with bright alignment energy.' },
  { id: 'obsidian', name: 'Obsidian Protocol', description: 'Near-black tactical surfaces with restrained highlights.' },
  { id: 'aether', name: 'Aether Circuit', description: 'Blue-black panels with luminous cyan structure.' },
];

export function getTheme() {
  try { return localStorage.getItem(THEME_KEY) || 'cosmic'; } catch { return 'cosmic'; }
}

export function applyTheme(theme) {
  const selected = THEMES.some((item) => item.id === theme) ? theme : 'cosmic';
  document.documentElement.dataset.theme = selected;
  try { localStorage.setItem(THEME_KEY, selected); } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent('tda-theme-change', { detail: selected }));
  return selected;
}