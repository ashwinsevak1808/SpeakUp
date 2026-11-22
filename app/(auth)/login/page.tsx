import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/learn/AuthForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold text-brand-900">Welcome back</h1>
      <p className="mb-8 mt-2 text-muted">Log in to continue your practice.</p>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-brand-50" />}><AuthForm mode="login" /></Suspense>
    </>
  );
}
