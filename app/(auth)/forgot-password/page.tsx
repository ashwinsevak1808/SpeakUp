import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/learn/AuthForm";

export const metadata: Metadata = { title: "Reset your password", robots: { index: false } };

export default function ForgotPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold text-brand-900">Forgot your password?</h1>
      <p className="mb-8 mt-2 text-muted">Enter your email and we will send you a link to choose a new one.</p>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-brand-50" />}><AuthForm mode="forgot" /></Suspense>
    </>
  );
}
