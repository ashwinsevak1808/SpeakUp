-- When online payment is switched on, a paid private slot can only be booked by paying (confirm_payment books it).
-- Staff can still book on a student's behalf, and free slots (price 0) can still be booked directly.
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
  if public.payments_ready() and coalesce(s.price, 0) > 0 and not public.is_staff() then return 'pay'; end if;
  insert into public.bookings (session_id, user_id, name, email) values (p_id, me.id, me.name, me.email);
  update public.sessions set booked = true where id = p_id;
  return 'ok';
end $$;
revoke execute on function public.book_session(text) from public, anon;
grant execute on function public.book_session(text) to authenticated;
