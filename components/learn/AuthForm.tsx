"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { isStaff, login, requestPasswordReset, signup, updatePassword, useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup" | "forgot" | "reset";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const linkError = params.get("error") === "link";
  const { status, user } = useAuth();
  const dest = next && (next.startsWith("/learn") || next.startsWith("/admin")) ? next : isStaff(user?.role) ? "/admin" : "/learn";
  const [v, setV] = useState({ name: "", email: "", password: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [formErr, setFormErr] = useState(linkError ? "That link has expired or was already used. Please try again." : "");
  const [sent, setSent] = useState<"" | "confirm" | "reset">("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (status === "auth" && mode !== "reset") router.replace(dest); }, [status, dest, router, mode]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === "signup" && v.name.trim().length < 2) e.name = "Please enter your full name.";
    if (mode !== "reset" && !EMAIL.test(v.email.trim())) e.email = "Please enter a valid email address.";
    if (mode === "signup" || mode === "reset") { if (v.password.length < 8) e.password = "Use at least 8 characters."; }
    else if (mode === "login" && !v.password) e.password = "Please enter your password.";
    return e;
  };

  async function submit(ev: FormEvent) {
    ev.preventDefault(); setFormErr("");
    const e = validate(); setErrs(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    if (mode === "signup") {
      const r = await signup(v.name, v.email, v.password);
      if (r.error) setFormErr(r.error); else if (r.confirm) setSent("confirm");
    } else if (mode === "login") {
      const err = await login(v.email, v.password); if (err) setFormErr(err);
    } else if (mode === "forgot") {
      const err = await requestPasswordReset(v.email); if (err) setFormErr(err); else setSent("reset");
    } else {
      const err = await updatePassword(v.password); if (err) setFormErr(err); else router.replace(dest);
    }
    setBusy(false);
  }

  if (sent) {
    return (
      <div role="status" className="nx-card p-6">
        <h2 className="ty-head ty-ink">Check your inbox</h2>
        <p className="ty-body ty-secondary mt-2">
          We sent a link to <b className="text-[var(--text-primary)]">{v.email.trim()}</b>.{" "}
          {sent === "confirm" ? "Open it to confirm your email and start learning." : "Open it to choose a new password."}
        </p>
        <p className="ty-note ty-muted mt-3">Nothing there after a minute? Look in Spam or Promotions.</p>
        <button onClick={() => setSent("")} className="btn-base btn-ghost btn-sm mt-4">Use a different email</button>
      </div>
    );
  }
  if (mode === "reset" && status === "anon") {
    return <p className="rounded-md bg-brand-50 p-4 text-sm text-brand-800">This page opens from the reset link in your email. <Link href="/forgot-password" className="font-semibold underline underline-offset-4">Send a new link</Link>.</p>;
  }

  const field = (name: "name" | "email" | "password", label: string, type: string, auto: string) => (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={`a-${name}`} className="block text-sm font-semibold text-ink">{label}</label>
        {name === "password" && mode === "login" && <Link href="/forgot-password" className="text-sm font-medium text-brand-700 underline-offset-4 hover:underline">Forgot password?</Link>}
      </div>
      <input
        id={`a-${name}`} name={name} type={type} autoComplete={auto} value={v[name]}
        onChange={(e) => setV({ ...v, [name]: e.target.value })}
        aria-invalid={!!errs[name]} aria-describedby={errs[name] ? `a-${name}-err` : undefined}
        className={cn("w-full rounded-md border px-4 py-3 outline-none transition-colors focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20", errs[name] ? "border-red-600" : "border-brand-300")}
      />
      {errs[name] && <p id={`a-${name}-err`} role="alert" className="mt-1 text-sm font-medium text-red-600">{errs[name]}</p>}
    </div>
  );
  const label = { signup: "Create my account", login: "Log in", forgot: "Send reset link", reset: "Save new password" }[mode];

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {mode === "signup" && field("name", "Full name", "text", "name")}
      {mode !== "reset" && field("email", "Email", "email", "email")}
      {mode !== "forgot" && field("password", mode === "reset" ? "New password" : "Password", "password", mode === "login" ? "current-password" : "new-password")}
      {formErr && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">{formErr}</p>}
      <button disabled={busy} className="w-full rounded-md bg-accent-600 py-3 font-semibold text-white transition-colors hover:bg-accent-700 disabled:opacity-70">
        {busy ? "Please wait…" : label}
      </button>
      <p className="text-center text-sm text-muted">
        {mode === "signup" ? <>Already have an account? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-brand-700 underline underline-offset-4">Log in</Link></>
          : mode === "login" ? <>New here? <Link href="/signup" className="font-semibold text-brand-700 underline underline-offset-4">Create a free account</Link></>
          : <>Remembered it? <Link href="/login" className="font-semibold text-brand-700 underline underline-offset-4">Log in</Link></>}
      </p>
    </form>
  );
}
