import { Suspense } from "react";
import { StudentDetail } from "@/components/admin/StudentDetail";

export default function StudentPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-sunken)]" />}>
      <StudentDetail params={params} />
    </Suspense>
  );
}
