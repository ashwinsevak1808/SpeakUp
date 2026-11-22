# Running Your English: setup guide

Everything (accounts, progress, classes, bookings, enrolments, payments, certificates, leads, lessons)
lives in **Supabase**. The website is a Next.js app. Settings go in `.env.local` (see `.env.local.example`).

## Who can do what

| Role | Where they work | Can |
|---|---|---|
| Student | `/learn` | learn, book private sessions, enrol, get a certificate |
| Trainer | `/admin` | see every student, approve enrolments, run classes, edit lessons, see leads and payments |
| Owner | `/admin` | everything a trainer can, plus Team (add/remove trainers) and deleting accounts |

Everyone logs in at `/login`. Trainers and owners land in the admin panel.
These rules are enforced inside the database (row-level security), not only in the screens.

## First-time setup (already done for the current project)

1. Create a Supabase project. Copy the URL and publishable key into `.env.local`.
2. Copy the **Session pooler** connection string (Connect button) into `SUPABASE_DB_URL`.
3. `npm install`, then `npm run db:migrate` (creates all tables and security rules from `supabase/migrations`).
4. Sign up on the site with your own email, then `npm run db:role -- you@email.com owner`.
5. Add trainers from **Admin > Team** (enter their email; they get access when they sign up).

## Before real students sign up

1. **Emails (required).** Supabase's built-in email only reaches your own team and is heavily rate-limited.
   - Either set up custom SMTP: Supabase > Authentication > Emails > SMTP settings (Resend, Brevo, Zoho…),
   - or switch off "Confirm email" (Authentication > Sign In / Providers > Email) for now.
2. **Website address.** Supabase > Authentication > URL Configuration: set Site URL to your domain and add
   `https://YOUR-DOMAIN/auth/callback` to Redirect URLs (keep `http://localhost:3000/auth/callback` for testing).
3. **Database password.** If it was ever shared, reset it (Database settings) and update `SUPABASE_DB_URL`.

## Online payment (Razorpay)

Until this is switched on, students press **Request enrolment**, you collect UPI / bank payment,
and approve them in **Admin > Enrolments**. Private sessions are booked directly and paid to the trainer.

To switch on card / UPI / net-banking payment:
1. In Razorpay (start with **Test mode**), Settings > API Keys: copy Key Id and Key Secret.
2. Webhooks: add `https://YOUR-DOMAIN/api/pay/webhook`, events `payment.captured` and `order.paid`, choose a secret.
3. Put `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` in `.env.local` and on your host.
4. Run `npm run db:payments` (copies the secret and the course price from `lib/learn-data.ts` into the database).
   Run it again whenever you change the price. `npm run db:payments -- off` switches online payment off.

How it stays safe: the price is decided by the database, Razorpay's signature is checked by the database,
and only then is the student enrolled or the slot booked. Paid slots cannot be booked without paying.
If two people pay for the same slot, the second payment is marked **Refund needed** in Admin > Payments.

## Email alerts (optional)

Create a free account at resend.com, then set `RESEND_API_KEY` and `ALERT_EMAIL` (comma-separated for several people).
You get an email for each new lead, enrolment request, online payment and private booking.

## Certificates

When an enrolled student finishes every weekly checkpoint and opens the Certificate page, the database issues a
permanent ID such as `YE-2026-A1B2C3`. Anyone can check it at `/verify?id=…`. Staff can issue or withdraw a
certificate from the student's page in the admin panel.

## Going live (hosting)

Any Node host works (Vercel is simplest): import the `web` folder, add the environment variables from
`.env.local.example` (not `SUPABASE_DB_URL`), deploy, then do "Website address" above and set the Razorpay webhook URL.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | run the site on http://localhost:3000 |
| `npm run db:migrate` | apply new database changes from `supabase/migrations` |
| `npm run db:role -- email owner\|trainer\|student` | change someone's role (or invite an email) |
| `npm run db:payments` | switch on online payment after adding Razorpay keys |
| `npm run db:status` | show applied migrations and how many accounts of each role |

## Also before launch
- Real Google Meet links are added per class in Admin > Classes.
- Set `SITE.url`, phone and WhatsApp number in `lib/data.ts`; the course price in `lib/learn-data.ts`.
- The lead trainer name printed on certificates is in `app/learn/certificate/page.tsx`.
- Wording: "Certificate of Completion". Do not claim government or university accreditation.
