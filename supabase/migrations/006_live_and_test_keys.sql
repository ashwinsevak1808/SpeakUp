-- The live site uses Razorpay LIVE keys, local development uses TEST keys, and both talk to this one
-- database. Keep both secrets and accept a signature made with either (both are private, so this is
-- exactly as safe). Settings: razorpay_key_secret_live, razorpay_key_secret_test (written by
-- `npm run db:payments`); the old single razorpay_key_secret is still read for compatibility.

create or replace function private.razorpay_secrets() returns text[]
language sql stable security definer set search_path = private as $$
  select coalesce(array_agg(value) filter (where coalesce(value, '') <> ''), '{}')
  from private.settings where key in ('razorpay_key_secret', 'razorpay_key_secret_live', 'razorpay_key_secret_test')
$$;
revoke execute on function private.razorpay_secrets() from public, anon, authenticated;

create or replace function public.payments_ready() returns boolean
language sql stable security definer set search_path = public as $$ select cardinality(private.razorpay_secrets()) > 0 $$;

create or replace function public.attach_order(p_payment_id uuid, p_order_id text, p_proof text) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare sec text; ok boolean := false; n int;
begin
  if not public.payments_ready() then return 'payments-off'; end if;
  foreach sec in array private.razorpay_secrets() loop
    if p_proof = encode(hmac(p_payment_id::text || ':' || p_order_id, sec, 'sha256'), 'hex') then ok := true; end if;
  end loop;
  if not ok then return 'bad-proof'; end if;
  update public.payments set order_id = p_order_id where id = p_payment_id and status = 'created' and order_id is null;
  get diagnostics n = row_count;
  return case when n = 1 then 'ok' else 'missing' end;
end $$;

create or replace function public.confirm_payment(p_order_id text, p_payment_id text, p_signature text) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare sec text; ok boolean := false; p public.payments; s public.sessions; me public.profiles;
begin
  if not public.payments_ready() then return 'payments-off'; end if;
  foreach sec in array private.razorpay_secrets() loop
    if p_signature = encode(hmac(p_order_id || '|' || p_payment_id, sec, 'sha256'), 'hex') then ok := true; end if;
  end loop;
  if not ok then return 'bad-signature'; end if;
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

-- Move the single old secret to the right slot (test keys were the only ones used so far).
insert into private.settings (key, value)
  select 'razorpay_key_secret_test', value from private.settings where key = 'razorpay_key_secret' and coalesce(value, '') <> ''
on conflict (key) do update set value = excluded.value;
update private.settings set value = '' where key = 'razorpay_key_secret';

revoke execute on function public.payments_ready(), public.attach_order(uuid, text, text), public.confirm_payment(text, text, text) from public;
grant execute on function public.payments_ready(), public.attach_order(uuid, text, text), public.confirm_payment(text, text, text) to anon, authenticated;
