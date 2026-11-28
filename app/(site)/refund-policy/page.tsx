import type { Metadata } from "next";
import { SITE } from "@/lib/data";
import { PLAN } from "@/lib/learn-data";
import { WEEK_PRICE } from "@/lib/access";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Refund & Cancellation Policy", description: "When SpeakUp payments can be cancelled or refunded, and how long refunds take." };

/* EDIT: these are SpeakUp's refund rules. Change the numbers here if your policy changes. */
const PLAN_REFUND_DAYS = 7;
const PLAN_REFUND_MAX_CLASSES = 2;
const rs = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function RefundPolicy() {
  return (
    <LegalPage eyebrow="Legal" title="Refund & Cancellation Policy" updated="28 November 2026"
      intro="We want you to be happy with SpeakUp. This page explains when you can cancel and get your money back, and how long it takes.">
      <h2>1. Full plan ({PLAN.name}, {rs(PLAN.price)})</h2>
      <ul>
        <li>You can ask for a <strong>full refund within {PLAN_REFUND_DAYS} days</strong> of your payment, as long as you have attended no more than {PLAN_REFUND_MAX_CLASSES} live classes.</li>
        <li>After {PLAN_REFUND_DAYS} days, or after attending more than {PLAN_REFUND_MAX_CLASSES} live classes, the plan is not refundable.</li>
        <li>A plan is not refundable once a Certificate of Completion has been issued.</li>
      </ul>

      <h2>2. Single week unlock ({rs(WEEK_PRICE)})</h2>
      <p>A week is unlocked and delivered instantly after payment, so week unlocks are <strong>not refundable</strong>, except in the cases in section 4.</p>

      <h2>3. Private sessions</h2>
      <ul>
        <li><strong>You cancel 2 hours or more before the start:</strong> full refund, or you can rebook another slot. You can cancel in your account under Private sessions.</li>
        <li><strong>You cancel less than 2 hours before, or do not join:</strong> no refund.</li>
        <li><strong>We cancel, or the trainer does not join:</strong> full refund, or a free rebooking if you prefer.</li>
      </ul>

      <h2>4. Always refunded in full</h2>
      <ul>
        <li>You were charged twice for the same purchase.</li>
        <li>Money left your account but the purchase was not completed or unlocked.</li>
        <li>You paid for a private session slot that another learner booked a moment before you.</li>
        <li>We cannot provide a service you paid for.</li>
      </ul>

      <h2>5. How to ask for a refund</h2>
      <p>Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or message us on WhatsApp at {SITE.phone} with your registered email and the Razorpay payment ID (it is in your payment confirmation). We reply within 2 working days.</p>

      <h2>6. When you get the money</h2>
      <p>Approved refunds are sent back to the <strong>original payment method</strong> (UPI, card, bank or wallet) through Razorpay within <strong>5 to 7 working days</strong>. Your bank may take a few more days to show it. We do not refund in cash or to a different account.</p>

      <h2>7. Cancelling a plan</h2>
      <p>Plans are one-time payments, not subscriptions, so there is nothing to cancel and you will never be charged again automatically. Access simply ends when the plan&rsquo;s {PLAN.months} months are over.</p>
    </LegalPage>
  );
}
