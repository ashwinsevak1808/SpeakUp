import type { Session } from "../live";

/** Starter schedule written the first time the backend runs. Trainers replace it from /trainer. */
const IST = 5.5 * 3600000;
const istIso = (daysFromToday: number, h: number, m = 0) => {
  const t = new Date(Date.now() + IST); // "now" shifted so UTC fields read as India time
  return new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate() + daysFromToday, h, m) - IST).toISOString();
};
const id = () => Math.random().toString(36).slice(2, 10);

export function seedSessions(): Session[] {
  const out: Session[] = [];
  const titles = ["Speaking Practice Circle", "Grammar Clinic", "Conversation Lab", "Pronunciation Workshop", "Interview and Work English"];
  const trainers = ["Priya Deshmukh", "Rahul Kulkarni"];
  for (let d = 0; d < 14; d++) out.push({ id: id(), kind: "group", title: titles[d % titles.length], trainer: trainers[d % 2], start: istIso(d, 20), minutes: 60, link: "https://meet.google.com/your-class-link", notes: "Join 5 minutes early. Keep your microphone on mute until you speak." });
  for (let d = 0; d < 7; d++) {
    out.push({ id: id(), kind: "private", title: "Private session (30 min)", trainer: "Priya Deshmukh", start: istIso(d, 18), minutes: 30, link: "https://meet.google.com/your-private-link", price: 150, booked: null });
    out.push({ id: id(), kind: "private", title: "Private session (30 min)", trainer: "Rahul Kulkarni", start: istIso(d, 19), minutes: 30, link: "https://meet.google.com/your-private-link", price: 150, booked: null });
  }
  for (const d of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]) {
    const day = new Date(Date.now() + IST + d * 86400000).getUTCDay();
    if (day === 0) out.push({ id: id(), kind: "inperson", title: "Mumbai Practical Session", trainer: "Priya Deshmukh", start: istIso(d, 17), minutes: 90, link: "", venue: "Andheri West, Mumbai (exact venue shared on WhatsApp)", notes: "Role-plays, mock interviews and speaking club." });
  }
  return out.sort((a, b) => +new Date(a.start) - +new Date(b.start));
}
