import type { Metadata } from "next";
import { LearnShell } from "@/components/learn/LearnShell";

export const metadata: Metadata = { title: "Student Area", robots: { index: false } };

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <LearnShell>{children}</LearnShell>;
}
