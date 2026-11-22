/* =====================================================================
   STUDENT AREA CONTENT: lessons, tips, live classes, plan, certificate rules.
   EDIT the placeholders (meeting links, timings, price).
   ===================================================================== */

export const PLAN = {
  name: "3-Month Online Programme",
  price: 3000, // EDIT: ₹ per student
  months: 3,
  includes: [
    "Live online classes on Google Meet, every day at a fixed time",
    "A guided 12-week path: daily lessons, weekly checkpoints and milestones",
    "Speech checking while you practise, and a voice you choose",
    "Library of 20 chapters and daily speaking tips",
    "Certificate of Completion (for enrolled students who finish the course)",
  ],
  mumbaiAddon: "Mumbai students can also join in-person practice sessions on Sundays.", // EDIT price/terms
};

/* ---- library: the "Speak Up" book chapters, served from /public/book ---- */
export type Chapter = { id: string; n: number; title: string; desc: string; part: string; href: string };
const L: [string, string, string][] = [
  ["Believe First, Speak Next", "You already know more English than you think.", "Part 1: Starting Point"],
  ["Your 20-Minute Daily Practice System", "A simple daily habit that really sticks.", "Part 1: Starting Point"],
  ["Know Your Level", "A friendly self-assessment, and one clear goal.", "Part 1: Starting Point"],
  ["Pronunciation Made Simple", "Tricky sounds, word stress, endings.", "Part 2: Foundations"],
  ["Build Your Vocabulary", "Learn words in chunks, not lists.", "Part 2: Foundations"],
  ["Essential Grammar for Speaking", "Only the grammar you need when talking.", "Part 2: Foundations"],
  ["From Thought to Sentence", "Stop translating in your head.", "Part 2: Foundations"],
  ["Everyday Conversations", "Greetings, small talk, shopping, travel.", "Part 3: Everyday Communication"],
  ["Phone Calls & Social Situations", "Customer care, introductions, polite refusals.", "Part 3: Everyday Communication"],
  ["The Art of Listening", "Fast speakers, accents, active listening.", "Part 3: Everyday Communication"],
  ["Body Language & Voice", "Eye contact, posture, tone and pace.", "Part 3: Everyday Communication"],
  ["Public Speaking Without Fear", "Structure a speech and manage nerves.", "Part 4: Advanced & Professional"],
  ["Presentations That Work", "Slides, flow, handling questions.", "Part 4: Advanced & Professional"],
  ["Group Discussions", "Start, agree, disagree, summarise.", "Part 4: Advanced & Professional"],
  ["Interviews: Get the Job", "Tough questions, salary talk.", "Part 4: Advanced & Professional"],
  ["Email & Business Writing", "Emails, WhatsApp at work, templates.", "Part 4: Advanced & Professional"],
  ["Negotiation & Storytelling", "Persuade politely; stories that stick.", "Part 4: Advanced & Professional"],
  ["Your 30/60/90-Day Plan", "A day-by-day roadmap.", "Part 5: Growth Plan"],
  ["Common Mistakes & How to Fix Them", "Wrong vs right, side by side.", "Part 5: Growth Plan"],
  ["Resources, Habits & Next Steps", "Apps, channels, partners, habits.", "Part 5: Growth Plan"],
];
export const FREE_CHAPTERS = 3; // first 3 chapters are free to read
export const CHAPTERS: Chapter[] = L.map(([title, desc, part], i) => ({
  id: `ch${String(i + 1).padStart(2, "0")}`, n: i + 1, title, desc, part,
  href: `/book/chapters/ch${String(i + 1).padStart(2, "0")}.html`,
}));

/* ---- tips ---- */
export type Tip = { id: string; cat: "Speaking" | "Listening" | "Vocabulary" | "Confidence" | "Grammar" | "Interviews"; title: string; text: string };
export const TIPS: Tip[] = [
  { id: "t1", cat: "Speaking", title: "Talk to yourself for 5 minutes", text: "Describe what you are doing as you do it: 'I'm making tea. I'm adding sugar.' Self-talk builds fluency with zero pressure." },
  { id: "t2", cat: "Speaking", title: "Record a 1-minute voice note", text: "Record yourself answering one question daily. Listen once, note one thing to improve, and move on. Keep the first recording to compare after a month." },
  { id: "t3", cat: "Listening", title: "Use the 3-times clip", text: "Listen to the same 1-minute clip three times: once for the idea, once writing what you hear, once repeating it aloud." },
  { id: "t4", cat: "Listening", title: "Shadow, don't just listen", text: "Repeat a speaker one sentence behind, copying speed and tone. It trains your ears and mouth together." },
  { id: "t5", cat: "Vocabulary", title: "Learn chunks, not words", text: "Learn 'make a decision', not just 'decision'. Chunks come out whole when you speak." },
  { id: "t6", cat: "Vocabulary", title: "Three new chunks a day", text: "Write three phrases from today, add one true sentence about your life for each, and revise them after 2, 4 and 8 days." },
  { id: "t7", cat: "Confidence", title: "Fix 'umm' with a pause", text: "A silent pause sounds thoughtful. Use 'Let me think...' when you need time." },
  { id: "t8", cat: "Confidence", title: "Make mistakes on purpose", text: "Mistakes are how everyone learns. Aim to speak, not to be perfect. Perfect speakers were once beginners who kept talking." },
  { id: "t9", cat: "Grammar", title: "Fix one mistake at a time", text: "Find the one mistake you repeat most and watch for it this week. One fix a week is 50 fixes a year." },
  { id: "t10", cat: "Grammar", title: "Say model sentences aloud", text: "Do not memorise rules. Memorise a sentence like 'She doesn't like coffee' and change the words." },
  { id: "t11", cat: "Interviews", title: "Prepare 'Tell me about yourself'", text: "Use Present (who you are), Past (what you did), Future (what you want). Keep it under one minute and practise aloud." },
  { id: "t12", cat: "Interviews", title: "Pause before you answer", text: "Take one breath before each answer. It sounds calm, and your answer will be clearer." },
];
