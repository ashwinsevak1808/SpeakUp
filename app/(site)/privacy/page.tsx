import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/data";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy", description: "How SpeakUp collects, uses and protects your personal data." };

export default function Privacy() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="28 November 2026"
      intro={`This policy explains what personal data ${SITE.legalName} collects when you use our website and online English course, why we collect it, and the choices you have.`}>
      <p>{SITE.legalName} (&ldquo;SpeakUp&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) runs the website {SITE.url.replace(/^https?:\/\//, "")} and the SpeakUp learning app. We handle your personal data in line with India&rsquo;s Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000 and its rules. By creating an account or using our services, you agree to this policy.</p>

      <h2>1. What we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li><strong>Account details:</strong> your name, email address and password (stored only in encrypted, hashed form). Optionally, your phone number.</li>
        <li><strong>Learning preferences:</strong> your level, goal, chosen voice and reading speed, and a profile photo or avatar if you add one.</li>
        <li><strong>Messages and forms:</strong> what you send us through the contact form, level test, free e-book form or WhatsApp.</li>
      </ul>
      <h3>Information created while you learn</h3>
      <ul>
        <li><strong>Progress:</strong> lessons and tests completed, answers you got wrong (for your review list), points, streak days and certificates.</li>
        <li><strong>Classes:</strong> the live classes and private sessions you book.</li>
        <li><strong>Notes by trainers:</strong> short notes our trainers may write about your progress, to teach you better.</li>
      </ul>
      <h3>Payments</h3>
      <p>Payments are processed by <strong>Razorpay</strong>. We never see or store your card number, UPI PIN, bank password or CVV. We keep only what we need to confirm and support your purchase: the amount, what it was for, the date, its status and the Razorpay order and payment IDs.</p>
      <h3>Speaking exercises</h3>
      <p>When you practise speaking, your browser&rsquo;s built-in speech recognition turns your voice into text on your device so the app can check it. <strong>We do not record or store your voice.</strong> Depending on your browser, the browser maker (for example Google or Apple) may process the audio to recognise it, under their own privacy policy.</p>
      <h3>Technical information</h3>
      <p>We use essential cookies and similar storage to keep you logged in and to remember simple settings. Our hosting providers may log technical data such as IP address, browser type and the time of a request, to keep the service secure and working. We do not use advertising cookies and we do not sell your data.</p>

      <h2>2. Why we use it</h2>
      <ul>
        <li>To create and run your account and save your progress across devices.</li>
        <li>To provide lessons, tests, live classes, private sessions and certificates.</li>
        <li>To process payments, unlock what you paid for, and handle refunds.</li>
        <li>To reply to your questions and send important service messages (for example sign-in codes, booking details or changes to classes).</li>
        <li>To keep the service secure, prevent misuse and meet our legal and tax obligations.</li>
        <li>To understand, in aggregate, how the course is used so we can improve it.</li>
      </ul>
      <p>We use your data on the basis of your consent and to provide the service you asked for. You can withdraw consent at any time (see section 6); some features need your data to work, so we may then have to close your account.</p>

      <h2>3. Who we share it with</h2>
      <p>We share only what is needed with trusted service providers who process data on our behalf:</p>
      <ul>
        <li><strong>Supabase</strong>: secure database and sign-in.</li>
        <li><strong>Vercel</strong>: website hosting.</li>
        <li><strong>Razorpay</strong>: payment processing.</li>
        <li><strong>Google Meet</strong>: live online classes (when you join a class, Google&rsquo;s terms apply).</li>
        <li><strong>Our email provider</strong>: to send sign-in codes and service emails.</li>
        <li><strong>Our trainers</strong>: they see your name, contact details and progress to teach you.</li>
      </ul>
      <p>We may also disclose data when the law requires it, for example to a court or government authority. We never sell or rent your personal data.</p>
      <p>Some providers store data on servers outside India. When they do, we rely on their security measures and contractual protections, and transfers follow Indian law.</p>

      <h2>4. How long we keep it</h2>
      <ul>
        <li>Account and learning data: while your account is open. When you ask us to delete your account, we delete it within 30 days.</li>
        <li>Payment and invoice records: as long as tax and accounting law requires (generally up to 8 years), even after the account is deleted.</li>
        <li>Website enquiries: up to 2 years, unless you ask us to delete them sooner.</li>
      </ul>

      <h2>5. How we protect it</h2>
      <p>Data is sent over encrypted connections (HTTPS) and stored with providers that use industry-standard security. Passwords are hashed. Access inside our team is limited by role: students can only see their own data, and only trainers and the owner can see student records. No system is perfectly secure, but we work to protect your data and will inform you and the authorities of a breach as the law requires.</p>

      <h2>6. Your rights</h2>
      <p>You can ask us to:</p>
      <ul>
        <li>give you a summary of the personal data we hold about you;</li>
        <li>correct or update it (you can change most of it yourself in Settings);</li>
        <li>delete your account and data;</li>
        <li>withdraw your consent;</li>
        <li>nominate another person to exercise these rights if you are unable to.</li>
      </ul>
      <p>Write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We will reply within 30 days. If you are not satisfied, you may complain to the Data Protection Board of India.</p>

      <h2>7. Children</h2>
      <p>SpeakUp is meant for learners aged 18 and over. If you are under 18, a parent or legal guardian must create the account or give consent, and we will not knowingly track or target advertising at children.</p>

      <h2>8. Grievance officer</h2>
      <p>For any concern about your personal data, contact our grievance officer, <strong>{SITE.grievanceOfficer}</strong>, at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We acknowledge complaints within 48 hours and resolve them within 30 days.</p>

      <h2>9. Changes to this policy</h2>
      <p>We may update this policy. We will change the date at the top, and for important changes we will tell you by email or in the app. Please also read our <Link href="/terms">Terms &amp; Conditions</Link>.</p>
    </LegalPage>
  );
}
