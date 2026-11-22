"use client";
import { useRef, useState } from "react";
import { Check, Mic, Settings as Cog, Target, UserRound } from "@/components/learn/icons";
import { saveProfile, useAuth } from "@/lib/auth";
import { Avatar, AVATAR_IDS, fileToAvatar } from "@/components/learn/Avatar";
import { GoalPicker, LevelPicker, VoicePicker } from "@/components/learn/Preferences";
import { PageTitle } from "@/components/learn/ui";
import { cn } from "@/lib/utils";

type Tab = "profile" | "learning" | "voice";
const TABS: { id: Tab; label: string; icon: typeof Cog }[] = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "learning", label: "Learning", icon: Target },
  { id: "voice", label: "Voice", icon: Mic },
];

/** A settings section: title and help on top, content below, ruled like the Neemo settings. */
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
function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-dashed border-[var(--border)] py-3.5 first:pt-0 last:border-0 last:pb-0 sm:grid-cols-[200px_1fr] sm:items-center sm:gap-6">
      <div><div className="ty-subject ty-ink">{label}</div>{hint && <div className="ty-note ty-muted">{hint}</div>}</div>
      <div className="ty-body ty-secondary min-w-0 break-words">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [err, setErr] = useState("");
  const file = useRef<HTMLInputElement>(null);
  if (!user) return null;

  const upload = async (f?: File) => {
    if (!f) return;
    setErr("");
    if (!f.type.startsWith("image/")) return setErr("Please choose an image file.");
    try { saveProfile(user.id, { photo: await fileToAvatar(f), avatar: "" }); } catch (e) { setErr((e as Error).message); }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle title="Settings" text="Your profile, how the course is shaped, and the voice that reads to you. Changes save automatically.">
        <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-[var(--shadow-card)]">
          <Avatar name={user.name} photo={profile.photo} avatar={profile.avatar} size={36} />
          <div className="min-w-0"><div className="ty-subject ty-ink truncate">{user.name}</div><div className="ty-note ty-muted truncate">{user.enrolled ? "Full plan" : "Free"}</div></div>
        </div>
      </PageTitle>

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
            <Section title="Picture" desc="Shown next to your name around the app. Your photo stays on this device.">
              <div className="flex flex-wrap items-center gap-5">
                <Avatar name={user.name} photo={profile.photo} avatar={profile.avatar} size={84} className="ring-4 ring-white shadow-[var(--shadow-card)]" />
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => file.current?.click()} className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-700">Upload a photo</button>
                  {(profile.photo || profile.avatar) && <button onClick={() => saveProfile(user.id, { photo: "", avatar: "" })} className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-brand-900 hover:bg-brand-50">Use my initials</button>}
                  <input ref={file} type="file" accept="image/*" className="hidden" onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} />
                </div>
              </div>
              {err && <p role="alert" className="mt-3 text-sm text-live">{err}</p>}
              <div className="mt-5 border-t border-dashed border-[var(--border)] pt-4">
                <div className="ty-label ty-caps ty-subtle mb-3">Or pick a character</div>
                <div className="flex flex-wrap gap-3">
                  {AVATAR_IDS.map((id) => {
                    const on = !profile.photo && profile.avatar === id;
                    return (
                      <button key={id} onClick={() => saveProfile(user.id, { avatar: id, photo: "" })} aria-pressed={on} aria-label={`Character ${id}`} className={cn("relative rounded-full p-0.5 transition-transform hover:scale-105", on && "ring-2 ring-accent-600 ring-offset-2")}>
                        <Avatar name={user.name} avatar={id} size={52} />
                        {on && <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent-600 text-white ring-2 ring-white"><Check className="h-3 w-3" /></span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Section>
            <Section title="Account">
              <Row label="Name">{user.name}</Row>
              <Row label="Email">{user.email}</Row>
              <Row label="Plan" hint="Your access to live classes and the full path">{user.enrolled ? "Full plan" : "Free"}</Row>
            </Section>
          </>
        )}
        {tab === "learning" && (
          <>
            <Section title="Your level" desc="Intermediate students skip the beginner-only grammar lessons and move faster."><LevelPicker /></Section>
            <Section title="Your main goal" desc="We mark the lessons that matter most for it."><GoalPicker /></Section>
          </>
        )}
        {tab === "voice" && <Section title="Voice for listening" desc="Pick the accent you want to hear in the lessons. Tap the speaker to preview."><VoicePicker /></Section>}
      </div>
    </div>
  );
}
