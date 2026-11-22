import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { serverSupabase } from "@/lib/supabase/server";

/** Links in Supabase emails (confirm sign-up, reset password) land here and sign the person in. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const nextRaw = url.searchParams.get("next") ?? "/learn";
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/learn";
  const sb = await serverSupabase();

  let ok = false;
  if (code) ok = !(await sb.auth.exchangeCodeForSession(code)).error;
  else if (tokenHash && type) ok = !(await sb.auth.verifyOtp({ token_hash: tokenHash, type })).error;

  if (ok) return NextResponse.redirect(new URL(type === "recovery" ? "/reset-password" : next, url.origin));
  return NextResponse.redirect(new URL("/login?error=link", url.origin));
}
