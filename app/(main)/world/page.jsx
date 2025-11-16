"use client";
import { useState } from "react";
import styles from "./world.module.css";

export default function WorldPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.wrapper}>

      {/* Desktop Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>EcoCoach</h2>

        <a href="/home" className={styles.sidebarItem}>Home</a>
        <a href="/chat" className={styles.sidebarItem}>Chat</a>
        <a href="/challenges" className={styles.sidebarItem}>Challenges</a>
        <a href="/world" className={styles.sidebarItemActive}>World</a>
        <a href="/rewards" className={styles.sidebarItem}>Rewards</a>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.container}>

        {/* Mobile top bar */}
        <div className={styles.mobileTopBar}>
          <button
            className={styles.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <div className={styles.statsTop}>
            <span className={styles.chip}>120 Coins</span>
            <span className={styles.chip}>3 Trees</span>
            <span className={styles.chip}>2 Birds</span>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <a href="/home">Home</a>
            <a href="/chat">Chat</a>
            <a href="/challenges">Challenges</a>
            <a href="/world">World</a>
            <a href="/rewards">Rewards</a>
          </div>
        )}

        {/* Desktop Stats Row */}
        <div className={styles.desktopStats}>
          <span className={styles.chip}>120 Coins</span>
          <span className={styles.chip}>3 Trees</span>
          <span className={styles.chip}>2 Birds</span>
        </div>

        {/* Header */}
        <h1 className={styles.title}>Your World</h1>
        <p className={styles.subtitle}>Every action adds life to the planet.</p>

        {/* GLOBE */}
        <div className={styles.globeWrapper}>
          <div className={styles.globe}>
            <p className={styles.globeText}>Your Eco World</p>

            {/* Placeholder for trees & birds */}
            <div className={styles.treeOne}></div>
            <div className={styles.treeTwo}></div>
            <div className={styles.sapling}></div>
            <div className={styles.bird}></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionRow}>
          <a href="/challenges" className={styles.linkButton}>View Challenges</a>
          <a href="/shop" className={styles.linkButton}>Shop</a>
        </div>
      </main>
    </div>
  );
}
