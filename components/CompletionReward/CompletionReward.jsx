// components/CompletionReward/CompletionReward.jsx
"use client";
import React from "react";
import styles from "./CompletionReward.module.css";

const ecoMessages = [
  "Great job, eco-warrior!",
  "Every action counts!",
  "You're growing the planet!",
  "Mother Earth thanks you!",
  " Keep up the green work!",
  "Planting hope today!",
];

export default function CompletionReward({ open, onClose, coinsEarned = 5, treeGrown = true }) {
  if (!open) return null;

  const message = ecoMessages[Math.floor(Math.random() * ecoMessages.length)];

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.celebration}>
          <img src="/icons/plant1.png" alt="Celebration" className={styles.icon} />
        </div>

        <h2 className={styles.title}>Challenge Complete!</h2>

        <p className={styles.message}>{message}</p>

        <div className={styles.rewards}>
          {coinsEarned > 0 && (
            <div className={styles.reward}>
              <img src="/icons/coin.png" alt="coins" className={styles.rewardIcon} />
              <span className={styles.rewardText}>+{coinsEarned} Coins</span>
            </div>
          )}

          {treeGrown && (
            <div className={styles.reward}>
              <img src="/icons/tree.png" alt="tree" className={styles.rewardIcon} />
              <span className={styles.rewardText}>Tree Growing!</span>
            </div>
          )}
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          Grow More
        </button>
      </div>
    </div>
  );
}
