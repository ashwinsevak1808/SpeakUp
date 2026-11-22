"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV_MAIN, NAV_MORE, SITE } from "@/lib/data";
import { FREE_UNTIL_LABEL } from "@/lib/access";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE.name} home`}>
      <span className="logo-mark grid h-9 w-9 place-items-center rounded-md bg-brand-700 font-display text-sm font-bold text-white">SU</span>
      <span className={cn("font-display text-lg font-bold tracking-tight", light ? "text-white" : "text-brand-900")}>{SITE.name}</span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { status } = useAuth();
  const authed = status === "auth";
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close menus whenever the route changes
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
    setMore(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    const click = (e: MouseEvent) => moreRef.current && !moreRef.current.contains(e.target as Node) && setMore(false);
    const key = (e: KeyboardEvent) => e.key === "Escape" && (setMore(false), setOpen(false));
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", click);
      document.removeEventListener("keydown", key);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-[0_1px_0_var(--color-line)]">
      {/* Announcement banner */}
      <Link href={authed ? "/learn" : "/signup"} className="block h-9 bg-brand-800 text-[13px] text-white transition-colors hover:bg-brand-900">
        <span className="mx-auto flex h-full max-w-6xl items-center justify-center gap-2 px-4 text-center">
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider">Free</span>
          <span className="truncate"><span className="hidden sm:inline">Every lesson and test is free until {FREE_UNTIL_LABEL}. </span><span className="sm:hidden">Free till 28 Feb 2027. </span><b className="underline underline-offset-2">{authed ? "My dashboard" : "Register"}<span className="hidden sm:inline">{authed ? "" : " for free"}</span> →</b></span>
        </span>
      </Link>

      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_MAIN.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link key={l.href} href={l.href} className={cn("relative px-3.5 py-2 text-[15px] font-medium transition-colors hover:text-brand-700", active ? "text-brand-700" : "text-ink")}>
                {l.label}
                {active && <span className="absolute inset-x-3.5 -bottom-[13px] h-0.5 bg-brand-600" />}
              </Link>
            );
          })}
          <div ref={moreRef} className="relative">
            <button onClick={() => setMore((m) => !m)} aria-expanded={more} aria-haspopup="true" className="flex items-center gap-1 px-3.5 py-2 text-[15px] font-medium text-ink hover:text-brand-700">
              More <ChevronDown className={cn("h-4 w-4 transition-transform", more && "rotate-180")} aria-hidden />
            </button>
            {more && (
              <div className="absolute right-0 top-full mt-3 w-72 rounded-lg border border-line bg-white p-2 shadow-xl shadow-brand-900/10">
                {NAV_MORE.map((m) => (
                  <Link key={m.href} href={m.href} className="block rounded-md px-3 py-2.5 hover:bg-brand-50">
                    <span className="block text-sm font-semibold text-brand-900">{m.label}</span>
                    <span className="block text-xs text-muted">{m.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          {!authed && <Link href="/login" className="hidden px-3 py-2 text-[15px] font-medium text-ink hover:text-brand-700 sm:inline-block">Log in</Link>}
          <Link href={authed ? "/learn" : "/signup"} className="hidden rounded-md bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 sm:inline-block">
            {authed ? "My Dashboard" : "Register Free"}
          </Link>
          <button onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="grid h-11 w-11 place-items-center text-brand-900 lg:hidden">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-[104px] z-40 overflow-y-auto bg-white px-5 pb-10 pt-4 lg:hidden">
          <ul className="divide-y divide-line">
            {[...NAV_MAIN, ...NAV_MORE].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={cn("block py-4 text-lg font-semibold", pathname === l.href ? "text-brand-600" : "text-brand-900")}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3">
            <Link href={authed ? "/learn" : "/signup"} className="block rounded-md bg-brand-700 py-3.5 text-center font-semibold text-white">{authed ? "My Dashboard" : "Register for free"}</Link>
            {!authed && <Link href="/login" className="block rounded-md border border-brand-700 py-3.5 text-center font-semibold text-brand-700">Log in</Link>}
          </div>
        </div>
      )}
    </header>
  );
}
