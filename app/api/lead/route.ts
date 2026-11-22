import { NextResponse } from "next/server";

/**
 * EDIT: This endpoint receives every form on the site (demo, ebook, corporate, level-test).
 * Right now it validates and logs the lead. To actually receive them, add ONE of:
 *   - Email via Resend / Nodemailer
 *   - Append to Google Sheets (Apps Script webhook)
 *   - WhatsApp / Slack webhook
 *   - Forward to a CRM
 * Example (Google Sheets webhook):
 *   await fetch(process.env.LEADS_WEBHOOK_URL!, { method: "POST", body: JSON.stringify(lead) });
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, 2000) : "");
  const kind = str("kind");
  if (!kind) return NextResponse.json({ ok: false, error: "Missing form type" }, { status: 400 });

  const email = str("email");
  const phone = str("phone").replace(/[\s-]/g, "");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 422 });
  if (phone && !/^(?:\+?91)?[6-9]\d{9}$/.test(phone)) return NextResponse.json({ ok: false, error: "Invalid phone" }, { status: 422 });

  const lead = { ...Object.fromEntries(Object.entries(body).map(([k, v]) => [k, typeof v === "string" ? v.trim().slice(0, 2000) : v])), receivedAt: new Date().toISOString() };
  console.log("New lead:", lead);

  return NextResponse.json({ ok: true });
}
