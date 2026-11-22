import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Trainer sign-in for the demo backend: a passcode set in .env.local (TRAINER_PASSCODE).
 * It issues a signed, httpOnly cookie. Replace with Supabase Auth + a "trainer" role before launch.
 */
const COOKIE = "ye_trainer";
const dev = process.env.NODE_ENV !== "production";
const SECRET = process.env.TRAINER_SECRET ?? (dev ? "dev-only-secret" : "");
export const PASSCODE = process.env.TRAINER_PASSCODE ?? (dev ? "trainer-demo" : "");
export const trainerAuthReady = () => !!SECRET && !!PASSCODE;
export const usingDevDefaults = () => !process.env.TRAINER_PASSCODE;

const sign = (v: string) => createHmac("sha256", SECRET).update(v).digest("hex");
const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export async function issueTrainerCookie() {
  const exp = String(Date.now() + 12 * 3600 * 1000);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, { httpOnly: true, sameSite: "lax", secure: !dev, path: "/", maxAge: 12 * 3600 });
}
export async function clearTrainerCookie() { (await cookies()).delete(COOKIE); }
export async function isTrainer() {
  if (!trainerAuthReady()) return false;
  const raw = (await cookies()).get(COOKIE)?.value; if (!raw) return false;
  const [exp, sig] = raw.split(".");
  return !!exp && !!sig && Number(exp) > Date.now() && same(sig, sign(exp));
}
export const checkPasscode = (p: string) => trainerAuthReady() && same(createHmac("sha256", "x").update(p).digest("hex"), createHmac("sha256", "x").update(PASSCODE).digest("hex"));
