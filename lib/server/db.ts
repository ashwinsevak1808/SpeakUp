import { promises as fs } from "fs";
import path from "path";

/**
 * Tiny JSON-file database for the backend (runs on your own computer or a VPS).
 * Files live in /data (git-ignored). To use Supabase or Postgres later, replace the
 * bodies of readJson/writeJson and the API routes keep working.
 * NOTE: serverless hosts such as Vercel cannot keep files between requests; use Supabase there.
 */
const dir = path.join(process.cwd(), "data");
let chain: Promise<unknown> = Promise.resolve();

/** Run one read-modify-write at a time so two trainers never overwrite each other. */
export function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.catch(() => undefined);
  return run;
}
export async function readJson<T>(name: string, seed: () => T): Promise<T> {
  try { return JSON.parse(await fs.readFile(path.join(dir, name), "utf8")) as T; }
  catch { const v = seed(); await writeJson(name, v); return v; }
}
export async function writeJson(name: string, value: unknown) {
  await fs.mkdir(dir, { recursive: true });
  const tmp = path.join(dir, `${name}.${process.pid}.tmp`);
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
  await fs.rename(tmp, path.join(dir, name));
}
