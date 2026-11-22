"use client";
import { useMemo, useSyncExternalStore } from "react";
import { KEYS, SERVER, profKey, progKey, read, remove, subscribe, write } from "./store";
import type { Goal, Level } from "./path-data";

export type Account = {
  id: string; name: string; email: string; salt: string; hash: string; createdAt: string;
  enrolled: boolean; enrolledAt?: string; plan?: string; mumbai?: boolean;
};
/** done = completed lesson/checkpoint ids; steps = last step reached per lesson (to resume);
 *  stars = checkpoint rating 1-3; read = library chapters marked as read. */
export type Progress = { done: string[]; steps: Record<string, number>; stars: Record<string, number>; read: string[]; days: string[]; xp: number; missed: string[] };
/** Personal settings: how the path is shaped for this student, and which voice reads English aloud. */
export type Profile = { onboarded: boolean; level: Level; goal: Goal; voiceURI: string; rate: number };
export const DEFAULT_PROFILE: Profile = { onboarded: false, level: "beginner", goal: "everyday", voiceURI: "", rate: 0.9 };
const emptyProgress = (): Progress => ({ done: [], steps: {}, stars: {}, read: [], days: [], xp: 0, missed: [] });

const today = () => new Date().toISOString().slice(0, 10);
const norm = (e: string) => e.trim().toLowerCase();
const parse = <T,>(raw: string, fallback: T): T => { try { return raw && raw !== SERVER ? (JSON.parse(raw) as T) : fallback; } catch { return fallback; } };
const users = () => parse<Record<string, Account>>(read(KEYS.USERS), {});

async function sha(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));

/* ---------- hooks ---------- */
export function useAuth() {
  const session = useSyncExternalStore(subscribe, () => read(KEYS.SESSION), () => SERVER);
  const usersRaw = useSyncExternalStore(subscribe, () => read(KEYS.USERS), () => SERVER);
  const progRaw = useSyncExternalStore(subscribe, () => (session && session !== SERVER ? read(progKey(session)) : ""), () => SERVER);
  const profRaw = useSyncExternalStore(subscribe, () => (session && session !== SERVER ? read(profKey(session)) : ""), () => SERVER);
  const user = useMemo(() => (session && session !== SERVER ? parse<Record<string, Account>>(usersRaw, {})[session] ?? null : null), [session, usersRaw]);
  const progress = useMemo(() => ({ ...emptyProgress(), ...parse<Partial<Progress>>(progRaw, {}) }), [progRaw]);
  const profile = useMemo<Profile>(() => ({ ...DEFAULT_PROFILE, ...parse<Partial<Profile>>(profRaw, {}) }), [profRaw]);
  const status: "loading" | "anon" | "auth" = session === SERVER ? "loading" : user ? "auth" : "anon";
  return { status, user, progress, profile };
}

/* ---------- actions ---------- */
export async function signup(name: string, email: string, password: string): Promise<string | null> {
  const e = norm(email);
  if (Object.values(users()).some((u) => u.email === e)) return "An account with this email already exists. Please log in.";
  const salt = uid(); const id = uid();
  const acc: Account = { id, name: name.trim(), email: e, salt, hash: await sha(salt + password), createdAt: new Date().toISOString(), enrolled: false };
  write(KEYS.USERS, JSON.stringify({ ...users(), [id]: acc }));
  write(KEYS.SESSION, id);
  return null;
}
export async function login(email: string, password: string): Promise<string | null> {
  const e = norm(email);
  const acc = Object.values(users()).find((u) => u.email === e);
  if (!acc || (await sha(acc.salt + password)) !== acc.hash) return "Email or password is incorrect.";
  write(KEYS.SESSION, acc.id);
  return null;
}
export function logout() { remove(KEYS.SESSION); }

export function enrol(id: string, plan: string, mumbai: boolean) {
  const all = users(); if (!all[id]) return;
  all[id] = { ...all[id], enrolled: true, enrolledAt: new Date().toISOString(), plan, mumbai };
  write(KEYS.USERS, JSON.stringify(all));
}

function progressOf(id: string): Progress { return { ...emptyProgress(), ...parse<Partial<Progress>>(read(progKey(id)), {}) }; }
const touchDay = (p: Progress) => { const d = today(); if (!p.days.includes(d)) p.days = [...p.days, d]; };

export function setStep(id: string, lessonId: string, step: number) {
  const p = progressOf(id);
  if ((p.steps[lessonId] ?? -1) >= step) return;
  p.steps = { ...p.steps, [lessonId]: step };
  write(progKey(id), JSON.stringify(p));
}
export function completeLesson(id: string, lessonId: string, xp = 50) {
  const p = progressOf(id);
  if (!p.done.includes(lessonId)) { p.done = [...p.done, lessonId]; p.xp += xp; }
  touchDay(p);
  write(progKey(id), JSON.stringify(p));
}
export function completeCheckpoint(id: string, checkpointId: string, stars: number) {
  const p = progressOf(id);
  if (!p.done.includes(checkpointId)) { p.done = [...p.done, checkpointId]; p.xp += 40 + stars * 10; }
  p.stars = { ...p.stars, [checkpointId]: Math.max(p.stars[checkpointId] ?? 0, stars) };
  touchDay(p);
  write(progKey(id), JSON.stringify(p));
}
export function saveProfile(id: string, patch: Partial<Profile>) {
  const cur = { ...DEFAULT_PROFILE, ...parse<Partial<Profile>>(read(profKey(id)), {}) };
  write(profKey(id), JSON.stringify({ ...cur, ...patch }));
}
/** Remember which exercises were missed first time (personal review list), and forget the ones now known. */
export function updateMissed(id: string, missed: string[], mastered: string[]) {
  const p = progressOf(id);
  p.missed = Array.from(new Set([...p.missed.filter((m) => !mastered.includes(m)), ...missed]));
  write(progKey(id), JSON.stringify(p));
}
export function toggleRead(id: string, chapterId: string) {
  const p = progressOf(id);
  p.read = p.read.includes(chapterId) ? p.read.filter((c) => c !== chapterId) : [...p.read, chapterId];
  write(progKey(id), JSON.stringify(p));
}

/* ---------- derived ---------- */
export function streakOf(days: string[]) {
  const set = new Set(days); let n = 0; const d = new Date();
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1); // allow "not yet today"
  while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
