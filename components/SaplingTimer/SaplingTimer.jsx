// components/SaplingTimer/SaplingTimer.jsx
"use client";
import React from "react";
import { useTimer } from "@/hooks/useTimer";
import styles from "./SaplingTimer.module.css";

export default function SaplingTimer({ deadline }) {
  const { remaining, human, isExpired } = useTimer(deadline);

  const pct = deadline ? Math.max(0, Math.min(100, Math.round((remaining / (new Date(deadline).getTime() - (new Date().getTime() - remaining))) * 100))) : 0;

  return (
    <div className={styles.timer}>
      <div className={styles.timeText}>{isExpired ? "Expired" : human}</div>
      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
