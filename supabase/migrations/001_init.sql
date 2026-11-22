-- Your English: accounts, progress, classes, bookings, enrolments, lessons, leads.
-- Every table has row-level security: what a person can read or change is decided here,
-- in the database, not in the browser. Roles: student (default), trainer, owner.

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('student', 'trainer', 'owner');
exception when duplicate_object then null; end $$;

/* ---------------------------------------------------------------- tables */

create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text not null default '',
  name         text not null default '',
  phone        text,
  role         public.app_role not null default 'student',
  enrolled     boolean not null default false,
  plan         text,
  mumbai       boolean not null default false,
  enrolled_at  timestamptz,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz
);
create index if not exists profiles_role_idx on public.profiles (role);

-- Progress (lessons done, steps, stars, streak days, review list) and personal settings.
create table if not exists public.student_data (
  user_id    uuid primary key references public.profiles (id) on delete cascade,
  progress   jsonb not null default '{}'::jsonb,
  settings   jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Private notes trainers write about a student. Students never see these.
create table if not exists public.staff_notes (
  id          bigint generated always as identity primary key,
  student_id  uuid not null references public.profiles (id) on delete cascade,
  author_id   uuid references public.profiles (id) on delete set null,
  author_name text not null default '',
  body        text not null check (length(body) between 1 and 4000),
  created_at  timestamptz not null default now()
);
create index if not exists staff_notes_student_idx on public.staff_notes (student_id, created_at desc);

-- A student asks to enrol; staff approve once the payment has arrived.
create table if not exists public.enrol_requests (
  id           bigint generated always as identity primary key,
  user_id      uuid not null references public.profiles (id) on delete cascade,
  plan         text not null,
  mumbai       boolean not null default false,
  amount       int,
  status       text not null default 'pending' check (status in ('pending', 'approved', 'declined', 'cancelled')),
  student_note text,
  staff_note   text,
  created_at   timestamptz not null default now(),
  handled_by   uuid references public.profiles (id) on delete set null,
  handled_at   timestamptz
);
create unique index if not exists enrol_requests_one_pending on public.enrol_requests (user_id) where status = 'pending';

-- Live classes, private slots and in-person sessions.
create table if not exists public.sessions (
  id         text primary key default substr(md5(random()::text || clock_timestamp()::text), 1, 12),
  kind       text not null check (kind in ('group', 'private', 'inperson')),
  title      text not null,
  trainer    text not null,
  start_at   timestamptz not null,
  minutes    int not null check (minutes between 10 and 240),
  venue      text,
  notes      text,
  live       boolean,               -- true = forced live, false = forced ended, null = follow the clock
  price      int,
  booked     boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists sessions_start_idx on public.sessions (start_at);

-- Google Meet links live in their own table so they can be hidden row by row.
create table if not exists public.session_links (
  session_id text primary key references public.sessions (id) on delete cascade,
  link       text not null default ''
);

-- Who booked a private slot. Only the student and staff can read a booking.
create table if not exists public.bookings (
  session_id text primary key references public.sessions (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  name       text not null,
  email      text not null,
  booked_at  timestamptz not null default now()
);
create index if not exists bookings_user_idx on public.bookings (user_id);

-- The whole course as one document (the built-in course is used until a trainer saves an edit).
create table if not exists public.course_content (
  id         int primary key default 1 check (id = 1),
  weeks      jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

-- Every form on the website (demo class, ebook, corporate, level test, contact).
create table if not exists public.leads (
  id         bigint generated always as identity primary key,
  kind       text not null,
  name       text,
  email      text,
  phone      text,
  data       jsonb not null default '{}'::jsonb,
  status     text not null default 'new' check (status in ('new', 'contacted', 'converted', 'closed')),
  staff_note text,
  created_at timestamptz not null default now()
);
create index if not exists leads_created_idx on public.leads (created_at desc);

-- Trainers the owner has invited before they made an account. They get the role when they sign up.
create table if not exists public.staff_invites (
  email      text primary key,
  role       public.app_role not null check (role <> 'student'),
  invited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

/* ---------------------------------------------------------------- helpers */

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('trainer', 'owner') from public.profiles where id = auth.uid()), false)
$$;

create or replace function public.is_owner() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'owner' from public.profiles where id = auth.uid()), false)
$$;

create or replace function public.is_enrolled() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select enrolled from public.profiles where id = auth.uid()), false)
$$;

-- A new sign-up gets a profile, an empty progress row, and a staff role if the owner invited them.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare inv public.app_role;
begin
  select role into inv from public.staff_invites where email = lower(coalesce(new.email, ''));
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(inv, 'student')
  )
  on conflict (id) do nothing;
  insert into public.student_data (user_id) values (new.id) on conflict (user_id) do nothing;
  if inv is not null then delete from public.staff_invites where email = lower(new.email); end if;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.sync_user_email() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set email = lower(coalesce(new.email, '')) where id = new.id;
  return new;
end $$;

drop trigger if exists on_auth_user_email on auth.users;
create trigger on_auth_user_email after update of email on auth.users for each row execute function public.sync_user_email();

-- Students may edit their own name, phone and "last seen", never their role or enrolment.
-- (Not security definer on purpose: current_user tells us whether the call came from the app.)
create or replace function public.protect_profile() returns trigger
language plpgsql set search_path = public as $$
begin
  new.id := old.id;
  new.created_at := old.created_at;
  if current_user in ('anon', 'authenticated') then
    new.email := old.email;
    if not public.is_staff() then
      new.role := old.role;
      new.enrolled := old.enrolled;
      new.plan := old.plan;
      new.mumbai := old.mumbai;
      new.enrolled_at := old.enrolled_at;
    elsif new.role is distinct from old.role and not public.is_owner() then
      raise exception 'Only the owner can change who is a trainer.';
    end if;
  end if;
  if new.role is distinct from old.role and old.role = 'owner'
     and (select count(*) from public.profiles where role = 'owner') <= 1 then
    raise exception 'There must always be at least one owner.';
  end if;
  if new.enrolled and not old.enrolled then new.enrolled_at := coalesce(new.enrolled_at, now()); end if;
  if not new.enrolled then new.enrolled_at := null; end if;
  return new;
end $$;

drop trigger if exists protect_profile on public.profiles;
create trigger protect_profile before update on public.profiles for each row execute function public.protect_profile();

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at := now(); return new; end $$;

drop trigger if exists student_data_touch on public.student_data;
create trigger student_data_touch before update on public.student_data for each row execute function public.touch_updated_at();

/* ---------------------------------------------------------------- actions (RPC) */

-- Book a private slot. Locks the row so two students can never book the same slot.
create or replace function public.book_session(p_id text) returns text
language plpgsql security definer set search_path = public as $$
declare s public.sessions; me public.profiles;
begin
  if auth.uid() is null then return 'auth'; end if;
  select * into me from public.profiles where id = auth.uid();
  select * into s from public.sessions where id = p_id for update;
  if not found or s.kind <> 'private' then return 'missing'; end if;
  if s.start_at < now() then return 'past'; end if;
  if s.booked then return 'taken'; end if;
  insert into public.bookings (session_id, user_id, name, email) values (p_id, me.id, me.name, me.email);
  update public.sessions set booked = true where id = p_id;
  return 'ok';
end $$;

-- Cancel a booking: the student up to 2 hours before, staff at any time.
create or replace function public.cancel_booking(p_id text) returns text
language plpgsql security definer set search_path = public as $$
declare b public.bookings; s public.sessions;
begin
  select * into b from public.bookings where session_id = p_id;
  if not found then return 'missing'; end if;
  if not public.is_staff() then
    if b.user_id is distinct from auth.uid() then return 'missing'; end if;
    select * into s from public.sessions where id = p_id;
    if s.start_at - now() < interval '2 hours' then return 'late'; end if;
  end if;
  delete from public.bookings where session_id = p_id;
  update public.sessions set booked = false where id = p_id;
  return 'ok';
end $$;

-- Staff approve or decline an enrolment request. Approving enrols the student.
create or replace function public.handle_enrol_request(p_id bigint, p_approve boolean, p_note text default null) returns text
language plpgsql security definer set search_path = public as $$
declare r public.enrol_requests;
begin
  if not public.is_staff() then return 'forbidden'; end if;
  select * into r from public.enrol_requests where id = p_id for update;
  if not found then return 'missing'; end if;
  if r.status <> 'pending' then return 'done'; end if;
  update public.enrol_requests
     set status = case when p_approve then 'approved' else 'declined' end,
         staff_note = nullif(trim(coalesce(p_note, '')), ''), handled_by = auth.uid(), handled_at = now()
   where id = p_id;
  if p_approve then
    update public.profiles set enrolled = true, plan = r.plan, mumbai = r.mumbai, enrolled_at = now() where id = r.user_id;
  end if;
  return 'ok';
end $$;

-- Owner only: make someone a trainer/owner, or back to student. Invites the email if there is no account yet.
create or replace function public.set_staff_role(p_email text, p_role public.app_role) returns text
language plpgsql security definer set search_path = public as $$
declare e text := lower(trim(p_email)); n int;
begin
  if not public.is_owner() then return 'forbidden'; end if;
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return 'bad-email'; end if;
  if p_role = 'student' then
    delete from public.staff_invites where email = e;
  end if;
  update public.profiles set role = p_role where email = e;
  get diagnostics n = row_count;
  if n > 0 then return 'updated'; end if;
  if p_role = 'student' then return 'missing'; end if;
  insert into public.staff_invites (email, role, invited_by) values (e, p_role, auth.uid())
  on conflict (email) do update set role = excluded.role, invited_by = excluded.invited_by, created_at = now();
  return 'invited';
end $$;

/* ---------------------------------------------------------------- row-level security */

alter table public.profiles       enable row level security;
alter table public.student_data   enable row level security;
alter table public.staff_notes    enable row level security;
alter table public.enrol_requests enable row level security;
alter table public.sessions       enable row level security;
alter table public.session_links  enable row level security;
alter table public.bookings       enable row level security;
alter table public.course_content enable row level security;
alter table public.leads          enable row level security;
alter table public.staff_invites  enable row level security;

drop policy if exists "profiles read"   on public.profiles;
drop policy if exists "profiles update" on public.profiles;
create policy "profiles read"   on public.profiles for select to authenticated using (id = auth.uid() or public.is_staff());
create policy "profiles update" on public.profiles for update to authenticated using (id = auth.uid() or public.is_staff()) with check (id = auth.uid() or public.is_staff());

drop policy if exists "data read"   on public.student_data;
drop policy if exists "data insert" on public.student_data;
drop policy if exists "data update" on public.student_data;
create policy "data read"   on public.student_data for select to authenticated using (user_id = auth.uid() or public.is_staff());
create policy "data insert" on public.student_data for insert to authenticated with check (user_id = auth.uid());
create policy "data update" on public.student_data for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "notes staff"  on public.staff_notes;
drop policy if exists "notes add"    on public.staff_notes;
drop policy if exists "notes remove" on public.staff_notes;
create policy "notes staff"  on public.staff_notes for select to authenticated using (public.is_staff());
create policy "notes add"    on public.staff_notes for insert to authenticated with check (public.is_staff() and author_id = auth.uid());
create policy "notes remove" on public.staff_notes for delete to authenticated using (author_id = auth.uid() or public.is_owner());

drop policy if exists "requests read"   on public.enrol_requests;
drop policy if exists "requests create" on public.enrol_requests;
drop policy if exists "requests cancel" on public.enrol_requests;
create policy "requests read"   on public.enrol_requests for select to authenticated using (user_id = auth.uid() or public.is_staff());
create policy "requests create" on public.enrol_requests for insert to authenticated with check (user_id = auth.uid() and status = 'pending' and handled_by is null and handled_at is null and staff_note is null);
create policy "requests cancel" on public.enrol_requests for update to authenticated using (user_id = auth.uid() and status = 'pending') with check (user_id = auth.uid() and status = 'cancelled' and handled_by is null);

drop policy if exists "sessions read"  on public.sessions;
drop policy if exists "sessions staff" on public.sessions;
create policy "sessions read"  on public.sessions for select to authenticated using (true);
create policy "sessions staff" on public.sessions for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- The join link: staff always; enrolled students for group classes; the booker for their private slot.
drop policy if exists "links read"  on public.session_links;
drop policy if exists "links staff" on public.session_links;
create policy "links read" on public.session_links for select to authenticated using (
  public.is_staff()
  or exists (select 1 from public.sessions s where s.id = session_id and s.kind = 'group' and public.is_enrolled())
  or exists (select 1 from public.bookings b where b.session_id = session_links.session_id and b.user_id = auth.uid())
);
create policy "links staff" on public.session_links for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "bookings read"  on public.bookings;
create policy "bookings read" on public.bookings for select to authenticated using (user_id = auth.uid() or public.is_staff());

drop policy if exists "content read"  on public.course_content;
drop policy if exists "content staff" on public.course_content;
create policy "content read"  on public.course_content for select to anon, authenticated using (true);
create policy "content staff" on public.course_content for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "leads create" on public.leads;
drop policy if exists "leads staff"  on public.leads;
create policy "leads create" on public.leads for insert to anon, authenticated with check (status = 'new' and staff_note is null);
create policy "leads staff"  on public.leads for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "invites read"  on public.staff_invites;
drop policy if exists "invites owner" on public.staff_invites;
create policy "invites read"  on public.staff_invites for select to authenticated using (public.is_staff());
create policy "invites owner" on public.staff_invites for all to authenticated using (public.is_owner()) with check (public.is_owner());

/* ---------------------------------------------------------------- grants */

revoke all on all tables in schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.student_data, public.staff_notes, public.enrol_requests,
  public.sessions, public.session_links, public.bookings, public.course_content, public.leads, public.staff_invites to authenticated;
grant select on public.course_content to anon;
grant insert on public.leads to anon;

revoke execute on all functions in schema public from public, anon;
grant execute on function public.is_staff(), public.is_owner(), public.is_enrolled(),
  public.book_session(text), public.cancel_booking(text), public.handle_enrol_request(bigint, boolean, text),
  public.set_staff_role(text, public.app_role) to authenticated;
