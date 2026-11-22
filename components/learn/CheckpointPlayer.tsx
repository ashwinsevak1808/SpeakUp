"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Flag, Lock, Star } from "@/components/learn/icons";
import { completeCheckpoint, updateMissed, useAuth } from "@/lib/auth";
import { useCourse } from "@/lib/course";
import { statusOf } from "@/lib/path-state";
import { ItemRunner } from "./ItemRunner";
import { EnrolDialog } from "./EnrolDialog";
import { Button, LinkButton, PageTitle, btn } from "./ui";
import { Gate, nodeHref } from "./LessonPlayer";
import { cn } from "@/lib/utils";
import { opener } from "@/lib/access";

export function CheckpointPlayer({ checkpointId }: { checkpointId: string }) {
  const { user, progress } = useAuth();
  const course = useCourse();
  const cp = course.checkpointById(checkpointId);
  const [phase, setPhase] = useState<"intro" | "run" | "result">("intro");
  const [result, setResult] = useState({ firstTry: 0, total: 0, stars: 0 });
  const [dialog, setDialog] = useState(false);
  if (!user) return null;
  if (!cp || cp.week.comingSoon) return <Gate icon={Lock} title="Checkpoint not found" text="It may have been moved by your trainers." />;

  const idx = course.sequence.findIndex((n) => n.id === cp.id);
  const status = idx < 0 ? "locked" : statusOf(course, course.sequence[idx], progress, opener(user));
  const next = course.sequence[idx + 1];
  const done = progress.done.includes(cp.id);

  if (status === "paywall") return <><Gate icon={Lock} title={cp.title} text={`Week ${cp.week.n} is locked. Unlock it, or get the full plan.`} action={<Button onClick={() => setDialog(true)}>See options</Button>} />{dialog && <EnrolDialog userId={user.id} week={cp.week.n} onClose={() => setDialog(false)} />}</>;
  if (status === "locked") {
    const cur = course.sequence.find((n) => !progress.done.includes(n.id));
    return <Gate icon={Lock} title="Finish this week's lessons first" text={`The checkpoint reviews what you learned in Week ${cp.week.n}.`} action={cur && <LinkButton href={nodeHref(cur)}>Continue where you left off</LinkButton>} />;
  }

  function finish(r: { firstTry: number; total: number; missed: string[] }) {
    updateMissed(user!.id, r.missed, cp!.items.map((i) => i.id).filter((id) => !r.missed.includes(id)));
    const pct = r.firstTry / r.total;
    const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : 1;
    completeCheckpoint(user!.id, cp!.id, stars);
    setResult({ ...r, stars }); setPhase("result");
  }

  return (
    <div className="nx-page">
      <PageTitle eyebrow={`Week ${cp.week.n} checkpoint · ${cp.items.length} exercises · about 8 minutes`} title={cp.title} text="A relaxed review of the week. Wrong answers are explained, and you try again.">
        <LinkButton href="/learn/path" variant="tertiary" icon={ArrowLeft}>My path</LinkButton>
      </PageTitle>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section aria-label="Checkpoint" className="nx-card min-w-0 px-5 py-6 sm:px-7 sm:py-7">
          {phase === "intro" && (
            <div className="py-4 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]"><Flag className="h-7 w-7" /></span>
              <h2 className="mt-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">Let&apos;s look back at your week</h2>
              <p className="ty-body ty-muted mx-auto mt-2 max-w-lg">You cannot fail: if something is wrong, we explain it and you try again. At the end you earn up to 3 stars for how many you got right first time.</p>
              {done && <p className="ty-note ty-subtle mt-2">You have already completed this, so practise again freely.</p>}
              <button onClick={() => setPhase("run")} className={btn("primary", "lg", "mt-6")}>Start checkpoint <ArrowRight className="h-4 w-4" /></button>
            </div>
          )}
          {phase === "run" && <ItemRunner items={cp.items} finishLabel="See my stars" onFinish={finish} />}
          {phase === "result" && (
            <div className="py-2 text-center">
              <div className="mb-3 flex justify-center gap-2" aria-label={`${result.stars} of 3 stars`}>
                {[1, 2, 3].map((n) => <span key={n} className={cn("grid size-12 place-items-center rounded-full", n <= result.stars ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-sunken)] text-[var(--border-strong)]")}><Star className="h-6 w-6" /></span>)}
              </div>
              <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">Checkpoint complete</h2>
              <p className="ty-subject ty-accent mt-1">{result.firstTry} of {result.total} right first time</p>
              <p className="ty-body ty-muted mx-auto mt-2 max-w-md">{result.stars === 3 ? "Excellent. You really know this week." : result.stars === 2 ? "Very good. A quick look back at the lessons will make it even stronger." : "Good effort. Revisit this week's lessons any time; repetition is how it sticks."}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                {next && <LinkButton href={nodeHref(next)} size="lg">{next.kind === "lesson" ? `Next: ${next.lesson.title}` : `Next: ${next.title}`}<ArrowRight className="h-4 w-4" /></LinkButton>}
                <LinkButton href="/learn/path" variant="secondary" size="lg">Back to my path</LinkButton>
              </div>
            </div>
          )}
        </section>
        <aside aria-label="About this checkpoint" className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-20">
          <section className="nx-card p-5">
            <div className="ty-subject ty-ink">How stars work</div>
            <dl className="nx-facts mt-2">
              <div><dt>3 stars</dt><dd>9 in 10 first time</dd></div>
              <div><dt>2 stars</dt><dd>7 in 10 first time</dd></div>
              <div><dt>1 star</dt><dd>Finish the round</dd></div>
              <div><dt>Your best</dt><dd>{progress.stars[cp.id] ? `${progress.stars[cp.id]} stars` : "Not yet"}</dd></div>
            </dl>
          </section>
          <section className="nx-card p-5">
            <div className="ty-subject ty-ink">Covers Week {cp.week.n}</div>
            <ul className="mt-2 space-y-1.5">{cp.week.lessons.map((l) => <li key={l.id} className="ty-body ty-secondary flex gap-2"><span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--accent)]" />{l.title}</li>)}</ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
