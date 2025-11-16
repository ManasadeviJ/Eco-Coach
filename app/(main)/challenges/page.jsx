"use client";
import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "./challenges.module.css";

export default function ChallengesPage() {
  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <main className={styles.main}>
        <h1 className={styles.headerTitle}>Daily Challenges</h1>

        {/* Challenge 1 — Not Accepted Yet */}
        <div className={styles.challengeCard}>
          <div className={styles.leftGroup}>
            <img src="/icons/no-plastic.png" className={styles.icon} />

            <div className={styles.textGroup}>
              <h3 className={styles.cardTitle}>Avoid Plastic</h3>
              <p className={styles.cardSubtitle}>Daily Habit</p>
            </div>
          </div>

          <div className={styles.rightGroup}>
            <span className={styles.rewardChip}>40</span>
            <button className={styles.statusAccept}>Accept</button>
          </div>
        </div>

        {/* Challenge 2 — Active */}
        <div className={styles.challengeCard}>
          <div className={styles.leftGroup}>
            <img src="/icons/tree.png" className={styles.icon} />

            <div className={styles.textGroup}>
              <h3 className={styles.cardTitle}>Plant a Tree</h3>
              <p className={styles.cardSubtitle}>Fortlite Co</p>
            </div>
          </div>

          <div className={styles.rightGroup}>
            <span className={styles.rewardChip}>30</span>
            <span className={styles.statusActive}>Active</span>
          </div>
        </div>

        {/* Challenge 3 — Completed */}
        <div className={styles.challengeCard}>
          <div className={styles.leftGroup}>
            <img src="/icons/bag.png" className={styles.icon} />

            <div className={styles.textGroup}>
              <h3 className={styles.cardTitle}>Use Your Own Bag</h3>
              <p className={styles.cardSubtitle}>Ongoing Habit</p>
            </div>
          </div>

          <div className={styles.rightGroup}>
            <span className={styles.rewardChip}>15</span>
            <span className={styles.statusDone}>Done</span>
          </div>
        </div>

      </main>
    </div>
  );
}
