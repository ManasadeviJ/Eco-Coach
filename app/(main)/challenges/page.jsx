"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import ChallengeCard from "@/components/ChallengeCard/ChallengeCard";
import styles from "./challenges.module.css";
import { useAuth } from "@/context/AuthContext";

export default function ChallengesPage() {
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user;
  const userId = user?.id;

  const [loading, setLoading] = useState(true);
  const [challengeList, setChallengeList] = useState([]);
  const [acceptingId, setAcceptingId] = useState(null);

  /** -------------------------
   * LOAD AVAILABLE CHALLENGES
   ---------------------------*/
  const loadChallenges = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/challenge"); // GET list
      if (!res.ok) throw new Error("Failed to fetch challenges");

      const json = await res.json();
      setChallengeList(json.challenges || []);
    } catch (err) {
      console.error(err);
      setChallengeList([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  /** -------------------------
   * ACCEPT CHALLENGE
   ---------------------------*/
  const handleAccept = async (challenge) => {
    if (!userId) {
      router.push("/login");
      return;
    }

    setAcceptingId(challenge.id);

    try {
      const res = await fetch("/api/active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge_id: challenge.id }),
      });

      if (!res.ok) {
        const err = await res.text();
        alert(err);
        setAcceptingId(null);
        return;
      }

      // Success → go home to show timer & sapling
      router.push("/home");
    } catch (err) {
      console.error(err);
      alert("Network error");
    }

    setAcceptingId(null);
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <main className={styles.main}>
        <h1 className={styles.headerTitle}>Daily Challenges</h1>

        {loading && <p>Loading challenges...</p>}

        {!loading && challengeList.length === 0 && (
          <p>No challenges available today.</p>
        )}

        {/* Render via reusable ChallengeCard */}
        {challengeList.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onAccept={handleAccept}
            accepting={acceptingId === challenge.id}
          />
        ))}
      </main>
    </div>
  );
}
