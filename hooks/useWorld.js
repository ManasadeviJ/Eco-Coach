// hooks/useWorld.js
import { useState, useEffect, useCallback } from "react";
import { apiPost } from "@/lib/apiClient";

export default function useWorld(userId, opts = { pollInterval: 0 }) {
  const [world, setWorld] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const fetchWorld = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await apiPost("/api/forest/get", { user_id: userId });
      setWorld(res.world || []);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWorld();
    let t;
    if (opts.pollInterval && opts.pollInterval > 0) {
      t = setInterval(fetchWorld, opts.pollInterval);
    }
    return () => clearInterval(t);
  }, [fetchWorld, opts.pollInterval]);

  const revive = useCallback(async (worldId) => {
    // optimistic update: mark as sapling locally
    const prev = world;
    setWorld(w => w.map(x => x.id === worldId ? { ...x, type: "sapling", level: 1 } : x));
    try {
      const res = await apiPost("/api/forest/revive", { user_id: userId, world_id: worldId });
      return res;
    } catch (e) {
      setWorld(prev);
      throw e;
    }
  }, [userId, world]);

  return { world, loading, err, fetchWorld, revive, setWorld };
}
