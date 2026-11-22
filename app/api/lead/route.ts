import { NextResponse } from "next/server";
import { publicSupabase } from "@/lib/supabase/server";
import { alertTeam } from "@/lib/server/notify";

/**
 * Every form on the website (demo class, ebook, corporate, level test, contact) lands here
 * and is saved to the `leads` table. Trainers and the owner see them in Admin > Leads.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 }); }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, 2000) : "");
  const kind = str("kind");
  if (!kind) return NextResponse.json({ ok: false, error: "Missing form type" }, { status: 400 });

  const email = str("email");
  const phone = str("phone").replace(/[\s-]/g, "");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 422 });
  if (phone && !/^(?:\+?91)?[6-9]\d{9}$/.test(phone)) return NextResponse.json({ ok: false, error: "Invalid phone" }, { status: 422 });

  const data = Object.fromEntries(Object.entries(body).filter(([k]) => !["kind", "name", "email", "phone"].includes(k)).slice(0, 40)
    .map(([k, v]) => [k.slice(0, 60), typeof v === "string" ? v.trim().slice(0, 2000) : v]));
  const { error } = await publicSupabase().from("leads").insert({ kind: kind.slice(0, 60), name: str("name") || null, email: email.toLowerCase() || null, phone: phone || null, data });
  if (error) { console.error("Lead not saved:", error.message); return NextResponse.json({ ok: false, error: "Could not send. Please try WhatsApp." }, { status: 500 }); }
  await alertTeam(`New lead: ${str("name") || email || phone} (${kind})`, [str("name") && `Name: ${str("name")}`, email && `Email: ${email}`, phone && `Phone: ${phone}`, ...Object.entries(data).map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)], "/admin/leads");
  return NextResponse.json({ ok: true });
}
