#!/usr/bin/env node
/**
 * Database helper (runs on your computer, uses SUPABASE_DB_URL from .env.local).
 *   npm run db:migrate                      apply new files in supabase/migrations, in order
 *   npm run db:role -- you@mail.com owner   make an account owner / trainer / student
 *   npm run db:status                       list applied migrations and account counts
 *   npm run db:payments                     turn on online payment (after adding Razorpay keys to .env.local)
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const url = process.env.SUPABASE_DB_URL;
if (!url) { console.error("SUPABASE_DB_URL is missing. Add it to .env.local."); process.exit(1); }
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
const [cmd, ...args] = process.argv.slice(2);

async function migrate() {
  await client.query("create schema if not exists ops; create table if not exists ops.migrations (name text primary key, applied_at timestamptz not null default now())");
  const done = new Set((await client.query("select name from ops.migrations")).rows.map((r) => r.name));
  const dir = path.join(process.cwd(), "supabase", "migrations");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  let n = 0;
  for (const f of files) {
    if (done.has(f)) continue;
    const sql = await readFile(path.join(dir, f), "utf8");
    await client.query("begin");
    try { await client.query(sql); await client.query("insert into ops.migrations (name) values ($1)", [f]); await client.query("commit"); }
    catch (e) { await client.query("rollback"); throw new Error(`${f}: ${e.message}`); }
    console.log(`applied ${f}`); n++;
  }
  await client.query("notify pgrst, 'reload schema'");
  console.log(n ? `${n} migration(s) applied.` : "Database is up to date.");
}

async function role() {
  const [email, r] = args;
  if (!email || !["owner", "trainer", "student"].includes(r)) { console.error("Usage: npm run db:role -- someone@mail.com owner|trainer|student"); process.exit(1); }
  const e = email.trim().toLowerCase();
  const { rowCount } = await client.query("update public.profiles set role = $2 where email = $1", [e, r]);
  if (rowCount) { console.log(`${e} is now ${r}.`); return; }
  if (r === "student") { console.log(`No account with ${e}.`); return; }
  await client.query("insert into public.staff_invites (email, role) values ($1, $2) on conflict (email) do update set role = excluded.role", [e, r]);
  console.log(`No account with ${e} yet. They become ${r} as soon as they sign up with that email.`);
}

/** Copy the Razorpay key secret (from .env.local) and the plan price/name (from lib/learn-data.ts) into the database.
 *  `npm run db:payments -- off` switches online payment off again. */
async function payments() {
  const src = await readFile(path.join(process.cwd(), "lib", "learn-data.ts"), "utf8");
  const price = src.match(/price:\s*(\d+)/)?.[1]; const name = src.match(/name:\s*"([^"]+)"/)?.[1];
  if (price) await client.query("insert into private.settings values ('plan_price', $1) on conflict (key) do update set value = excluded.value", [price]);
  if (name) await client.query("insert into private.settings values ('plan_name', $1) on conflict (key) do update set value = excluded.value", [name]);
  const secret = args[0] === "off" ? "" : process.env.RAZORPAY_KEY_SECRET ?? "";
  await client.query("insert into private.settings values ('razorpay_key_secret', $1) on conflict (key) do update set value = excluded.value", [secret]);
  console.log(`Plan: ${name} at ₹${price}. Online payment is ${secret ? "ON" : "OFF (no RAZORPAY_KEY_SECRET in .env.local)"}.`);
}

/** DANGER: delete every account and all data (tables, rules and payment settings stay), then create one owner.
 *  npm run db:wipe -- --yes owner@email.com "Password" "Owner Name" */
async function wipe() {
  const [flag, email, password, name = "Owner"] = args;
  if (flag !== "--yes" || !email || !password) { console.error('Usage: npm run db:wipe -- --yes owner@email.com "Password" "Owner Name"\nThis deletes ALL accounts, progress, classes, payments and leads.'); process.exit(1); }
  if (password.length < 8) { console.error("Use a password of at least 8 characters."); process.exit(1); }
  await client.query("begin");
  try {
    await client.query("truncate public.week_unlocks, public.payments, public.certificates, public.staff_notes, public.enrol_requests, public.bookings, public.session_links, public.sessions, public.leads, public.staff_invites, public.course_content, public.student_data restart identity cascade");
    await client.query("delete from auth.users");
    await client.query(`with u as (
      insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, reauthentication_token, phone_change, phone_change_token)
      values ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', lower($1), crypt($2, gen_salt('bf')), now(),
        '{"provider":"email","providers":["email"]}', jsonb_build_object('name', $3::text), now(), now(), '', '', '', '', '', '', '', '')
      returning id, email)
      insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
      select gen_random_uuid(), u.id, u.id::text, 'email', jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true), now(), now(), now() from u`, [email.trim(), password, name]);
    await client.query("update public.profiles set role = 'owner' where email = lower($1)", [email.trim()]);
    await client.query("commit");
  } catch (e) { await client.query("rollback"); throw new Error("Nothing was changed: " + e.message); }
  console.log(`Database cleaned. ${email.trim().toLowerCase()} is the owner and can log in now (email already confirmed).`);
}

async function status() {
  const m = await client.query("select name, applied_at from ops.migrations order by name").catch(() => ({ rows: [] }));
  for (const r of m.rows) console.log(`migration ${r.name}  ${r.applied_at.toISOString()}`);
  const c = await client.query("select role, count(*)::int n from public.profiles group by role order by role").catch(() => ({ rows: [] }));
  for (const r of c.rows) console.log(`${r.role}: ${r.n}`);
}

try {
  await client.connect();
  if (cmd === "migrate") await migrate();
  else if (cmd === "role") await role();
  else if (cmd === "status") await status();
  else if (cmd === "payments") await payments();
  else if (cmd === "wipe") await wipe();
  else { console.error("Commands: migrate | role <email> <owner|trainer|student> | status | payments [off]"); process.exitCode = 1; }
} catch (e) { console.error(e.message); process.exitCode = 1; }
finally { await client.end(); }
