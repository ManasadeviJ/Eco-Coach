// lib/worldLogic.js
// Pure helper functions used by the World page / context.
// NOTE: this file contains no React; it's safe to test on server or client.

export const TOTAL_GROW_MS = 12 * 60 * 60 * 1000; // 12 hours -> full-grown threshold
export const HALF_GROW_MS = TOTAL_GROW_MS * 0.5;

export function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

// compute progress percentage (0..100) based on plantedAt
export function growthPct(plantedAt) {
  if (!plantedAt) return 0;
  const elapsed = Date.now() - plantedAt;
  return Math.min(100, Math.round((elapsed / TOTAL_GROW_MS) * 100));
}

export function getStageForPlant(plant) {
  // plant: { status, plantedAt, revivedAt, ... }
  // status can be 'sapling'|'dry'|'full'|'manual'
  if (!plant.plantedAt || plant.status === "dry") return "sapling";
  const pct = growthPct(plant.plantedAt);
  if (pct >= 100) return "full";
  if (pct >= 50) return "half";
  return "sapling";
}

// storage helpers (localStorage)
const STORAGE_KEY = "eco_world_v1";

export function loadWorldFromStorage() {
  try {
    const raw = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("worldStorage load error", e);
    return null;
  }
}

export function saveWorldToStorage(data) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("worldStorage save error", e);
  }
}
