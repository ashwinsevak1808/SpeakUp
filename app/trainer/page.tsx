"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Radio, Trash2 } from "@/components/learn/icons";
import { KIND_LABEL, PRIVATE_PRICE, dayKey, fmtDate, fmtTime, isLive, type SessionKind, type SessionView } from "@/lib/live";
import { useNow } from "@/lib/use-live";
import { LiveBadge } from "@/components/learn/live";
import { api } from "@/components/trainer/api";
import { cn } from "@/lib/utils";

const input = "w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent-600 focus:ring-2 focus:ring-accent-500/20";
const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) => <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">{children}</label>;
const tomorrow = () => new Date(Date.now() + 5.5 * 3600000 + 86400000).toISOString().slice(0, 10);

export default function TrainerSchedule() {
  const now = useNow(15000);
  const [sessions, setSessions] = useState<SessionView[]>([]);
  const [msg, setMsg] = useState("");
  const [errs, setErrs] = useState<string[]>([]);
  const [f, setF] = useState({ kind: "group" as SessionKind, title: "Speaking Practice Circle", trainer: "Priya Deshmukh", date: tomorrow(), time: "20:00", minutes: 60, link: "", notes: "", repeat: "daily", count: 14, price: PRIVATE_PRICE, venue: "" });

  const load = useCallback(() => api<{ sessions: SessionView[] }>("/api/sessions").then((r) => { if (r.ok) setSessions(r.data.sessions); }), []);
  useEffect(() => { load(); }, [load]);

  async function create(e: FormEvent) {
    e.preventDefault(); setErrs([]); setMsg("");
    const r = await api<{ created?: number }>("/api/sessions", "POST", { ...f, repeat: f.kind === "private" && f.repeat === "none" ? "none" : f.repeat });
    if (r.ok) { setMsg(`Created ${r.data.created} session${r.data.created === 1 ? "" : "s"}.`); load(); } else setErrs(r.data.errors ?? [r.data.error ?? "Could not create."]);
  }
  const patch = async (id: string, body: object) => { await api(`/api/sessions/${id}`, "PUT", body); load(); };
  const remove = async (id: string) => { if (confirm("Delete this session?")) { await api(`/api/sessions/${id}`, "DELETE"); load(); } };

  const upcoming = sessions.filter((s) => +new Date(s.start) + s.minutes * 60000 > +now - 2 * 3600000);
  const liveList = sessions.filter((s) => isLive(s, now));
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
      <form onSubmit={create} className="h-fit min-w-0 space-y-4 nx-card p-5">
        <h2 className="font-display text-lg font-semibold text-brand-900">Schedule a class</h2>
        <div><Label htmlFor="kind">Type</Label><select id="kind" value={f.kind} onChange={(e) => { const k = e.target.value as SessionKind; setF((x) => ({ ...x, kind: k, minutes: k === "private" ? 30 : k === "inperson" ? 90 : 60, title: k === "private" ? "Private session (30 min)" : k === "inperson" ? "Mumbai Practical Session" : x.title, repeat: k === "inperson" ? "weekly" : x.repeat })); }} className={input}>{(Object.keys(KIND_LABEL) as SessionKind[]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}</select></div>
        <div><Label htmlFor="title">Title</Label><input id="title" value={f.title} onChange={(e) => set("title", e.target.value)} className={input} /></div>
        <div><Label htmlFor="trainer">Trainer name</Label><input id="trainer" value={f.trainer} onChange={(e) => set("trainer", e.target.value)} className={input} /></div>
        <div className="grid grid-cols-2 gap-3"><div><Label htmlFor="date">Start date</Label><input id="date" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} className={input} /></div><div><Label htmlFor="time">Time (India)</Label><input id="time" type="time" value={f.time} onChange={(e) => set("time", e.target.value)} className={input} /></div></div>
        <div className="grid grid-cols-2 gap-3"><div><Label htmlFor="minutes">Length (min)</Label><input id="minutes" type="number" min={10} max={240} value={f.minutes} onChange={(e) => set("minutes", Number(e.target.value))} className={input} /></div>{f.kind === "private" && <div><Label htmlFor="price">Price (₹)</Label><input id="price" type="number" min={0} value={f.price} onChange={(e) => set("price", Number(e.target.value))} className={input} /></div>}</div>
        {f.kind !== "inperson" ? <div><Label htmlFor="link">Google Meet link</Label><input id="link" placeholder="https://meet.google.com/abc-defg-hij" value={f.link} onChange={(e) => set("link", e.target.value)} className={input} /></div> : <div><Label htmlFor="venue">Venue</Label><input id="venue" value={f.venue} onChange={(e) => set("venue", e.target.value)} className={input} /></div>}
        <div><Label htmlFor="notes">Notes for students (optional)</Label><input id="notes" value={f.notes} onChange={(e) => set("notes", e.target.value)} className={input} /></div>
        <div className="grid grid-cols-2 gap-3"><div><Label htmlFor="repeat">Repeat</Label><select id="repeat" value={f.repeat} onChange={(e) => set("repeat", e.target.value)} className={input}><option value="none">Just once</option><option value="daily">Every day</option><option value="weekdays">Weekdays only</option><option value="weekly">Every week</option></select></div>{f.repeat !== "none" && <div><Label htmlFor="count">How many</Label><input id="count" type="number" min={1} max={60} value={f.count} onChange={(e) => set("count", Number(e.target.value))} className={input} /></div>}</div>
        {errs.length > 0 && <ul role="alert" className="space-y-1 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{errs.map((e) => <li key={e}>{e}</li>)}</ul>}
        {msg && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm font-semibold text-ok">{msg}</p>}
        <button className="w-full rounded-lg bg-accent-600 py-3 font-semibold text-white hover:bg-accent-700">Create</button>
      </form>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold text-brand-900">Live now</h2>
        {liveList.length === 0 ? <p className="mb-8 rounded-xl border border-dashed border-line p-5 text-sm text-muted">Nothing is live. A class goes live automatically at its start time, or press <b>Go live</b> below.</p> : <div className="mb-8 space-y-3">{liveList.map((s) => <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-live/30 bg-red-50 p-4"><LiveBadge /><span className="font-semibold text-brand-900">{s.title}</span><span className="text-sm text-muted">{s.trainer}</span><button onClick={() => patch(s.id, { live: false })} className="ml-auto rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white">End class</button></div>)}</div>}

        <h2 className="mb-3 font-display text-lg font-semibold text-brand-900">Upcoming ({upcoming.length})</h2>
        <div className="space-y-3">
          {upcoming.slice(0, 40).map((s) => <Row key={s.id} s={s} now={now} onSave={patch} onDelete={remove} />)}
        </div>
      </div>
    </div>
  );
}

function Row({ s, now, onSave, onDelete }: { s: SessionView; now: Date; onSave: (id: string, b: object) => void; onDelete: (id: string) => void }) {
  const [edit, setEdit] = useState(false);
  const [v, setV] = useState({ title: s.title, trainer: s.trainer, link: s.link, notes: s.notes ?? "", date: dayKey(s.start), time: new Date(s.start).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }) });
  const live = isLive(s, now);
  return (
    <div className={cn("rounded-xl border bg-white p-4", live ? "border-live/40" : "border-line")}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-28 shrink-0 text-sm"><div className="font-semibold text-brand-900">{fmtDate(s.start)}</div><div className="text-muted">{fmtTime(s.start)} · {s.minutes}m</div></div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2">{live && <LiveBadge />}<span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-600">{KIND_LABEL[s.kind]}</span>{s.booked && <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-ok">Booked: {s.booked.name}</span>}</div><div className="mt-1 font-semibold text-brand-900">{s.title}</div><div className="truncate text-sm text-muted">{s.trainer}{s.link ? ` · ${s.link}` : s.kind !== "inperson" ? " · no link yet" : ""}</div></div>
        <div className="flex items-center gap-2">
          {s.kind !== "inperson" && (live ? <button onClick={() => onSave(s.id, { live: false })} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-brand-900 hover:bg-brand-50">End</button> : <button onClick={() => onSave(s.id, { live: true })} className="flex items-center gap-1.5 rounded-lg bg-live px-3 py-2 text-sm font-semibold text-white"><Radio className="h-4 w-4" />Go live</button>)}
          <button onClick={() => setEdit((e) => !e)} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-brand-900 hover:bg-brand-50">{edit ? "Close" : "Edit"}</button>
          <button onClick={() => onDelete(s.id)} aria-label="Delete session" className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-live"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
      {edit && (
        <div className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
          <div><Label htmlFor={`t-${s.id}`}>Title</Label><input id={`t-${s.id}`} value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} className={input} /></div>
          <div><Label htmlFor={`tr-${s.id}`}>Trainer</Label><input id={`tr-${s.id}`} value={v.trainer} onChange={(e) => setV({ ...v, trainer: e.target.value })} className={input} /></div>
          <div className="sm:col-span-2"><Label htmlFor={`l-${s.id}`}>Google Meet link</Label><input id={`l-${s.id}`} value={v.link} onChange={(e) => setV({ ...v, link: e.target.value })} className={input} placeholder="https://meet.google.com/..." /></div>
          <div><Label htmlFor={`d-${s.id}`}>Date</Label><input id={`d-${s.id}`} type="date" value={v.date} onChange={(e) => setV({ ...v, date: e.target.value })} className={input} /></div>
          <div><Label htmlFor={`ti-${s.id}`}>Time (India)</Label><input id={`ti-${s.id}`} type="time" value={v.time} onChange={(e) => setV({ ...v, time: e.target.value })} className={input} /></div>
          <div className="sm:col-span-2"><Label htmlFor={`n-${s.id}`}>Notes</Label><input id={`n-${s.id}`} value={v.notes} onChange={(e) => setV({ ...v, notes: e.target.value })} className={input} /></div>
          <div className="sm:col-span-2"><button onClick={() => { onSave(s.id, v); setEdit(false); }} className="rounded-lg bg-accent-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-700">Save changes</button></div>
        </div>
      )}
    </div>
  );
}
