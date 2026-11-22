import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false } };

// The admin panel is per-person and loads in the browser, so the frame streams in after the static shell.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="app-theme grid min-h-screen place-items-center"><span className="ty-body ty-muted animate-pulse">Loading the admin panel…</span></div>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
