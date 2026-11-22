"use client";
import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Current year: 2026 in the static HTML, then the real year in the browser. */
export function Year() {
  const y = useSyncExternalStore(noop, () => new Date().getFullYear(), () => 2026);
  return <>{y}</>;
}
