/**
 * Email alerts to the team (new lead, enrolment request, payment, booking) through Resend (resend.com, free tier).
 * Set RESEND_API_KEY and ALERT_EMAIL (comma-separated) in .env.local. Optional ALERT_FROM, e.g.
 * "SpeakUp <alerts@speakup.in>" once your domain is verified in Resend.
 * Without the key nothing is sent and nothing breaks: everything is still in the admin panel.
 */
export async function alertTeam(subject: string, lines: (string | null | undefined | false)[], link?: string) {
  const key = process.env.RESEND_API_KEY; const to = process.env.ALERT_EMAIL;
  if (!key || !to) return;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const body = lines.filter(Boolean).join("\n") + (link ? `\n\nOpen: ${site}${link}` : "");
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.ALERT_FROM ?? "SpeakUp <onboarding@resend.dev>", to: to.split(",").map((s) => s.trim()), subject: `[SpeakUp] ${subject}`, text: body }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error("Alert email failed:", r.status, await r.text().catch(() => ""));
  } catch (e) { console.error("Alert email failed:", (e as Error).message); }
}
