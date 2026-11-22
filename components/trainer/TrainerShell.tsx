"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { BookOpen, CalendarDays, LogOut, Users } from "@/components/learn/icons";
import { Logo } from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { api } from "./api";

type Me = { trainer: boolean; ready: boolean; devDefaults: boolean };
const TABS = [
  { href: "/trainer", label: "Schedule", icon: CalendarDays },
  { href: "/trainer/bookings", label: "Private bookings", icon: Users },
  { href: "/trainer/lessons", label: "Lessons", icon: BookOpen },
];

export function TrainerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [me, setMe] = useState<Me | null>(null);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => { api<Me>("/api/trainer").then((r) => setMe(r.data)); }, []);

  async function login(e: FormEvent) {
    e.preventDefault(); setErr("");
    const r = await api("/api/trainer", "POST", { passcode: pass });
    if (r.ok) setMe((m) => (m ? { ...m, trainer: true } : m)); else setErr(r.data.error ?? "Could not sign in.");
  }
  async function logout() { await api("/api/trainer", "DELETE"); setMe((m) => (m ? { ...m, trainer: false } : m)); setPass(""); }

  if (!me) return <div className="app-theme grid min-h-screen place-items-center text-muted"><span className="animate-pulse">Loading…</span></div>;

  if (!me.trainer) {
    return (
      <div className="app-theme grid min-h-screen place-items-center p-6">
        <form onSubmit={login} className="w-full max-w-sm nx-card p-8 shadow-sm">
          <Logo />
          <h1 className="mt-6 font-display text-2xl font-semibold text-brand-900">Trainer sign-in</h1>
          <p className="mb-6 mt-1 text-sm text-muted">Manage the live-class schedule, Google Meet links, private bookings and lessons.</p>
          <label htmlFor="pc" className="mb-1.5 block text-sm font-semibold text-brand-900">Passcode</label>
          <input id="pc" type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoFocus className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-accent-600 focus:ring-2 focus:ring-accent-500/20" />
          {err && <p role="alert" className="mt-2 text-sm font-medium text-red-600">{err}</p>}
          {!me.ready && <p className="mt-3 rounded-lg bg-brand-50 p-3 text-xs text-muted">Trainer sign-in is not configured. Add TRAINER_PASSCODE and TRAINER_SECRET to .env.local.</p>}
          {me.devDefaults && me.ready && <p className="mt-3 rounded-lg bg-brand-50 p-3 text-xs text-muted">Local testing passcode: <b className="text-brand-900">trainer-demo</b>. Set your own TRAINER_PASSCODE in .env.local before going live.</p>}
          <button disabled={!pass} className="btn-base btn-primary btn-lg mt-5 w-full">Sign in</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-theme ws-main-wash min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,#fff_85%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-8">
          <span className="logo-mark grid size-7 shrink-0 place-items-center text-[11px] font-semibold">YE</span>
          <span className="ty-subject ty-ink hidden sm:inline">Your English</span>
          <span className="ty-label ty-600 rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-[var(--accent-text)]">Trainer</span>
          <button onClick={logout} className="btn-base btn-ghost btn-sm ml-auto"><LogOut className="h-4 w-4" />Sign out</button>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-4 sm:px-8" aria-label="Trainer">
          {TABS.map((t) => { const on = t.href === "/trainer" ? pathname === "/trainer" : pathname.startsWith(t.href); return <Link key={t.href} href={t.href} aria-current={on ? "page" : undefined} className={cn("relative flex shrink-0 items-center gap-1.5 pb-2.5 pt-1 text-[13px] font-medium", on ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]")}><t.icon className="h-4 w-4" />{t.label}{on && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[var(--accent)]" />}</Link>; })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8">{children}</main>
    </div>
  );
}
