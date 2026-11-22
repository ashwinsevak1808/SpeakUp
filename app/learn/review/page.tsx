"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, RotateCcw } from "@/components/learn/icons";
import { updateMissed, useAuth } from "@/lib/auth";
import { useCourse } from "@/lib/course";
import type { Item } from "@/lib/path-data";
import { Card, PageTitle } from "@/components/learn/ui";
import { ItemRunner } from "@/components/learn/ItemRunner";

/** Personal review: the exercises this student missed first time, repeated until they stick. */
export default function ReviewPage() {
  const { user, progress } = useAuth();
  const course = useCourse();
  const [phase, setPhase] = useState<"intro" | "run" | "done">("intro");
  const [left, setLeft] = useState(0);
  const items = useMemo(() => progress.missed.map((id) => course.itemById(id)).filter((i): i is Item => !!i).slice(0, 10), [progress.missed, course]);
  const [frozen, setFrozen] = useState<Item[]>([]);
  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title="Review" text="The exercises you found tricky come back here, so they become easy. Everyone has some." />
      <Card className="!p-6 sm:!p-8">
        {phase === "intro" && (items.length === 0 ? (
          <div className="py-6 text-center"><div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-green-50 text-ok ring-8 ring-green-50/60"><Check className="h-8 w-8" /></div><h2 className="ty-title">Nothing to review</h2><p className="ty-body ty-muted mx-auto mt-2 max-w-sm">As you do lessons, any exercise you miss first time will appear here for a quick revisit.</p><Link href="/learn/path" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent-600 px-6 py-3 font-semibold text-white hover:bg-accent-700">Continue my path <ArrowRight className="h-4 w-4" /></Link></div>
        ) : (
          <div className="py-2 text-center"><div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-accent-50 text-accent-700 ring-8 ring-accent-50/60"><RotateCcw className="h-8 w-8" /></div><h2 className="ty-title">{progress.missed.length} to revisit</h2><p className="ty-body ty-muted mx-auto mt-2 max-w-md">A short round of {items.length}. Get them right and they leave your list.</p><button onClick={() => { setFrozen(items); setPhase("run"); }} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent-600 px-7 py-3 font-semibold text-white hover:bg-accent-700">Start review <ArrowRight className="h-4 w-4" /></button></div>
        ))}
        {phase === "run" && <ItemRunner items={frozen} finishLabel="Finish review" onFinish={(r) => { const mastered = frozen.map((i) => i.id).filter((id) => !r.missed.includes(id)); updateMissed(user.id, [], mastered); setLeft(r.missed.length); setPhase("done"); }} />}
        {phase === "done" && (
          <div className="py-4 text-center"><div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-green-50 text-ok"><Check className="h-7 w-7" /></div><h2 className="font-display text-2xl font-semibold text-brand-900">Review complete</h2><p className="mt-2 text-muted">{left === 0 ? "You got them all. Those are now off your list." : `${left} still need a little more practice. They stay on your list for next time.`}</p><Link href="/learn" className="mt-5 inline-flex rounded-lg bg-accent-600 px-7 py-3 font-semibold text-white hover:bg-accent-700">Back to dashboard</Link></div>
        )}
      </Card>
      {phase === "intro" && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[["1", "You miss one", "Any exercise you get wrong in a lesson is saved here."], ["2", "Try it again", "A short round of up to 10, whenever you like."], ["3", "It sticks", "Get it right and it leaves your list for good."]].map(([n, t, d]) => (
            <div key={n} className="rounded-[var(--radius-xl)] bg-white p-4 shadow-[var(--shadow-card)]"><span className="grid h-7 w-7 place-items-center rounded-full bg-accent-50 text-sm font-semibold text-accent-700">{n}</span><div className="ty-subject ty-ink mt-3">{t}</div><div className="ty-note ty-muted mt-0.5">{d}</div></div>
          ))}
        </div>
      )}
    </div>
  );
}
