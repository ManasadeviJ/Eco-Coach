"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "./challenges.module.css";
import { loadAcceptedChallenge, saveAcceptedChallenge, removeAcceptedChallenge } from "@/lib/challengeLogic";

export default function ChallengesPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "Avoid Plastic",
      subtitle: "Daily Habit",
      icon: "/icons/no-plastic.png",
      reward: 40,
      status: "accept" // accept, active, done
    },
    {
      id: 2,
      title: "Plant a Tree",
      subtitle: "Fortlite Co",
      icon: "/icons/tree.png",
      reward: 30,
      status: "accept"
    },
    {
      id: 3,
      title: "Use Your Own Bag",
      subtitle: "Ongoing Habit",
      icon: "/icons/bag.png",
      reward: 15,
      status: "accept"
    }
  ]);

  // Load accepted challenge status on mount
  useEffect(() => {
    const acceptedChallenge = loadAcceptedChallenge();
    if (acceptedChallenge) {
      setChallenges(prev => 
        prev.map(c => 
          c.id === acceptedChallenge.id ? { ...c, status: "active" } : c
        )
      );
    }
  }, []);

  const handleAcceptChallenge = (challenge) => {
    // Save to localStorage using utility function
    saveAcceptedChallenge(challenge);
    
    // Update status
    setChallenges(challenges.map(c => 
      c.id === challenge.id ? { ...c, status: "active" } : c
    ));
    
    // Redirect to home
    router.push("/home");
  };

  const handleCompleteChallenge = (challenge) => {
    // Remove accepted challenge from localStorage
    removeAcceptedChallenge();
    
    // Update challenge status to done
    setChallenges(challenges.map(c => 
      c.id === challenge.id ? { ...c, status: "done" } : c
    ));
  };

  const getStatusButton = (challenge) => {
    if (challenge.status === "accept") {
      return (
        <button 
          className={styles.statusAccept}
          onClick={() => handleAcceptChallenge(challenge)}
        >
          Accept
        </button>
      );
    } else if (challenge.status === "active") {
      return (
        <button 
          className={styles.statusDone}
          onClick={() => handleCompleteChallenge(challenge)}
        >
          ✓ Done
        </button>
      );
    } else {
      return <span className={styles.statusDone}>✓ Done</span>;
    }
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <main className={styles.main}>
        <h1 className={styles.headerTitle}>Daily Challenges</h1>

        {challenges.map((challenge) => (
          <div key={challenge.id} className={styles.challengeCard}>
            <div className={styles.leftGroup}>
              <img src={challenge.icon} className={styles.icon} />

              <div className={styles.textGroup}>
                <h3 className={styles.cardTitle}>{challenge.title}</h3>
                <p className={styles.cardSubtitle}>{challenge.subtitle}</p>
              </div>
            </div>

            <div className={styles.rightGroup}>
              <span className={styles.rewardChip}>{challenge.reward}</span>
              {getStatusButton(challenge)}
            </div>
          </div>
        ))}

      </main>
    </div>
  );
}
