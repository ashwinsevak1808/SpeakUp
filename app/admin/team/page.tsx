"use client";
/** The team: who can open the admin panel. Only the owner can add or remove trainers. */
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Users } from "@/components/learn/icons";
import { Badge, EmptyState, PageTitle, Panel, btn } from "@/components/learn/ui";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Person, input } from "@/components/admin/bits";
import { ago, fmtDay, useAdmin } from "@/components/admin/data";

type Invite = { email: string; role: "trainer" | "owner"; created_at: string };

export default function Team() {
  const { user } = useAuth();
  const { staff, reload } = useAdmin();
  const owner = user?.role === "owner";
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"trainer" | "owner">("trainer");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const loadInvites = useCallback(() => { supabase().from("staff_invites").select("email, role, created_at").order("created_at", { ascending: false }).then(({ data }) => setInvites((data as Invite[]) ?? [])); }, []);
  useEffect(() => { loadInvites(); }, [loadInvites]);

  async function set(e: string, r: "student" | "trainer" | "owner") {
    setErr(""); setMsg("");
    const { data, error } = await supabase().rpc("set_staff_role", { p_email: e, p_role: r });
    if (error) { setErr(/at least one owner/i.test(error.message) ? "There must always be at least one owner." : error.message); return false; }
    const text: Record<string, string> = {
      updated: r === "student" ? `${e} is no longer on the team.` : `${e} is now ${r === "owner" ? "an owner" : "a trainer"}.`,
      invited: `${e} does not have an account yet. Ask them to sign up at /signup with this email; they become ${r === "owner" ? "an owner" : "a trainer"} straight away.`,
      missing: "No account with that email.", forbidden: "Only the owner can change the team.", "bad-email": "That email does not look right.",
    };
    if (data === "updated" || data === "invited") setMsg(text[data]); else setErr(text[data as string] ?? "Could not update.");
    reload(); loadInvites();
    return data === "updated" || data === "invited";
  }
  async function add(e: FormEvent) { e.preventDefault(); if (await set(email.trim(), role)) setEmail(""); }

  return (
    <div className="nx-page">
      <PageTitle eyebrow={`${staff.length} on the team${invites.length ? ` · ${invites.length} invited` : ""}`} title="Team" text="Trainers can see every student, approve enrolments, run classes and edit lessons. Only owners can change who is on the team." />
      {(msg || err) && <p role={err ? "alert" : "status"} className={cn("nx-card mb-6 p-4 text-sm font-medium", err ? "text-[var(--danger)]" : "text-[var(--accent-text)]")}>{err || msg}</p>}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Panel title="Trainers and owners" bodyClass="!p-0">
            {staff.length === 0 ? <EmptyState compact icon={Users} title="No one yet" /> : (
              <ul>{staff.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] px-5 py-3 first:border-t-0">
                  <div className="min-w-0 flex-1"><Person p={p} sub={`${p.email} · last seen ${ago(p.lastActive).toLowerCase()}`} /></div>
                  <Badge tone={p.role === "owner" ? "accent" : "neutral"}>{p.role === "owner" ? "Owner" : "Trainer"}</Badge>
                  {owner && p.id !== user?.id && (
                    <span className="flex gap-1.5">
                      <button onClick={() => set(p.email, p.role === "owner" ? "trainer" : "owner")} className={btn("ghost", "sm")}>{p.role === "owner" ? "Make trainer" : "Make owner"}</button>
                      <button onClick={() => confirm(`Remove ${p.name} from the team? They keep a normal student account.`) && set(p.email, "student")} className={btn("ghost", "sm", "hover:!text-[var(--danger)]")}>Remove</button>
                    </span>
                  )}
                  {p.id === user?.id && <span className="ty-label ty-subtle">You</span>}
                </li>
              ))}</ul>
            )}
          </Panel>
          {invites.length > 0 && (
            <Panel title="Invited, not signed up yet" desc="They get their role automatically when they create an account with this email." bodyClass="!p-0">
              <ul>{invites.map((i) => (
                <li key={i.email} className="flex items-center gap-3 border-t border-[var(--border)] px-5 py-3 first:border-t-0">
                  <div className="min-w-0 flex-1"><div className="ty-body ty-ink truncate">{i.email}</div><div className="ty-note ty-muted">Invited {fmtDay(i.created_at)}</div></div>
                  <Badge>{i.role === "owner" ? "Owner" : "Trainer"}</Badge>
                  {owner && <button onClick={async () => { await supabase().from("staff_invites").delete().eq("email", i.email); loadInvites(); }} className={btn("ghost", "sm")}>Cancel</button>}
                </li>
              ))}</ul>
            </Panel>
          )}
        </div>

        <aside className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-20">
          {owner ? (
            <form onSubmit={add} className="nx-card space-y-3 p-5">
              <div className="ty-subject ty-ink">Add a trainer</div>
              <p className="ty-note ty-muted">Enter the email they use (or will use) to log in.</p>
              <label className="block"><span className="ty-label ty-subtle mb-1 block">Email</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="trainer@example.com" className={input} /></label>
              <label className="block"><span className="ty-label ty-subtle mb-1 block">Role</span><select value={role} onChange={(e) => setRole(e.target.value as "trainer" | "owner")} className={input}><option value="trainer">Trainer</option><option value="owner">Owner (can manage the team)</option></select></label>
              <button disabled={!email.trim()} className={btn("primary", "md", "w-full")}>Add to team</button>
            </form>
          ) : <p className="nx-card ty-body ty-muted p-5">Only an owner can add or remove trainers.</p>}
          <section className="nx-card p-5">
            <div className="ty-subject ty-ink">What each role can do</div>
            <dl className="nx-facts mt-2">
              <div><dt>Student</dt><dd>Learn, book, enrol</dd></div>
              <div><dt>Trainer</dt><dd>Everything in admin</dd></div>
              <div><dt>Owner</dt><dd>Admin + team</dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
