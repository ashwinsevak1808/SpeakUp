"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "select" | "textarea";
  options?: string[];
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  half?: boolean;
  defaultValue?: string;
};

function validate(f: Field, v: string): string | null {
  const val = v.trim();
  if (f.required !== false && !val) return f.type === "select" ? "Please choose an option." : "This field is required.";
  if (!val) return null;
  if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return "Please enter a valid email address.";
  if (f.type === "tel" && !/^(?:\+?91[\s-]?)?[6-9]\d{9}$/.test(val.replace(/[\s-]/g, ""))) return "Enter a valid 10-digit Indian mobile number.";
  if (f.minLength && val.length < f.minLength) return `Please write at least ${f.minLength} characters.`;
  return null;
}

export function LeadForm({
  kind,
  fields,
  submitLabel,
  successTitle = "Thank you",
  successText,
  downloadHref,
  dark,
  className,
}: {
  kind: string; // "demo" | "ebook" | "corporate" | ...
  fields: Field[];
  submitLabel: string;
  successTitle?: string;
  successText: string;
  downloadHref?: string;
  dark?: boolean;
  className?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ""])));
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "fail">("idle");
  const [trap, setTrap] = useState("");

  const set = (name: string, v: string) => {
    setValues((o) => ({ ...o, [name]: v }));
    if (touched[name]) setErrors((e) => ({ ...e, [name]: validate(fields.find((f) => f.name === name)!, v) }));
  };
  const blur = (f: Field) => {
    setTouched((t) => ({ ...t, [f.name]: true }));
    setErrors((e) => ({ ...e, [f.name]: validate(f, values[f.name]) }));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (trap) return; // honeypot
    const errs = Object.fromEntries(fields.map((f) => [f.name, validate(f, values[f.name])]));
    setErrors(errs);
    setTouched(Object.fromEntries(fields.map((f) => [f.name, true])));
    const firstBad = fields.find((f) => errs[f.name]);
    if (firstBad) {
      document.getElementById(`${kind}-${firstBad.name}`)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ...values }),
      });
      if (!res.ok) throw new Error("bad");
      setState("done");
      if (downloadHref) {
        const a = document.createElement("a");
        a.href = downloadHref;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch {
      setState("fail");
    }
  }

  const input = cn(
    "w-full rounded-md border px-4 py-3 text-base outline-none transition-colors placeholder:text-slate-400",
    "focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20",
    dark ? "border-white/20 bg-white/10 text-white placeholder:text-brand-300" : "border-slate-300 bg-white text-ink",
  );

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn("flex min-h-72 flex-col items-center justify-center gap-3 text-center", dark ? "text-white" : "text-brand-800")}
          >
            <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-white"><Check className="h-7 w-7" aria-hidden /></div>
            <h3 className="font-display text-2xl font-bold">{successTitle}</h3>
            <p className={cn("max-w-xs", dark ? "text-brand-100" : "text-slate-600")}>{successText}</p>
            {downloadHref && (
              <a href={downloadHref} download className="mt-1 font-semibold text-brand-600 underline underline-offset-4">
                Didn&apos;t start? Download again
              </a>
            )}
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2" exit={{ opacity: 0 }}>
            {fields.map((f) => {
              const id = `${kind}-${f.name}`;
              const err = touched[f.name] ? errors[f.name] : null;
              const common = {
                id,
                name: f.name,
                value: values[f.name],
                onBlur: () => blur(f),
                "aria-invalid": !!err,
                "aria-describedby": err ? `${id}-err` : undefined,
                className: cn(input, err && "!border-red-600"),
              };
              return (
                <div key={f.name} className={cn(!f.half && "sm:col-span-2")}>
                  <label htmlFor={id} className={cn("mb-1.5 block text-sm font-semibold", dark ? "text-brand-100" : "text-brand-800")}>
                    {f.label}
                    {f.required === false && <span className="ml-1 font-normal opacity-60">(optional)</span>}
                  </label>
                  {f.type === "select" ? (
                    <select {...common} onChange={(e) => set(f.name, e.target.value)}>
                      <option value="" className="text-slate-900">Select…</option>
                      {f.options?.map((o) => (
                        <option key={o} className="text-slate-900">{o}</option>
                      ))}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea {...common} rows={4} placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)} />
                  ) : (
                    <input
                      {...common}
                      type={f.type ?? "text"}
                      inputMode={f.type === "tel" ? "tel" : undefined}
                      autoComplete={f.type === "email" ? "email" : f.type === "tel" ? "tel" : f.name === "name" ? "name" : undefined}
                      placeholder={f.placeholder}
                      onChange={(e) => set(f.name, e.target.value)}
                    />
                  )}
                  <AnimatePresence>
                    {err && (
                      <motion.p id={`${id}-err`} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-sm font-semibold text-red-600">
                        {err}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* honeypot: hidden from humans, bots fill it */}
            <input tabIndex={-1} autoComplete="off" aria-hidden value={trap} onChange={(e) => setTrap(e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" name="website" />

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={state === "sending"}
                className="w-full rounded-md bg-brand-700 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-70"
              >
                {state === "sending" ? "Sending…" : submitLabel}
              </button>
              {state === "fail" && (
                <p role="alert" className="mt-3 text-center text-sm font-semibold text-red-600">
                  Something went wrong. Please try again or message us on WhatsApp.
                </p>
              )}
              <p className={cn("mt-3 text-center text-xs", dark ? "text-brand-300" : "text-slate-400")}>We never spam. Your details stay private.</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Ready-made field sets */
export const DEMO_FIELDS: Field[] = [
  { name: "name", label: "Full name", half: true, minLength: 2, placeholder: "Your name" },
  { name: "phone", label: "Mobile number", type: "tel", half: true, placeholder: "98765 43210" },
  { name: "email", label: "Email", type: "email", placeholder: "you@email.com" },
  { name: "course", label: "I'm interested in", type: "select", options: ["Basic Communication", "Advanced Communication", "Interview Mastery", "Public Speaking Lab", "Corporate Training", "Not sure yet"] },
  { name: "message", label: "Anything we should know?", type: "textarea", required: false, placeholder: "Your goals, preferred timing…" },
];
export const EBOOK_FIELDS: Field[] = [
  { name: "name", label: "Full name", minLength: 2, placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", placeholder: "you@email.com" },
  { name: "phone", label: "Mobile number", type: "tel", placeholder: "98765 43210" },
];
export const CORP_FIELDS: Field[] = [
  { name: "company", label: "Company name", half: true, minLength: 2 },
  { name: "name", label: "Your name", half: true, minLength: 2 },
  { name: "email", label: "Work email", type: "email", half: true },
  { name: "phone", label: "Phone", type: "tel", half: true },
  { name: "size", label: "Team size", type: "select", options: ["1–10", "11–25", "26–50", "51–100", "100+"] },
  { name: "requirement", label: "Your requirement", type: "textarea", minLength: 10, placeholder: "e.g. Email writing and client-call training for 20 sales executives" },
];
