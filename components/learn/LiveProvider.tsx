"use client";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { SessionView } from "@/lib/live";
import { useNow, useSessions } from "@/lib/use-live";

type Ctx = { sessions: SessionView[]; loaded: boolean; error: boolean; now: Date; reload: () => void };
const LiveCtx = createContext<Ctx>({ sessions: [], loaded: false, error: false, now: new Date(0), reload: () => {} });

/** One shared, auto-refreshing list of sessions and a ticking clock for the whole student area. */
export function LiveProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const { sessions, error, reload } = useSessions(userId);
  const now = useNow(15000);
  const value = useMemo<Ctx>(() => ({ sessions: sessions ?? [], loaded: sessions !== null, error, now, reload }), [sessions, error, now, reload]);
  return <LiveCtx.Provider value={value}>{children}</LiveCtx.Provider>;
}
export const useLive = () => useContext(LiveCtx);
