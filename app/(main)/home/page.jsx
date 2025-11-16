"use client";
import { useState } from "react";
import styles from "./home.module.css";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.wrapper}>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Overlay */}
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)}></div>}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <a href="/home">Home</a>
          <a href="/chat">Chat</a>
          <a href="/challenges">Challenges</a>
          <a href="/world">World</a>
          <a href="/rewards">Rewards</a>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className={styles.main}>

        {/* Mobile Top Bar */}
        {/* <div className={styles.mobileTopBar}>
          <button className={styles.menuButton} onClick={() => setMenuOpen(true)}>
            ☰
          </button>

          <div className={styles.statsTop}>
            <span className={styles.chip}>Coins 120</span>
            <span className={styles.chip}>Trees 3</span>
          </div>
        </div> */}

        <h1 className={styles.title}>Hi, User</h1>

        <div className={styles.circleWrapper}>
          <div className={styles.circle}>
            <p className={styles.circleText}>Take today’s challenge</p>
          </div>
        </div>

        <button className={styles.askAIMain}>Ask AI</button>

      </main>
    </div>
  );
}
