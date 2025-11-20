// components/Sidebar/Sidebar.jsx
"use client";

import { useState } from "react";
import styles from "./sidebar.module.css";
import { useAuth } from "@/context/AuthContext";
import usePoints from "@/hooks/usePoints";
import Link from "next/link";

export default function Sidebar() {
  const auth = useAuth();
  const user = auth?.user;
  const userId = user?.id;
  const { points: coins, loading } = usePoints(userId);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger */}
      <button className={styles.menuButton} onClick={() => setOpen(true)} aria-label="open menu">
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </button>

      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <button className={styles.closeButton} onClick={() => setOpen(false)} aria-label="close menu">✕</button>

        <h2 className={styles.logo}>EcoCoach</h2>

        <nav className={styles.nav}>
          <Link href="/home" className={styles.item}>Home</Link>
          <Link href="/chat" className={styles.item}>Chat</Link>
          <Link href="/challenges" className={styles.item}>Challenges</Link>
          <Link href="/world" className={styles.item}>World</Link>
          <Link href="/rewards" className={styles.item}>Rewards</Link>
        </nav>

        <div className={styles.bottomSection}>
          <Link href="/profile" className={styles.profileBtn}>
            <img src="/icons/user.png" alt="Profile" />
            My Profile
          </Link>
        </div>
      </aside>

      <div className={styles.topStats}>
        <div className={styles.coins} title="Your coins">
          <img src="/icons/coin.png" alt="coins" />
          <span>{loading ? "…" : (coins ?? 0)}</span>
          <button className={styles.plus} aria-label="Add coins">+</button>
        </div>

        <div className={styles.trees}>
          🌳 <span>3</span>
        </div>
      </div>
    </>
  );
}
