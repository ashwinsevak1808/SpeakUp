import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/learn/AuthForm";

export const metadata: Metadata = { title: "Create your account" };

export default function SignupPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold text-brand-900">Start learning free</h1>
      <p className="mb-8 mt-2 text-muted">Every lesson is free until 28 February 2027. It takes less than a minute.</p>
      <Suspense fallback={<div className="h-72 animate-pulse rounded-md bg-brand-50" />}><AuthForm mode="signup" /></Suspense>
      <p className="mt-4 text-center text-sm text-muted">Prefer no password? <Link href="/login?method=code" className="font-semibold text-brand-700 underline underline-offset-4">Sign up with an email code</Link></p>
    </>
  );
}
