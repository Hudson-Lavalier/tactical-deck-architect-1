// Build storage — persists player builds to localStorage.
// Builds survive across sessions, game ends, and turn completions.
// They never go away until manually deleted.

const STORAGE_KEY = 'savedBuilds';

export function getSavedBuilds() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveBuild(build) {
  const builds = getSavedBuilds();
  const newBuild = {
    id: build.id || `build_${Date.now()}`,
    name: build.name || 'Untitled Build',
    paradigms: build.paradigms, // array of {id, family, name, alignment}
    createdAt: build.createdAt || Date.now(),
  };
  builds.push(newBuild);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
  return newBuild;
}

export function updateBuild(id, updates) {
  const builds = getSavedBuilds();
  const idx = builds.findIndex((b) => b.id === id);
  if (idx !== -1) {
    builds[idx] = { ...builds[idx], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
    return builds[idx];
  }
  return null;
}

export function deleteBuild(id) {
  const builds = getSavedBuilds();
  const filtered = builds.filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getBuildById(id) {
  return getSavedBuilds().find((b) => b.id === id);
}