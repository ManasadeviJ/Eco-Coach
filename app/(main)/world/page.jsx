// app/(main)/world/page.jsx
"use client";

import React from "react";
import styles from "./world.module.css";
import { WorldProvider, useWorld } from "@/context/WorldContext";
import Sidebar from "@/components/Sidebar/Sidebar";

function WorldInner() {
  const {
    state,
    isHydrated,
    birds,
    trees,
    saplings,
    dry,
    acceptChallenge,
    reviveTree,
    buyPlant,
    markChallengeCompleted,
    removePlant,
  } = useWorld();

  // Don't render until hydrated to avoid mismatch
  if (!isHydrated) {
    return (
      <div className={styles.wrapper}>
        <Sidebar />
        <main className={styles.main}>
          <h1 className={styles.title}>Your World</h1>
          <p className={styles.subtitle}>Loading...</p>
        </main>
      </div>
    );
  }

  // Click handlers
  const onAccept = () => {
    acceptChallenge();
    // small toast could be added
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <main className={styles.main}>
        <h1 className={styles.title}>Your World</h1>
        <p className={styles.subtitle}>Every action adds life to the planet.</p>

        {/* Stats row */}
        <div className={styles.statsRow}>
          <div className={styles.statChip}>
            <img src="/icons/coin.png" alt="coins" className={styles.statIcon} />
            <span>{state.coins}</span>
          </div>

          <div className={styles.statChip}>
            <img src="/icons/growntree.png" alt="trees" className={styles.statIcon} />
            <span>{trees} Trees</span>
          </div>

          <div className={styles.statChip}>
            <img src="/icons/bird.png" alt="birds" className={styles.statIcon} />
            <span>{birds}</span>
          </div>
        </div>

        {/* globe area */}
        <div className={styles.globeWrapper}>
          <div className={styles.globe}>
            <img src="/icons/earth.png" className={styles.earthImage} alt="earth" />

            {/* overlay plants */}
            {state.plants.map((p) => {
              const stage = p.status === "dry" ? "driedtree" : p.status === "full" ? "growntree" : "sapling";
              const src = `/icons/${stage}.png`;
              return (
                <div
                  key={p.id}
                  className={styles.plantIcon}
                  style={{ left: p.x, top: p.y }}
                  title={p.status === "dry" ? "Dry tree (revive for 1 coin)" : p.status === "full" ? "Grown tree" : "Sapling — complete the challenge to grow"}
                  onClick={() => {
                    if (p.status === "dry") reviveTree(p.id);
                  }}
                >
                  <img src={src} alt={stage} />
                </div>
              );
            })}

            {/* birds as floating images */}
            {Array.from({ length: birds }).map((_, i) => (
              <img key={i} src="/icons/bird.png" alt="bird" className={styles.bird} style={{ animationDelay: `${i * 0.7}s` }} />
            ))}

          </div>
        </div>

        {/* actions */}
        <div className={styles.actionRow}>
          <button className={styles.primary} onClick={() => (window.location.href = "/challenges")}>
            View Challenges
          </button>

          <button className={styles.ghost} onClick={() => buyPlant("sapling", 3)}>
            Shop (Buy sapling - 3 coins)
          </button>
        </div>

        <div className={styles.suggestRow}>
          <button className={styles.suggestBtn} onClick={onAccept}>
            Suggest an eco idea (AI)
            <span className={styles.aiPill}>AI</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default function WorldPage() {
  return (
    <WorldProvider>
      <WorldInner />
    </WorldProvider>
  );
}
