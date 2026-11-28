import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/data";
import { PLAN } from "@/lib/learn-data";
import { FREE_UNTIL_LABEL, WEEK_PRICE } from "@/lib/access";
import { PRIVATE_PRICE } from "@/lib/live";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms & Conditions", description: "The terms for using the SpeakUp website, app, live classes and paid plans." };

const rs = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function Terms() {
  return (
    <LegalPage eyebrow="Legal" title="Terms & Conditions" updated="28 November 2026"
      intro={`These terms are an agreement between you and ${SITE.legalName} for using the SpeakUp website, learning app, live classes and paid plans. Please read them before you register or pay.`}>
      <h2>1. About SpeakUp</h2>
      <p>SpeakUp is an online English course run by {SITE.legalName}. It includes self-paced lessons and tests in your account, live online classes with trainers on Google Meet, optional private sessions and a Certificate of Completion. All teaching is online; we do not run in-person classes.</p>

      <h2>2. Your account</h2>
      <ul>
        <li>You must give correct details and keep your password and sign-in codes private. You are responsible for activity on your account.</li>
        <li>One account is for one person. Do not share your account or the class links.</li>
        <li>You must be 18 or older, or have a parent or guardian&rsquo;s consent.</li>
      </ul>

      <h2>3. Free access and paid plans</h2>
      <ul>
        <li><strong>Free:</strong> until {FREE_UNTIL_LABEL}, every lesson, test and grammar topic in the app is free. After that date, the first weeks remain free and other weeks need a plan or a week unlock. We may change what is free with notice on the website.</li>
        <li><strong>{PLAN.name} ({rs(PLAN.price)}):</strong> live online classes, every chapter for {PLAN.months} months from the date of payment, and the Certificate of Completion when you finish the course. Access ends after {PLAN.months} months unless you renew; your progress and any certificate stay in your account.</li>
        <li><strong>Single week ({rs(WEEK_PRICE)}):</strong> unlocks the lessons and test of one week of the course permanently. It does not include live classes or the certificate.</li>
        <li><strong>Private sessions (from {rs(PRIVATE_PRICE)}):</strong> one 30-minute one-to-one session with a trainer at the booked time.</li>
      </ul>
      <p>Prices are in Indian rupees and include applicable taxes unless stated otherwise. We may change prices for future purchases; a change never affects what you have already paid for.</p>

      <h2>4. Payments</h2>
      <p>Payments are processed securely by Razorpay (UPI, cards, net banking and wallets). Your access is unlocked automatically when Razorpay confirms the payment. If money leaves your account but access is not unlocked within 24 hours, contact us with your payment ID. Refunds follow our <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>.</p>

      <h2>5. Live classes and private sessions</h2>
      <ul>
        <li>Class times are shown in India time in your account. We may occasionally reschedule or replace a trainer; we will show the change in your account.</li>
        <li>Be respectful. We may remove anyone who harasses others, shares offensive content or disrupts a class, without a refund.</li>
        <li>Recording classes or sharing class links or materials outside SpeakUp is not allowed.</li>
        <li>Private sessions can be cancelled by you up to 2 hours before the start (see the refund policy).</li>
      </ul>

      <h2>6. Certificate</h2>
      <p>The SpeakUp Certificate of Completion is issued to learners on the full plan who complete all weeks and their tests. It shows that you finished our course. It is not a government, university or board qualification. Each certificate has an ID that anyone can check on our <Link href="/verify">verification page</Link>. We may withdraw a certificate obtained by cheating or misuse.</p>

      <h2>7. Content and acceptable use</h2>
      <p>All lessons, exercises, text, audio, designs and the SpeakUp name and logo belong to {SITE.legalName} or its licensors. You may use them for your own learning only. You may not copy, sell, publish or share them, scrape the website, try to break its security, or use it for anything unlawful.</p>

      <h2>8. Our responsibility</h2>
      <p>We work hard to keep SpeakUp accurate and available, but we provide it &ldquo;as is&rdquo; and cannot promise it will always be error-free or uninterrupted. Learning results depend on your own practice, so we do not guarantee a particular score, job or outcome. To the extent the law allows, our total liability to you is limited to the amount you paid us in the 3 months before the claim.</p>

      <h2>9. Ending your account</h2>
      <p>You can stop using SpeakUp at any time and ask us to delete your account. We may suspend or close an account that breaks these terms. Refunds, if any, follow the refund policy.</p>

      <h2>10. Changes and law</h2>
      <p>We may update these terms; the date at the top shows the latest version, and important changes will be announced on the website or by email. These terms are governed by the laws of India, and courts in India have jurisdiction. Please also read our <Link href="/privacy">Privacy Policy</Link>.</p>
    </LegalPage>
  );
}
