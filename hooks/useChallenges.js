// hooks/useChallenges.js
import { useState, useEffect, useCallback } from "react";
import { apiPost } from "@/lib/apiClient";

export default function useChallenges(userId) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await apiPost("/api/challenge/list", { user_id: userId });
      setList(res.challenges || []);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchChallenges();
  }, [userId, fetchChallenges]);

  // Accept a challenge (optimistic)
  const accept = useCallback(async ({ challenge_id, duration_hours }) => {
    // optimistic UI: add placeholder active challenge
    const placeholder = { id: `tmp-${Date.now()}`, challenge_id, status: "active", optimistic: true };
    setList(prev => [placeholder, ...prev]);

    try {
      const res = await apiPost("/api/challenge", { user_id: userId, challenge_id, duration_hours });
      // replace placeholder
      setList(prev => [res.active, ...prev.filter(p => p.id !== placeholder.id)]);
      return res;
    } catch (e) {
      // rollback
      setList(prev => prev.filter(p => p.id !== placeholder.id));
      throw e;
    }
  }, [userId]);

  return { list, loading, err, fetchChallenges, accept };
}
