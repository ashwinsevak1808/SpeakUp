import { NextResponse, connection } from "next/server";
import { razorpayReady } from "@/lib/server/razorpay";
import { publicSupabase } from "@/lib/supabase/server";

/** Is online payment switched on? (Razorpay keys on the server AND the secret saved in the database.) */
export async function GET() {
  await connection(); // decide per request, never at build time
  if (!razorpayReady()) return NextResponse.json({ enabled: false });
  const { data } = await publicSupabase().rpc("payments_ready");
  return NextResponse.json({ enabled: data === true });
}
