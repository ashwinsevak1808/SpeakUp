import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/learn/AuthForm";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false } };

export default function ResetPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold text-brand-900">Choose a new password</h1>
      <p className="mb-8 mt-2 text-muted">Use at least 8 characters. You will stay logged in.</p>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-brand-50" />}><AuthForm mode="reset" /></Suspense>
    </>
  );
}
