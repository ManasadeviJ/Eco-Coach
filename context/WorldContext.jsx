// context/WorldContext.jsx
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  uid,
  loadWorldFromStorage,
  saveWorldToStorage,
  growthPct,
  getStageForPlant,
  TOTAL_GROW_MS,
} from "@/lib/worldLogic";

/*
State shape:
{
  coins: number,
  plants: [
    { id, status: 'sapling'|'full'|'dry', plantedAt: timestamp, createdFromChallengeId?: string, x: '20%', y: '30%' }
  ],
  birds: number
}
*/

const WorldContext = createContext(null);

export function useWorld() {
  return useContext(WorldContext);
}

export function WorldProvider({ children }) {
  const initial = {
    coins: 0, // Start with 0, will be loaded from storage
    plants: [], // empty initially
    // birds count computed from plants (1 bird per 3 trees)
    updatedAt: Date.now(),
  };

  const [state, setState] = useState(initial);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from storage only on client side after hydration
  useEffect(() => {
    const saved = loadWorldFromStorage();
    if (saved) {
      setState(saved);
    }
    setIsHydrated(true);
  }, []);

  // recompute birds count from number of fully grown trees
  const computeBirds = useCallback((plants) => {
    const fullCount = plants.filter((p) => p.status === "full").length;
    return Math.floor(fullCount / 3);
  }, []);

  // persist on changes
  useEffect(() => {
    saveWorldToStorage(state);
  }, [state]);

  // tick: update plant statuses based on time
  useEffect(() => {
    const timer = setInterval(() => {
      setState((s) => {
        let changed = false;
        const nextPlants = s.plants.map((p) => {
          if (p.status === "dry" || p.status === "full") return p;
          if (!p.plantedAt) return p;
          const pct = growthPct(p.plantedAt);
          if (pct >= 100 && p.status !== "full") {
            changed = true;
            return { ...p, status: "full" };
          }
          return p;
        });
        if (!changed) return s;
        return { ...s, plants: nextPlants, updatedAt: Date.now() };
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // ACTIONS

  const acceptChallenge = useCallback(({ fromChallengeId } = {}) => {
    // Plant a sapling at a random position on globe
    const pos = randomPosition();
    const newPlant = {
      id: uid("p_"),
      status: "sapling",
      plantedAt: Date.now(),
      createdFromChallengeId: fromChallengeId || null,
      x: pos.x,
      y: pos.y,
    };
    setState((s) => ({ ...s, plants: [...s.plants, newPlant], updatedAt: Date.now() }));
    return newPlant.id;
  }, []);

  const markChallengeCompleted = useCallback((challengePlantId) => {
    // mark specific plant as 'full' immediately and reward 1 coin
    setState((s) => {
      const next = s.plants.map((p) =>
        p.id === challengePlantId ? { ...p, status: "full", plantedAt: p.plantedAt || Date.now() } : p
      );
      return { ...s, plants: next, coins: s.coins + 1, updatedAt: Date.now() };
    });
  }, []);

  const markChallengeFailed = useCallback((challengePlantId) => {
    setState((s) => {
      const next = s.plants.map((p) => (p.id === challengePlantId ? { ...p, status: "dry" } : p));
      return { ...s, plants: next, updatedAt: Date.now() };
    });
  }, []);

  const reviveTree = useCallback((plantId) => {
    // cost 1 coin to revive a dry tree => becomes sapling with plantedAt = now
    setState((s) => {
      const plant = s.plants.find((p) => p.id === plantId);
      if (!plant || plant.status !== "dry") return s;
      if (s.coins < 1) return s; // not enough coins
      const next = s.plants.map((p) =>
        p.id === plantId ? { ...p, status: "sapling", plantedAt: Date.now() } : p
      );
      return { ...s, plants: next, coins: s.coins - 1, updatedAt: Date.now() };
    });
  }, []);

  const buyPlant = useCallback((type = "sapling", cost = 3) => {
    // buy an extra sapling from shop
    setState((s) => {
      if (s.coins < cost) return s;
      const pos = randomPosition();
      const newPlant = {
        id: uid("p_"),
        status: "sapling",
        plantedAt: Date.now(),
        createdFromShop: true,
        x: pos.x,
        y: pos.y,
      };
      return { ...s, plants: [...s.plants, newPlant], coins: s.coins - cost, updatedAt: Date.now() };
    });
  }, []);

  const removePlant = useCallback((plantId) => {
    setState((s) => ({ ...s, plants: s.plants.filter((p) => p.id !== plantId), updatedAt: Date.now() }));
  }, []);

  // helpers
  function randomPosition() {
    // returns {x:'45%', y:'32%'} positions nicely distributed
    const angle = Math.random() * Math.PI * 2;
    const r = 38 + Math.random() * 24; // radius percent from center
    const cx = 50 + r * Math.cos(angle) / 100 * 100;
    const cy = 50 + r * Math.sin(angle) / 100 * 100;
    // clamp
    const x = Math.min(88, Math.max(12, Math.round(cx))) + "%";
    const y = Math.min(80, Math.max(20, Math.round(cy))) + "%";
    return { x, y };
  }

  // computed values
  const birds = computeBirds(state.plants);
  const trees = state.plants.filter((p) => p.status === "full").length;
  const saplings = state.plants.filter((p) => p.status === "sapling").length;
  const dry = state.plants.filter((p) => p.status === "dry").length;

  const contextValue = {
    state,
    isHydrated,
    birds,
    trees,
    saplings,
    dry,
    acceptChallenge,
    markChallengeCompleted,
    markChallengeFailed,
    reviveTree,
    buyPlant,
    removePlant,
  };

  return <WorldContext.Provider value={contextValue}>{children}</WorldContext.Provider>;
}
