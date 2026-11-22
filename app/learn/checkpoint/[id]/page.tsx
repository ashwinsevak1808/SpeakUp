import type { Metadata } from "next";
import { CheckpointPlayer } from "@/components/learn/CheckpointPlayer";
import { WEEKS } from "@/lib/path-data";

export function generateStaticParams() {
  return WEEKS.map((w) => ({ id: w.checkpoint.id }));
}
export const metadata: Metadata = { title: "Checkpoint" };

export default async function CheckpointPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CheckpointPlayer checkpointId={id} />;
}
