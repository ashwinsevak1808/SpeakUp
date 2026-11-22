"use client";
import { useMemo, useState } from "react";
import { Check, Lock, Medal, Printer } from "@/components/learn/icons";
import { useAuth } from "@/lib/auth";
import { PLAN } from "@/lib/learn-data";
import { useCourse } from "@/lib/course";
import { certificateStatus, weekDone } from "@/lib/course-core";
import { SITE } from "@/lib/data";
import { Card, PageTitle, Ring } from "@/components/learn/ui";
import { EnrolDialog } from "@/components/learn/EnrolDialog";
import { cn } from "@/lib/utils";

function Step({ ok, title, text }: { ok: boolean; title: string; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full", ok ? "bg-ok text-white" : "border-2 border-dashed border-brand-300 text-brand-300")}>{ok && <Check className="h-3.5 w-3.5" />}</span>
      <span><span className={cn("block font-semibold", ok ? "text-brand-900" : "text-brand-800")}>{title}</span><span className="block text-sm text-muted">{text}</span></span>
    </li>
  );
}

/** A decorative seal: a ring of points around a medal. */
function Seal() {
  return (
    <div className="relative grid h-24 w-24 place-items-center" aria-hidden>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs><linearGradient id="seal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f5d77a" /><stop offset="1" stopColor="#b9892b" /></linearGradient></defs>
        <g fill="url(#seal)">{Array.from({ length: 24 }).map((_, i) => <circle key={i} cx={50 + 44 * Math.cos((i * Math.PI) / 12)} cy={50 + 44 * Math.sin((i * Math.PI) / 12)} r="6" />)}<circle cx="50" cy="50" r="42" /></g>
        <circle cx="50" cy="50" r="34" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" strokeDasharray="2 3" />
      </svg>
      <Medal className="relative h-9 w-9 text-white drop-shadow" />
    </div>
  );
}

export default function Certificate() {
  const { user, progress } = useAuth();
  const course = useCourse();
  const [preview, setPreview] = useState(false);
  const [dialog, setDialog] = useState(false);
  const date = useMemo(() => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), []);
  if (!user) return null;
  const c = certificateStatus(course, progress);
  const ready = c.eligible && user.enrolled;
  const show = ready || preview;
  const id = `YE-${new Date().getFullYear()}-${user.id.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase()}`;
  const pct = Math.round((c.weeksDone / Math.max(1, c.weeksNeeded)) * 100);

  return (
    <>
      <div className="print:hidden">
        <PageTitle title="Certificate" text="Your Certificate of Completion is for enrolled students who finish the whole course. Logging in alone does not give a certificate." />
        <Card className="mb-6 !p-5 sm:!p-6">
          <div className="flex flex-wrap items-center gap-6">
            <Ring value={pct} size={110} stroke={11}><div className="text-center"><div className="ty-figure">{c.weeksDone}</div><div className="ty-label ty-subtle">of {c.weeksNeeded} weeks</div></div></Ring>
            <ul className="min-w-[240px] flex-1 space-y-4">
              <Step ok={user.enrolled} title={`Enrol in the ${PLAN.name}`} text="Unlocks live classes, every week and the certificate." />
              <Step ok={c.eligible} title={`Complete all ${c.weeksNeeded} weeks`} text="Every lesson and every weekly checkpoint." />
            </ul>
            <div className="flex flex-wrap gap-3">
              {ready ? <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-accent-700"><Printer className="h-4 w-4" />Print or save as PDF</button>
                : <>
                  {!user.enrolled && <button onClick={() => setDialog(true)} className="rounded-lg bg-accent-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-accent-700">Enrol now</button>}
                  <button onClick={() => setPreview((p) => !p)} className="rounded-lg border border-line bg-white px-5 py-2.5 font-semibold text-brand-900 hover:bg-brand-50">{preview ? "Hide sample" : "Preview a sample"}</button>
                </>}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-12">
            {course.weeks.map((w) => {
              const d = weekDone(course, progress, w.n);
              return (
                <div key={w.n} title={w.comingSoon ? "Coming soon" : d ? "Done" : "In progress"} className={cn("flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-center", d ? "border-transparent bg-ok text-white" : w.comingSoon ? "border-dashed border-line bg-white text-brand-300" : "border-line bg-white text-brand-800")}>
                  {d ? <Check className="h-4 w-4" /> : w.comingSoon ? <Lock className="h-4 w-4" /> : <span className="h-4 text-sm font-semibold leading-4">{w.n}</span>}
                  <span className="text-[10px] font-semibold uppercase tracking-wide">Wk {w.n}</span>
                </div>
              );
            })}
          </div>
          {course.publishedWeeks < c.weeksNeeded && <p className="mt-4 text-sm text-muted">{c.weeksNeeded - course.publishedWeeks} more weeks are being prepared by your trainers. You can already earn milestones for the weeks that are live.</p>}
        </Card>
      </div>

      {show && (
        <div className="mx-auto max-w-4xl print:max-w-none">
          <div className="relative overflow-hidden rounded-sm bg-[#fffdf7] p-3 shadow-[var(--shadow-pop)] print:shadow-none print:break-inside-avoid" style={{ backgroundImage: "radial-gradient(circle at 50% 0%, #fff 0%, #fffdf7 60%, #faf3de 100%)" }}>
            <div className="relative border-[3px] border-double border-[#b9892b] px-6 py-12 text-center sm:px-16">
              {["left-3 top-3", "right-3 top-3 rotate-90", "bottom-3 right-3 rotate-180", "bottom-3 left-3 -rotate-90"].map((p) => (
                <svg key={p} viewBox="0 0 40 40" className={`absolute h-10 w-10 ${p}`} aria-hidden><path d="M2 38V8C2 4 4 2 8 2h30" fill="none" stroke="#b9892b" strokeWidth="2" /><path d="M8 38V14c0-3 3-6 6-6h24" fill="none" stroke="#b9892b" strokeWidth="1" strokeOpacity=".6" /></svg>
              ))}
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8a6416]">{SITE.name}</div>
              <h2 className="mt-5 font-serif text-4xl font-semibold text-brand-900 sm:text-5xl">Certificate of Completion</h2>
              <div className="mx-auto my-6 flex items-center justify-center gap-3 text-[#b9892b]"><span className="h-px w-16 bg-current" /><span aria-hidden>◆</span><span className="h-px w-16 bg-current" /></div>
              <p className="text-muted">This is to certify that</p>
              <p className="my-4 border-b border-[#d9c48a] pb-3 font-serif text-4xl italic text-brand-900 sm:text-5xl">{user.name}</p>
              <p className="mx-auto max-w-xl leading-relaxed text-ink">has successfully completed the <b>{PLAN.name}</b> in spoken English and communication skills, including live classes, daily guided lessons and weekly checkpoints.</p>
              <div className="mt-10 grid grid-cols-3 items-end gap-4 text-sm">
                <div className="border-t border-brand-800 pt-2 text-muted">Date<br /><span className="font-semibold text-brand-900">{date}</span></div>
                <div className="flex justify-center"><Seal /></div>
                <div className="border-t border-brand-800 pt-2 text-muted">Lead Trainer<br /><span className="font-serif text-lg italic text-brand-900">Priya Deshmukh</span></div>
              </div>
              <div className="mt-6 text-xs text-muted">Certificate ID <span className="font-mono font-semibold text-brand-900">{id}</span></div>
              {!c.eligible && <div className="pointer-events-none absolute inset-0 grid place-items-center"><span className="-rotate-12 border-4 border-brand-300/60 px-8 py-2 text-5xl font-extrabold tracking-widest text-brand-300/60">SAMPLE</span></div>}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted print:hidden">Certificate of Completion issued by {SITE.name}. It is not a government or university qualification.</p>
        </div>
      )}
      {dialog && <EnrolDialog userId={user.id} onClose={() => setDialog(false)} />}
    </>
  );
}
