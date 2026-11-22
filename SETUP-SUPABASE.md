# Going from demo to real: accounts, payments, certificates

Right now the student area runs in **demo mode**: accounts and progress are saved in the
visitor's own browser (`lib/store.ts`). That is perfect for testing and showing the product,
but NOT for real students: nothing syncs between devices, and a student could edit their own
progress or mark themselves enrolled. Before taking real money, do these three things.

All the pages only talk to `lib/auth.ts`. Replace what is inside it (and delete `lib/store.ts`)
and every page keeps working.

## 1. Accounts + progress: Supabase (free tier is enough for the first batch)
1. Create a project at supabase.com. Copy the Project URL and anon key into `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL=...` and `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
2. `npm i @supabase/supabase-js`
3. In the SQL editor, run:

```sql
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  enrolled boolean not null default false,   -- ONLY the server may set this (see step 2)
  plan text, mumbai boolean default false, enrolled_at timestamptz,
  created_at timestamptz default now()
);
create table path_progress (          -- one row per lesson or checkpoint a student has touched
  user_id uuid references profiles on delete cascade, node_id text,   -- 'd01'..'d20', 'cp1'..'cp4'
  step int not null default 0,        -- last lesson step reached (0 warm-up .. 3 speak), for resume
  done_at timestamptz, stars int,     -- done_at set when finished; stars (1-3) for checkpoints
  primary key (user_id, node_id)
);
create table library_reads (user_id uuid references profiles on delete cascade, chapter_id text, read_at timestamptz default now(), primary key (user_id, chapter_id));
create table activity_days (user_id uuid references profiles on delete cascade, day date, primary key (user_id, day));
create table certificates (id text primary key, user_id uuid references profiles, issued_at timestamptz default now());

alter table profiles enable row level security;
alter table path_progress enable row level security;
alter table library_reads enable row level security;
alter table activity_days enable row level security;
alter table certificates enable row level security;

create policy "own profile read"   on profiles for select using (auth.uid() = id);
create policy "own profile name"   on profiles for update using (auth.uid() = id) with check (auth.uid() = id and enrolled = (select enrolled from profiles where id = auth.uid()));
create policy "own path"    on path_progress   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own reads"   on library_reads   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own days"    on activity_days   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "anyone can verify a certificate id" on certificates for select using (true);
```
4. In `lib/auth.ts`: `signup`/`login`/`logout` become `supabase.auth.signUp / signInWithPassword / signOut`;
   `useAuth` reads the session and the rows above; `setStep` / `completeLesson` / `completeCheckpoint` / `toggleRead` upsert rows.

## 2. Payment: Razorpay (UPI, cards, net banking; ~2% fee)
**Never** mark a student enrolled from the browser. The flow must be:
1. Student clicks Enrol -> your server route `POST /api/pay/order` creates a Razorpay order for the plan price.
2. Browser opens Razorpay Checkout with that order id.
3. Razorpay calls your webhook `POST /api/pay/webhook` (verify the signature with your webhook secret).
4. The webhook, using the Supabase **service-role key** (server only), sets `profiles.enrolled = true`.
Replace the button in `components/learn/EnrolDialog.tsx` with steps 1-2. Keep keys in `.env.local`, never in the repo.

## 3. Certificates people can verify
- When a student becomes eligible, a server route inserts a row in `certificates` and returns the id (`YE-2026-A1B2C3`).
- Add a public page `/verify/[id]` that looks the id up and shows "Valid: <name>, completed <date>".
  Employers can then check a certificate is real. (The demo certificate id is not verifiable.)
- Wording: keep "Certificate of Completion". Do not claim government or university accreditation.

## Also before launch
- Put real Google Meet links and timings in `lib/learn-data.ts`.
- Add your real domain to `SITE.url` in `lib/data.ts`; fill `/public/images` (see IMAGE-PROMPTS.md).
- The lessons are served from `public/book`, a copy of your `book/` folder. If you edit the book, copy it again:
  `cp -R ../book/chapters ../book/themes ../book/book.js ../book/index.html public/book/`
- Send lead forms (`app/api/lead/route.ts`) somewhere real (email / Google Sheet).

## Live classes, bookings and lessons (already built; what to change for production)
The backend in `app/api/*` stores sessions and lessons in JSON files under `/data`. That is perfect on your own
computer or a VPS. **Serverless hosts (Vercel) cannot keep files**, so move these to Supabase tables:

```sql
create table sessions (
  id text primary key, kind text not null check (kind in ('group','private','inperson')),
  title text not null, trainer text not null, start timestamptz not null, minutes int not null,
  link text, venue text, notes text, live boolean, price int,
  booked_by uuid references profiles, booked_at timestamptz
);
create table lessons (id text primary key, week int not null, day int not null, body jsonb not null, updated_at timestamptz default now());
alter table profiles add column role text not null default 'student';   -- set 'trainer' for your trainers
```
Policies to add (this is what makes the join link genuinely private):
- `sessions`: everyone may read rows **except the `link` column**; the link is returned only through a server function for
  students whose `profiles.enrolled = true` (group classes) or who are `booked_by` (private sessions).
- `sessions`, `lessons`: insert/update/delete only where the caller's `profiles.role = 'trainer'`.
- Replace the trainer passcode in `lib/server/trainer-auth.ts` with Supabase Auth.

**Known limits of the demo backend**
- Enrolment is a flag in the student's own browser, so the Google Meet link is only hidden in the interface, not at the
  network level. A technical student could read it from `/api/sessions`. Fixed by the policies above.
- The private-session payment is simulated. Razorpay must create the order and confirm it on the server before a slot is booked.
