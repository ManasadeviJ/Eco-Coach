// app/(main)/world/page.jsx
"use client";

import React from "react";
import styles from "./world.module.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import { WorldProvider, useWorldContext } from "@/context/WorldContext";
import { useAuth } from "@/context/AuthContext";
import WorldGrid from "@/components/WorldGrid/WorldGrid";
import ReviveModal from "@/components/ReviveModal/ReviveModal";
import { useState } from "react";

function WorldInner() {
  const auth = useAuth();
  const user = auth?.user;
  const userId = user?.id;

  const { world, loading, fetchWorld, reviveTree, acceptChallenge, buyPlant } = useWorldContext();

  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const onPlantClick = (obj) => {
    if (obj.type === "dry") {
      setSelected(obj);
      setModalOpen(true);
    }
  };

  const confirmRevive = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      await reviveTree(selected.id);
      await fetchWorld();
      setModalOpen(false);
    } catch (e) {
      alert(e.message || "Failed to revive");
    } finally {
      setBusy(false);
    }
  };

  const treeCount = (world || []).filter(w => w.type === "tree").length;
  const birdCount = Math.floor(treeCount / 3);

  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <main className={styles.main}>
        <h1 className={styles.title}>Your World</h1>
        <p className={styles.subtitle}>Every action adds life to the planet.</p>

        <div className={styles.statsRow}>
          <div className={styles.statChip}>
            <img src="/icons/coin.png" alt="coins" className={styles.statIcon} />
            <span>{/* coins are in sidebar */}</span>
          </div>

          <div className={styles.statChip}>
            <img src="/icons/growntree.png" alt="trees" className={styles.statIcon} />
            <span>{treeCount} Trees</span>
          </div>

          <div className={styles.statChip}>
            <img src="/icons/bird.png" alt="birds" className={styles.statIcon} />
            <span>{birdCount}</span>
          </div>
        </div>

        <div className={styles.globeWrapper}>
          {loading ? <div>Loading…</div> : <WorldGrid world={world} onPlantClick={onPlantClick} />}
        </div>

        <div className={styles.actionRow}>
          <button className={styles.primary} onClick={() => (window.location.href = "/challenges")}>
            View Challenges
          </button>
          <button className={styles.ghost} onClick={() => buyPlant("sapling", 3)}>
            Shop (Buy sapling - 3 coins)
          </button>
        </div>

        <div className={styles.suggestRow}>
          <button className={styles.suggestBtn} onClick={() => acceptChallenge()}>
            Suggest an eco idea (AI)
            <span className={styles.aiPill}>AI</span>
          </button>
        </div>
      </main>

      <ReviveModal open={modalOpen} onClose={() => setModalOpen(false)} onConfirm={confirmRevive} cost={1} busy={busy} />
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
