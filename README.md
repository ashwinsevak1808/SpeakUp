# Your English: website

Next.js 16 (App Router) + Tailwind CSS 4 + Framer Motion. 17 routes.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Edit your content (almost everything is in ONE file)
`lib/data.ts`: business name, phone, WhatsApp, address, social links, courses, syllabus,
trainers, testimonials, batches & fees, FAQs, level-test questions.

Other things to replace before launch:
- `SITE.url` in `lib/data.ts`: your real domain (used for SEO, sitemap).
- `SITE.mapEmbed`: Google Maps embed URL (Share → Embed a map → copy the `src`).
- `public/sample-chapter.pdf`: your real e-book sample chapter.
- **Photos:** see `IMAGE-PROMPTS.md`. Every image is a placeholder in `public/images/`; overwrite each with a same-named .jpg.
- Brand colours: `@theme` block at the top of `app/globals.css` (one green family: change `brand-*` and everything follows).

## Receive form leads
All forms post to `app/api/lead/route.ts`, which currently validates and logs.
Add one of: email (Resend), Google Sheets webhook, WhatsApp/Slack webhook, or a CRM.

## Pages
/ · /about · /courses · /courses/[slug] (5 courses) · /how-it-works · /beyond-the-classroom ·
/trainers · /success-stories · /pricing · /free-ebook · /faq · /corporate · /contact · /level-test

## Student area (online-first)
A guided 12-week course, not a test. Plain black/white/grey UI (`.app-theme` in `app/globals.css`).

**Students** (`/signup`, `/login`, then `/learn`): dashboard with today's lesson ("Start here"), LIVE indicator,
My Path (5-step daily lessons + weekly checkpoints), Live Classes (calendar + Google Meet join links for enrolled
students), Private Sessions (Rs 150 per 30 min), Review (your own missed exercises), Library, Tips, Certificate,
Settings (level, goal, voice).

**Trainers** (`/trainer`): schedule classes (one-off or daily/weekdays/weekly series), paste Google Meet links, press
**Go live**, see private bookings, and edit/add lessons. Sign in with `TRAINER_PASSCODE` (copy `.env.local.example` to
`.env.local`). With no env set, local development uses the passcode `trainer-demo`.

**Backend** (`app/api/*`, data in `/data/*.json`, git-ignored): `content` (lessons), `sessions` (classes + private
slots + bookings), `trainer` (sign-in). Lessons come from the backend, so trainers improve them without a code change.
The built-in course in `lib/path-data.ts` is only the starting copy.

**Personal**: level (intermediate students skip 4 beginner lessons), goal (lessons tagged "For your goal"), the voice and
speed used for listening, and a Review list built from each student's own mistakes. Speech is checked in the browser
(Chrome/Edge); no audio is recorded or stored by us.

Still in **demo mode**: accounts, enrolment and payment are simulated in the browser. See `SETUP-SUPABASE.md`.
