"use client";
/** Small fetch helper for the trainer pages. Returns the parsed JSON and whether the call worked. */
export async function api<T = Record<string, unknown>>(path: string, method = "GET", body?: unknown) {
  const r = await fetch(path, { method, cache: "no-store", headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  const data = (await r.json().catch(() => ({}))) as T & { error?: string; errors?: string[] };
  return { ok: r.ok, status: r.status, data };
}
