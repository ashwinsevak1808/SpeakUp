"use client";
/**
 * The student workspace frame, modelled on Neemo's company WorkspaceFrame:
 * a white 248px sidebar (workspace block, grouped nav with caps labels, accent bar on the
 * active item, plan card, help/settings/account footer), a 56px top bar (sidebar toggle,
 * breadcrumb, ⌘K search, live pill, streak, notifications), and the canvas with a soft wash.
 */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award, Bell, BookOpen, CalendarDays, ChevronRight, Flame, Flag, Help, LayoutDashboard, Lightbulb, Play, Lock, LogOut, Map, Menu,
  PenLine, RotateCcw, Search, Settings, SidebarToggle, Unfold, UserRound, Video, X, type IconType,
} from "@/components/learn/icons";
import { logout, streakOf, useAuth } from "@/lib/auth";
import { CourseProvider, useCourse } from "@/lib/course";
import { currentNode, statusOf, MILESTONES } from "@/lib/path-state";
import { countdown, fmtTime, isPast, startsInMin } from "@/lib/live";
import { PLAN } from "@/lib/learn-data";
import { Avatar } from "@/components/learn/Avatar";
import { cn } from "@/lib/utils";
import { LiveProvider, useLive } from "./LiveProvider";
import { LiveBadge, liveNow } from "./live";
import { EnrolDialog } from "./EnrolDialog";
import { nodeHref } from "./LessonPlayer";
import { Badge, btn } from "./ui";
import { CommandPalette, type PaletteItem } from "@/components/ui/CommandPalette";
import { opener } from "@/lib/access";
import { FREE_UNTIL_LABEL, freePeriod } from "@/lib/access";
import { Spinner } from "@/components/ui/Spinner";
import { BrandMark, Wordmark } from "@/components/brand/BrandMark";

type NavItem = { href: string; label: string; icon: IconType; badge?: "live" | "review" };
const GROUPS: { label: string; items: NavItem[] }[] = [
  { label: "Learn", items: [
    { href: "/learn", label: "Dashboard", icon: LayoutDashboard },
    { href: "/learn/path", label: "My path", icon: Map },
    { href: "/learn/grammar", label: "Grammar guide", icon: PenLine },
    { href: "/learn/review", label: "Review", icon: RotateCcw, badge: "review" },
  ] },
  { label: "Classes", items: [
    { href: "/learn/live", label: "Live classes", icon: CalendarDays, badge: "live" },
    { href: "/learn/private", label: "Private sessions", icon: UserRound },
  ] },
  { label: "Resources", items: [
    { href: "/learn/library", label: "Library", icon: BookOpen },
    { href: "/learn/tips", label: "Speaking tips", icon: Lightbulb },
    { href: "/learn/certificate", label: "Certificate", icon: Award },
  ] },
];
const ALL = [...GROUPS.flatMap((g) => g.items), { href: "/learn/settings", label: "Settings", icon: Settings }];
const isActive = (href: string, p: string) => href === "/learn" ? p === "/learn" : href === "/learn/path" ? ["/learn/path", "/learn/lesson", "/learn/checkpoint"].some((x) => p.startsWith(x)) : p.startsWith(href);

export function LearnShell({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const leaving = useRef(false);
  useEffect(() => { if (status === "anon" && !leaving.current) router.replace(`/login?next=${encodeURIComponent(pathname)}`); }, [status, pathname, router]);

  if (status !== "auth" || !user) {
    return <div className="app-theme grid min-h-screen place-items-center"><span role="status" className="ty-body ty-muted flex items-center gap-3"><Spinner className="h-5 w-5 text-[var(--accent)]" />Loading your workspace…</span></div>;
  }
  return (
    <CourseProvider>
      <LiveProvider key={`${user.id}:${user.enrolled}`} userId={user.id}>
        <Frame onLeave={() => { leaving.current = true; logout(); router.push("/"); }}>{children}</Frame>
      </LiveProvider>
    </CourseProvider>
  );
}

/* ---------- small popover helper: closes on outside click and Escape ---------- */
function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const click = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", click); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", click); document.removeEventListener("keydown", key); };
  }, [open]);
  return { open, setOpen, ref };
}

function Frame({ children, onLeave }: { children: React.ReactNode; onLeave: () => void }) {
  const { user, progress } = useAuth();
  const { sessions, now } = useLive();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [rail, setRail] = useState(false);
  const [enrol, setEnrol] = useState(false);
  const [palette, setPalette] = useState(false);
  const [prev, setPrev] = useState(pathname);
  if (prev !== pathname) { setPrev(pathname); setDrawer(false); setPalette(false); }
  useEffect(() => { document.body.style.overflow = drawer ? "hidden" : ""; }, [drawer]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((p) => !p); } };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, []);
  if (!user) return null;

  const live = liveNow(sessions, now);
  const streak = streakOf(progress.days);
  const page = ALL.find((n) => isActive(n.href, pathname));
  const sub = pathname.startsWith("/learn/lesson") ? "Lesson" : pathname.startsWith("/learn/checkpoint") ? "Checkpoint" : null;

  const sidebar = (collapsed: boolean) => (
    <div className="flex h-full flex-col">
      {/* workspace block */}
      <div className={cn("flex h-14 shrink-0 items-center gap-2.5 border-b border-[var(--border)]", collapsed ? "justify-center px-2" : "px-4")}>
        <Link href="/learn" className="shrink-0" aria-label="SpeakUp dashboard"><BrandMark className="size-8" /></Link>
        {!collapsed && <div className="min-w-0"><div className="truncate"><Wordmark className="text-[17px]" /></div><div className="ty-label ty-subtle -mt-0.5 truncate">{user.enrolled ? PLAN.name : "Free"}</div></div>}
      </div>

      <nav aria-label="Student area" className="flex-1 overflow-y-auto px-3 py-4">
        {GROUPS.map((g) => (
          <div key={g.label} className="mb-5 last:mb-0">
            {!collapsed ? <div className="ty-label ty-caps ty-subtle mb-1.5 px-2.5">{g.label}</div> : <div className="mx-auto mb-2 h-px w-6 bg-[var(--border)]" />}
            <ul className="space-y-0.5">
              {g.items.map((n) => {
                const on = isActive(n.href, pathname);
                const count = n.badge === "review" ? progress.missed.length : 0;
                return (
                  <li key={n.href}>
                    <Link href={n.href} title={collapsed ? n.label : undefined} aria-current={on ? "page" : undefined}
                      className={cn("relative flex h-9 items-center gap-2.5 rounded-[var(--radius-md)] text-[13px] transition-colors", collapsed ? "justify-center" : "px-2.5",
                        on ? "bg-[var(--accent-subtle)] font-semibold text-[var(--accent-text)]" : "font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]")}>
                      {on && <span aria-hidden className="absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[var(--accent)]" />}
                      <n.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={on ? 2 : 1.7} />
                      {!collapsed && <span className="truncate">{n.label}</span>}
                      {!collapsed && n.badge === "live" && live.length > 0 && <LiveBadge className="ml-auto !px-1.5 !py-0 !text-[9.5px]" />}
                      {!collapsed && count > 0 && <span className="ty-label ty-mono ml-auto rounded-full bg-[var(--surface-sunken)] px-1.5 text-[var(--text-muted)]">{count}</span>}
                      {collapsed && (count > 0 || (n.badge === "live" && live.length > 0)) && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[var(--accent)]" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {!user.enrolled && !collapsed && (
        <div className="nx-glass mx-3 mb-3 p-3.5">
          <span className="ty-label ty-caps ty-accent">{freePeriod() ? "Everything free" : "Free plan"}</span>
          <p className="ty-note ty-muted mt-1.5">{freePeriod() ? `All lessons and tests are free until ${FREE_UNTIL_LABEL}. Live classes and the certificate come with the plan.` : "Get live classes, every chapter and your certificate."}</p>
          <button onClick={() => setEnrol(true)} className={btn("primary", "sm", "mt-3 w-full")}>{`Pay ₹${PLAN.price.toLocaleString("en-IN")}`}</button>
        </div>
      )}

      <div className={cn("shrink-0 border-t border-[var(--border)] p-3", collapsed && "px-2")}>
        <Link href="/contact" title="Help" className={cn("flex h-9 items-center gap-2.5 rounded-[var(--radius-md)] text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]", collapsed ? "justify-center" : "px-2.5")}><Help className="h-[18px] w-[18px]" strokeWidth={1.7} />{!collapsed && "Help and support"}</Link>
        <Link href="/learn/settings" title="Settings" aria-current={pathname.startsWith("/learn/settings") ? "page" : undefined} className={cn("flex h-9 items-center gap-2.5 rounded-[var(--radius-md)] text-[13px] font-medium", collapsed ? "justify-center" : "px-2.5", pathname.startsWith("/learn/settings") ? "bg-[var(--accent-subtle)] text-[var(--accent-text)]" : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]")}><Settings className="h-[18px] w-[18px]" strokeWidth={1.7} />{!collapsed && "Settings"}</Link>
        <Account collapsed={collapsed} onLeave={onLeave} />
      </div>
    </div>
  );

  return (
    <div className="app-theme flex min-h-screen print:block print:bg-white">
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 border-r border-[var(--border)] bg-white transition-[width] duration-200 lg:block print:!hidden", rail ? "w-[64px]" : "w-[248px]")}>{sidebar(rail)}</aside>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden print:hidden">
          <button aria-label="Close menu" onClick={() => setDrawer(false)} className="absolute inset-0 bg-[rgba(17,17,31,.32)]" />
          <aside className="nx-pop absolute inset-y-0 left-0 w-[272px] max-w-[85vw] bg-white shadow-xl">
            <button onClick={() => setDrawer(false)} aria-label="Close menu" className="absolute right-2 top-3 grid size-8 place-items-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"><X className="h-4 w-4" /></button>
            {sidebar(false)}
          </aside>
        </div>
      )}

      <div className="ws-main-wash flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-[var(--border)] bg-[color-mix(in_srgb,#fff_82%,transparent)] px-3 backdrop-blur-xl sm:px-5 print:!hidden">
          <button onClick={() => setDrawer(true)} aria-label="Open menu" aria-expanded={drawer} className="grid size-8 place-items-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)] lg:hidden"><Menu className="h-[18px] w-[18px]" /></button>
          <button onClick={() => setRail((r) => !r)} aria-label={rail ? "Expand sidebar" : "Collapse sidebar"} className="hidden size-8 place-items-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)] lg:grid"><SidebarToggle className="h-[18px] w-[18px]" /></button>
          <span aria-hidden className="mx-1 hidden h-5 w-px bg-[var(--border)] sm:block" />
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-[13px]">
            <Link href="/learn" className="hidden shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] sm:inline">SpeakUp</Link>
            {page && <><ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-[var(--text-subtle)] sm:block" />{sub ? <Link href={page.href} className="truncate text-[var(--text-muted)] hover:text-[var(--text-primary)]">{page.label}</Link> : <span className="truncate font-medium text-[var(--text-primary)]">{page.label}</span>}</>}
            {sub && <><ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-subtle)]" /><span className="truncate font-medium text-[var(--text-primary)]">{sub}</span></>}
          </nav>

          <button onClick={() => setPalette(true)} className="ml-auto hidden h-8 w-[260px] items-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] bg-white px-2.5 text-[13px] text-[var(--text-subtle)] shadow-[inset_0_0_0_1px_var(--border)] transition-shadow hover:shadow-[inset_0_0_0_1px_var(--border-strong)] md:flex">
            <Search className="h-4 w-4" />Search lessons and pages<kbd className="ty-label ml-auto rounded border border-[var(--border)] bg-[var(--surface-subtle)] px-1.5 font-sans">⌘K</kbd>
          </button>
          <button onClick={() => setPalette(true)} aria-label="Search" className="ml-auto grid size-8 place-items-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)] md:hidden"><Search className="h-[18px] w-[18px]" /></button>

          {live.length > 0 && <Link href="/learn/live" className="flex items-center gap-2 rounded-full bg-[var(--accent-subtle)] py-1 pl-1 pr-3 text-[12px] font-semibold text-[var(--accent-text)]"><LiveBadge />Class is live<span className="hidden sm:inline"> · join</span></Link>}
          <span className="hidden h-8 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-semibold text-[var(--text-secondary)] shadow-[inset_0_0_0_1px_var(--border)] sm:flex" title="Days in a row you studied"><Flame className={cn("h-4 w-4", streak ? "text-[var(--accent)]" : "text-[var(--text-subtle)]")} /><span className="ty-mono">{streak}</span><span className="font-medium text-[var(--text-muted)]">day streak</span></span>
          <Notifications />
        </header>

        <main id="main" className="mx-auto w-full max-w-[1240px] flex-1 px-4 py-6 sm:px-6 lg:px-8 print:p-0">{children}</main>
      </div>

      {palette && <Palette onClose={() => setPalette(false)} />}
      {enrol && <EnrolDialog userId={user.id} onClose={() => setEnrol(false)} />}
    </div>
  );
}

/* ---------- account popover in the sidebar footer ---------- */
function Account({ collapsed, onLeave }: { collapsed: boolean; onLeave: () => void }) {
  const { user, profile } = useAuth();
  const { open, setOpen, ref } = usePopover();
  if (!user) return null;
  return (
    <div ref={ref} className="relative mt-1">
      <button onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} className={cn("flex w-full items-center gap-2.5 rounded-[var(--radius-md)] p-1.5 text-left hover:bg-[var(--surface-hover)]", collapsed && "justify-center")}>
        <Avatar name={user.name} photo={profile.photo} avatar={profile.avatar} size={28} />
        {!collapsed && <><span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium text-[var(--text-primary)]">{user.name}</span><span className="block truncate text-[11px] text-[var(--text-subtle)]">{user.email}</span></span><Unfold className="h-4 w-4 shrink-0 text-[var(--text-subtle)]" /></>}
      </button>
      {open && (
        <div role="menu" className="nx-pop absolute bottom-full left-0 z-40 mb-2 w-60 rounded-[var(--radius-lg)] bg-white p-1.5 shadow-[var(--shadow-pop)]">
          <div className="px-2.5 py-2"><div className="ty-subject ty-ink truncate">{user.name}</div><div className="ty-note ty-muted truncate">{user.email}</div><Badge tone={user.enrolled ? "success" : "neutral"} className="mt-2">{user.role === "owner" ? "Owner" : user.role === "trainer" ? "Trainer" : user.enrolled ? "Full plan" : "Free"}</Badge></div>
          <div className="my-1 h-px bg-[var(--border)]" />
          <Link role="menuitem" href="/learn/settings" className="flex h-9 items-center gap-2 rounded-md px-2.5 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"><Settings className="h-4 w-4" />Settings and voice</Link>
          <Link role="menuitem" href="/" className="flex h-9 items-center gap-2 rounded-md px-2.5 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"><BookOpen className="h-4 w-4" />Visit the website</Link>
          <button role="menuitem" onClick={onLeave} className="flex h-9 w-full items-center gap-2 rounded-md px-2.5 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"><LogOut className="h-4 w-4" />Log out</button>
        </div>
      )}
    </div>
  );
}

/* ---------- notifications bell: derived from classes, bookings, review and milestones ---------- */
function Notifications() {
  const { user, progress } = useAuth();
  const course = useCourse();
  const { sessions, now } = useLive();
  const { open, setOpen, ref } = usePopover();
  const items = useMemo(() => {
    const out: { id: string; icon: IconType; title: string; text: string; href: string; urgent?: boolean }[] = [];
    for (const s of liveNow(sessions, now)) out.push({ id: s.id, icon: Video, title: `${s.title} is live`, text: `With ${s.trainer}. Join from Live classes.`, href: "/learn/live", urgent: true });
    const soon = sessions.filter((s) => (s.kind === "group" || s.mine) && !isPast(s, now) && startsInMin(s, now) > 0 && startsInMin(s, now) <= 24 * 60).slice(0, 3);
    for (const s of soon) out.push({ id: s.id, icon: s.mine ? UserRound : CalendarDays, title: s.mine && s.kind === "private" ? "Your private session" : s.title, text: `${fmtTime(s.start)} · ${countdown(s, now)} · ${s.trainer}`, href: s.kind === "private" ? "/learn/private" : "/learn/live", urgent: startsInMin(s, now) <= 30 });
    if (progress.missed.length) out.push({ id: "review", icon: RotateCcw, title: `${progress.missed.length} ${progress.missed.length === 1 ? "exercise" : "exercises"} to review`, text: "Quick practice on what you missed.", href: "/learn/review" });
    const next = MILESTONES.find((m) => !m.earned(course, progress));
    if (next) out.push({ id: "ms", icon: Flag, title: `Next milestone: ${next.title}`, text: next.desc, href: "/learn" });
    return out;
  }, [sessions, now, progress, course]);
  const urgent = items.some((i) => i.urgent);
  if (!user) return null;
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-label={`Notifications${items.length ? ` (${items.length})` : ""}`} aria-expanded={open} className="relative grid size-8 place-items-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)]">
        <Bell className="h-[18px] w-[18px]" />
        {items.length > 0 && <span className={cn("absolute right-1.5 top-1.5 size-2 rounded-full ring-2 ring-white", urgent ? "bg-[var(--accent)]" : "bg-[var(--accent)]")} />}
      </button>
      {open && (
        <div className="nx-pop absolute right-0 top-full z-40 mt-2 w-[340px] max-w-[calc(100vw-24px)] rounded-[var(--radius-lg)] bg-white shadow-[var(--shadow-pop)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3"><span className="ty-subject ty-ink">Notifications</span><span className="ty-note ty-subtle">{items.length} new</span></div>
          {items.length ? (
            <ul className="max-h-[400px] overflow-y-auto p-1.5">
              {items.map((i) => (
                <li key={i.id}>
                  <Link href={i.href} onClick={() => setOpen(false)} className="flex gap-3 rounded-[var(--radius-md)] p-2.5 hover:bg-[var(--surface-hover)]">
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded-[var(--radius-md)]", i.urgent ? "bg-[var(--accent-subtle)] text-[var(--accent-text)]" : "bg-[var(--accent-subtle)] text-[var(--accent-text)]")}><i.icon className="h-4 w-4" /></span>
                    <span className="min-w-0"><span className="ty-body ty-500 ty-ink block truncate">{i.title}</span><span className="ty-note ty-muted line-clamp-2">{i.text}</span></span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-10 text-center"><span className="mx-auto grid size-10 place-items-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent-text)]"><Bell className="h-5 w-5" /></span><p className="ty-subject ty-ink mt-3">You are all caught up</p><p className="ty-note ty-muted mt-1">Class reminders and review prompts show up here.</p></div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- ⌘K search: jump to any page or lesson ---------- */
function Palette({ onClose }: { onClose: () => void }) {
  const { user, progress } = useAuth();
  const course = useCourse();
  const router = useRouter();
  const cur = currentNode(course, progress);
  const items = useMemo<PaletteItem[]>(() => {
    const go = (href: string) => () => router.push(href);
    const suggested: PaletteItem[] = cur ? [{ id: "cont", group: "Continue", label: cur.kind === "lesson" ? cur.lesson.title : cur.title, sub: cur.kind === "lesson" ? `Day ${cur.lesson.day} · Week ${cur.week}` : `Week ${cur.week} checkpoint`, icon: Play, hint: "Up next", run: go(nodeHref(cur)) }] : [];
    const pages: PaletteItem[] = ALL.map((n) => ({ id: n.href, group: "Pages", label: n.label, icon: n.icon, run: go(n.href) }));
    const lessons: PaletteItem[] = course.sequence.map((n) => {
      const st = statusOf(course, n, progress, opener(user));
      return {
        id: n.id, group: "Lessons", label: n.kind === "lesson" ? n.lesson.title : n.title, icon: st === "locked" ? Lock : n.kind === "lesson" ? BookOpen : Flag,
        keywords: `week ${n.week} ${n.kind === "lesson" ? `day ${n.lesson.day} ${n.lesson.kind}` : "checkpoint test"}`,
        sub: `Week ${n.week}${n.kind === "lesson" ? ` · Day ${n.lesson.day}` : ""}${st === "locked" ? " · opens when you reach it" : ""}`,
        hint: st === "done" ? "Done" : st === "current" ? "Up next" : st === "paywall" ? "Unlock" : "Later",
        disabled: st === "locked", run: go(st === "paywall" ? "/learn/path" : nodeHref(n)),
      };
    });
    return [...suggested, ...pages, ...lessons];
  }, [course, progress, user, router, cur]);
  return (
    <CommandPalette items={items} onClose={onClose} placeholder="Search lessons, grammar and pages"
      groups={["Continue", "Pages", "Lessons"]} limits={{ Lessons: 12 }} emptyLimits={{ Lessons: 0 }}
      emptyHint="Try a grammar topic like “past simple” or a page like “Review”." />
  );
}
