# SpeakUp

Learn English online: a 12-week guided course (60 daily lessons, 44 grammar topics, weekly checkpoints,
speaking checks), live online classes with trainers, certificates, and an admin panel for the team.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Supabase (Postgres, Auth, row-level security) · Razorpay

## Run it

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run db:migrate                 # create the database tables (first time / after updates)
npm run dev                        # http://localhost:3000
```

Full setup, roles, payments, emails and going live: **[SETUP-SUPABASE.md](SETUP-SUPABASE.md)**.

## Where things are

| Area | Path |
|---|---|
| Public website | `app/(site)`, copy in `lib/data.ts` |
| Student app | `app/learn`, `components/learn` |
| Admin panel (trainers + owner) | `app/admin`, `components/admin` |
| Course content (12 weeks) | `lib/path-data.ts`, `lib/path-month2.ts`, `lib/path-month3.ts` |
| Who can open what (free period, prices) | `lib/access.ts`, `lib/learn-data.ts` |
| Database schema and security rules | `supabase/migrations/*.sql` |
| Payments | `lib/pay.ts`, `app/api/pay/*`, `lib/server/razorpay.ts` |

## Access model

- Until **28 February 2027** every lesson, test and grammar topic is free. Live classes need the full plan.
- After that, weeks 1 and 2 stay free; any other week unlocks for **₹1,000**.
- **Full plan ₹3,000:** live online classes + every chapter for 3 months + Certificate of Completion.

Secrets live only in `.env.local` (git-ignored). Never commit it.
