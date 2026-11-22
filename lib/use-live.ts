"use client";
import { useCallback, useEffect, useState } from "react";
import type { SessionView } from "./live";

/** A clock that ticks, so "Live now" and countdowns stay correct without reloading. */
export function useNow(ms = 15000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}

/** Sessions from the backend, refreshed every 30 seconds so a trainer's "Go live" shows up quickly.
 *  The server knows who is asking (login cookie); userId only restarts the feed when the account changes. */
export function useSessions(userId: string | null) {
  const [sessions, setSessions] = useState<SessionView[] | null>(null);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    const load = () => fetch("/api/sessions", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { sessions: SessionView[] }) => { if (alive) { setSessions(d.sessions); setError(false); } })
      .catch(() => { if (alive) setError(true); });
    load();
    const t = setInterval(load, 30000);
    return () => { alive = false; clearInterval(t); };
  }, [userId, tick]);
  const reload = useCallback(() => setTick((n) => n + 1), []);
  return { sessions, error, reload };
}
