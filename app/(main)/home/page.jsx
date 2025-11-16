"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "./home.module.css";

export default function HomePage() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  // -------- CHALLENGE TIMER --------
  const [acceptedChallenge, setAcceptedChallenge] = useState(false);
  const [timerPercentage, setTimerPercentage] = useState(0);
  const [treeStage, setTreeStage] = useState("sapling");  
  // values: "sapling", "half", "full", "dry"

  useEffect(() => {
    if (!acceptedChallenge) return;

    const totalTime = 12 * 60 * 60 * 1000; // 12 hours
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / totalTime) * 100, 100);

      setTimerPercentage(pct);

      // TREE STAGE LOGIC
      if (pct < 33) setTreeStage("sapling");
      else if (pct < 66) setTreeStage("half");
      else if (pct < 100) setTreeStage("full");
      else setTreeStage("full"); // completed

    }, 1000);

    return () => clearInterval(interval);
  }, [acceptedChallenge]);

  // redirect circle tap
  const handleCircleClick = () => {
    router.push("/challenges");
  };

  const handleAskAI = () => {
    router.push("/chat");
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />

      {/* DARK OVERLAY */}
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)}></div>
      )}

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <a href="/home">Home</a>
          <a href="/chat">Chat</a>
          <a href="/challenges">Challenges</a>
          <a href="/world">World</a>
          <a href="/rewards">Rewards</a>
        </div>
      )}

      <main className={styles.main}>

        <h1 className={styles.title}>Hi, User</h1>

        {/* ---- CIRCLE AREA ---- */}
        <div className={styles.circleWrapper}>
          <div
            className={styles.circle}
            style={{
              backgroundImage: `url(/trees/${treeStage}.png)`,
              border: acceptedChallenge
                ? `8px solid #78C841`
                : "3px solid #E3FCBF",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            onClick={handleCircleClick}
          >
            <div
              className={styles.timerRing}
              style={{ "--pct": `${timerPercentage}%` }}
            ></div>

            <p className={styles.circleText}>
              {acceptedChallenge ? "Challenge Running…" : "Take today's challenge"}
            </p>
          </div>
        </div>

        {/* ASK AI */}
        <button className={styles.askAIMain} onClick={handleAskAI}>
          Ask AI
        </button>
      </main>
    </div>
  );
}
