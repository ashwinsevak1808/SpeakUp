import type { Item, Lesson } from "./path-data";

/** Checks a lesson object (from the trainer editor) before it is saved. Returns a list of problems; empty = valid. */
export function validateLesson(x: unknown): string[] {
  const e: string[] = [];
  const l = x as Partial<Lesson>;
  if (!l || typeof l !== "object") return ["Lesson must be an object."];
  const str = (v: unknown, name: string) => { if (typeof v !== "string" || !v.trim()) e.push(`${name} is required.`); };
  str(l.id, "id"); str(l.title, "title"); str(l.goal, "goal");
  if (l.id && !/^[a-z0-9-]{2,24}$/i.test(l.id)) e.push("id may only contain letters, numbers and dashes (2 to 24 characters).");
  if (!["Start here", "Grammar", "Speaking", "Vocabulary", "Conversation", "Project"].includes(String(l.kind))) e.push("kind must be one of: Start here, Grammar, Speaking, Vocabulary, Conversation, Project.");
  if (typeof l.day !== "number" || l.day < 1) e.push("day must be a number (1 or more).");
  if (typeof l.week !== "number" || l.week < 1) e.push("week must be a number (1 or more).");
  if (typeof l.minutes !== "number" || l.minutes < 1) e.push("minutes must be a number.");
  if (!l.warm || !l.warm.phrase || !l.warm.meaning || !l.warm.example) e.push("warm needs phrase, meaning and example.");
  if (!Array.isArray(l.learn) || l.learn.length < 1) e.push("learn needs at least 1 card.");
  else l.learn.forEach((c, i) => { if (!c.title || !c.text) e.push(`learn card ${i + 1} needs a title and text.`); });
  if (!Array.isArray(l.practice) || l.practice.length < 1) e.push("practice needs at least 1 exercise.");
  else {
    const seen = new Set<string>();
    (l.practice as Item[]).forEach((it, i) => {
      const n = `exercise ${i + 1}`;
      if (!it.id) e.push(`${n} needs an id.`); else if (seen.has(it.id)) e.push(`${n}: duplicate id "${it.id}".`); else seen.add(it.id);
      if (it.t === "choose") {
        if (!it.q) e.push(`${n} needs a question (q).`);
        if (!Array.isArray(it.options) || it.options.length < 2 || new Set(it.options).size !== it.options.length) e.push(`${n} needs 2+ different options.`);
        else if (!Number.isInteger(it.answer) || it.answer < 0 || it.answer >= it.options.length) e.push(`${n}: answer must be the number of the right option (0 = first).`);
        if (!it.why) e.push(`${n} needs an explanation (why).`);
      } else if (it.t === "type") {
        if (!it.q || !String(it.q).includes("___")) e.push(`${n}: type questions should contain ___ for the gap.`);
        if (!Array.isArray(it.answers) || !it.answers.length) e.push(`${n} needs answers.`);
        if (!it.why) e.push(`${n} needs an explanation (why).`);
      } else if (it.t === "order") {
        if (!it.prompt) e.push(`${n} needs a prompt.`);
        if (!Array.isArray(it.words) || it.words.length < 3) e.push(`${n} needs at least 3 words.`);
        else if (!Array.isArray(it.answers) || !it.answers.length) e.push(`${n} needs answers.`);
        else if (it.answers[0].split(" ").slice().sort().join("|") !== it.words.slice().sort().join("|")) e.push(`${n}: words must be exactly the words of the first answer, in any order.`);
      } else if (it.t === "say") { if (!it.text) e.push(`${n} needs text to say.`); }
      else e.push(`${n}: unknown type "${(it as { t?: string }).t}" (use choose, type, order or say).`);
    });
  }
  if (!l.speak || !l.speak.prompt || !l.speak.model) e.push("speak needs a prompt and a model answer.");
  else if (!Array.isArray(l.speak.checklist) || l.speak.checklist.length < 1) e.push("speak needs a checklist.");
  if (!Array.isArray(l.recap) || l.recap.length < 1) e.push("recap needs at least 1 line.");
  return e;
}
