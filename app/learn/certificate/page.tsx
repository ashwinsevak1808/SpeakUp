"use client";
import { useMemo, useState } from "react";
import { Check, Circle, Printer } from "@/components/learn/icons";
import { useAuth } from "@/lib/auth";
import { PLAN } from "@/lib/learn-data";
import { useCourse } from "@/lib/course";
import { certificateStatus, weekDone } from "@/lib/course-core";
import { SITE } from "@/lib/data";
import { Bar, Card, PageTitle } from "@/components/learn/ui";
import { EnrolDialog } from "@/components/learn/EnrolDialog";
import { cn } from "@/lib/utils";

function Req({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      {ok ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />}
      <span className={ok ? "text-ink" : "text-muted"}>{children}</span>
    </li>
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
  const show = (c.eligible && user.enrolled) || preview;
  const id = `YE-${new Date().getFullYear()}-${user.id.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase()}`;

  return (
    <>
      <div className="print:hidden">
        <PageTitle title="Certificate" text="Your Certificate of Completion is for enrolled students who finish the whole course. Logging in alone does not give a certificate." />
        <Card className="mb-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-brand-900">Requirements</h2>
          <ul className="space-y-3 text-[15px]">
            <Req ok={user.enrolled}>Enrol in the {PLAN.name}</Req>
            <Req ok={c.eligible}>Complete all {c.weeksNeeded} weeks, with every lesson and checkpoint ({c.weeksDone}/{c.weeksNeeded} weeks done)</Req>
          </ul>
          <div className="mt-5"><Bar value={(c.weeksDone / c.weeksNeeded) * 100} /></div>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {course.weeks.map((w) => (
              <div key={w.n} className={cn("rounded-md px-3 py-2 text-xs font-semibold", weekDone(course, progress, w.n) ? "bg-green-50 text-ok" : w.comingSoon ? "bg-slate-50 text-slate-400" : "bg-brand-100 text-brand-600")}>Week {w.n}{weekDone(course, progress, w.n) ? " · done" : w.comingSoon ? " · coming soon" : ""}</div>
            ))}
          </div>
          {course.publishedWeeks < c.weeksNeeded && <p className="mt-4 text-sm text-muted">{c.weeksNeeded - course.publishedWeeks} more weeks are being prepared by your trainers. You can already earn milestones for the weeks that are live.</p>}
          {!user.enrolled && <button onClick={() => setDialog(true)} className="mt-5 rounded-lg bg-accent-600 px-5 py-2.5 font-semibold text-white hover:bg-accent-700">Enrol now</button>}
        </Card>
        <div className="mb-6 flex flex-wrap gap-3">
          {c.eligible && user.enrolled
            ? <button onClick={() => window.print()} className="flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-2.5 font-semibold text-white hover:bg-accent-700"><Printer className="h-4 w-4" />Print or save as PDF</button>
            : <button onClick={() => setPreview((p) => !p)} className="rounded-lg border border-accent-600 px-5 py-2.5 font-semibold text-brand-700 hover:bg-brand-50">{preview ? "Hide sample" : "Preview a sample certificate"}</button>}
        </div>
      </div>

      {show && (
        <div className="mx-auto max-w-4xl print:max-w-none">
          <div className="relative border-[3px] border-brand-800 bg-white p-2 print:break-inside-avoid">
            <div className="border border-brand-300 px-6 py-12 text-center sm:px-16">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">{SITE.name}</div>
              <h2 className="mt-6 font-serif text-4xl font-semibold text-brand-900 sm:text-5xl">Certificate of Completion</h2>
              <div className="mx-auto my-6 h-px w-24 bg-brand-800" />
              <p className="text-muted">This is to certify that</p>
              <p className="my-4 font-serif text-4xl italic text-brand-900 sm:text-5xl">{user.name}</p>
              <p className="mx-auto max-w-xl leading-relaxed text-ink">has successfully completed the <b>{PLAN.name}</b> in spoken English and communication skills, including live classes, daily guided lessons and weekly checkpoints.</p>
              <div className="mt-12 grid grid-cols-3 items-end gap-4 text-sm">
                <div><div className="border-t border-brand-800 pt-2 text-muted">Date<br /><span className="font-semibold text-brand-900">{date}</span></div></div>
                <div className="text-xs text-muted">Certificate ID<br /><span className="font-mono text-sm font-semibold text-brand-900">{id}</span></div>
                <div><div className="border-t border-brand-800 pt-2 text-muted">Lead Trainer<br /><span className="font-semibold text-brand-900">Priya Deshmukh</span></div></div>
              </div>
              {!c.eligible && <div className="pointer-events-none absolute inset-0 grid place-items-center"><span className="-rotate-12 border-4 border-brand-300/70 px-8 py-2 font-display text-5xl font-extrabold tracking-widest text-brand-300/70">SAMPLE</span></div>}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted print:hidden">Certificate of Completion issued by {SITE.name}. It is not a government or university qualification.</p>
        </div>
      )}
      {dialog && <EnrolDialog userId={user.id} onClose={() => setDialog(false)} />}
    </>
  );
}
