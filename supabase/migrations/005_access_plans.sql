-- Access model:
--  * Full plan (₹3,000): live classes + every chapter for 3 months + certificate. plan_until = paid date + 3 months.
--  * Single chapter (₹1,000): unlocks one week of the path for good (week_unlocks).
--  * "enrolled" = has bought the full plan at least once (needed for the certificate);
--    is_enrolled() = the plan is active right now (needed for live-class links).

alter table public.profiles add column if not exists plan_until timestamptz;
update public.profiles set plan_until = coalesce(enrolled_at, now()) + interval '3 months' where enrolled and plan_until is null;

insert into private.settings (key, value) values ('week_price', '1000'), ('plan_months', '3') on conflict (key) do nothing;

create table if not exists public.week_unlocks (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  week       int not null check (week between 1 and 52),
  payment_id uuid references public.payments (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (user_id, week)
);
alter table public.week_unlocks enable row level security;
drop policy if exists "unlocks read"  on public.week_unlocks;
drop policy if exists "unlocks staff" on public.week_unlocks;
create policy "unlocks read"  on public.week_unlocks for select to authenticated using (user_id = auth.uid() or public.is_staff());
create policy "unlocks staff" on public.week_unlocks for all to authenticated using (public.is_staff()) with check (public.is_staff());
grant select, insert, delete on public.week_unlocks to authenticated;

alter table public.payments add column if not exists week int;
alter table public.payments drop constraint if exists payments_purpose_check;
alter table public.payments add constraint payments_purpose_check check (purpose in ('enrol', 'session', 'week'));

-- Active plan right now.
create or replace function public.is_enrolled() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select enrolled and (plan_until is null or plan_until > now()) from public.profiles where id = auth.uid()), false)
$$;

-- Staff enrolling someone by hand (or approving a request) gives the same 3 months.
create or replace function public.protect_profile() returns trigger
language plpgsql set search_path = public as $$
begin
  new.id := old.id;
  new.created_at := old.created_at;
  if current_user in ('anon', 'authenticated') then
    new.email := old.email;
    if not public.is_staff() then
      new.role := old.role; new.enrolled := old.enrolled; new.plan := old.plan; new.mumbai := old.mumbai;
      new.enrolled_at := old.enrolled_at; new.plan_until := old.plan_until;
    elsif new.role is distinct from old.role and not public.is_owner() then
      raise exception 'Only the owner can change who is a trainer.';
    end if;
  end if;
  if new.role is distinct from old.role and old.role = 'owner'
     and (select count(*) from public.profiles where role = 'owner') <= 1 then
    raise exception 'There must always be at least one owner.';
  end if;
  if new.enrolled and not old.enrolled then
    new.enrolled_at := coalesce(new.enrolled_at, now());
    if new.plan_until is null or new.plan_until < now() then new.plan_until := now() + interval '3 months'; end if;
  end if;
  if not new.enrolled then new.enrolled_at := null; new.plan_until := null; end if;
  return new;
end $$;

drop function if exists public.begin_payment(text, text, boolean);
create or replace function public.begin_payment(p_purpose text, p_session_id text default null, p_mumbai boolean default false, p_week int default null)
returns table (payment_id uuid, amount int, description text)
language plpgsql security definer set search_path = public, extensions as $$
declare me public.profiles; s public.sessions; amt int; descr text; pid uuid;
begin
  if auth.uid() is null then raise exception 'login-required'; end if;
  if not public.payments_ready() then raise exception 'payments-off'; end if;
  select * into me from public.profiles where id = auth.uid();
  if p_purpose = 'enrol' then
    if me.enrolled and me.plan_until > now() + interval '7 days' then raise exception 'already-enrolled'; end if;
    amt := private.setting('plan_price')::int; descr := private.setting('plan_name');
  elsif p_purpose = 'week' then
    if p_week is null or p_week < 1 or p_week > 52 then raise exception 'bad-week'; end if;
    if me.enrolled and me.plan_until > now() then raise exception 'already-enrolled'; end if;
    if exists (select 1 from public.week_unlocks where user_id = me.id and week = p_week) then raise exception 'already-unlocked'; end if;
    amt := private.setting('week_price')::int; descr := 'Unlock Week ' || p_week;
  elsif p_purpose = 'session' then
    select * into s from public.sessions where id = p_session_id;
    if not found or s.kind <> 'private' then raise exception 'slot-missing'; end if;
    if s.booked then raise exception 'slot-taken'; end if;
    if s.start_at < now() then raise exception 'slot-past'; end if;
    amt := coalesce(s.price, 150); descr := s.title;
  else raise exception 'bad-purpose'; end if;
  insert into public.payments (user_id, purpose, session_id, week, mumbai, amount)
  values (me.id, p_purpose, case when p_purpose = 'session' then p_session_id end, case when p_purpose = 'week' then p_week end, false, amt)
  returning id into pid;
  return query select pid, amt, descr;
end $$;

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
    update public.profiles set enrolled = true, plan = private.setting('plan_name'), enrolled_at = coalesce(enrolled_at, now()),
      plan_until = greatest(coalesce(plan_until, now()), now()) + (coalesce(private.setting('plan_months'), '3') || ' months')::interval
    where id = p.user_id;
    update public.enrol_requests set status = 'approved', staff_note = 'Paid online (' || p_payment_id || ')', handled_at = now() where user_id = p.user_id and status = 'pending';
    return 'ok';
  end if;
  if p.purpose = 'week' then
    insert into public.week_unlocks (user_id, week, payment_id) values (p.user_id, p.week, p.id) on conflict do nothing;
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

-- Certificate IDs now carry the SpeakUp prefix.
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
    if not me.enrolled then raise exception 'not-enrolled'; end if;   -- certificate only with a purchased plan
    select coalesce(progress -> 'done', '[]'::jsonb) into done from public.student_data where user_id = uid;
    select nullif(count(*)::int, 0) into weeks from public.course_content c, jsonb_array_elements(c.weeks) w
      where not coalesce((w ->> 'comingSoon')::boolean, false) and jsonb_array_length(w -> 'lessons') > 0;
    weeks := greatest(coalesce(weeks, 12), 1);
    for i in 1..weeks loop
      if not coalesce(done ? ('cp' || i), false) then raise exception 'not-finished'; end if;
    end loop;
  end if;
  delete from public.certificates where user_id = uid and revoked;
  cid := 'SU-' || to_char(now(), 'YYYY') || '-' || upper(substr(md5(random()::text || uid::text), 1, 6));
  insert into public.certificates (id, user_id, name, plan, issued_by) values (cid, uid, me.name, me.plan, auth.uid());
  return cid;
end $$;

revoke execute on all functions in schema public from public, anon;
grant execute on function public.is_staff(), public.is_owner(), public.is_enrolled(),
  public.book_session(text), public.cancel_booking(text), public.handle_enrol_request(bigint, boolean, text),
  public.set_staff_role(text, public.app_role), public.payments_ready(), public.begin_payment(text, text, boolean, int),
  public.issue_certificate(uuid), public.delete_account(uuid) to authenticated;
grant execute on function public.attach_order(uuid, text, text), public.confirm_payment(text, text, text),
  public.verify_certificate(text), public.payments_ready() to anon, authenticated;
