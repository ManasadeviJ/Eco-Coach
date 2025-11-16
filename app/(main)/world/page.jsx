"use client";
import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "./world.module.css";

export default function WorldPage() {
  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <main className={styles.main}>
        {/* Header */}
        <h1 className={styles.title}>Your World</h1>
        <p className={styles.subtitle}>Every action adds life to the planet.</p>

        {/* Globe Section */}
        <div className={styles.globeWrapper}>
          <div className={styles.globe}>
            <p className={styles.globeText}>Your Eco World</p>

            <div className={styles.treeOne}></div>
            <div className={styles.treeTwo}></div>
            <div className={styles.sapling}></div>
            <div className={styles.bird}></div>
          </div>
        </div>

        {/* Action buttons */}
        <div className={styles.actionRow}>
          <a href="/challenges" className={styles.linkButton}>View Challenges</a>
          <a href="/shop" className={styles.linkButton}>Shop</a>
        </div>
      </main>
    </div>
  );
}
