"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { login, signup, useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const dest = next && next.startsWith("/learn") ? next : "/learn";
  const { status } = useAuth();
  const [v, setV] = useState({ name: "", email: "", password: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [formErr, setFormErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (status === "auth") router.replace(dest); }, [status, dest, router]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === "signup" && v.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Please enter a valid email address.";
    if (mode === "signup" ? v.password.length < 8 : !v.password) e.password = mode === "signup" ? "Use at least 8 characters." : "Please enter your password.";
    return e;
  };

  async function submit(ev: FormEvent) {
    ev.preventDefault(); setFormErr("");
    const e = validate(); setErrs(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    const err = mode === "signup" ? await signup(v.name, v.email, v.password) : await login(v.email, v.password);
    setBusy(false);
    if (err) setFormErr(err); else router.replace(dest);
  }

  const field = (name: "name" | "email" | "password", label: string, type: string, auto: string) => (
    <div>
      <label htmlFor={`a-${name}`} className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>
      <input
        id={`a-${name}`} name={name} type={type} autoComplete={auto} value={v[name]}
        onChange={(e) => setV({ ...v, [name]: e.target.value })}
        aria-invalid={!!errs[name]} aria-describedby={errs[name] ? `a-${name}-err` : undefined}
        className={cn("w-full rounded-md border px-4 py-3 outline-none transition-colors focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20", errs[name] ? "border-red-600" : "border-slate-300")}
      />
      {errs[name] && <p id={`a-${name}-err`} role="alert" className="mt-1 text-sm font-medium text-red-600">{errs[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {mode === "signup" && field("name", "Full name", "text", "name")}
      {field("email", "Email", "email", "email")}
      {field("password", "Password", "password", mode === "signup" ? "new-password" : "current-password")}
      {formErr && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">{formErr}</p>}
      <button disabled={busy} className="w-full rounded-md bg-accent-600 py-3 font-semibold text-white transition-colors hover:bg-accent-700 disabled:opacity-70">
        {busy ? "Please wait…" : mode === "signup" ? "Create my account" : "Log in"}
      </button>
      <p className="text-center text-sm text-muted">
        {mode === "signup" ? <>Already have an account? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-brand-700 underline underline-offset-4">Log in</Link></>
          : <>New here? <Link href="/signup" className="font-semibold text-brand-700 underline underline-offset-4">Create a free account</Link></>}
      </p>
    </form>
  );
}
