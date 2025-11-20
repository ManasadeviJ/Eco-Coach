// components/ChallengeCard/ChallengeCard.jsx
"use client";
import React from "react";
import styles from "./ChallengeCard.module.css";

export default function ChallengeCard({ challenge, onAccept, accepting, accepted, onComplete, completing }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>{challenge.title}</h3>
        <span className={styles.points}>+{challenge.points || 1}</span>
      </div>
      <p className={styles.desc}>{challenge.description}</p>

      <div className={styles.footer}>
        {!accepted ? (
          <button
            className={styles.acceptBtn}
            onClick={() => onAccept && onAccept(challenge)}
            disabled={accepting}
          >
            {accepting ? "Joining…" : "Join Challenge"}
          </button>
        ) : (
          <button
            className={styles.acceptBtn}
            onClick={() => onComplete && onComplete(challenge)}
            disabled={completing}
          >
            {completing ? "Completing…" : "I did it"}
          </button>
        )}
      </div>
    </div>
  );
}
