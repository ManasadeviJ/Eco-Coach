"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import CompletionReward from "@/components/CompletionReward/CompletionReward";
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
  // map challengeId -> activeId (server) for accepted challenges
  const [acceptedMap, setAcceptedMap] = useState({});
  const [completingId, setCompletingId] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [rewardCoins, setRewardCoins] = useState(0);

  /** -------------------------
   * LOAD AVAILABLE CHALLENGES (WITH FALLBACK)
   ---------------------------*/
  const loadChallenges = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/challenge");
      if (!res.ok) throw new Error("Server down");

      const json = await res.json();
      setChallengeList(json.challenges || []);
    } catch (err) {
      console.error("API failed → Using dummy challenges");
      try {
        const dummy = await import("@/data/dummyChallenges.json");
        setChallengeList(dummy.default || []);
      } catch (jsonErr) {
        console.error("Dummy JSON load failed", jsonErr);
        setChallengeList([]);
      }
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
      // anonymous user: create a local active challenge so Home can show it
      try {
        const localActive = {
          id: `local-${challenge.id}-${Date.now()}`,
          user_id: null,
          source_challenge_id: challenge.id,
          challenge_id: challenge.id,
          title: challenge.title || challenge.name || "",
          accepted_at: new Date().toISOString(),
          deadline_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          status: "active",
        };

        setAcceptedMap((m) => ({ ...m, [challenge.id]: localActive.id }));
        localStorage.setItem("local_active_challenge", JSON.stringify(localActive));
        // notify other parts of the app (Home) to pick up the new active
        window.dispatchEvent(new Event("localActiveUpdated"));
      } catch (err) {
        console.error("local accept error", err);
        alert("Unable to start challenge locally");
      }

      setAcceptingId(null);
      return;
    }

    setAcceptingId(challenge.id);

    try {
      const res = await fetch("/api/active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge_id: challenge.id, user_id: userId }),
      });

      if (!res.ok) {
        const err = await res.text();
        alert(err);
        setAcceptingId(null);
        return;
      }

      const json = await res.json();
      // json.active should be the inserted active row
      const activeId = json.active?.id;
      if (activeId) {
        setAcceptedMap((m) => ({ ...m, [challenge.id]: activeId }));
      }

      // stay on challenges page; button will switch to "I did it"
    } catch (err) {
      console.error(err);
      alert("Network error");
    }

    setAcceptingId(null);
  };

  // Complete handler from the Challenges page
  const handleComplete = async (challenge) => {
    if (!userId) {
      // Local completion flow for anonymous users
      let localActive = null;
      try {
        const raw = localStorage.getItem("local_active_challenge");
        if (raw) localActive = JSON.parse(raw);
      } catch (err) {
        console.error("parse local active", err);
      }

      const activeId = acceptedMap[challenge.id] || (localActive && localActive.id);
      if (!activeId) {
        alert('No local active challenge found for this item');
        return;
      }

      setCompletingId(challenge.id);
      try {
        const coins = 5;
        setRewardCoins(coins);
        setShowReward(true);

        // notify sidebar
        window.dispatchEvent(new CustomEvent('coinsUpdated', { detail: { coins } }));

        // remove accepted mapping and local storage
        setAcceptedMap((m) => {
          const copy = { ...m };
          delete copy[challenge.id];
          return copy;
        });
        localStorage.removeItem('local_active_challenge');
      } catch (err) {
        console.error(err);
        alert('Network error');
      }

      setCompletingId(null);
      return;
    }

    let activeId = acceptedMap[challenge.id];
    if (!activeId) {
      // try to find active via API
      try {
        const res = await fetch(`/api/active?user_id=${userId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.active && json.active.source_challenge_id === challenge.id) {
            // use server active id
            activeId = json.active.id;
          } else {
            alert('No active challenge found for this item');
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching active', err);
        alert('Unable to complete challenge');
        return;
      }
    }

    setCompletingId(challenge.id);
    try {
      const res = await fetch("/api/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, active_id: activeId }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error('Complete failed', txt);
        alert(txt || 'Failed to complete');
        setCompletingId(null);
        return;
      }

      const json = await res.json();
      const coins = json.coins_earned || json.points || 5;
      setRewardCoins(coins);
      setShowReward(true);

      // dispatch event so sidebar updates
      window.dispatchEvent(new CustomEvent('coinsUpdated', { detail: { coins } }));

      // remove accepted mapping so button returns to Join Challenge
      setAcceptedMap((m) => {
        const copy = { ...m };
        delete copy[challenge.id];
        return copy;
      });
    } catch (err) {
      console.error(err);
      alert('Network error');
    }

    setCompletingId(null);
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

        {challengeList.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onAccept={handleAccept}
            accepting={acceptingId === challenge.id}
            accepted={Boolean(acceptedMap[challenge.id])}
            onComplete={handleComplete}
            completing={completingId === challenge.id}
          />
        ))}
      </main>

      <CompletionReward
        open={showReward}
        onClose={() => setShowReward(false)}
        coinsEarned={rewardCoins}
        treeGrown={true}
      />
    </div>
  );
}
