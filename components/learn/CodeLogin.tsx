"use client";
/**
 * Log in (or sign up) with a one-time code sent by email. No password needed.
 * Step 1: email → Supabase sends a code (and a sign-in link). Step 2: type the code → signed in.
 * New emails get an account automatically. Needs working email sending in Supabase (custom SMTP).
 */
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { isStaff, sendLoginCode, useAuth, verifyLoginCode } from "@/lib/auth";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const field = "w-full rounded-md border border-brand-300 px-4 py-3 outline-none transition-colors focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 disabled:bg-brand-50";

export function CodeLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const { status, user } = useAuth();
  const dest = next && (next.startsWith("/learn") || next.startsWith("/admin")) ? next : isStaff(user?.role) ? "/admin" : "/learn";
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [wait, setWait] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);
  const leaving = status === "auth";

  useEffect(() => { if (status === "auth") router.replace(dest); }, [status, dest, router]);
  useEffect(() => { if (wait <= 0) return; const t = setTimeout(() => setWait((w) => w - 1), 1000); return () => clearTimeout(t); }, [wait]);

  async function send(e?: FormEvent) {
    e?.preventDefault(); setErr("");
    if (!EMAIL.test(email.trim())) { setErr("Please enter a valid email address."); return; }
    setBusy(true);
    const m = await sendLoginCode(email);
    setBusy(false);
    if (m) { setErr(m); return; }
    setStep("code"); setCode(""); setWait(30);
    setTimeout(() => codeRef.current?.focus(), 50);
  }
  async function verify(e?: FormEvent) {
    e?.preventDefault(); setErr("");
    const c = code.replace(/\D/g, "");
    if (c.length < 6) { setErr("Enter the code from the email."); return; }
    setBusy(true);
    const m = await verifyLoginCode(email, c);
    setBusy(false);
    if (m) setErr(m);
  }

  const button = (text: string, busyText: string) => (
    <button disabled={busy || leaving} className="flex w-full items-center justify-center gap-2.5 rounded-md bg-accent-600 py-3 font-semibold text-white transition-colors hover:bg-accent-700 disabled:cursor-wait disabled:opacity-90">
      {(busy || leaving) && <Spinner />}
      <span aria-live="polite">{leaving ? "Opening your dashboard…" : busy ? busyText : text}</span>
    </button>
  );

  if (step === "email") {
    return (
      <form onSubmit={send} noValidate aria-busy={busy} className="space-y-4">
        <div>
          <label htmlFor="c-email" className="mb-1.5 block text-sm font-semibold text-ink">Email</label>
          <input id="c-email" type="email" autoComplete="email" inputMode="email" value={email} disabled={busy} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="you@email.com" />
          <p className="mt-1.5 text-sm text-muted">We will email you a one-time code. New here? This creates your free account.</p>
        </div>
        {err && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">{err}</p>}
        {button("Email me a code", "Sending your code…")}
      </form>
    );
  }

  return (
    <form onSubmit={verify} noValidate aria-busy={busy || leaving} className="space-y-4">
      <div className="rounded-md bg-brand-50 p-3 text-sm text-brand-800">
        We sent a code to <b className="break-all">{email.trim()}</b>. It can take a minute; check Spam too. You can also just tap the link in that email.
      </div>
      <div>
        <label htmlFor="c-code" className="mb-1.5 block text-sm font-semibold text-ink">Code from the email</label>
        <input
          ref={codeRef} id="c-code" value={code} disabled={busy || leaving}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 10))}
          inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*" placeholder="123456" maxLength={10}
          className={cn(field, "text-center font-mono text-2xl tracking-[0.5em] placeholder:tracking-[0.5em] placeholder:text-brand-200")}
        />
      </div>
      {err && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">{err}</p>}
      {button("Log in", "Checking your code…")}
      <div className="flex items-center justify-between text-sm">
        <button type="button" onClick={() => { setStep("email"); setErr(""); }} disabled={busy || leaving} className="font-semibold text-brand-700 underline-offset-4 hover:underline">Use a different email</button>
        <button type="button" onClick={() => send()} disabled={busy || leaving || wait > 0} className="font-semibold text-brand-700 underline-offset-4 hover:underline disabled:text-muted disabled:no-underline">{wait > 0 ? `Send again in ${wait}s` : "Send a new code"}</button>
      </div>
    </form>
  );
}
