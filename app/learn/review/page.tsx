"use client";
/** Personal review: the exercises this student missed first time, repeated until they stick. */
import { useMemo, useState } from "react";
import { ArrowRight, Check, RotateCcw } from "@/components/learn/icons";
import { updateMissed, useAuth } from "@/lib/auth";
import { useCourse } from "@/lib/course";
import type { Item } from "@/lib/path-data";
import { EmptyState, LinkButton, PageTitle, btn } from "@/components/learn/ui";
import { ItemRunner } from "@/components/learn/ItemRunner";

const KIND: Record<Item["t"], string> = { choose: "Pick the answer", type: "Fill the gap", order: "Build the sentence", say: "Say it aloud" };

export default function ReviewPage() {
  const { user, progress } = useAuth();
  const course = useCourse();
  const [phase, setPhase] = useState<"intro" | "run" | "done">("intro");
  const [left, setLeft] = useState(0);
  const items = useMemo(() => progress.missed.map((id) => course.itemById(id)).filter((i): i is Item => !!i).slice(0, 10), [progress.missed, course]);
  const [frozen, setFrozen] = useState<Item[]>([]);
  if (!user) return null;
  const byKind = items.reduce<Record<string, number>>((m, i) => { m[KIND[i.t]] = (m[KIND[i.t]] || 0) + 1; return m; }, {});

  return (
    <div className="nx-page">
      <PageTitle eyebrow={progress.missed.length ? `${progress.missed.length} on your list` : "Your list is empty"} title="Review" text="The exercises you found tricky come back here, so they become easy. Everyone has some." />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section aria-label="Review" className="nx-card min-w-0 px-5 py-6 sm:px-7 sm:py-7">
          {phase === "intro" && (items.length === 0 ? (
            <EmptyState icon={Check} title="Nothing to review" text="As you do lessons, any exercise you miss first time will appear here for a quick revisit." action={<LinkButton href="/learn/path">Continue my path <ArrowRight className="h-4 w-4" /></LinkButton>} />
          ) : (
            <div className="py-6 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]"><RotateCcw className="h-7 w-7" /></span>
              <h2 className="mt-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">{progress.missed.length} to revisit</h2>
              <p className="ty-body ty-muted mx-auto mt-2 max-w-md">A short round of {items.length}. Get them right and they leave your list.</p>
              <button onClick={() => { setFrozen(items); setPhase("run"); }} className={btn("primary", "lg", "mt-6")}>Start review <ArrowRight className="h-4 w-4" /></button>
            </div>
          ))}
          {phase === "run" && <ItemRunner items={frozen} finishLabel="Finish review" onFinish={(r) => { const mastered = frozen.map((i) => i.id).filter((id) => !r.missed.includes(id)); updateMissed(user.id, [], mastered); setLeft(r.missed.length); setPhase("done"); }} />}
          {phase === "done" && (
            <EmptyState icon={Check} title="Review complete" text={left === 0 ? "You got them all. Those are now off your list." : `${left} still need a little more practice. They stay on your list for next time.`} action={<LinkButton href="/learn">Back to dashboard</LinkButton>} />
          )}
        </section>

        <aside aria-label="How review works" className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-20">
          {items.length > 0 && (
            <section className="nx-card p-5">
              <div className="ty-subject ty-ink">On your list</div>
              <dl className="nx-facts mt-2">{Object.entries(byKind).map(([k, n]) => <div key={k}><dt>{k}</dt><dd>{n}</dd></div>)}</dl>
            </section>
          )}
          <section className="nx-card p-5">
            <div className="ty-subject ty-ink">How review works</div>
            <ol className="mt-3 space-y-3">
              {[["You miss one", "Any exercise you get wrong in a lesson is saved here."], ["Try it again", "A short round of up to 10, whenever you like."], ["It sticks", "Get it right and it leaves your list for good."]].map(([t, d], n) => (
                <li key={t} className="flex gap-3"><span className="ty-label ty-mono grid size-6 shrink-0 place-items-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent-text)]">{n + 1}</span><span><span className="ty-body ty-500 ty-ink block">{t}</span><span className="ty-note ty-muted block">{d}</span></span></li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}
