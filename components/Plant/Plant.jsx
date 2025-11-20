// components/Plant/Plant.jsx
"use client";
import React from "react";
import styles from "./Plant.module.css";

const ICONS = {
  sapling: "/icons/sapling.png",
  half: "/icons/growntree.png", // adapt to your assets
  tree: "/icons/growntree.png",
  dry: "/icons/driedtree.png",
  bird: "/icons/bird.png"
};

export default function Plant({ obj, size = 60, onClick }) {
  const src = ICONS[obj.type] || ICONS.sapling;
  return (
    <button className={styles.plant} style={{ width: size, height: size }} onClick={() => onClick && onClick(obj)}>
      <img src={src} alt={obj.type} style={{ width: "100%", height: "100%" }} />
    </button>
  );
}
