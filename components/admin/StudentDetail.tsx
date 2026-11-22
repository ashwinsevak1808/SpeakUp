"use client";
/** One student, everything about them: account, enrolment, progress by week, mistakes, bookings, notes. */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, Check, Flame, Grad, Mic, Star, Trash2, UserRound } from "@/components/learn/icons";
import { Avatar } from "@/components/learn/Avatar";
import { Badge, EmptyState, PageTitle, Panel, Ring, btn } from "@/components/learn/ui";
import { useAuth } from "@/lib/auth";
import { buildCourse, GOAL_LABEL } from "@/lib/course-core";
import { useFullCourse } from "@/lib/course";
import { PLAN } from "@/lib/learn-data";
import { fmtDate, fmtTime } from "@/lib/live";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useNow } from "@/lib/use-live";
import { ReqActions, StatusBadge, input, itemText } from "./bits";
import { ago, fmtDay, fmtDayTime, useAdmin, waLink } from "./data";

type Note = { id: number; body: string; author_name: string; author_id: string | null; created_at: string };
type Payment = { id: string; purpose: string; amount: number; status: string; payment_id: string | null; created_at: string; paid_at: string | null };
type Cert = { id: string; issued_at: string; revoked: boolean };
type Booking = { session_id: string; booked_at: string; sessions: { title: string; trainer: string; start_at: string; minutes: number } | null };

export function StudentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { people, requests, loaded, reload } = useAdmin();
  const { user: me } = useAuth();
  const router = useRouter();
  const { weeks } = useFullCourse();
  const s = people.find((p) => p.id === id);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [photo, setPhoto] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [cert, setCert] = useState<Cert | null>(null);
  const [tick, setTick] = useState(0);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const now = +useNow(60000);

  useEffect(() => {
    let alive = true;
    const sb = supabase();
    Promise.all([
      sb.from("staff_notes").select("id, body, author_name, author_id, created_at").eq("student_id", id).order("created_at", { ascending: false }),
      sb.from("bookings").select("session_id, booked_at, sessions(title, trainer, start_at, minutes)").eq("user_id", id),
      sb.from("student_data").select("photo:settings->>photo").eq("user_id", id).maybeSingle<{ photo: string | null }>(),
      sb.from("payments").select("id, purpose, amount, status, payment_id, created_at, paid_at").eq("user_id", id).neq("status", "created").order("created_at", { ascending: false }),
      sb.from("certificates").select("id, issued_at, revoked").eq("user_id", id).maybeSingle<Cert>(),
    ]).then(([n, b, p, pay, c]) => {
      if (!alive) return;
      setPayments((pay.data as Payment[]) ?? []); setCert(c.data ?? null);
      setNotes((n.data as Note[]) ?? []);
      setBookings(((b.data as unknown as Booking[]) ?? []).sort((x, y) => (y.sessions?.start_at ?? "").localeCompare(x.sessions?.start_at ?? "")));
      setPhoto(p.data?.photo ?? "");
    });
    return () => { alive = false; };
  }, [id, tick]);

  const course = useMemo(() => buildCourse(weeks, s?.level ?? "beginner"), [weeks, s?.level]);
  const refresh = useCallback(() => { reload(); setTick((n) => n + 1); }, [reload]);

  if (!loaded) return <div className="h-64 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-sunken)]" />;
  if (!s) return <div className="nx-card"><EmptyState icon={UserRound} title="Student not found" text="They may have deleted their account." action={<Link href="/admin/students" className={btn("primary", "md")}>Back to students</Link>} /></div>;

  const reqs = requests.filter((r) => r.user_id === s.id);
  const pending = reqs.find((r) => r.status === "pending");
  const inSeq = new Set(course.sequence.map((n) => n.id));
  const current = course.sequence.find((n) => !s.progress.done.includes(n.id))?.id;
  const missed = s.progress.missed.map((m) => ({ id: m, item: course.itemById(m) })).filter((x) => x.item);
  const days30 = s.progress.days.filter((d) => +new Date(d) > now - 30 * 86400000).length;
  const isOwner = me?.role === "owner";
  const self = me?.id === s.id;

  async function update(patch: Record<string, unknown>, ok: string) {
    setErr(""); setMsg("");
    const { error } = await supabase().from("profiles").update(patch).eq("id", s!.id);
    if (error) setErr(error.message); else { setMsg(ok); refresh(); }
  }
  async function issueCert() {
    setErr(""); setMsg("");
    const { data, error } = await supabase().rpc("issue_certificate", { p_user: s!.id });
    if (error) setErr(error.message); else { setMsg(`Certificate ${data} issued.`); refresh(); }
  }
  async function revokeCert() {
    if (!cert || !confirm(`Withdraw certificate ${cert.id}? Anyone checking it will see it is no longer valid.`)) return;
    const { error } = await supabase().from("certificates").update({ revoked: true }).eq("id", cert.id);
    if (error) setErr(error.message); else { setMsg("Certificate withdrawn."); refresh(); }
  }
  async function deleteAccount() {
    const typed = prompt(`This permanently deletes ${s!.name}'s account, progress, bookings and notes. It cannot be undone.\n\nType DELETE to confirm.`);
    if (typed !== "DELETE") return;
    const { data, error } = await supabase().rpc("delete_account", { p_user: s!.id });
    if (error || data !== "ok") { setErr(error?.message ?? ({ forbidden: "Only the owner can delete accounts.", owner: "Owners cannot be deleted. Make them a trainer first.", self: "You cannot delete your own account here." } as Record<string, string>)[data as string] ?? "Could not delete."); return; }
    reload(); router.push("/admin/students");
  }
  async function setRole(role: "student" | "trainer" | "owner") {
    if (!confirm(`Change ${s!.name} to ${role}?`)) return;
    const { data, error } = await supabase().rpc("set_staff_role", { p_email: s!.email, p_role: role });
    if (error || data === "forbidden") setErr(error?.message ?? "Only the owner can change roles."); else { setMsg(`${s!.name} is now ${role === "student" ? "a student" : `a ${role}`}.`); refresh(); }
  }

  return (
    <div className="nx-page">
      <Link href="/admin/students" className="ty-note ty-muted mb-3 inline-flex items-center gap-1 hover:text-[var(--text-primary)]"><ArrowLeft className="h-3.5 w-3.5" />All students</Link>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Avatar name={s.name} photo={photo} avatar={s.avatar} size={56} />
        <div className="min-w-0 flex-1">
          <PageTitle title={s.name} eyebrow={<span className="flex flex-wrap items-center gap-2"><StatusBadge status={s.status} />{s.role !== "student" && <Badge tone="accent">{s.role === "owner" ? "Owner" : "Trainer"}</Badge>}<span>Joined {fmtDay(s.createdAt)}</span></span>} text={`${s.email}${s.phone ? ` · ${s.phone}` : ""}`}>
            <a href={`mailto:${s.email}`} className={btn("secondary", "md")}>Email</a>
            {s.phone && <a href={waLink(s.phone, `Hi ${s.name.split(" ")[0]}, this is SpeakUp.`)} target="_blank" rel="noopener" className={btn("secondary", "md")}>WhatsApp</a>}
            {s.role === "student" && (s.enrolled
              ? <button onClick={() => confirm(`Remove ${s.name}'s enrolment? They go back to the free preview.`) && update({ enrolled: false }, "Enrolment removed.")} className={btn("ghost", "md")}>Remove enrolment</button>
              : <button onClick={() => update({ enrolled: true, plan: s.plan ?? PLAN.name }, `${s.name} is enrolled.`)} className={btn("primary", "md")}><Check className="h-4 w-4" />Enrol now</button>)}
          </PageTitle>
        </div>
      </div>
      {(msg || err) && <p role={err ? "alert" : "status"} className={cn("nx-card mb-6 p-4 text-sm font-medium", err ? "text-[var(--danger)]" : "text-[var(--accent-text)]")}>{err || msg}</p>}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          {pending && (
            <section className="nx-glass flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1"><span className="ty-label ty-caps ty-accent">Enrolment requested</span><div className="ty-subject ty-ink mt-1">{pending.plan} · ₹{(pending.amount ?? 0).toLocaleString("en-IN")}</div><div className="ty-note ty-muted">{ago(pending.created_at)}{pending.student_note ? ` · “${pending.student_note}”` : ""}</div></div>
              <div className="shrink-0 [&>span]:justify-start sm:[&>span]:justify-end"><ReqActions req={pending} onDone={refresh} /></div>
            </section>
          )}

          <Panel title="Progress by week" desc={`${s.level === "intermediate" ? "Intermediate path (beginner-only lessons skipped)" : "Beginner path"} · ${s.done} of ${s.total} done`}>
            <ol className="space-y-2.5">
              {course.weeks.filter((w) => !w.comingSoon).map((w) => {
                const cp = s.progress.stars[w.checkpoint.id];
                return (
                  <li key={w.n} className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
                    <div className="min-w-0"><div className="ty-label ty-caps ty-subtle">Week {w.n}</div><div className="ty-note ty-muted hidden truncate sm:block">{w.title}</div></div>
                    <div className="flex flex-wrap gap-1.5">
                      {w.lessons.map((l) => {
                        const done = s.progress.done.includes(l.id); const skip = !inSeq.has(l.id);
                        return <span key={l.id} title={`Day ${l.day}: ${l.title}${skip ? " (skipped for this level)" : done ? " (done)" : ""}`} className={cn("ty-label ty-mono grid h-7 min-w-9 place-items-center rounded-md px-1.5",
                          done ? "bg-[var(--accent)] text-white" : l.id === current ? "bg-white text-[var(--accent-text)] shadow-[inset_0_0_0_1.5px_var(--accent)]" : skip ? "text-[var(--text-subtle)] shadow-[inset_0_0_0_1px_var(--border)] [background:repeating-linear-gradient(135deg,#fff_0_4px,var(--surface-sunken)_4px_6px)]" : "bg-[var(--surface-sunken)] text-[var(--text-muted)]")}>{l.day}</span>;
                      })}
                      <span title={`${w.checkpoint.title}${cp ? `: ${cp} of 3 stars` : ""}`} className={cn("ty-label grid h-7 place-items-center rounded-md px-2", s.progress.done.includes(w.checkpoint.id) ? "bg-[var(--accent-subtle)] text-[var(--accent-text)]" : w.checkpoint.id === current ? "shadow-[inset_0_0_0_1.5px_var(--accent)] text-[var(--accent-text)]" : "bg-[var(--surface-sunken)] text-[var(--text-subtle)]")}>
                        {cp ? <span className="flex items-center gap-0.5">{[1, 2, 3].map((n) => <Star key={n} className={cn("h-3 w-3", n <= cp ? "text-[var(--accent)]" : "text-[var(--border-strong)]")} />)}</span> : "Check"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="ty-note ty-muted mt-4 flex flex-wrap gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-[var(--accent)]" />Done</span>
              <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm shadow-[inset_0_0_0_1.5px_var(--accent)]" />Up next</span>
              <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-[var(--surface-sunken)]" />Not yet</span>
              <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm shadow-[inset_0_0_0_1px_var(--border)] [background:repeating-linear-gradient(135deg,#fff_0_2px,var(--surface-sunken)_2px_4px)]" />Skipped for level</span>
            </div>
          </Panel>

          <Panel title="Struggling with" desc="Exercises they got wrong first time and have not fixed yet in Review" bodyClass="!p-0">
            {missed.length === 0 ? <EmptyState compact icon={Check} title="Nothing to fix" text="No missed exercises waiting in Review." /> : (
              <ul>{missed.slice(0, 12).map(({ id: mid, item }) => {
                const lesson = course.allLessons.find((l) => l.practice.some((p) => p.id === mid));
                return <li key={mid} className="flex gap-3 border-t border-[var(--border)] px-5 py-3 first:border-t-0"><span className="ty-label ty-mono ty-subtle w-14 shrink-0 pt-0.5">{lesson ? `Day ${lesson.day}` : mid}</span><span className="min-w-0"><span className="ty-body ty-ink block">{itemText(item)}</span>{lesson && <span className="ty-note ty-muted">{lesson.title}</span>}</span></li>;
              })}</ul>
            )}
            {missed.length > 12 && <p className="ty-note ty-muted border-t border-[var(--border)] px-5 py-3">and {missed.length - 12} more</p>}
          </Panel>

          <Notes studentId={s.id} notes={notes} onChange={() => setTick((n) => n + 1)} />

          <Panel title="Private sessions" desc={`${bookings.length} booked`} bodyClass="!p-0">
            {bookings.length === 0 ? <EmptyState compact icon={Mic} title="No private sessions" text="Bookings this student makes appear here." /> : (
              <ul>{bookings.map((b) => b.sessions && (
                <li key={b.session_id} className="flex items-center gap-3 border-t border-[var(--border)] px-5 py-3 first:border-t-0">
                  <div className="ty-mono w-28 shrink-0 text-[13px] font-semibold text-[var(--text-primary)]">{fmtDate(b.sessions.start_at)}<div className="ty-note ty-muted font-normal">{fmtTime(b.sessions.start_at)}</div></div>
                  <div className="min-w-0 flex-1"><div className="ty-body ty-ink truncate">{b.sessions.title}</div><div className="ty-note ty-muted">With {b.sessions.trainer} · booked {ago(b.booked_at)}</div></div>
                  {+new Date(b.sessions.start_at) < now && <Badge>Past</Badge>}
                </li>
              ))}</ul>
            )}
          </Panel>

          <Panel title="Payments" desc={payments.length ? `₹${payments.filter((p) => p.status === "paid").reduce((n, p) => n + p.amount, 0).toLocaleString("en-IN")} paid online` : "Online payments by this student"} bodyClass="!p-0">
            {payments.length === 0 ? <EmptyState compact icon={Check} title="No online payments" text="Payments made through Razorpay appear here. Offline (UPI) payments are approved in Enrolments." /> : (
              <ul>{payments.map((p) => (
                <li key={p.id} className="flex items-center gap-3 border-t border-[var(--border)] px-5 py-3 first:border-t-0">
                  <div className="min-w-0 flex-1"><div className="ty-body ty-ink">{p.purpose === "enrol" ? "Course fee" : "Private session"}</div><div className="ty-note ty-muted">{fmtDayTime(p.paid_at ?? p.created_at)}{p.payment_id ? ` · ${p.payment_id}` : ""}</div></div>
                  <span className="ty-mono ty-body ty-ink">₹{p.amount.toLocaleString("en-IN")}</span>
                  <Badge tone={p.status === "paid" ? "accent" : p.status === "refund_needed" ? "danger" : "neutral"}>{p.status === "refund_needed" ? "Refund needed" : p.status}</Badge>
                </li>
              ))}</ul>
            )}
          </Panel>
        </div>

        <aside aria-label="Summary" className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-20">
          <section className="nx-card p-5">
            <div className="flex items-center gap-4">
              <Ring value={s.pct} size={76} stroke={7}><div className="ty-mono text-[15px] font-semibold text-[var(--text-primary)]">{s.pct}%</div></Ring>
              <div><div className="ty-subject ty-ink">Week {s.week} of {course.totalWeeks}</div><div className="ty-note ty-muted">{s.done} of {s.total} steps done</div></div>
            </div>
            <dl className="nx-facts mt-4">
              <div><dt>Streak</dt><dd className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-[var(--accent)]" />{s.streak} days</dd></div>
              <div><dt>Days studied (30 days)</dt><dd>{days30}</dd></div>
              <div><dt>Points</dt><dd>{s.xp}</dd></div>
              <div><dt>Review list</dt><dd>{s.progress.missed.length}</dd></div>
              <div><dt>Library chapters read</dt><dd>{s.progress.read.length}</dd></div>
              <div><dt>Last active</dt><dd>{ago(s.lastActive)}</dd></div>
            </dl>
          </section>

          <Details s={s} onSave={update} />

          <section className="nx-card p-5">
            <div className="ty-subject ty-ink">Learning</div>
            <dl className="nx-facts mt-2">
              <div><dt>Level</dt><dd className="capitalize">{s.level}</dd></div>
              <div><dt>Goal</dt><dd>{GOAL_LABEL[s.goal]}</dd></div>
              <div><dt>Plan</dt><dd>{s.enrolled ? s.plan ?? PLAN.name : "Free preview"}</dd></div>
              {s.enrolledAt && <div><dt>Enrolled on</dt><dd>{fmtDay(s.enrolledAt)}</dd></div>}
              {s.planUntil && <div><dt>Plan until</dt><dd>{fmtDay(s.planUntil)}</dd></div>}
            </dl>
          </section>

          {reqs.length > 0 && (
            <section className="nx-card p-5">
              <div className="ty-subject ty-ink">Enrolment history</div>
              <ul className="mt-3 space-y-2.5">{reqs.map((r) => <li key={r.id} className="flex items-center justify-between gap-2"><span className="ty-note ty-muted">{fmtDayTime(r.created_at)}</span><Badge tone={r.status === "approved" ? "accent" : "neutral"}>{r.status}</Badge></li>)}</ul>
            </section>
          )}

          <section className="nx-card p-5">
            <div className="ty-subject ty-ink">Certificate</div>
            {cert && !cert.revoked ? (
              <>
                <dl className="nx-facts mt-2"><div><dt>ID</dt><dd className="ty-mono"><a href={`/verify?id=${cert.id}`} target="_blank" rel="noopener" className="hover:text-[var(--accent-text)]">{cert.id}</a></dd></div><div><dt>Issued</dt><dd>{fmtDay(cert.issued_at)}</dd></div></dl>
                <button onClick={revokeCert} className={btn("ghost", "sm", "mt-3")}>Withdraw certificate</button>
              </>
            ) : (
              <>
                <p className="ty-note ty-muted mt-0.5">{cert?.revoked ? "The last certificate was withdrawn." : s.pct === 100 ? "Finished the course. The certificate is issued when they open the Certificate page, or issue it now." : "Issued automatically when an enrolled student finishes all 12 weeks."}</p>
                <button onClick={issueCert} className={btn(s.pct === 100 ? "primary" : "secondary", "sm", "mt-3")}>Issue certificate now</button>
              </>
            )}
          </section>

          {isOwner && !self && (
            <section className="nx-card p-5">
              <div className="ty-subject ty-ink">Role</div>
              <p className="ty-note ty-muted mt-0.5">Trainers can open this admin panel. Only you can change roles.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["student", "trainer", "owner"] as const).map((r) => <button key={r} disabled={s.role === r} onClick={() => setRole(r)} className={btn(s.role === r ? "primary" : "secondary", "sm", "capitalize")}>{r}</button>)}
              </div>
            </section>
          )}
          {isOwner && !self && s.role !== "owner" && (
            <section className="nx-card p-5">
              <div className="ty-subject ty-ink">Delete account</div>
              <p className="ty-note ty-muted mt-0.5">Permanently removes the login, progress, bookings and notes. Payment records are removed too, so export Payments first if you need them.</p>
              <button onClick={deleteAccount} className={btn("ghost", "sm", "mt-3 !text-[var(--danger)]")}>Delete this account</button>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function Details({ s, onSave }: { s: { id: string; name: string; phone: string | null; email: string }; onSave: (patch: Record<string, unknown>, ok: string) => Promise<void> }) {
  const [edit, setEdit] = useState(false);
  const [v, setV] = useState({ name: s.name, phone: s.phone ?? "" });
  async function save(e: FormEvent) {
    e.preventDefault();
    if (v.name.trim().length < 2) return;
    await onSave({ name: v.name.trim(), phone: v.phone.trim() || null }, "Details saved."); setEdit(false);
  }
  return (
    <section className="nx-card p-5">
      <div className="flex items-center justify-between"><div className="ty-subject ty-ink">Contact</div><button onClick={() => { setV({ name: s.name, phone: s.phone ?? "" }); setEdit((x) => !x); }} className={btn("ghost", "sm")}>{edit ? "Cancel" : "Edit"}</button></div>
      {edit ? (
        <form onSubmit={save} className="mt-3 space-y-2.5">
          <label className="block"><span className="ty-label ty-subtle mb-1 block">Name</span><input value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} className={input} /></label>
          <label className="block"><span className="ty-label ty-subtle mb-1 block">Phone (for WhatsApp)</span><input value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} placeholder="98765 43210" className={input} /></label>
          <button className={btn("primary", "sm", "w-full")}>Save</button>
        </form>
      ) : (
        <dl className="nx-facts mt-2">
          <div><dt>Email</dt><dd className="truncate">{s.email}</dd></div>
          <div><dt>Phone</dt><dd>{s.phone ?? <span className="text-[var(--text-subtle)]">Not added</span>}</dd></div>
        </dl>
      )}
    </section>
  );
}

function Notes({ studentId, notes, onChange }: { studentId: string; notes: Note[]; onChange: () => void }) {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function add(e: FormEvent) {
    e.preventDefault(); if (!body.trim() || !user) return;
    setBusy(true); setErr("");
    const { error } = await supabase().from("staff_notes").insert({ student_id: studentId, author_id: user.id, author_name: user.name, body: body.trim() });
    setBusy(false); if (error) setErr(error.message); else { setBody(""); onChange(); }
  }
  async function remove(id: number) {
    if (!confirm("Delete this note?")) return;
    const { error } = await supabase().from("staff_notes").delete().eq("id", id);
    if (error) setErr(error.message); else onChange();
  }
  return (
    <Panel title="Trainer notes" desc="Only trainers see these. Use them for class feedback, payment notes or follow-ups.">
      <form onSubmit={add} className="flex flex-col gap-2 sm:flex-row">
        <label className="min-w-0 flex-1"><span className="sr-only">New note</span><textarea value={body} onChange={(e) => setBody(e.target.value)} rows={2} maxLength={4000} placeholder="For example: Confident speaker, needs work on past tense. Paid by UPI on 22 Nov." className={cn(input, "h-auto py-2 leading-relaxed")} /></label>
        <button disabled={busy || !body.trim()} className={btn("primary", "md", "sm:self-start")}>Add note</button>
      </form>
      {err && <p role="alert" className="ty-note mt-2 text-[var(--danger)]">{err}</p>}
      {notes.length === 0 ? <p className="ty-body ty-muted mt-4">No notes yet.</p> : (
        <ul className="mt-4 space-y-3">{notes.map((n) => (
          <li key={n.id} className="rounded-[var(--radius-md)] bg-[var(--surface-subtle)] p-3">
            <p className="ty-body ty-ink whitespace-pre-wrap">{n.body}</p>
            <div className="ty-note ty-muted mt-1.5 flex items-center gap-2"><Grad className="h-3.5 w-3.5" />{n.author_name || "Trainer"} · {fmtDayTime(n.created_at)}
              {(n.author_id === user?.id || user?.role === "owner") && <button onClick={() => remove(n.id)} aria-label="Delete note" className="ml-auto grid size-7 place-items-center rounded-md text-[var(--text-subtle)] hover:bg-white hover:text-[var(--danger)]"><Trash2 className="h-3.5 w-3.5" /></button>}
            </div>
          </li>
        ))}</ul>
      )}
    </Panel>
  );
}
