-- Online payments (Razorpay), certificates people can verify, and owner-only account deletion.
--
-- Payments are verified INSIDE the database: the Razorpay key secret is stored in a private schema
-- that the website API cannot read, and confirm_payment() checks Razorpay's signature with it.
-- So nobody can mark themselves paid, and the site does not need Supabase's secret service key.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.settings (key text primary key, value text);
insert into private.settings (key, value) values
  ('plan_name', '3-Month Online Programme'),
  ('plan_price', '3000')
on conflict (key) do nothing;

create or replace function private.setting(k text) returns text
language sql stable security definer set search_path = private as $$ select value from private.settings where key = k $$;

/* ---------------------------------------------------------------- payments */

create table if not exists public.payments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  purpose     text not null check (purpose in ('enrol', 'session')),
  session_id  text references public.sessions (id) on delete set null,
  mumbai      boolean not null default false,
  amount      int not null check (amount > 0),        -- rupees
  currency    text not null default 'INR',
  status      text not null default 'created' check (status in ('created', 'paid', 'refund_needed', 'refunded', 'failed')),
  order_id    text unique,
  payment_id  text unique,
  note        text,
  created_at  timestamptz not null default now(),
  paid_at     timestamptz
);
create index if not exists payments_user_idx on public.payments (user_id, created_at desc);
alter table public.payments enable row level security;
drop policy if exists "payments read"  on public.payments;
drop policy if exists "payments staff" on public.payments;
create policy "payments read"  on public.payments for select to authenticated using (user_id = auth.uid() or public.is_staff());
create policy "payments staff" on public.payments for update to authenticated using (public.is_staff()) with check (public.is_staff());
grant select, update on public.payments to authenticated;

-- True when the owner has saved the Razorpay secret (npm run db:payments).
create or replace function public.payments_ready() returns boolean
language sql stable security definer set search_path = public as $$ select coalesce(private.setting('razorpay_key_secret'), '') <> '' $$;

-- Step 1 (student): open a payment. The PRICE IS DECIDED HERE, never by the browser.
create or replace function public.begin_payment(p_purpose text, p_session_id text default null, p_mumbai boolean default false)
returns table (payment_id uuid, amount int, description text)
language plpgsql security definer set search_path = public, extensions as $$
declare me public.profiles; s public.sessions; amt int; descr text; pid uuid;
begin
  if auth.uid() is null then raise exception 'login-required'; end if;
  if not public.payments_ready() then raise exception 'payments-off'; end if;
  select * into me from public.profiles where id = auth.uid();
  if p_purpose = 'enrol' then
    if me.enrolled then raise exception 'already-enrolled'; end if;
    amt := private.setting('plan_price')::int; descr := private.setting('plan_name');
  elsif p_purpose = 'session' then
    select * into s from public.sessions where id = p_session_id;
    if not found or s.kind <> 'private' then raise exception 'slot-missing'; end if;
    if s.booked then raise exception 'slot-taken'; end if;
    if s.start_at < now() then raise exception 'slot-past'; end if;
    amt := coalesce(s.price, 150); descr := s.title;
  else raise exception 'bad-purpose'; end if;
  insert into public.payments (user_id, purpose, session_id, mumbai, amount)
  values (me.id, p_purpose, case when p_purpose = 'session' then p_session_id end, coalesce(p_mumbai, false), amt)
  returning id into pid;
  return query select pid, amt, descr;
end $$;

-- Step 2 (server): link the Razorpay order. The proof is an HMAC only the server can make (it holds the secret).
create or replace function public.attach_order(p_payment_id uuid, p_order_id text, p_proof text) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare sec text := private.setting('razorpay_key_secret'); n int;
begin
  if coalesce(sec, '') = '' then return 'payments-off'; end if;
  if p_proof is distinct from encode(hmac(p_payment_id::text || ':' || p_order_id, sec, 'sha256'), 'hex') then return 'bad-proof'; end if;
  update public.payments set order_id = p_order_id where id = p_payment_id and status = 'created' and order_id is null;
  get diagnostics n = row_count;
  return case when n = 1 then 'ok' else 'missing' end;
end $$;

-- Step 3 (checkout or webhook): Razorpay's signature proves the money arrived. Then enrol / book. Safe to call twice.
create or replace function public.confirm_payment(p_order_id text, p_payment_id text, p_signature text) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare sec text := private.setting('razorpay_key_secret'); p public.payments; s public.sessions; me public.profiles;
begin
  if coalesce(sec, '') = '' then return 'payments-off'; end if;
  if p_signature is distinct from encode(hmac(p_order_id || '|' || p_payment_id, sec, 'sha256'), 'hex') then return 'bad-signature'; end if;
  select * into p from public.payments where order_id = p_order_id for update;
  if not found then return 'missing'; end if;
  if p.status = 'paid' then return 'ok'; end if;
  if p.status <> 'created' then return p.status; end if;
  update public.payments set status = 'paid', payment_id = p_payment_id, paid_at = now() where id = p.id;
  select * into me from public.profiles where id = p.user_id;

  if p.purpose = 'enrol' then
    update public.profiles set enrolled = true, plan = private.setting('plan_name'), mumbai = (mumbai or p.mumbai), enrolled_at = coalesce(enrolled_at, now()) where id = p.user_id;
    update public.enrol_requests set status = 'approved', staff_note = 'Paid online (' || p_payment_id || ')', handled_at = now() where user_id = p.user_id and status = 'pending';
    return 'ok';
  end if;

  select * into s from public.sessions where id = p.session_id for update;
  if not found or s.booked or s.start_at < now() then
    update public.payments set status = 'refund_needed', note = 'Slot was no longer free when the payment arrived.' where id = p.id;
    return 'refund_needed';
  end if;
  insert into public.bookings (session_id, user_id, name, email) values (s.id, me.id, me.name, me.email);
  update public.sessions set booked = true where id = s.id;
  return 'ok';
end $$;

/* ---------------------------------------------------------------- certificates */

create table if not exists public.certificates (
  id        text primary key,
  user_id   uuid not null unique references public.profiles (id) on delete cascade,
  name      text not null,
  plan      text,
  issued_at timestamptz not null default now(),
  issued_by uuid references public.profiles (id) on delete set null,
  revoked   boolean not null default false
);
alter table public.certificates enable row level security;
drop policy if exists "certs read"  on public.certificates;
drop policy if exists "certs staff" on public.certificates;
create policy "certs read"  on public.certificates for select to authenticated using (user_id = auth.uid() or public.is_staff());
create policy "certs staff" on public.certificates for update to authenticated using (public.is_staff()) with check (public.is_staff());
grant select, update on public.certificates to authenticated;

-- A student claims their certificate (enrolled + every published weekly checkpoint done),
-- or staff issue one for a student by id. Returns the certificate id. Re-claiming returns the same id.
create or replace function public.issue_certificate(p_user uuid default null) returns text
language plpgsql security definer set search_path = public as $$
declare uid uuid := coalesce(p_user, auth.uid()); me public.profiles; done jsonb; weeks int; cid text; i int;
begin
  if auth.uid() is null then raise exception 'login-required'; end if;
  if uid <> auth.uid() and not public.is_staff() then raise exception 'forbidden'; end if;
  select id into cid from public.certificates where user_id = uid and not revoked;
  if cid is not null then return cid; end if;
  select * into me from public.profiles where id = uid;
  if not found then raise exception 'missing'; end if;
  if uid = auth.uid() and not public.is_staff() then
    if not me.enrolled then raise exception 'not-enrolled'; end if;
    select coalesce(progress -> 'done', '[]'::jsonb) into done from public.student_data where user_id = uid;
    select coalesce((select count(*)::int from public.course_content c, jsonb_array_elements(c.weeks) w
                      where not coalesce((w ->> 'comingSoon')::boolean, false) and jsonb_array_length(w -> 'lessons') > 0), 12) into weeks;
    for i in 1..weeks loop
      if not coalesce(done ? ('cp' || i), false) then raise exception 'not-finished'; end if;
    end loop;
  end if;
  delete from public.certificates where user_id = uid and revoked;
  cid := 'YE-' || to_char(now(), 'YYYY') || '-' || upper(substr(md5(random()::text || uid::text), 1, 6));
  insert into public.certificates (id, user_id, name, plan, issued_by) values (cid, uid, me.name, me.plan, auth.uid());
  return cid;
end $$;

-- Anyone (an employer) can check a certificate id.
create or replace function public.verify_certificate(p_id text)
returns table (name text, plan text, issued_at timestamptz, valid boolean)
language sql stable security definer set search_path = public as $$
  select name, plan, issued_at, not revoked from public.certificates where id = upper(trim(p_id))
$$;

/* ---------------------------------------------------------------- account deletion */

-- Owner only: permanently delete a student or trainer account and everything linked to it.
create or replace function public.delete_account(p_user uuid) returns text
language plpgsql security definer set search_path = public as $$
declare r public.app_role;
begin
  if not public.is_owner() then return 'forbidden'; end if;
  if p_user = auth.uid() then return 'self'; end if;
  select role into r from public.profiles where id = p_user;
  if not found then return 'missing'; end if;
  if r = 'owner' then return 'owner'; end if;
  delete from auth.users where id = p_user;
  return 'ok';
end $$;

/* ---------------------------------------------------------------- grants */

revoke execute on all functions in schema public from public, anon;
grant execute on function public.is_staff(), public.is_owner(), public.is_enrolled(),
  public.book_session(text), public.cancel_booking(text), public.handle_enrol_request(bigint, boolean, text),
  public.set_staff_role(text, public.app_role), public.payments_ready(), public.begin_payment(text, text, boolean),
  public.issue_certificate(uuid), public.delete_account(uuid) to authenticated;
grant execute on function public.attach_order(uuid, text, text), public.confirm_payment(text, text, text),
  public.verify_certificate(text), public.payments_ready() to anon, authenticated;
revoke execute on function private.setting(text) from public, anon, authenticated;
