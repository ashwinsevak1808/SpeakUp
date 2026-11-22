-- Fix: with no saved course edits, count(*) returned 0 weeks, so any enrolled student could claim a certificate.
-- Now: the number of published weeks in the saved course, or 12 (the built-in course) when there is none.
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
    select nullif(count(*)::int, 0) into weeks from public.course_content c, jsonb_array_elements(c.weeks) w
      where not coalesce((w ->> 'comingSoon')::boolean, false) and jsonb_array_length(w -> 'lessons') > 0;
    weeks := greatest(coalesce(weeks, 12), 1);
    for i in 1..weeks loop
      if not coalesce(done ? ('cp' || i), false) then raise exception 'not-finished'; end if;
    end loop;
  end if;
  delete from public.certificates where user_id = uid and revoked;
  cid := 'YE-' || to_char(now(), 'YYYY') || '-' || upper(substr(md5(random()::text || uid::text), 1, 6));
  insert into public.certificates (id, user_id, name, plan, issued_by) values (cid, uid, me.name, me.plan, auth.uid());
  return cid;
end $$;
revoke execute on function public.issue_certificate(uuid) from public, anon;
grant execute on function public.issue_certificate(uuid) to authenticated;
