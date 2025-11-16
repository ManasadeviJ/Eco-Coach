"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "./home.module.css";
import { 
  loadAcceptedChallenge, 
  removeAcceptedChallenge, 
  loadCoins, 
  addCoins,
  getTreeStage
} from "@/lib/challengeLogic";

export default function HomePage() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [coins, setCoins] = useState(0);

  // -------- CHALLENGE TIMER --------
  const [acceptedChallenge, setAcceptedChallenge] = useState(null);
  const [timerPercentage, setTimerPercentage] = useState(0);
  const [treeStage, setTreeStage] = useState("sapling");
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  // values: "sapling", "half", "full", "dry"

  // Load accepted challenge and coins from localStorage on mount
  useEffect(() => {
    const storedChallenge = loadAcceptedChallenge();
    if (storedChallenge) {
      setAcceptedChallenge(storedChallenge);
      setChallengeCompleted(false);
    }

    const storedCoins = loadCoins();
    setCoins(storedCoins);
  }, []);

  // Timer effect
  useEffect(() => {
    if (!acceptedChallenge) return;

    const totalTime = 12 * 60 * 60 * 1000; // 12 hours
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / totalTime) * 100, 100);

      setTimerPercentage(pct);
      setTreeStage(getTreeStage(pct));

    }, 1000);

    return () => clearInterval(interval);
  }, [acceptedChallenge]);

  // redirect circle tap
  const handleCircleClick = () => {
    if (!acceptedChallenge) {
      router.push("/challenges");
    }
  };

  const handleCompleteChallenge = (e) => {
    e.stopPropagation();
    console.log("Button clicked! Current state - challengeCompleted:", challengeCompleted);
    
    if (!challengeCompleted) {
      // First click: Give reward
      console.log("First click - Adding coin...");
      try {
        const newCoinsValue = addCoins(1);
        console.log("Coins added. New total:", newCoinsValue);
        setCoins(newCoinsValue);
        setChallengeCompleted(true);
        console.log("State updated - challengeCompleted set to true");
      } catch (error) {
        console.error("Error adding coins:", error);
      }
    } else {
      // Second click: Take new challenge
      console.log("Second click - Taking new challenge...");
      try {
        removeAcceptedChallenge();
        setAcceptedChallenge(null);
        setChallengeCompleted(false);
        setTimerPercentage(0);
        setTreeStage("sapling");
        console.log("Redirecting to challenges...");
        router.push("/challenges");
      } catch (error) {
        console.error("Error taking new challenge:", error);
      }
    }
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

        {/* COINS DISPLAY */}
        {/* <div className={styles.coinsDisplay}>
          <span className={styles.coinIcon}>🪙</span>
          <span className={styles.coinCount}>{coins}</span>
        </div> */}
        <br></br>
        

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

            <div className={styles.circleContent}>
              {acceptedChallenge ? (
                <>
                  <p className={styles.circleText}>
                    {challengeCompleted ? "Challenge Completed!" : "Challenge Running…"}
                  </p>
                  <p className={styles.challengeTitle}>
                    {acceptedChallenge.title || acceptedChallenge.name}
                  </p>
                  <button 
                    className={styles.completedBtn}
                    onClick={handleCompleteChallenge}
                  >
                    {challengeCompleted ? "Take New Challenge" : "Done"}
                  </button>
                </>
              ) : (
                <p className={styles.circleText}>
                  Take today's challenge
                </p>
              )}
            </div>
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
