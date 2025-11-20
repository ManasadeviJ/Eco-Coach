// context/WorldContext.js
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext"; // ensure AuthContext exists (we added earlier)
import { useRouter } from "next/navigation";

const WorldContext = createContext(null);

export function WorldProvider({ children }) {
  const auth = useAuth();
  const user = auth?.user;
  const userId = user?.id;
  const [world, setWorld] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchWorld = useCallback(async () => {
    if (!userId) {
      setWorld([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("user_world_objects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (!error) {
      setWorld(data || []);
    } else {
      console.error("fetchWorld error", error);
      setWorld([]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchWorld();
    // Realtime subscription for world changes
    if (!userId) return;

    const channel = supabase
      .channel(`public:user_world_objects:user=${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_world_objects", filter: `user_id=eq.${userId}` },
        (payload) => {
          // For INSERT/UPDATE/DELETE maintain local state
          if (payload.eventType === "INSERT") {
            setWorld((w) => [payload.record, ...w]);
          } else if (payload.eventType === "UPDATE") {
            setWorld((w) => w.map(x => x.id === payload.record.id ? payload.record : x));
          } else if (payload.eventType === "DELETE") {
            setWorld((w) => w.filter(x => x.id !== payload.record.id));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, fetchWorld]);

  // Accept a challenge: call server api to create user_active_challenge + world sapling
  const acceptChallenge = useCallback(async ({ challenge_id, duration_hours = 12 } = {}) => {
    if (!userId) {
      router.push("/login");
      return;
    }
    const res = await fetch("/api/challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, challenge_id, duration_hours }),
    });
    return res.json();
  }, [userId, router]);

  // Mark challenge completed: calls /api/complete or RPC via server
  const markChallengeCompleted = useCallback(async (active_id) => {
    if (!userId) return;
    const res = await fetch("/api/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, active_id }),
    });
    return res.json();
  }, [userId]);

  // Revive a dry tree
  const reviveTree = useCallback(async (world_id) => {
    if (!userId) return { error: "not_authenticated" };
    const res = await fetch("/api/forest/revive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, world_id }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error || "revive_failed");
    }
    return json;
  }, [userId]);

  // buyPlant (shop) — simple implementation: insert world object and deduct coins (server handles atomicity)
  const buyPlant = useCallback(async (type = "sapling", cost = 3) => {
    if (!userId) {
      router.push("/login");
      return;
    }
    const res = await fetch("/api/shop/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, type, cost }),
    });
    return res.json();
  }, [userId, router]);

  const removePlant = useCallback(async (world_id) => {
    if (!userId) return;
    const res = await fetch("/api/forest/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, world_id }),
    });
    return res.json();
  }, [userId]);

  return (
    <WorldContext.Provider value={{
      world,
      loading,
      fetchWorld,
      acceptChallenge,
      markChallengeCompleted,
      reviveTree,
      buyPlant,
      removePlant,
    }}>
      {children}
    </WorldContext.Provider>
  );
}

export function useWorldContext() {
  const ctx = useContext(WorldContext);
  if (!ctx) throw new Error("useWorldContext must be used inside WorldProvider");
  return ctx;
}
