"use client";

import { useState, useEffect } from "react";
import styles from "./sidebar.module.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [coins, setCoins] = useState(0);

  // Load coins from localStorage
  useEffect(() => {
    // Initial load
    const storedCoins = parseInt(localStorage.getItem("coins") || "0");
    setCoins(storedCoins);

    // Listen for custom coin update event
    const handleCoinUpdate = (event) => {
      const updatedCoins = parseInt(localStorage.getItem("coins") || "0");
      setCoins(updatedCoins);
    };

    window.addEventListener("coinsUpdated", handleCoinUpdate);
    return () => window.removeEventListener("coinsUpdated", handleCoinUpdate);
  }, []);

  return (
    <>
      {/* Hamburger (mobile only) */}
      <button className={styles.menuButton} onClick={() => setOpen(true)}>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </button>

      {/* Overlay when sidebar opens */}
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        {/* Close button (mobile only) */}
        <button className={styles.closeButton} onClick={() => setOpen(false)}>
          ✕
        </button>

        <h2 className={styles.logo}>EcoCoach</h2>

        <nav className={styles.nav}>
          <a href="/home" className={styles.item}>Home</a>
          <a href="/chat" className={styles.item}>Chat</a>
          <a href="/challenges" className={styles.item}>Challenges</a>
          <a href="/world" className={styles.item}>World</a>
          <a href="/rewards" className={styles.item}>Rewards</a>
        </nav>
      </aside>

      {/* Floating Coins & Trees (top-right) */}
      <div className={styles.topStats}>
        <div className={styles.coins}>
          <img src="/icons/coin.png" alt="" />
          <span>{coins}</span>
          <button className={styles.plus}>+</button>
        </div>

        <div className={styles.trees}>
          🌳 <span>3</span>
        </div>
      </div>
    </>
  );
}
