"use client";
/**
 * The admin workspace for trainers and the owner, in the same Neemo layout as the student area:
 * white sidebar with grouped nav, 56px top bar (breadcrumb, ⌘K student search), soft canvas.
 */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award, BookOpen, CalendarDays, ChevronRight, Grad, LayoutDashboard, LogOut, Menu, Search, ShieldCheck, SidebarToggle, Unfold,
  UserRound, Users, X, Zap, type IconType,
} from "@/components/learn/icons";
import { isStaff, logout, useAuth } from "@/lib/auth";
import { CourseProvider } from "@/lib/course";
import { Avatar } from "@/components/learn/Avatar";
import { Badge } from "@/components/learn/ui";
import { cn } from "@/lib/utils";
import { AdminProvider, STATUS_LABEL, useAdmin } from "./data";
import { CommandPalette, type PaletteItem } from "@/components/ui/CommandPalette";
import { Spinner } from "@/components/ui/Spinner";

type NavItem = { href: string; label: string; icon: IconType; badge?: "requests" | "leads"; owner?: boolean };
const GROUPS: { label: string; items: NavItem[] }[] = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "People", items: [
    { href: "/admin/students", label: "Students", icon: Grad },
    { href: "/admin/enrolments", label: "Enrolments", icon: ShieldCheck, badge: "requests" },
    { href: "/admin/leads", label: "Leads", icon: Zap, badge: "leads" },
    { href: "/admin/payments", label: "Payments", icon: Award },
  ] },
  { label: "Teaching", items: [
    { href: "/admin/classes", label: "Classes", icon: CalendarDays },
    { href: "/admin/bookings", label: "Private bookings", icon: UserRound },
    { href: "/admin/lessons", label: "Lessons", icon: BookOpen },
  ] },
  { label: "Settings", items: [{ href: "/admin/team", label: "Team", icon: Users }] },
];
const ALL = GROUPS.flatMap((g) => g.items);
const isActive = (href: string, p: string) => (href === "/admin" ? p === "/admin" : p.startsWith(href));

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const leaving = useRef(false);
  useEffect(() => { if (status === "anon" && !leaving.current) router.replace(`/login?next=${encodeURIComponent(pathname)}`); }, [status, pathname, router]);

  if (status !== "auth" || !user) return <div className="app-theme grid min-h-screen place-items-center"><span role="status" className="ty-body ty-muted flex items-center gap-3"><Spinner className="h-5 w-5 text-[var(--accent)]" />Loading the admin panel…</span></div>;
  if (!isStaff(user.role)) {
    return (
      <div className="app-theme grid min-h-screen place-items-center p-6">
        <div className="nx-card max-w-sm p-8 text-center">
          <h1 className="ty-head ty-ink">This area is for trainers</h1>
          <p className="ty-body ty-muted mt-2">Your account is a student account. Ask the owner to add you to the team.</p>
          <Link href="/learn" className="btn-base btn-primary btn-md mt-5">Go to my dashboard</Link>
        </div>
      </div>
    );
  }
  return (
    <CourseProvider>
      <AdminProvider>
        <Frame onLeave={async () => { leaving.current = true; await logout(); router.push("/login"); }}>{children}</Frame>
      </AdminProvider>
    </CourseProvider>
  );
}

function Frame({ children, onLeave }: { children: React.ReactNode; onLeave: () => void }) {
  const { user } = useAuth();
  const { requests, newLeads } = useAdmin();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [rail, setRail] = useState(false);
  const [palette, setPalette] = useState(false);
  const [prev, setPrev] = useState(pathname);
  if (prev !== pathname) { setPrev(pathname); setDrawer(false); setPalette(false); }
  useEffect(() => { document.body.style.overflow = drawer ? "hidden" : ""; }, [drawer]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((p) => !p); } };
    document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k);
  }, []);
  if (!user) return null;
  const pending = requests.filter((r) => r.status === "pending").length;
  const page = ALL.find((n) => isActive(n.href, pathname));
  const sub = /^\/admin\/students\/.+/.test(pathname) ? "Student" : null;

  const sidebar = (collapsed: boolean) => (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-14 shrink-0 items-center gap-2.5 border-b border-[var(--border)]", collapsed ? "justify-center px-2" : "px-4")}>
        <Link href="/admin" className="logo-mark grid size-7 shrink-0 place-items-center text-[11px] font-semibold" aria-label="Admin dashboard">SU</Link>
        {!collapsed && <div className="min-w-0"><div className="ty-subject ty-ink truncate">SpeakUp</div><div className="ty-label ty-subtle -mt-0.5 truncate">Admin panel</div></div>}
      </div>
      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
        {GROUPS.map((g) => (
          <div key={g.label} className="mb-5 last:mb-0">
            {!collapsed ? <div className="ty-label ty-caps ty-subtle mb-1.5 px-2.5">{g.label}</div> : <div className="mx-auto mb-2 h-px w-6 bg-[var(--border)]" />}
            <ul className="space-y-0.5">
              {g.items.map((n) => {
                const on = isActive(n.href, pathname);
                const count = n.badge === "requests" ? pending : n.badge === "leads" ? newLeads : 0;
                return (
                  <li key={n.href}>
                    <Link href={n.href} title={collapsed ? n.label : undefined} aria-current={on ? "page" : undefined}
                      className={cn("relative flex h-9 items-center gap-2.5 rounded-[var(--radius-md)] text-[13px] transition-colors", collapsed ? "justify-center" : "px-2.5",
                        on ? "bg-[var(--accent-subtle)] font-semibold text-[var(--accent-text)]" : "font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]")}>
                      {on && <span aria-hidden className="absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[var(--accent)]" />}
                      <n.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={on ? 2 : 1.7} />
                      {!collapsed && <span className="truncate">{n.label}</span>}
                      {!collapsed && count > 0 && <span className="ty-label ty-mono ml-auto rounded-full bg-[var(--accent)] px-1.5 text-white">{count}</span>}
                      {collapsed && count > 0 && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[var(--accent)]" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className={cn("shrink-0 border-t border-[var(--border)] p-3", collapsed && "px-2")}>
        <Link href="/learn" title="Student view" className={cn("flex h-9 items-center gap-2.5 rounded-[var(--radius-md)] text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]", collapsed ? "justify-center" : "px-2.5")}><Grad className="h-[18px] w-[18px]" strokeWidth={1.7} />{!collapsed && "Open the student app"}</Link>
        <AccountMenu collapsed={collapsed} onLeave={onLeave} />
      </div>
    </div>
  );

  return (
    <div className="app-theme flex min-h-screen">
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 border-r border-[var(--border)] bg-white transition-[width] duration-200 lg:block", rail ? "w-[64px]" : "w-[248px]")}>{sidebar(rail)}</aside>
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close menu" onClick={() => setDrawer(false)} className="absolute inset-0 bg-[rgba(17,17,31,.32)]" />
          <aside className="nx-pop absolute inset-y-0 left-0 w-[272px] max-w-[85vw] bg-white shadow-xl">
            <button onClick={() => setDrawer(false)} aria-label="Close menu" className="absolute right-2 top-3 grid size-8 place-items-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"><X className="h-4 w-4" /></button>
            {sidebar(false)}
          </aside>
        </div>
      )}
      <div className="ws-main-wash flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-[var(--border)] bg-[color-mix(in_srgb,#fff_82%,transparent)] px-3 backdrop-blur-xl sm:px-5">
          <button onClick={() => setDrawer(true)} aria-label="Open menu" aria-expanded={drawer} className="grid size-8 place-items-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)] lg:hidden"><Menu className="h-[18px] w-[18px]" /></button>
          <button onClick={() => setRail((r) => !r)} aria-label={rail ? "Expand sidebar" : "Collapse sidebar"} className="hidden size-8 place-items-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)] lg:grid"><SidebarToggle className="h-[18px] w-[18px]" /></button>
          <span aria-hidden className="mx-1 hidden h-5 w-px bg-[var(--border)] sm:block" />
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-[13px]">
            <Link href="/admin" className="hidden shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] sm:inline">Admin</Link>
            {page && <><ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-[var(--text-subtle)] sm:block" />{sub ? <Link href={page.href} className="truncate text-[var(--text-muted)] hover:text-[var(--text-primary)]">{page.label}</Link> : <span className="truncate font-medium text-[var(--text-primary)]">{page.label}</span>}</>}
            {sub && <><ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-subtle)]" /><span className="truncate font-medium text-[var(--text-primary)]">{sub}</span></>}
          </nav>
          <button onClick={() => setPalette(true)} className="ml-auto hidden h-8 w-[280px] items-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] bg-white px-2.5 text-[13px] text-[var(--text-subtle)] shadow-[inset_0_0_0_1px_var(--border)] hover:shadow-[inset_0_0_0_1px_var(--border-strong)] md:flex">
            <Search className="h-4 w-4" />Search students, pages…<kbd className="ty-label ml-auto rounded border border-[var(--border)] bg-[var(--surface-subtle)] px-1.5 font-sans">⌘K</kbd>
          </button>
          <button onClick={() => setPalette(true)} aria-label="Search" className="ml-auto grid size-8 place-items-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-hover)] md:hidden"><Search className="h-[18px] w-[18px]" /></button>
          <Badge tone="accent" className="hidden sm:inline-flex">{user.role === "owner" ? "Owner" : "Trainer"}</Badge>
        </header>
        <main id="main" className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      {palette && <Palette onClose={() => setPalette(false)} />}
    </div>
  );
}

function AccountMenu({ collapsed, onLeave }: { collapsed: boolean; onLeave: () => void }) {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const click = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", click); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", click); document.removeEventListener("keydown", key); };
  }, [open]);
  if (!user) return null;
  return (
    <div ref={ref} className="relative mt-1">
      <button onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} className={cn("flex w-full items-center gap-2.5 rounded-[var(--radius-md)] p-1.5 text-left hover:bg-[var(--surface-hover)]", collapsed && "justify-center")}>
        <Avatar name={user.name} photo={profile.photo} avatar={profile.avatar} size={28} />
        {!collapsed && <><span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium text-[var(--text-primary)]">{user.name}</span><span className="block truncate text-[11px] text-[var(--text-subtle)]">{user.email}</span></span><Unfold className="h-4 w-4 shrink-0 text-[var(--text-subtle)]" /></>}
      </button>
      {open && (
        <div role="menu" className="nx-pop absolute bottom-full left-0 z-40 mb-2 w-60 rounded-[var(--radius-lg)] bg-white p-1.5 shadow-[var(--shadow-pop)]">
          <div className="px-2.5 py-2"><div className="ty-subject ty-ink truncate">{user.name}</div><div className="ty-note ty-muted truncate">{user.email}</div><Badge tone="accent" className="mt-2">{user.role === "owner" ? "Owner" : "Trainer"}</Badge></div>
          <div className="my-1 h-px bg-[var(--border)]" />
          <Link role="menuitem" href="/learn/settings" className="flex h-9 items-center gap-2 rounded-md px-2.5 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"><UserRound className="h-4 w-4" />My profile</Link>
          <button role="menuitem" onClick={onLeave} className="flex h-9 w-full items-center gap-2 rounded-md px-2.5 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"><LogOut className="h-4 w-4" />Log out</button>
        </div>
      )}
    </div>
  );
}

/* ---------- ⌘K: jump to a student, a page or an action ---------- */
function Palette({ onClose }: { onClose: () => void }) {
  const { people, requests, newLeads } = useAdmin();
  const { user } = useAuth();
  const router = useRouter();
  const pending = requests.filter((r) => r.status === "pending").length;
  const items = useMemo<PaletteItem[]>(() => {
    const go = (href: string) => () => router.push(href);
    const actions: PaletteItem[] = [
      { id: "a-class", group: "Actions", label: "Schedule a class", icon: CalendarDays, keywords: "new live class session meet", run: go("/admin/classes") },
      ...(pending ? [{ id: "a-req", group: "Actions", label: `Review ${pending} enrolment ${pending === 1 ? "request" : "requests"}`, icon: ShieldCheck, run: go("/admin/enrolments") }] : []),
      ...(newLeads ? [{ id: "a-leads", group: "Actions", label: `Follow up ${newLeads} new ${newLeads === 1 ? "lead" : "leads"}`, icon: Zap, run: go("/admin/leads") }] : []),
      ...(user?.role === "owner" ? [{ id: "a-team", group: "Actions", label: "Add a trainer", icon: Users, keywords: "invite staff team", run: go("/admin/team") }] : []),
      { id: "a-app", group: "Actions", label: "Open the student app", icon: Grad, keywords: "learn preview", run: go("/learn") },
    ];
    const pages: PaletteItem[] = ALL.map((n) => ({ id: n.href, group: "Pages", label: n.label, icon: n.icon, run: go(n.href) }));
    const byActive = [...people].sort((a, b) => (b.lastActive ?? b.createdAt).localeCompare(a.lastActive ?? a.createdAt));
    const ppl: PaletteItem[] = byActive.map((p) => ({
      id: p.id, group: p.role === "student" ? "Students" : "Team", label: p.name, sub: p.email, keywords: p.phone ?? "",
      hint: p.role === "student" ? STATUS_LABEL[p.status] : p.role === "owner" ? "Owner" : "Trainer",
      mark: <Avatar name={p.name} avatar={p.avatar} size={30} />, run: go(`/admin/students/${p.id}`),
    }));
    return [...actions, ...pages, ...ppl];
  }, [people, pending, newLeads, user, router]);
  return (
    <CommandPalette items={items} onClose={onClose} placeholder="Search students, pages and actions"
      groups={["Actions", "Students", "Team", "Pages"]} limits={{ Students: 8, Team: 5 }} emptyLimits={{ Students: 5, Team: 0 }}
      emptyHint="Try a name, an email or a phone number." />
  );
}
