import { createHmac, timingSafeEqual } from "crypto";

/**
 * Razorpay, server side only. Keys come from .env.local (or your host's environment):
 *   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET
 * After adding them run `npm run db:payments` so the database can check payment signatures too.
 */
const env = () => ({
  id: process.env.RAZORPAY_KEY_ID ?? "",
  secret: process.env.RAZORPAY_KEY_SECRET ?? "",
  webhook: process.env.RAZORPAY_WEBHOOK_SECRET ?? "",
  api: process.env.RAZORPAY_API_URL ?? "https://api.razorpay.com", // overridden only in tests
});
export const razorpayKeyId = () => env().id;
export const razorpayReady = () => !!env().id && !!env().secret;

const hmac = (data: string, key: string) => createHmac("sha256", key).update(data).digest("hex");
const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/** What Razorpay Checkout returns as razorpay_signature for a successful payment. */
export const checkoutSignature = (orderId: string, paymentId: string) => hmac(`${orderId}|${paymentId}`, env().secret);
/** Proof for the database that this order was created by our server (see attach_order in the migration). */
export const orderProof = (paymentRowId: string, orderId: string) => hmac(`${paymentRowId}:${orderId}`, env().secret);
/** Razorpay signs every webhook body with the webhook secret. */
export const webhookValid = (body: string, signature: string | null) => !!env().webhook && !!signature && same(hmac(body, env().webhook), signature);

export async function createOrder(amountRupees: number, receipt: string, notes: Record<string, string>) {
  const { id, secret, api } = env();
  const r = await fetch(`${api}/v1/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}` },
    body: JSON.stringify({ amount: Math.round(amountRupees * 100), currency: "INR", receipt: receipt.slice(0, 40), notes }),
  });
  const d = (await r.json().catch(() => ({}))) as { id?: string; error?: { description?: string } };
  if (!r.ok || !d.id) throw new Error(d.error?.description ?? `Razorpay error ${r.status}`);
  return d.id;
}
