"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import CompletionReward from "@/components/CompletionReward/CompletionReward";
import styles from "./home.module.css";
import { useAuth } from "@/context/AuthContext";

/**
 * Home page:
 * - loads active challenge from server (/api/active)
 * - computes timer % from accepted_at -> deadline_at
 * - calls /api/complete on "Done"
 * - on completion, refreshes active challenge (so UI shows completed)
 */

export default function HomePage() {
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user;
  const userId = user?.id;

  // Challenge state (server authoritative)
  const [acceptedChallenge, setAcceptedChallenge] = useState(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // Completion reward modal
  const [showReward, setShowReward] = useState(false);
  const [rewardCoins, setRewardCoins] = useState(0);

  // Timer UI
  const [timerPercentage, setTimerPercentage] = useState(0);
  const [treeStage, setTreeStage] = useState("sapling"); // sapling, half, full, dry
  const intervalRef = useRef(null);

  // load active challenge for the user
  const fetchActive = async () => {
    // If user not logged in, prefer a locally-persisted active challenge
    if (!userId) {
      try {
        const raw = localStorage.getItem("local_active_challenge");
        if (raw) {
          setAcceptedChallenge(JSON.parse(raw));
          return;
        }
      } catch (err) {
        console.error("local fetchActive parse error", err);
      }
      setAcceptedChallenge(null);
      return;
    }
    try {
      const res = await fetch("/api/active"); // expects { active: {...} } or { active: null }
      if (!res.ok) {
        console.warn("Failed to fetch active challenge", await res.text());
        setAcceptedChallenge(null);
        return;
      }
      const json = await res.json();
      // The API should return an object with accepted challenge row:
      // { active: { id, user_id, challenge_id, accepted_at, deadline_at, ... , title? } }
      setAcceptedChallenge(json.active ?? null);
      // Reset completed flag if we fetched a fresh active or none
      setChallengeCompleted(false);
    } catch (err) {
      console.error("fetchActive error", err);
      setAcceptedChallenge(null);
    }
  };

  // compute stage from percentage helper
  const getTreeStage = (pct, status) => {
    if (status === "dry") return "driedtree";
    if (pct <= 33) return "sapling";
    if (pct <= 66) return "half";
    return "growntree";
  };

  // timer loop: compute % from accepted_at -> deadline_at
  useEffect(() => {
    // clear any prior interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!acceptedChallenge) {
      // reset UI
      setTimerPercentage(0);
      setTreeStage("sapling");
      return;
    }

    // parse timestamps (assume server returns ISO strings)
    const start = acceptedChallenge.accepted_at ? new Date(acceptedChallenge.accepted_at).getTime() : Date.now();
    const deadline = acceptedChallenge.deadline_at ? new Date(acceptedChallenge.deadline_at).getTime() : (start + 12 * 60 * 60 * 1000);
    const total = Math.max(deadline - start, 1);

    const step = () => {
      const now = Date.now();
      const elapsed = now - start;
      const pct = Math.min(Math.max((elapsed / total) * 100, 0), 100);
      setTimerPercentage(pct);

      // determine tree stage
      const stage = getTreeStage(pct, acceptedChallenge.status);
      setTreeStage(stage);

      // if past deadline and challenge still active, refresh fetch to let worker mark failed / update status
      if (now >= deadline && acceptedChallenge.status === "active") {
        // fetch server state so UI updates (worker or API may mark failed)
        fetchActive();
      }
    };

    // initial update
    step();
    intervalRef.current = setInterval(step, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptedChallenge?.id]);

  // fetch once on mount and whenever userId changes
  useEffect(() => {
    fetchActive();
    // re-run periodically to stay in sync with server (optional)
    const poll = setInterval(() => {
      fetchActive();
    }, 30 * 1000); // every 30s

    return () => clearInterval(poll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Listen for local accept events so the Home circle updates when anonymous user accepts
  useEffect(() => {
    const onLocal = () => {
      try {
        const raw = localStorage.getItem("local_active_challenge");
        if (raw) {
          setAcceptedChallenge(JSON.parse(raw));
          setChallengeCompleted(false);
        } else {
          if (userId) fetchActive();
          else setAcceptedChallenge(null);
        }
      } catch (err) {
        console.error("onLocal parse error", err);
      }
    };

    window.addEventListener("localActiveUpdated", onLocal);
    return () => window.removeEventListener("localActiveUpdated", onLocal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Handle Done / Take New Challenge button
  const handleCompleteChallenge = async (e) => {
    e?.stopPropagation?.();

    // not logged in -> push to login
    if (!userId) {
      // For anonymous users we support a local-only flow:
      // - complete the locally-stored active challenge
      // - show reward modal and award a default number of coins
      if (!acceptedChallenge) {
        router.push("/challenges");
        return;
      }

      if (challengeCompleted) {
        await fetchActive();
        router.push("/challenges");
        return;
      }

      try {
        const coinsEarned = 5;
        setRewardCoins(coinsEarned);
        setShowReward(true);
        setChallengeCompleted(true);

        // notify sidebar
        window.dispatchEvent(
          new CustomEvent("coinsUpdated", { detail: { coins: coinsEarned } })
        );

        // clear local active
        localStorage.removeItem("local_active_challenge");
        setAcceptedChallenge(null);
      } catch (err) {
        console.error("local complete error", err);
        alert("Unable to complete challenge locally");
      }

      return;
    }

    // If no accepted challenge — go to challenges
    if (!acceptedChallenge) {
      router.push("/challenges");
      return;
    }

    // If already marked completed in UI, treat as "Take New Challenge"
    if (challengeCompleted) {
      // clear local accepted and redirect to /challenges to get new one
      // call server to cancel or ignore — user will pick new challenge manually
      await fetchActive(); // refresh
      router.push("/challenges");
      return;
    }

    // Mark complete: call server /api/complete
    try {
      const payload = { user_id: userId, active_id: acceptedChallenge.id };
      const res = await fetch("/api/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("complete failed", errText);
        // Try to parse JSON error
        let json = null;
        try { json = JSON.parse(errText); } catch {}
        const msg = (json && json.error) || "Failed to complete challenge";
        alert(msg);
        return;
      }

      // success: server will update coins via RPC and the world row
      const data = await res.json();
      
      // Extract coins from response (assume server returns coins_earned or similar)
      const coinsEarned = data.coins_earned || data.points || 5;
      setRewardCoins(coinsEarned);
      
      // Show reward modal
      setShowReward(true);
      
      // set UI to completed (this toggles button behaviour)
      setChallengeCompleted(true);

      // Dispatch custom event so Sidebar updates coin count
      window.dispatchEvent(
        new CustomEvent("coinsUpdated", { detail: { coins: coinsEarned } })
      );

      // refresh state (active challenge might be removed or updated)
      await fetchActive();

    } catch (err) {
      console.error("error completing challenge", err);
      alert("Network error when completing challenge.");
    }
  };

  // clicking the circle when no challenge -> navigate to /challenges
  const handleCircleClick = () => {
    if (!acceptedChallenge) {
      router.push("/challenges");
    }
  };

  // render friendly title text
  const circleText = acceptedChallenge
    ? (challengeCompleted ? "Challenge Completed!" : "Challenge Running…")
    : "Take today's challenge";

  const challengeTitle = acceptedChallenge ? (acceptedChallenge.title || acceptedChallenge.name || "Today's challenge") : "";

  return (
    <div className={styles.wrapper}>
      <Sidebar />

      {/* DARK OVERLAY - (if any mobile menu behaviour you keep) */}
      {/* ... existing mobile menu logic kept in original file if desired */}

      <main className={styles.main}>
        <h1 className={styles.title}>
          Hi{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : user?.email ? `, ${user.email.split("@")[0]}` : ", User"}
        </h1>

        <br />

        <div className={styles.circleWrapper}>
          <div
            className={styles.circle}
            style={{
              backgroundImage: `url(/icons/${treeStage}.png)`,
              border: acceptedChallenge ? `8px solid #78C841` : "3px solid #E3FCBF",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            onClick={handleCircleClick}
          >
            <div
              className={styles.timerRing}
              style={{ "--pct": `${Math.round(timerPercentage)}%` }}
            ></div>

            <div className={styles.circleContent}>
              <p className={styles.circleText}>{circleText}</p>

              {acceptedChallenge && (
                <>
                  <p className={styles.challengeTitle}>{challengeTitle}</p>
                  <button
                    className={styles.completedBtn}
                    onClick={handleCompleteChallenge}
                  >
                    {challengeCompleted ? "Take New Challenge" : "Done"}
                  </button>
                </>
              )}

              {!acceptedChallenge && (
                <p className={styles.circleText}>Tap to view today's challenge</p>
              )}
            </div>
          </div>
        </div>

        <button className={styles.askAIMain} onClick={() => router.push("/chat")}>
          Ask AI
        </button>
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
