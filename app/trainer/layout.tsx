import type { Metadata } from "next";
import { TrainerShell } from "@/components/trainer/TrainerShell";

export const metadata: Metadata = { title: "Trainer dashboard", robots: { index: false } };

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return <TrainerShell>{children}</TrainerShell>;
}
