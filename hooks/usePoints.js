// hooks/usePoints.js
"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * usePoints(userId)
 * - returns { points, loading, refresh }
 * - subscribes to realtime updates on user_points for this user
 */
export default function usePoints(userId) {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPoints = useCallback(async () => {
    if (!userId) {
      setPoints(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("user_points")
      .select("points")
      .eq("user_id", userId)
      .single();

    if (!error && data) {
      setPoints(data.points ?? 0);
    } else {
      // if row missing, set 0
      setPoints(0);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`public:user_points:user=${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_points", filter: `user_id=eq.${userId}` },
        (payload) => {
          // payload.record has new row for INSERT/UPDATE
          if (payload?.eventType === "UPDATE" || payload?.eventType === "INSERT") {
            setPoints((payload.record?.points) ?? 0);
            // Broadcast browser event in case other components use local listeners
            try {
              window.dispatchEvent(new CustomEvent("coinsUpdated"));
            } catch (e) {}
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  return { points, loading, refresh: fetchPoints };
}
