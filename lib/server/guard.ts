import { NextResponse } from "next/server";
import { getMe, isStaffRole, serverSupabase, type Me } from "@/lib/supabase/server";

type Ok = { sb: Awaited<ReturnType<typeof serverSupabase>>; me: Me; error?: undefined };
type Fail = { error: NextResponse; sb?: undefined; me?: undefined };

/** For API routes: the caller must be signed in (and staff, if asked). Returns a ready 401/403 otherwise. */
export async function requireUser(staff = false): Promise<Ok | Fail> {
  const sb = await serverSupabase();
  const me = await getMe(sb);
  if (!me) return { error: NextResponse.json({ error: "Please log in." }, { status: 401 }) };
  if (staff && !isStaffRole(me.role)) return { error: NextResponse.json({ error: "Only trainers can do this." }, { status: 403 }) };
  return { sb, me };
}
