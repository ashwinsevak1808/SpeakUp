/* =====================================================================
   EDIT ME: website copy and contact details live in this one file.
   Prices and the free period live in lib/learn-data.ts (PLAN) and lib/access.ts.
   Keep everything here true: no invented numbers, reviews or names.
   ===================================================================== */
import { FREE_UNTIL_LABEL, WEEK_PRICE, ALWAYS_FREE_WEEKS } from "./access";
import { PLAN } from "./learn-data";

export const SITE = {
  name: "SpeakUp",
  tagline: "Learn English the practical way: daily lessons you can do anywhere, and live online classes with skilled trainers.",
  phone: "+91 98765 43210", // EDIT
  phoneRaw: "+919876543210", // EDIT
  whatsapp: "919876543210", // EDIT: country code + number, no "+"
  email: "hello@speakup.in", // EDIT
  instagram: "", // EDIT: full link, or leave empty to hide
  youtube: "",   // EDIT
  linkedin: "",  // EDIT
  hours: "100% online · Learn at your own pace",
  // Legal details shown on the Privacy, Terms, Refund and Delivery pages and the Contact page.
  legalName: "SpeakUp", // EDIT: your registered business name once registered (e.g. "SpeakUp Learning LLP")
  address: "", // EDIT: registered business address (Razorpay checks this). Empty hides it.
  grievanceOfficer: "Ashwin Sevak", // EDIT: person who handles privacy complaints (required in India)
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://speak-up-one-omega.vercel.app", // set NEXT_PUBLIC_SITE_URL when you add your own domain
};

export const WA_LINK = (msg = "Hi! I want to know more about SpeakUp English classes.") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;

export const NAV_MAIN = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/courses", label: "Course" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export const NAV_MORE = [
  { href: "/level-test", label: "Free Level Test", desc: "Find your English level in 3 minutes" },
  { href: "/free-ebook", label: "Free E-Book", desc: "Download a sample chapter" },
  { href: "/verify", label: "Verify a Certificate", desc: "For employers and colleges" },
  { href: "/contact", label: "Contact", desc: "Questions? Talk to us" },
];

/* ---------------- WHAT YOU GET (true facts about the product) ---------------- */
export const COURSE_FACTS = [
  { value: "12", label: "weeks in the guided path" },
  { value: "60", label: "short daily lessons" },
  { value: "44", label: "grammar topics covered" },
  { value: "100%", label: "online, learn anywhere" },
];

export const WHY = [
  { icon: "discussion", title: "Speaking first", text: "Every lesson ends with you speaking, and the app checks what you said." },
  { icon: "pen", title: "All the grammar", text: "44 grammar topics, each with a simple rule, examples and the common mistakes to avoid." },
  { icon: "target", title: "Real-life English", text: "Introductions, phone calls, shopping, emails, meetings and job interviews." },
  { icon: "chart", title: "See your progress", text: "Streaks, weekly checkpoints, a review list of your mistakes and a certificate." },
];

/* ---------------- HOW IT WORKS ---------------- */
export const STEPS = [
  { icon: "pen", title: "Register for free", text: "Create your account in a minute. Tell us your level and your goal, and the course shapes itself around you." },
  { icon: "book", title: "One lesson a day", text: "Each lesson takes about 15 minutes: a warm-up phrase, a clear rule, practice with instant feedback and a speaking task." },
  { icon: "users", title: "Live online classes", text: "With the full plan, join live classes on Google Meet with our trainers to speak, ask questions and get corrected." },
  { icon: "chart", title: "Finish and get certified", text: "Complete the 12 weeks and their checkpoints to earn your Certificate of Completion (full plan)." },
];

/* ---------------- PRICING ---------------- */
export type PlanCard = { id: string; name: string; price: string; per: string; text: string; features: string[]; cta: string; href: string; featured?: boolean };
export const PLANS: PlanCard[] = [
  {
    id: "free", name: "Free", price: "₹0", per: `free until ${FREE_UNTIL_LABEL}`,
    text: "Start today with no payment. Every lesson, test and grammar topic is open during the free period.",
    features: ["All 60 daily lessons", "Weekly tests and checkpoints", "All 44 grammar topics", "Speaking practice with instant checks", "Review list, streaks and progress"],
    cta: "Register for free", href: "/signup",
  },
  {
    id: "plan", name: PLAN.name, price: `₹${PLAN.price.toLocaleString("en-IN")}`, per: `one payment · ${PLAN.months} months`,
    text: "Everything in Free, plus live classes with our trainers and your certificate.",
    features: ["Live online classes on Google Meet", "Every chapter unlocked for 3 months", "Personal feedback from trainers", "Certificate of Completion", "Pay by UPI, card or net banking"],
    cta: "Register and get the plan", href: "/signup", featured: true,
  },
  {
    id: "week", name: "Single chapter", price: `₹${WEEK_PRICE.toLocaleString("en-IN")}`, per: "per week of lessons",
    text: `After ${FREE_UNTIL_LABEL}, the first ${ALWAYS_FREE_WEEKS} weeks stay free. Unlock any other week on its own, and keep it.`,
    features: ["All lessons of that week", "Its weekly test", "Yours to keep", "Upgrade to the full plan any time"],
    cta: "Register for free", href: "/signup",
  },
];

/* ---------------- FAQ ---------------- */
export const FAQS = [
  { cat: "Getting Started", q: "Is SpeakUp really free?", a: `Yes. Until ${FREE_UNTIL_LABEL}, every lesson, test and grammar topic is free. You only pay if you want live classes with our trainers and the certificate (₹${PLAN.price.toLocaleString("en-IN")} for ${PLAN.months} months).` },
  { cat: "Getting Started", q: "I am a complete beginner. Can I join?", a: "Yes. The course starts from the very beginning: introducing yourself, simple sentences and everyday words. Tell us you are a beginner when you register and the path adjusts to you." },
  { cat: "Getting Started", q: "How do I know my level?", a: "Take the free 3-minute Level Test on this website. You can also choose Beginner or Intermediate in your account and change it any time." },
  { cat: "Classes", q: "Are classes online or in person?", a: "Everything is online. Lessons are in your account on any phone or computer, and live classes happen on Google Meet. We do not run offline classes at the moment." },
  { cat: "Classes", q: "What happens in a live class?", a: "You speak. Trainers run practice activities, answer questions and correct your mistakes kindly. Live classes are part of the full plan." },
  { cat: "Classes", q: "How long does a daily lesson take?", a: "About 15 minutes: a warm-up phrase, a short explanation with examples, practice exercises and a speaking task." },
  { cat: "Classes", q: "Does it check my speaking?", a: "Yes. Speaking exercises use your browser's speech recognition to check what you said. Your voice is not recorded or stored." },
  { cat: "Fees", q: "What does the full plan include?", a: `Live online classes, every chapter unlocked for ${PLAN.months} months, and your Certificate of Completion when you finish. One payment of ₹${PLAN.price.toLocaleString("en-IN")}.` },
  { cat: "Fees", q: "What happens after the free period?", a: `From ${FREE_UNTIL_LABEL}, the first ${ALWAYS_FREE_WEEKS} weeks stay free. You can unlock any other week for ₹${WEEK_PRICE.toLocaleString("en-IN")}, or get everything with the full plan.` },
  { cat: "Fees", q: "How do I pay?", a: "Securely online through Razorpay: UPI, debit or credit card, net banking or wallets. Your access unlocks the moment the payment succeeds." },
  { cat: "Results", q: "Will I get a certificate?", a: "Yes, with the full plan. Finish all 12 weeks and their checkpoints, and your Certificate of Completion is issued with an ID that employers can verify on our website." },
  { cat: "Results", q: "Is the certificate government approved?", a: "No. It is a SpeakUp Certificate of Completion showing that you finished the course. It is not a government or university qualification." },
];

/* ---------------- LEVEL TEST ---------------- */
export type Q = { q: string; options: string[]; answer: number };
export const QUIZ: Q[] = [
  { q: "She ___ to school every day.", options: ["go", "goes", "going", "gone"], answer: 1 },
  { q: "Choose the correct sentence.", options: ["I am agree with you.", "I agree with you.", "I agreeing with you.", "I am agreed you."], answer: 1 },
  { q: "I ___ my homework before dinner yesterday.", options: ["finish", "finishing", "finished", "finishes"], answer: 2 },
  { q: "What is the opposite of 'expensive'?", options: ["Costly", "Cheap", "Rich", "Heavy"], answer: 1 },
  { q: "If it rains tomorrow, we ___ at home.", options: ["stay", "stayed", "will stay", "staying"], answer: 2 },
  { q: "He has lived in this city ___ 2015.", options: ["for", "since", "from", "during"], answer: 1 },
  { q: "Choose the best word: 'The meeting was ___ because the manager was ill.'", options: ["cancelled", "canceling", "cancel", "cancels"], answer: 0 },
  { q: "By the time we arrived, the film ___.", options: ["already started", "has already started", "had already started", "is already starting"], answer: 2 },
  { q: "Which sentence is the most polite?", options: ["Give me the report.", "I want the report now.", "Could you please share the report when you get a chance?", "Send report."], answer: 2 },
  { q: "'He is under the weather' means he is...", options: ["standing outside", "feeling unwell", "very angry", "late for work"], answer: 1 },
  { q: "Had I known about the delay, I ___ earlier.", options: ["would leave", "will have left", "would have left", "had left"], answer: 2 },
  { q: "Choose the correct word: 'Her argument was so ___ that nobody could disagree.'", options: ["compelling", "compelled", "compel", "compellingly"], answer: 0 },
];

export const LEVELS = [
  { min: 0, max: 3, name: "Beginner", pick: "Beginner", text: "You are at the starting line, and that is a great place to be. Choose Beginner when you register: the path starts with the basics and builds up step by step." },
  { min: 4, max: 6, name: "Elementary", pick: "Beginner", text: "You know the basics. Choose Beginner when you register to make them solid, then regular speaking practice will make you fluent." },
  { min: 7, max: 9, name: "Intermediate", pick: "Intermediate", text: "You communicate well. Choose Intermediate when you register: the path skips the basics and focuses on fluency, work English and interviews." },
  { min: 10, max: 12, name: "Advanced", pick: "Intermediate", text: "Impressive. Choose Intermediate when you register and focus on the advanced grammar, interviews and presentations in Month 3." },
];
