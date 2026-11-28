"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, Check, Mic, PenLine, Settings as Cog, Target, Trash2, UserRound } from "@/components/learn/icons";
import { saveProfile, useAuth } from "@/lib/auth";
import { Avatar, AVATAR_IDS, fileToAvatar } from "@/components/learn/Avatar";
import { GoalPicker, LevelPicker, VoicePicker } from "@/components/learn/Preferences";
import { PageTitle } from "@/components/learn/ui";
import { GOAL_LABEL } from "@/lib/course-core";
import { fmtDate } from "@/lib/live";
import { cn } from "@/lib/utils";

type Tab = "profile" | "learning" | "voice";
const TABS: { id: Tab; label: string; icon: typeof Cog }[] = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "learning", label: "Learning", icon: Target },
  { id: "voice", label: "Voice", icon: Mic },
];

/** A settings section: title and help on top, content below. */
function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-xl)] bg-white shadow-[var(--shadow-card)]">
      <header className="border-b border-dashed border-[var(--border)] px-5 py-4 sm:px-6">
        <h3 className="ty-head">{title}</h3>
        {desc && <p className="ty-note ty-muted mt-0.5">{desc}</p>}
      </header>
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

/** A label on the left and its value on the right, ruled between rows. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-dashed border-[var(--border)] py-3.5 first:pt-0 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="ty-note ty-muted">{label}</div>
      <div className="ty-subject ty-ink min-w-0 break-words sm:text-right">{children}</div>
    </div>
  );
}

function ProfilePhoto() {
  const { user, profile } = useAuth();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  if (!user) return null;
  const hasPicture = !!(profile.photo || profile.avatar);

  const upload = async (f?: File) => {
    if (!f) return;
    setErr("");
    if (!f.type.startsWith("image/")) return setErr("Please choose an image file (JPG or PNG).");
    if (f.size > 10 * 1024 * 1024) return setErr("That image is over 10 MB. Please choose a smaller one.");
    setBusy(true);
    try { saveProfile(user.id, { photo: await fileToAvatar(f), avatar: "" }); } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  };

  return (
    <Section title="Profile picture" desc="Shown next to your name around the app. Your photo stays on this device.">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-stretch sm:gap-6">
        <div className="relative shrink-0">
          <Avatar name={user.name} photo={profile.photo} avatar={profile.avatar} size={120} className="text-4xl ring-4 ring-white shadow-[var(--shadow-card)]" />
          <button onClick={() => file.current?.click()} aria-label="Change photo" className="absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full bg-accent-600 text-white ring-4 ring-white transition-colors hover:bg-accent-700"><PenLine className="h-4 w-4" /></button>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files?.[0]); }}
          className={cn("flex w-full flex-1 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-5 py-6 text-center transition-colors sm:items-start sm:text-left", drag ? "border-accent-600 bg-brand-50" : "border-[var(--border)] bg-[var(--surface-subtle,#fafbfa)]")}
        >
          <div>
            <p className="font-semibold text-brand-900">{drag ? "Drop your photo here" : "Drag a photo here, or upload one"}</p>
            <p className="mt-0.5 text-sm text-muted">JPG or PNG. We crop it to a square for you.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={() => file.current?.click()} disabled={busy} className="btn-base btn-primary btn-md">{busy ? "Uploading…" : profile.photo ? "Change photo" : "Upload photo"}</button>
            {hasPicture && <button onClick={() => saveProfile(user.id, { photo: "", avatar: "" })} className="btn-base btn-secondary btn-md inline-flex items-center gap-1.5"><Trash2 className="h-4 w-4" />Remove</button>}
          </div>
          <input ref={file} type="file" accept="image/*" className="hidden" onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} />
        </div>
      </div>
      {err && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{err}</p>}

      <div className="mt-6 border-t border-dashed border-[var(--border)] pt-5">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <div className="ty-subject ty-ink">Or choose a character</div>
          <div className="ty-note ty-muted">No photo needed</div>
        </div>
        <div className="grid grid-cols-4 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
          {AVATAR_IDS.map((id) => {
            const on = !profile.photo && profile.avatar === id;
            return (
              <button key={id} onClick={() => saveProfile(user.id, { avatar: id, photo: "" })} aria-pressed={on} aria-label={`Character ${id}`} className={cn("relative grid aspect-square place-items-center rounded-2xl border transition-all sm:h-[72px] sm:w-[72px]", on ? "border-accent-600 bg-brand-50 shadow-[0_0_0_3px_var(--accent-ring)]" : "border-line bg-white hover:-translate-y-0.5 hover:border-brand-300")}>
                <Avatar name={user.name} avatar={id} size={52} />
                {on && <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-accent-600 text-white ring-2 ring-white"><Check className="h-3 w-3" /></span>}
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  if (!user) return null;
  const plan = user.enrolled ? (user.planUntil ? `Full plan · until ${fmtDate(user.planUntil, { day: "numeric", month: "short", year: "numeric" })}` : "Full plan") : "Free";

  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle title="Settings" text="Your profile, how the course is shaped, and the voice that reads to you. Changes save automatically." />

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-[var(--border)]" role="tablist" aria-label="Settings sections">
        {TABS.map(({ id, label, icon: I }) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cn("-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors", tab === id ? "border-accent-600 text-accent-700" : "border-transparent text-muted hover:text-brand-900")}>
            <I className="h-4 w-4" />{label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {tab === "profile" && (
          <>
            <ProfilePhoto />
            <Section title="Account">
              <Row label="Name">{user.name}</Row>
              <Row label="Email">{user.email}</Row>
              <Row label="Plan">
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold", user.enrolled ? "bg-accent-600 text-white" : "bg-brand-50 text-brand-800")}>{user.enrolled && <Check className="h-3.5 w-3.5" />}{plan}</span>
              </Row>
            </Section>
          </>
        )}
        {tab === "learning" && (
          <>
            <div className="flex flex-col gap-4 rounded-[var(--radius-xl)] bg-accent-600 p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15"><Target className="h-6 w-6" /></span>
                <div>
                  <p className="text-sm text-white/75">Your course is set for</p>
                  <p className="font-display text-lg font-semibold">{profile.level === "intermediate" ? "Intermediate" : "Beginner"} · {GOAL_LABEL[profile.goal]}</p>
                </div>
              </div>
              <Link href="/learn/path" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-accent-700 transition-colors hover:bg-brand-50">See my path<ArrowRight className="h-4 w-4" /></Link>
            </div>
            <Section title="Your level" desc="This decides which grammar lessons are in your path."><LevelPicker /></Section>
            <Section title="Your main goal" desc="We mark the lessons that matter most for it."><GoalPicker /></Section>
          </>
        )}
        {tab === "voice" && <Section title="Voice for listening" desc="Pick the accent you want to hear in the lessons. Tap the speaker to preview."><VoicePicker /></Section>}
      </div>
    </div>
  );
}
