import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * Supabase acting AS the signed-in visitor (their cookie session). Row-level security in the
 * database decides what they may read or change, so a route can never do more than its caller.
 */
export async function serverSupabase() {
  const jar = await cookies();
  return createServerClient(URL, KEY, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (list) => { try { list.forEach(({ name, value, options }) => jar.set(name, value, options)); } catch { /* read-only during render; proxy.ts refreshes */ } },
    },
  });
}

/** Supabase as an anonymous visitor (website forms, the public course). */
export const publicSupabase = () => createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });

export type Role = "student" | "trainer" | "owner";
export type Me = { id: string; email: string; name: string; role: Role; enrolled: boolean };

/** The signed-in person and their role, or null. */
export async function getMe(sb?: Awaited<ReturnType<typeof serverSupabase>>): Promise<Me | null> {
  const db = sb ?? (await serverSupabase());
  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;
  const { data } = await db.from("profiles").select("id, email, name, role, enrolled").eq("id", user.id).single();
  return (data as Me | null) ?? null;
}
export const isStaffRole = (r?: Role | null) => r === "trainer" || r === "owner";
