// components/ReviveModal/ReviveModal.jsx
"use client";
import React from "react";
import styles from "./ReviveModal.module.css";

export default function ReviveModal({ open, onClose, onConfirm, cost = 1, busy }) {
  if (!open) return null;
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Revive Plant</h3>
        <p>Spend {cost} coin to revive this plant into a sapling?</p>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>Cancel</button>
          <button className={styles.confirm} onClick={onConfirm} disabled={busy}>{busy ? "Working..." : `Revive - ${cost} coin`}</button>
        </div>
      </div>
    </div>
  );
}
