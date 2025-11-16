"use client";
import styles from "./home.module.css";
import { useState } from "react";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      
      {/* Desktop Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>EcoCoach</h2>

        <a href="/home" className={styles.sidebarItem}>Home</a>
        <a href="/chat" className={styles.sidebarItem}>Chat</a>
        <a href="/challenges" className={styles.sidebarItem}>Challenges</a>
        <a href="/world" className={styles.sidebarItem}>World</a>
        <a href="/rewards" className={styles.sidebarItem}>Rewards</a>
      </aside>

      {/* Main Content */}
      <div className={styles.container}>

        {/* Mobile Top Bar */}
        <div className={styles.mobileTopBar}>
          <button
            className={styles.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <div className={styles.statsTop}>
            <span className={styles.coinsChip}>Coins 120</span>
            <span className={styles.treesChip}>Trees 3</span>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <a href="/chat">Chat</a>
            <a href="/challenges">Challenges</a>
            <a href="/world">World</a>
            <a href="/rewards">Rewards</a>
          </div>
        )}

        {/* Desktop Stats Row (top-right chips) */}
        <div className={styles.desktopStats}>
          <span className={styles.coinsChip}>Coins 120</span>
          <span className={styles.treesChip}>Trees 3</span>
        </div>

        <h1 className={styles.headerTitle}>Hi, Alex</h1>

        {/* Big Circle */}
        <div className={styles.circleWrapper}>
          <div className={styles.circle}>
            <p className={styles.circleText}>Take today’s challenge</p>
          </div>
        </div>

        <button className={styles.askAIMain}>Ask AI</button>
      </div>
    </div>
  );
}
