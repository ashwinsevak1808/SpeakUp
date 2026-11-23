"use client";
/**
 * Accounts and progress, stored in Supabase.
 * Every page talks only to this file: useAuth() for reading, and the small actions below for saving.
 * Progress is kept in memory for instant screens and written to the database a moment later
 * (and right away when the tab is hidden or the student logs out).
 */
import { useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase/client";
import type { Goal, Level } from "./path-data";

export type Role = "student" | "trainer" | "owner";
export type EnrolRequest = { id: number; plan: string; mumbai: boolean; createdAt: string };
export type Account = {
  id: string; name: string; email: string; phone?: string; createdAt: string; role: Role;
  /** enrolled = the full plan is active now; purchased = bought it at least once (certificate). */
  enrolled: boolean; purchased: boolean; planUntil?: string; enrolledAt?: string; plan?: string; mumbai?: boolean;
  unlockedWeeks: number[];
  pendingEnrol: EnrolRequest | null;
};
/** done = completed lesson/checkpoint ids; steps = last step reached per lesson (to resume);
 *  stars = checkpoint rating 1-3; read = library chapters marked as read. */
export type Progress = { done: string[]; steps: Record<string, number>; stars: Record<string, number>; read: string[]; days: string[]; xp: number; missed: string[] };
/** Personal settings: how the path is shaped for this student, and which voice reads English aloud. */
export type Profile = { onboarded: boolean; level: Level; goal: Goal; voiceURI: string; rate: number; avatar: string; photo: string };
export const DEFAULT_PROFILE: Profile = { onboarded: false, level: "beginner", goal: "everyday", voiceURI: "", rate: 0.9, avatar: "", photo: "" };
export const emptyProgress = (): Progress => ({ done: [], steps: {}, stars: {}, read: [], days: [], xp: 0, missed: [] });
export const isStaff = (r?: Role) => r === "trainer" || r === "owner";

type State = { status: "loading" | "anon" | "auth"; user: Account | null; progress: Progress; profile: Profile };
const LOADING: State = { status: "loading", user: null, progress: emptyProgress(), profile: DEFAULT_PROFILE };
let state: State = LOADING;
const listeners = new Set<() => void>();
const set = (patch: Partial<State>) => { state = { ...state, ...patch }; listeners.forEach((l) => l()); };

const today = () => new Date().toISOString().slice(0, 10);
const norm = (e: string) => e.trim().toLowerCase();
const origin = () => (typeof window === "undefined" ? "" : window.location.origin);

/* ---------- loading the signed-in person ---------- */
type ProfileRow = { id: string; email: string; name: string; phone: string | null; role: Role; enrolled: boolean; plan: string | null; mumbai: boolean; enrolled_at: string | null; plan_until: string | null; created_at: string; last_seen_at: string | null };
const planActive = (r: ProfileRow) => r.enrolled && (!r.plan_until || +new Date(r.plan_until) > Date.now());
const planFields = (r: ProfileRow, weeks: number[]) => ({
  enrolled: planActive(r), purchased: r.enrolled, planUntil: r.plan_until ?? undefined, enrolledAt: r.enrolled_at ?? undefined,
  plan: r.plan ?? undefined, mumbai: r.mumbai, unlockedWeeks: weeks,
});

// One load per account at a time (sign-in fires several events at once).
let loading: { id: string; p: Promise<void> } | null = null;
function load(u: User | null): Promise<void> {
  if (!u) { set({ ...LOADING, status: "anon" }); return Promise.resolve(); }
  if (loading?.id === u.id) return loading.p;
  const p = loadNow(u).finally(() => { if (loading?.p === p) loading = null; });
  loading = { id: u.id, p };
  return p;
}
async function loadNow(u: User) {
  const sb = supabase();
  const [p, d, r, w] = await Promise.all([
    sb.from("profiles").select("*").eq("id", u.id).maybeSingle<ProfileRow>(),
    sb.from("student_data").select("progress, settings").eq("user_id", u.id).maybeSingle<{ progress: Partial<Progress>; settings: Partial<Profile> }>(),
    sb.from("enrol_requests").select("id, plan, mumbai, created_at").eq("user_id", u.id).eq("status", "pending").maybeSingle<{ id: number; plan: string; mumbai: boolean; created_at: string }>(),
    sb.from("week_unlocks").select("week").eq("user_id", u.id),
  ]);
  if (!p.data) { set({ ...LOADING, status: "anon" }); return; }
  const row = p.data;
  // Changes made on this device but not saved yet win over what the database had.
  const keepLocal = dirty && state.user?.id === u.id;
  set({
    status: "auth",
    user: {
      id: row.id, name: row.name, email: row.email, phone: row.phone ?? undefined, createdAt: row.created_at, role: row.role,
      ...planFields(row, (w.data ?? []).map((x: { week: number }) => x.week)),
      pendingEnrol: r.data ? { id: r.data.id, plan: r.data.plan, mumbai: r.data.mumbai, createdAt: r.data.created_at } : null,
    },
    progress: keepLocal ? state.progress : { ...emptyProgress(), ...(d.data?.progress ?? {}) },
    profile: keepLocal ? state.profile : { ...DEFAULT_PROFILE, ...(d.data?.settings ?? {}) },
  });
  // "Last seen" for the admin panel, at most once an hour.
  // (Supabase queries only run when awaited or .then()-ed, hence the empty .then.)
  if (!row.last_seen_at || Date.now() - +new Date(row.last_seen_at) > 3600000) sb.from("profiles").update({ last_seen_at: new Date().toISOString() }).eq("id", row.id).then(() => {});
}

let started = false;
function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  const sb = supabase();
  sb.auth.getUser().then(({ data }) => load(data.user));
  sb.auth.onAuthStateChange((event, session) => {
    token = session?.access_token ?? "";
    // Never await Supabase inside this callback (it can deadlock); hand off to the next tick.
    setTimeout(() => {
      if (event === "SIGNED_OUT" || !session) { if (state.status !== "anon") set({ ...LOADING, status: "anon" }); }
      else if (session.user.id !== state.user?.id) void load(session.user);
    }, 0);
  });
  // Hidden tab: save now. Back on the tab: pick up changes staff made (for example an approved enrolment).
  let lastCheck = Date.now();
  const flushNow = () => {
    if (document.visibilityState === "hidden") flushOnExit();
    else if (state.user && Date.now() - lastCheck > 60000) { lastCheck = Date.now(); void refreshAccount(); }
  };
  document.addEventListener("visibilitychange", flushNow);
  window.addEventListener("pagehide", flushOnExit);
}

function subscribe(cb: () => void) { listeners.add(cb); start(); return () => { listeners.delete(cb); }; }

/** Re-read only the account row (role, enrolment), keeping progress in memory untouched. */
async function refreshAccount() {
  const u = state.user; if (!u) return;
  const sb = supabase();
  const [p, r, w] = await Promise.all([
    sb.from("profiles").select("*").eq("id", u.id).maybeSingle<ProfileRow>(),
    sb.from("enrol_requests").select("id, plan, mumbai, created_at").eq("user_id", u.id).eq("status", "pending").maybeSingle<{ id: number; plan: string; mumbai: boolean; created_at: string }>(),
    sb.from("week_unlocks").select("week").eq("user_id", u.id),
  ]);
  if (!p.data || state.user?.id !== u.id) return;
  const row = p.data;
  set({ user: { ...u, name: row.name, phone: row.phone ?? undefined, role: row.role, ...planFields(row, (w.data ?? []).map((x: { week: number }) => x.week)),
    pendingEnrol: r.data ? { id: r.data.id, plan: r.data.plan, mumbai: r.data.mumbai, createdAt: r.data.created_at } : null } });
}

/* ---------- hooks ---------- */
export function useAuth() {
  return useSyncExternalStore(subscribe, () => state, () => LOADING);
}
/** Load the account again (after staff change something, or after enrolling). */
export async function refreshMe() { const { data } = await supabase().auth.getUser(); await load(data.user); }

/* ---------- saving progress (debounced) ---------- */
let timer: ReturnType<typeof setTimeout> | null = null;
let dirty = false;
// Saves run one after another and each sends the latest state, so an older save can never overwrite a newer one.
let chain: Promise<void> = Promise.resolve();
function flush(): Promise<void> {
  if (timer) { clearTimeout(timer); timer = null; }
  chain = chain.then(async () => {
    if (!dirty || !state.user) return;
    dirty = false;
    const { error } = await supabase().from("student_data").upsert({ user_id: state.user.id, progress: state.progress, settings: state.profile });
    if (error) { dirty = true; console.warn("Could not save progress yet; will retry.", error.message); timer = setTimeout(flush, 5000); }
  });
  return chain;
}
/** The page is closing or reloading: send the last changes with keepalive so the browser finishes the request. */
let token = "";
function flushOnExit() {
  if (!dirty || !state.user || !token) return;
  if (timer) { clearTimeout(timer); timer = null; }
  dirty = false;
  try {
    void fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/student_data?on_conflict=user_id`, {
      method: "POST", keepalive: true,
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, Authorization: `Bearer ${token}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ user_id: state.user.id, progress: state.progress, settings: state.profile }),
    });
  } catch { dirty = true; }
}
/** Keep the change in memory at once; write it to the database right away (important changes) or a moment later. */
function save(patch: Partial<Pick<State, "progress" | "profile">>, now = true) {
  if (!state.user) return;
  set(patch);
  dirty = true;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => void flush(), now ? 0 : 600);
}
const mine = (id: string) => !!state.user && state.user.id === id;

/* ---------- account actions ---------- */
const friendly = (m: string) =>
  /invalid login/i.test(m) ? "Email or password is incorrect."
  : /not confirmed/i.test(m) ? "Please confirm your email first. Open the link we sent to your inbox."
  : /already registered|already exists/i.test(m) ? "An account with this email already exists. Please log in."
  : /rate limit|too many/i.test(m) ? "Too many attempts. Please wait a few minutes and try again."
  : /password/i.test(m) && /(short|least|weak)/i.test(m) ? "Please use a stronger password (at least 8 characters)."
  : /sending .*(email|magic link)|smtp|email.*(not authorized|address not authorized)/i.test(m) ? "We could not send the email right now. Please try again in a few minutes, or message us on WhatsApp."
  : /token.*(expired|invalid)|otp.*(expired|invalid)|invalid.*(otp|token)/i.test(m) ? "That code is wrong or has expired. Check it, or send a new code."
  : /signups not allowed|signup.*disabled/i.test(m) ? "No account with this email yet. Please create an account first."
  : /fetch|network|timed out|taking too long/i.test(m) ? "The connection is slow. Check your internet and try again."
  : m;

/** Never leave a button spinning forever: give up after a while with a clear message. */
const SLOW = "This is taking too long. Check your internet and try again.";
function withTimeout<T>(p: Promise<T>, ms = 25000): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error(SLOW)), ms))]);
}
const msgOf = (e: unknown) => friendly(e instanceof Error ? e.message : String(e));

/** Create an account. confirm = true means "check your inbox": the email link finishes sign-up. */
export async function signup(name: string, email: string, password: string): Promise<{ error?: string; confirm?: boolean }> {
  let res: Awaited<ReturnType<ReturnType<typeof supabase>["auth"]["signUp"]>>;
  try {
    res = await withTimeout(supabase().auth.signUp({
      email: norm(email), password,
      options: { data: { name: name.trim() }, emailRedirectTo: `${origin()}/auth/callback?next=/learn` },
    }));
  } catch (e) { return { error: msgOf(e) }; }
  const { data, error } = res;
  if (error) return { error: friendly(error.message) };
  if (data.user && data.user.identities?.length === 0) return { error: "An account with this email already exists. Please log in." };
  if (!data.session) return { confirm: true };
  await load(data.user);
  return {};
}
export async function login(email: string, password: string): Promise<string | null> {
  try {
    const { data, error } = await withTimeout(supabase().auth.signInWithPassword({ email: norm(email), password }));
    if (error) return friendly(error.message);
    await withTimeout(load(data.user));
    return null;
  } catch (e) { return msgOf(e); }
}

/** Email code login, step 1: send a one-time code (and a sign-in link) to the email.
 *  New emails get an account automatically when `create` is true. */
export async function sendLoginCode(email: string, create = true, name?: string): Promise<string | null> {
  try {
    const { error } = await withTimeout(supabase().auth.signInWithOtp({
      email: norm(email),
      options: { shouldCreateUser: create, data: name?.trim() ? { name: name.trim() } : undefined, emailRedirectTo: `${origin()}/auth/callback?next=/learn` },
    }));
    return error ? friendly(error.message) : null;
  } catch (e) { return msgOf(e); }
}
/** Email code login, step 2: check the code and sign in. */
export async function verifyLoginCode(email: string, code: string): Promise<string | null> {
  try {
    const { data, error } = await withTimeout(supabase().auth.verifyOtp({ email: norm(email), token: code.replace(/\D/g, ""), type: "email" }));
    if (error) return friendly(error.message);
    await withTimeout(load(data.user));
    return null;
  } catch (e) { return msgOf(e); }
}
export async function logout() {
  await flush();
  await supabase().auth.signOut();
  set({ ...LOADING, status: "anon" });
}
export async function requestPasswordReset(email: string): Promise<string | null> {
  const { error } = await supabase().auth.resetPasswordForEmail(norm(email), { redirectTo: `${origin()}/auth/callback?next=/reset-password` });
  return error ? friendly(error.message) : null;
}
export async function updatePassword(password: string): Promise<string | null> {
  const { error } = await supabase().auth.updateUser({ password });
  return error ? friendly(error.message) : null;
}
export async function updateAccount(id: string, patch: { name?: string; phone?: string }): Promise<string | null> {
  if (!mine(id)) return "Not signed in.";
  const clean = { ...(patch.name !== undefined && { name: patch.name.trim() }), ...(patch.phone !== undefined && { phone: patch.phone.trim() || null }) };
  const { error } = await supabase().from("profiles").update(clean).eq("id", id);
  if (error) return error.message;
  set({ user: { ...state.user!, ...(clean.name !== undefined && { name: clean.name }), ...(clean.phone !== undefined && { phone: clean.phone ?? undefined }) } });
  return null;
}

/** Ask to enrol. A trainer confirms the payment and switches the account on from the admin panel. */
export async function enrol(id: string, plan: string, mumbai: boolean, _amount?: number, note?: string): Promise<string | null> {
  if (!mine(id)) return "Please log in again.";
  // Through the server, so the team gets an email alert (the price is set on the server, not here).
  const r = await fetch("/api/enrol", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mumbai, note }) });
  const d = (await r.json().catch(() => ({}))) as { error?: string; request?: { id: number; plan: string; created_at: string } };
  if (!r.ok || !d.request) return d.error ?? "Could not send your request. Please try again.";
  set({ user: { ...state.user!, pendingEnrol: { id: d.request.id, plan: d.request.plan || plan, mumbai, createdAt: d.request.created_at } } });
  return null;
}
export async function cancelEnrolRequest(id: string): Promise<string | null> {
  const req = state.user?.pendingEnrol;
  if (!mine(id) || !req) return null;
  const { error } = await supabase().from("enrol_requests").update({ status: "cancelled" }).eq("id", req.id);
  if (error) return error.message;
  set({ user: { ...state.user!, pendingEnrol: null } });
  return null;
}

/* ---------- progress actions (same names the pages always used) ---------- */
const withDay = (p: Progress) => (p.days.includes(today()) ? p.days : [...p.days, today()]);

export function setStep(id: string, lessonId: string, step: number) {
  if (!mine(id)) return;
  const p = state.progress;
  if ((p.steps[lessonId] ?? -1) >= step) return;
  save({ progress: { ...p, steps: { ...p.steps, [lessonId]: step } } }, false);
}
export function completeLesson(id: string, lessonId: string, xp = 50) {
  if (!mine(id)) return;
  const p = state.progress; const first = !p.done.includes(lessonId);
  save({ progress: { ...p, done: first ? [...p.done, lessonId] : p.done, xp: p.xp + (first ? xp : 0), days: withDay(p) } });
}
export function completeCheckpoint(id: string, checkpointId: string, stars: number) {
  if (!mine(id)) return;
  const p = state.progress; const first = !p.done.includes(checkpointId);
  save({ progress: { ...p, done: first ? [...p.done, checkpointId] : p.done, xp: p.xp + (first ? 40 + stars * 10 : 0), stars: { ...p.stars, [checkpointId]: Math.max(p.stars[checkpointId] ?? 0, stars) }, days: withDay(p) } });
}
export function saveProfile(id: string, patch: Partial<Profile>) {
  if (!mine(id)) return;
  save({ profile: { ...state.profile, ...patch } });
}
/** Remember which exercises were missed first time (personal review list), and forget the ones now known. */
export function updateMissed(id: string, missed: string[], mastered: string[]) {
  if (!mine(id)) return;
  const p = state.progress;
  save({ progress: { ...p, missed: Array.from(new Set([...p.missed.filter((m) => !mastered.includes(m)), ...missed])) } });
}
export function toggleRead(id: string, chapterId: string) {
  if (!mine(id)) return;
  const p = state.progress;
  save({ progress: { ...p, read: p.read.includes(chapterId) ? p.read.filter((c) => c !== chapterId) : [...p.read, chapterId] } }, false);
}

/* ---------- derived ---------- */
export function streakOf(days: string[]) {
  const set = new Set(days); let n = 0; const d = new Date();
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1); // allow "not yet today"
  while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
