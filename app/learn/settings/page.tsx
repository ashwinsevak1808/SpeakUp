"use client";
import { useAuth } from "@/lib/auth";
import { Card, PageTitle } from "@/components/learn/ui";
import { Preferences } from "@/components/learn/Preferences";

export default function SettingsPage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title="Settings" text="Shape the course to you. Changes save automatically." />
      <Card className="mb-6 !p-5"><div className="text-sm text-muted">Signed in as</div><div className="font-display text-lg font-semibold text-brand-900">{user.name}</div><div className="text-sm text-muted">{user.email} · {user.enrolled ? "Enrolled student" : "Free preview"}</div></Card>
      <Card className="!p-6 sm:!p-8"><Preferences /></Card>
    </div>
  );
}
