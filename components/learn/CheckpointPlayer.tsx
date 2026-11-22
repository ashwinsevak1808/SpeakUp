"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Flag, Lock, Star } from "@/components/learn/icons";
import { completeCheckpoint, updateMissed, useAuth } from "@/lib/auth";
import { useCourse } from "@/lib/course";
import { statusOf } from "@/lib/path-state";
import { ItemRunner } from "./ItemRunner";
import { EnrolDialog } from "./EnrolDialog";
import { Card } from "./ui";
import { nodeHref } from "./LessonPlayer";
import { cn } from "@/lib/utils";

export function CheckpointPlayer({ checkpointId }: { checkpointId: string }) {
  const { user, progress } = useAuth();
  const course = useCourse();
  const cp = course.checkpointById(checkpointId);
  const [phase, setPhase] = useState<"intro" | "run" | "result">("intro");
  const [result, setResult] = useState({ firstTry: 0, total: 0, stars: 0 });
  const [dialog, setDialog] = useState(false);
  if (!user) return null;
  if (!cp || cp.week.comingSoon) return <Card className="mx-auto max-w-xl text-center"><h1 className="font-display text-2xl font-semibold text-brand-900">Checkpoint not found</h1><Link href="/learn/path" className="mt-4 inline-block rounded-lg bg-accent-600 px-6 py-3 font-semibold text-white">Back to my path</Link></Card>;

  const idx = course.sequence.findIndex((n) => n.id === cp.id);
  const status = idx < 0 ? "locked" : statusOf(course, course.sequence[idx], progress, user.enrolled);
  const next = course.sequence[idx + 1];
  const done = progress.done.includes(cp.id);

  if (status === "paywall") {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <Lock className="mx-auto mb-3 h-8 w-8 text-brand-600" />
        <h1 className="font-display text-2xl font-semibold text-brand-900">{cp.title}</h1>
        <p className="my-3 text-muted">Enrol to continue the full path.</p>
        <button onClick={() => setDialog(true)} className="rounded-lg bg-accent-600 px-6 py-3 font-semibold text-white hover:bg-accent-700">Enrol now</button>
        {dialog && <EnrolDialog userId={user.id} onClose={() => setDialog(false)} />}
      </Card>
    );
  }
  if (status === "locked") {
    const cur = course.sequence.find((n) => !progress.done.includes(n.id));
    return (
      <Card className="mx-auto max-w-xl text-center">
        <Lock className="mx-auto mb-3 h-8 w-8 text-slate-400" />
        <h1 className="font-display text-2xl font-semibold text-brand-900">Finish this week&apos;s lessons first</h1>
        <p className="my-3 text-muted">The checkpoint reviews what you learned in Week {cp.week.n}.</p>
        {cur && <Link href={nodeHref(cur)} className="inline-block rounded-lg bg-accent-600 px-6 py-3 font-semibold text-white hover:bg-accent-700">Continue where you left off</Link>}
      </Card>
    );
  }

  function finish(r: { firstTry: number; total: number; missed: string[] }) {
    updateMissed(user!.id, r.missed, cp!.items.map((i) => i.id).filter((id) => !r.missed.includes(id)));
    const pct = r.firstTry / r.total;
    const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : 1;
    completeCheckpoint(user!.id, cp!.id, stars);
    setResult({ ...r, stars }); setPhase("result");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/learn/path" className="text-sm text-muted hover:text-brand-800">← My path</Link>
      <Card className="mt-4 !p-6 sm:!p-8">
        {phase === "intro" && (
          <div className="text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-brand-100 text-brand-700"><Flag className="h-8 w-8" /></div>
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">Week {cp.week.n} checkpoint</div>
            <h1 className="mt-1 font-display text-3xl font-semibold text-brand-900">Let&apos;s look back at your week</h1>
            <p className="mx-auto mt-3 max-w-lg text-muted">A relaxed review of what you learned. You cannot fail: if something is wrong, we explain it and you try again. At the end you earn up to 3 stars for how many you got right first time.</p>
            <p className="mt-2 text-sm text-muted">{cp.items.length} short exercises · about 8 minutes{done ? " · you have already completed this, so practise again freely" : ""}</p>
            <button onClick={() => setPhase("run")} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent-600 px-8 py-3 font-semibold text-white hover:bg-accent-700">Start checkpoint <ArrowRight className="h-4 w-4" /></button>
          </div>
        )}
        {phase === "run" && <ItemRunner items={cp.items} finishLabel="See my stars" onFinish={finish} />}
        {phase === "result" && (
          <div className="text-center">
            <div className="mb-3 flex justify-center gap-2" aria-label={`${result.stars} of 3 stars`}>
              {[1, 2, 3].map((n) => <Star key={n} className={cn("h-12 w-12", n <= result.stars ? "fill-brand-700 text-brand-700" : "text-slate-300")} />)}
            </div>
            <h1 className="font-display text-3xl font-semibold text-brand-900">Checkpoint complete</h1>
            <p className="mt-1 font-semibold text-brand-700">{result.firstTry} of {result.total} right first time</p>
            <p className="mx-auto mt-3 max-w-md text-muted">{result.stars === 3 ? "Excellent. You really know this week." : result.stars === 2 ? "Very good. A quick look back at the lessons will make it even stronger." : "Good effort. Revisit this week's lessons any time; repetition is how it sticks."}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {next && <Link href={nodeHref(next)} className="flex items-center gap-2 rounded-lg bg-accent-600 px-7 py-3 font-semibold text-white hover:bg-accent-700">{next.kind === "lesson" ? `Next: ${next.lesson.title}` : `Next: ${next.title}`}<ArrowRight className="h-4 w-4" /></Link>}
              <Link href="/learn/path" className="rounded-lg border border-line px-6 py-3 font-semibold text-brand-800 hover:bg-brand-50">Back to my path</Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
