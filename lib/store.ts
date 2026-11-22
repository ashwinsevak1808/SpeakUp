/**
 * DEMO-MODE STORAGE (browser localStorage).
 * ------------------------------------------------------------------
 * Accounts and progress live in the visitor's own browser. This is fine for trying
 * the product, NOT for real students: nothing is shared across devices and a student can
 * edit their own data. The functions in lib/auth.ts are the only code that touches this
 * file, so moving to Supabase later means replacing this module, not the pages.
 * See web/SETUP-SUPABASE.md.
 */
export const SERVER = "\u0000server";
const USERS = "ye:users";
const SESSION = "ye:session";
export const progKey = (id: string) => `ye:progress:${id}`;
export const profKey = (id: string) => `ye:profile:${id}`;
export const KEYS = { USERS, SESSION };

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (!e.key || e.key.startsWith("ye:")) cb(); };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
}
export const read = (k: string) => { try { return localStorage.getItem(k) ?? ""; } catch { return ""; } };
export function write(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* private mode: ignore */ } emit(); }
export function remove(k: string) { try { localStorage.removeItem(k); } catch { /* ignore */ } emit(); }
