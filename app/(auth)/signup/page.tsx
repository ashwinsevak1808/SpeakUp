import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/learn/AuthForm";

export const metadata: Metadata = { title: "Create your account" };

export default function SignupPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold text-brand-900">Start learning free</h1>
      <p className="mb-8 mt-2 text-muted">Create an account to try the first grammar topics and lessons. Enrol any time.</p>
      <Suspense fallback={<div className="h-72 animate-pulse rounded-md bg-brand-50" />}><AuthForm mode="signup" /></Suspense>
    </>
  );
}
