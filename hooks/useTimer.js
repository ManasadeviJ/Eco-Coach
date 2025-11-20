// hooks/useTimer.js
import { useState, useEffect } from "react";

export function useTimer(deadlineIso) {
  const deadline = deadlineIso ? new Date(deadlineIso).getTime() : null;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!deadline) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [deadline]);

  const remaining = deadline ? Math.max(0, deadline - now) : 0;

  function format(ms) {
    const s = Math.floor(ms / 1000);
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    if (hh > 0) return `${hh}h ${mm}m`;
    if (mm > 0) return `${mm}m ${ss}s`;
    return `${ss}s`;
  }

  return { remaining, human: format(remaining), isExpired: remaining <= 0 };
}
