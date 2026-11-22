import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyForm } from "./VerifyForm";

export const metadata: Metadata = { title: "Verify a certificate", description: "Check that a SpeakUp Certificate of Completion is genuine." };

export default function VerifyPage() {
  return (
    <section className="mx-auto max-w-xl px-5 py-16 sm:py-24">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent-700">For employers and colleges</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-brand-900 sm:text-4xl">Verify a certificate</h1>
      <p className="mb-8 mt-3 text-muted">Enter the Certificate ID printed at the bottom of the certificate.</p>
      <Suspense fallback={<div className="h-14 animate-pulse rounded-md bg-brand-50" />}><VerifyForm /></Suspense>
    </section>
  );
}
