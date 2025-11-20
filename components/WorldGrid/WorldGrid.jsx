// components/WorldGrid/WorldGrid.jsx
"use client";
import React from "react";
import Plant from "@/components/Plant/Plant";
import styles from "./WorldGrid.module.css";

export default function WorldGrid({ world, onPlantClick }) {
  // world is array with pos_x/pos_y 0..100 floats; map to grid
  return (
    <div className={styles.grid}>
      {world.map(obj => (
        <div
          key={obj.id}
          className={styles.cell}
          style={{
            left: `${(obj.pos_x ?? Math.random()*100)}%`,
            top: `${(obj.pos_y ?? Math.random()*100)}%`
          }}
        >
          <Plant obj={obj} onClick={onPlantClick} />
        </div>
      ))}
    </div>
  );
}
