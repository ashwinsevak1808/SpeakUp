"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";

type Row = { name: string; plan: string | null; issued_at: string; valid: boolean };

/** Certificate lookup. /verify?id=SU-2026-A1B2C3 checks straight away (the id printed on the certificate). */
export function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const asked = (params.get("id") ?? "").trim().toUpperCase();
  const [id, setId] = useState(asked);
  const [res, setRes] = useState<{ id: string; row: Row | null } | null>(null);

  useEffect(() => {
    if (!asked) return;
    let alive = true;
    supabase().rpc("verify_certificate", { p_id: asked }).then(({ data }) => { if (alive) setRes({ id: asked, row: (data as Row[] | null)?.[0] ?? null }); });
    return () => { alive = false; };
  }, [asked]);

  const go = (e: FormEvent) => { e.preventDefault(); const v = id.trim().toUpperCase(); if (v) router.push(`/verify?id=${encodeURIComponent(v)}`); };
  const r = res?.id === asked ? res.row : undefined;
  const date = r ? new Date(r.issued_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }) : "";

  return (
    <>
      {asked && (
        <div className="mb-10">
          {r === undefined ? <div className="h-36 animate-pulse rounded-xl bg-brand-50" /> : r && r.valid ? (
            <div role="status" className="rounded-xl border border-accent-200 bg-accent-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent-700">Valid certificate</p>
              <p className="mt-2 font-display text-2xl font-bold text-brand-900">{r.name}</p>
              <p className="mt-1 text-ink">completed the <b>{r.plan ?? "SpeakUp course"}</b> on {date}.</p>
              <p className="mt-4 font-mono text-sm text-muted">{asked}</p>
            </div>
          ) : (
            <div role="status" className="rounded-xl border border-line bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#b42318]">{r ? "This certificate was withdrawn" : "No certificate found"}</p>
              <p className="mt-2 text-ink">{r ? "It is no longer valid." : <>We have no certificate with the ID <span className="font-mono font-semibold">{asked}</span>. Check the spelling, or contact us.</>}</p>
            </div>
          )}
        </div>
      )}
      <form onSubmit={go} className="flex flex-col gap-3 sm:flex-row">
        <label className="min-w-0 flex-1"><span className="sr-only">Certificate ID</span>
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="SU-2026-A1B2C3" className="w-full rounded-md border border-brand-300 px-4 py-3 font-mono uppercase outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20" />
        </label>
        <button className="rounded-md bg-accent-600 px-6 py-3 font-semibold text-white hover:bg-accent-700">Check certificate</button>
      </form>
    </>
  );
}
