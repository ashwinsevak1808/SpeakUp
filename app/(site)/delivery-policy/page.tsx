import type { Metadata } from "next";
import { SITE } from "@/lib/data";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Delivery Policy", description: "How SpeakUp delivers its online course, live classes and private sessions after payment." };

export default function DeliveryPolicy() {
  return (
    <LegalPage eyebrow="Legal" title="Delivery Policy" updated="28 November 2026"
      intro="SpeakUp is a fully online service. Nothing is shipped to your address. This page explains how and when you receive what you buy.">
      <h2>1. No physical delivery</h2>
      <p>All SpeakUp products are digital services delivered online through your SpeakUp account. There are no shipping charges and nothing is sent by post or courier.</p>

      <h2>2. When you get access</h2>
      <ul>
        <li><strong>Full plan and week unlocks:</strong> unlocked in your account <strong>immediately</strong> after Razorpay confirms your payment, usually within a few seconds. Log in at {SITE.url.replace(/^https?:\/\//, "")} on any phone or computer to use it.</li>
        <li><strong>Live classes:</strong> the class timetable and the Google Meet link for each class appear in your account under Live classes. Join from there at the class time.</li>
        <li><strong>Private sessions:</strong> your booking and its Google Meet link appear in your account under Private sessions straight away, and the session takes place at the booked date and time.</li>
        <li><strong>Certificate:</strong> issued in your account as soon as you complete the course on the full plan. You can download or print it, and anyone can verify it online.</li>
      </ul>

      <h2>3. If something does not arrive</h2>
      <p>If your payment went through but access is not unlocked within <strong>24 hours</strong>, write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or WhatsApp {SITE.phone} with your registered email and Razorpay payment ID. We will unlock it or refund you in full.</p>

      <h2>4. What you need</h2>
      <p>A phone or computer with a modern browser and an internet connection. For live classes and speaking practice, a microphone (and ideally headphones) helps.</p>
    </LegalPage>
  );
}
