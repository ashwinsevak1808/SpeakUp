/* =====================================================================
   EDIT ME: every piece of copy, price, name and contact detail on the
   website lives in this one file. Change it here and all pages update.
   Images: /public/images/<name>.jpg  (see IMAGE-PROMPTS.md)
   ===================================================================== */

export const SITE = {
  name: "Your English", // EDIT: business name
  tagline: "Speak with confidence. Succeed with clarity.", // EDIT
  city: "Mumbai",
  address: "Practical sessions: Andheri West, Mumbai, Maharashtra 400053", // EDIT with your real venue
  phone: "+91 98765 43210", // EDIT
  phoneRaw: "+919876543210",
  whatsapp: "919876543210", // EDIT: country code + number, no "+"
  email: "hello@yourenglish.in", // EDIT
  instagram: "https://instagram.com/youraccount", // EDIT
  facebook: "https://facebook.com/yourpage",
  youtube: "https://youtube.com/@yourchannel",
  linkedin: "https://linkedin.com/company/yourpage",
  hours: "Live classes Tue & Sat evenings · Mumbai practice on Sundays",
  url: "https://www.yourenglish.in", // EDIT: live domain
  mapEmbed: "", // EDIT: paste ONLY the src="..." URL from Google Maps > Share > Embed
};

export const WA_LINK = (msg = "Hi! I want to know more about your English classes.") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;

export const NAV_MAIN = [
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/corporate", label: "Corporate" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/trainers", label: "Trainers" },
  { href: "/pricing", label: "Batches & Fees" },
];

export const NAV_MORE = [
  { href: "/level-test", label: "Free Level Test", desc: "Find your English level in 3 minutes" },
  { href: "/beyond-the-classroom", label: "Beyond the Classroom", desc: "Clubs, debates, mock interviews" },
  { href: "/success-stories", label: "Success Stories", desc: "What our learners say" },
  { href: "/free-ebook", label: "Free E-Book", desc: "Download a sample chapter" },
  { href: "/faq", label: "FAQ", desc: "Answers to common questions" },
  { href: "/contact", label: "Contact", desc: "Book a free demo class" },
];

export const STATS = [
  { value: 2500, suffix: "+", label: "Learners trained" }, // EDIT
  { value: 2, suffix: "", label: "Expert trainers" },
  { value: 180, suffix: "+", label: "Batches completed" },
  { value: 96, suffix: "%", label: "Would recommend us" },
];

/* ---------------- COURSES ---------------- */
export type Course = {
  slug: string;
  title: string;
  image: string;
  tagline: string;
  short: string;
  duration: string;
  frequency: string;
  level: string;
  audience: string;
  fee: string;
  featured?: boolean;
  outcomes: string[];
  includes: string[];
  syllabus: { title: string; topics: string[] }[];
};

export const COURSES: Course[] = [
  {
    slug: "basic-communication",
    title: "Basic Communication",
    image: "course-basic",
    tagline: "Start speaking from day one",
    short: "Spoken English, vocabulary and grammar in use, for complete beginners.",
    duration: "3 months",
    frequency: "2 live classes / week",
    level: "Beginner",
    audience: "Beginners, school and college students, homemakers and anyone starting from zero.",
    fee: "₹3,000",
    outcomes: [
      "Speak simple, correct sentences without long pauses",
      "Build 500+ everyday words you actually use",
      "Use grammar naturally in conversation, not just on paper",
      "Introduce yourself and chat with strangers confidently",
      "Understand English films, calls and conversations better",
    ],
    includes: ["24 live online classes (2 a week)", "Student login with grammar practice", "Complete lesson library and e-book", "Monthly progress report", "Certificate of Completion"],
    syllabus: [
      { title: "Month 1: Find Your Voice", topics: ["Greetings and self-introduction", "Daily-life vocabulary", "Simple present, past and future", "Pronunciation basics"] },
      { title: "Month 2: Build Your Sentences", topics: ["Asking and answering questions", "Describing people, places and routines", "Prepositions and connectors", "Listening practice"] },
      { title: "Month 3: Speak with Ease", topics: ["Phone and shopping conversations", "Storytelling basics", "Role-plays in real situations", "Final speaking assessment"] },
    ],
  },
  {
    slug: "advanced-communication",
    title: "Advanced Communication",
    image: "course-advanced",
    tagline: "From fluent to unforgettable",
    short: "Fluency, public speaking, presentations and interview skills.",
    duration: "4 months",
    frequency: "2 live classes / week",
    level: "Intermediate +",
    audience: "Learners who can already speak basic English and want fluency, polish and stage presence.",
    fee: "₹4,000",
    featured: true,
    outcomes: [
      "Speak fluently with natural rhythm and tone",
      "Deliver talks and presentations with stage confidence",
      "Handle group discussions and debates like a pro",
      "Crack interviews with structured, confident answers",
      "Think in English and express complex ideas clearly",
    ],
    includes: ["32 live online classes (2 a week)", "Student login with grammar practice", "3 mock interviews", "Video feedback on your speeches", "Certificate of Completion"],
    syllabus: [
      { title: "Month 1: Fluency Foundations", topics: ["Removing hesitation and filler words", "Intonation and stress", "Idioms and phrasal verbs", "Thinking in English"] },
      { title: "Month 2: Public Speaking", topics: ["Structuring a speech", "Body language and voice", "Overcoming stage fear", "Storytelling for impact"] },
      { title: "Month 3: Presentations and GDs", topics: ["Slides that support, not distract", "Group discussion strategy", "Debate techniques", "Handling Q&A"] },
      { title: "Month 4: Interview Ready", topics: ["Tell-me-about-yourself mastery", "HR and behavioural questions", "Mock interviews with feedback", "Final showcase"] },
    ],
  },
  {
    slug: "corporate-training",
    title: "Corporate Training",
    image: "course-corporate",
    tagline: "Communication your clients will notice",
    short: "Business English, email writing, meetings, negotiation and soft skills.",
    duration: "Custom",
    frequency: "Flexible schedule",
    level: "All levels",
    audience: "Working professionals and teams who want clear, confident workplace communication.",
    fee: "On request",
    outcomes: [
      "Write clear, polite and persuasive business emails",
      "Contribute confidently in meetings and calls",
      "Negotiate and influence with the right words",
      "Deliver crisp updates and presentations",
      "Strengthen soft skills: listening, empathy, feedback",
    ],
    includes: ["Needs analysis with your HR / L&D team", "On-site or online delivery", "Custom curriculum and case studies", "Manager progress reports", "Certificates for participants"],
    syllabus: [
      { title: "Module 1: Business English Essentials", topics: ["Professional vocabulary and tone", "Phone and video call etiquette", "Small talk that builds relationships"] },
      { title: "Module 2: Writing That Works", topics: ["Email structure and subject lines", "Reports and proposals", "Handling difficult emails"] },
      { title: "Module 3: Meetings and Negotiation", topics: ["Leading and contributing in meetings", "Negotiation language", "Persuasion and objection handling"] },
      { title: "Module 4: Soft Skills", topics: ["Active listening", "Giving and receiving feedback", "Cross-cultural communication"] },
    ],
  },
  {
    slug: "interview-mastery",
    title: "Interview Mastery",
    image: "course-interview",
    tagline: "Walk in nervous. Walk out hired.",
    short: "A focused 6-week crash course for job seekers and fresh graduates.",
    duration: "6 weeks",
    frequency: "2 live classes / week",
    level: "All levels",
    audience: "Final-year students, fresh graduates and professionals preparing for job interviews.",
    fee: "₹1,500",
    outcomes: [
      "Answer 'Tell me about yourself' with a strong story",
      "Handle HR, technical and situational questions",
      "Build confident body language and eye contact",
      "Negotiate salary politely and smartly",
    ],
    includes: ["12 intensive sessions", "5 recorded mock interviews", "Resume and LinkedIn review", "Question bank of 200+ answers", "Completion certificate"],
    syllabus: [
      { title: "Weeks 1–2: Foundations", topics: ["Self-introduction", "Strengths and weaknesses", "Resume walk-through"] },
      { title: "Weeks 3–4: Question Drills", topics: ["HR and behavioural questions", "Situational judgement", "Group discussions"] },
      { title: "Weeks 5–6: Mock Interviews", topics: ["Full mock rounds", "Feedback and fixes", "Salary negotiation"] },
    ],
  },
  {
    slug: "public-speaking",
    title: "Public Speaking Lab",
    image: "course-public-speaking",
    tagline: "Own the room. Any room.",
    short: "Beat stage fear and learn to hold an audience with ease.",
    duration: "8 weeks",
    frequency: "2 live classes / week",
    level: "Intermediate",
    audience: "Students, professionals and entrepreneurs who want to speak with presence and power.",
    fee: "₹2,000",
    outcomes: [
      "Calm your nerves with proven breathing and mindset tools",
      "Open and close a talk with impact",
      "Use voice, pauses and gestures like a speaker",
      "Deliver a 5-minute talk you are proud of",
    ],
    includes: ["8 hands-on workshops", "Video recording and review", "Speaker's toolkit PDF", "Final showcase evening", "Completion certificate"],
    syllabus: [
      { title: "Weeks 1–2: Mindset and Voice", topics: ["Managing stage fear", "Breathing and posture", "Voice modulation"] },
      { title: "Weeks 3–5: Structure and Story", topics: ["Opening hooks", "Story frameworks", "Persuasive closings"] },
      { title: "Weeks 6–8: Practice and Showcase", topics: ["Impromptu speaking", "Audience engagement", "Final talk"] },
    ],
  },
];

/* ---------------- WHY US ---------------- */
export const WHY = [
  { icon: "discussion", title: "Speaking first", text: "Most of every class is you talking, not us lecturing." },
  { icon: "users", title: "Small live batches", text: "Up to 20 learners per online class, so everyone gets personal feedback." },
  { icon: "chart", title: "Measurable progress", text: "Baseline, monthly reports and a final assessment." },
  { icon: "target", title: "Real-life focus", text: "Interviews, meetings, calls: situations you actually face." },
];

/* ---------------- HOW IT WORKS ---------------- */
export const STEPS = [
  { icon: "users", title: "Live online classes", text: "Two interactive sessions every week with your trainer and batch mates on Google Meet. You talk more than we do." },
  { icon: "pen", title: "Daily practice in your login", text: "Grammar exercises with instant feedback and short speaking tasks that keep the habit alive between classes." },
  { icon: "book", title: "E-book support", text: "An easy-to-read e-book with lessons, word lists and examples you can revise anytime." },
  { icon: "chart", title: "Progress tracking", text: "Your dashboard shows streaks, scores and lessons done, and trainers give personal feedback." },
];

/* ---------------- BEYOND THE CLASSROOM ---------------- */
export const ACTIVITIES = [
  { icon: "discussion", image: "activity-discussion", title: "Group Discussions", text: "Share opinions, listen well and learn to lead a conversation." },
  { icon: "scale", image: "activity-debate", title: "Debates", text: "Think on your feet, argue politely and speak with logic." },
  { icon: "drama", image: "activity-roleplay", title: "Role-Plays", text: "Practise shopping, phone calls, offices and travel before they happen." },
  { icon: "coffee", image: "activity-club", title: "Speaking Club", text: "A relaxed weekly meet-up to chat and practise with new people." },
  { icon: "handshake", image: "activity-interview", title: "Mock Interviews", text: "Face real interview questions and receive honest, kind feedback." },
  { icon: "compass", image: "activity-outing", title: "Outings and Events", text: "Café visits and city walks where English is the language of the day." },
];

/* ---------------- TRAINERS ---------------- */
export const TRAINERS = [
  {
    name: "Priya Deshmukh", // EDIT
    photo: "trainer-priya",
    role: "Founder and Lead Trainer",
    specialty: "Fluency and Public Speaking",
    exp: "10+ years",
    bio: "Priya started this academy after once freezing in front of a full room. Today she helps nervous speakers become calm, clear and confident communicators with a patient, encouraging style.",
    skills: ["Spoken English", "Public Speaking", "Confidence Building"],
    quote: "Nobody is bad at speaking. They just have not had enough safe practice.",
  },
  {
    name: "Rahul Kulkarni", // EDIT
    photo: "trainer-rahul",
    role: "Senior Trainer",
    specialty: "Interviews and Business English",
    exp: "8+ years",
    bio: "A former HR professional, Rahul coaches students and teams on interviews, emails and workplace communication, using practical, real-world examples.",
    skills: ["Interview Prep", "Business English", "Soft Skills"],
    quote: "Be clear, be kind, be yourself. The right words follow.",
  },
];

export const TEAM = [
  { name: "Priya Deshmukh", role: "Founder and Lead Trainer", photo: "trainer-priya" },
  { name: "Rahul Kulkarni", role: "Senior Trainer", photo: "trainer-rahul" },
  { name: "Neha Joshi", role: "Digital and Marketing", photo: "team-neha" },
  { name: "Amit Patil", role: "Operations and Admissions", photo: "team-amit" },
];

/* ---------------- TESTIMONIALS ---------------- */
export const TESTIMONIALS = [
  { name: "Sneha M.", role: "Software Engineer", course: "Advanced Communication", text: "I used to avoid speaking in meetings. After four months, I led my team's presentation. The trainers made me feel safe to try.", gain: "Led her first client demo" },
  { name: "Aditya P.", role: "MBA Graduate", course: "Interview Mastery", text: "The mock interviews were a game changer. I cleared my campus placement with confidence I never had before.", gain: "Placed in the second interview round" },
  { name: "Kavita S.", role: "Parent and Homemaker", course: "Basic Communication", text: "I was scared to even start. Now I chat with my children's teachers in English without worry. Thank you!", gain: "Speaks without hesitation" },
  { name: "Manoj R.", role: "Sales Manager", course: "Corporate Training", text: "Our sales team's client calls improved noticeably after the corporate programme. Highly recommended.", gain: "Team closed 18% more deals" },
  { name: "Ishita K.", role: "College Student", course: "Public Speaking Lab", text: "I won my first debate competition! Two months ago I could not even say my name on stage.", gain: "Won an inter-college debate" },
  { name: "Farhan S.", role: "Fresher", course: "Basic Communication", text: "The speaking club is my favourite part. It feels like meeting friends, and my English improved without me noticing.", gain: "Landed his first job" },
];

/* ---------------- PRICING / BATCHES ---------------- */
export type Batch = { course: string; slug: string; name: string; days: string; time: string; duration: string; fee: number | null; seats: number; mode: "Online" | "Custom"; start: string };
export const BATCHES: Batch[] = [
  { course: "Basic Communication", slug: "basic-communication", name: "Evening cohort", days: "Tue & Sat", time: "8:00 – 9:00 PM IST", duration: "3 months", fee: 3000, seats: 8, mode: "Online", start: "1 Dec" },
  { course: "Basic Communication", slug: "basic-communication", name: "Morning cohort", days: "Mon & Thu", time: "7:00 – 8:00 AM IST", duration: "3 months", fee: 3000, seats: 14, mode: "Online", start: "2 Dec" },
  { course: "Advanced Communication", slug: "advanced-communication", name: "Evening cohort", days: "Wed & Sun", time: "8:00 – 9:00 PM IST", duration: "4 months", fee: 4000, seats: 5, mode: "Online", start: "3 Dec" },
  { course: "Advanced Communication", slug: "advanced-communication", name: "Weekend cohort", days: "Sat & Sun", time: "10:00 – 11:00 AM IST", duration: "4 months", fee: 4000, seats: 11, mode: "Online", start: "6 Dec" },
  { course: "Interview Mastery", slug: "interview-mastery", name: "Crash course", days: "Tue & Thu", time: "8:30 – 9:30 PM IST", duration: "6 weeks", fee: 1500, seats: 9, mode: "Online", start: "9 Dec" },
  { course: "Public Speaking Lab", slug: "public-speaking", name: "Saturday lab", days: "Saturday", time: "4:00 – 5:30 PM IST", duration: "8 weeks", fee: 2000, seats: 12, mode: "Online", start: "13 Dec" },
  { course: "Corporate Training", slug: "corporate-training", name: "Custom programme", days: "As per your team", time: "Flexible", duration: "Flexible", fee: null, seats: 0, mode: "Custom", start: "Any time" },
];

export const OFFERS = [
  { icon: "graduation", title: "Student discount", text: "10% off with a valid student ID." },
  { icon: "users", title: "Bring a friend", text: "Enrol together and both get ₹500 off." },
  { icon: "pin", title: "Mumbai practice sessions", text: "Live in Mumbai? Add in-person Sunday sessions for role-plays and mock interviews." },
];

/* ---------------- FAQ ---------------- */
export const FAQS = [
  { cat: "Getting Started", q: "I am a complete beginner. Can I join?", a: "Absolutely. Our Basic Communication course starts from the very beginning, and our trainers are patient and encouraging. Many of our happiest learners began with just a few English words." },
  { cat: "Getting Started", q: "Can I try a class before paying?", a: "Yes. Book a free demo class, experience our teaching style, meet the trainer and then decide. There is no pressure at all." },
  { cat: "Getting Started", q: "How do I know which course is right for me?", a: "Take our 3-minute free Level Test, or just talk to us. We will suggest the right course based on your level and your goals." },
  { cat: "Classes", q: "How big are the batches?", a: "We keep live batches small, up to about 20 learners, so every learner gets time to speak and receive personal feedback." },
  { cat: "Classes", q: "Are classes online or in person?", a: "Our programme is online: live classes on Google Meet plus your own student login for practice. If you live in Mumbai, you can also join optional in-person practice sessions. Corporate programmes can be held at your office or online." },
  { cat: "Classes", q: "What is the student login?", a: "Every student gets a personal account with grammar practice (with instant explanations), the full lesson library, a class timetable, speaking tips, progress tracking and your certificate." },
  { cat: "Classes", q: "What if I miss a class?", a: "No worries. You can join the same session in another cohort, and your lessons and practice stay available in your login so you can catch up." },
  { cat: "Results", q: "How long until I see improvement?", a: "Most learners notice more confidence within 4 to 6 weeks. Steady practice is the secret, and we will help you build the habit." },
  { cat: "Results", q: "Will I get a certificate?", a: "Yes. You receive a course completion certificate after attending the course and clearing the final assessment." },
  { cat: "Fees", q: "How can I pay the fees?", a: "You can pay by UPI, card, bank transfer or cash. Instalment options are available on request." },
  { cat: "Fees", q: "Do you offer discounts?", a: "Yes. We offer student discounts, a 'bring a friend' offer and early-bird rates. Ask us when you enrol." },
  { cat: "Corporate", q: "Do you train teams at our office?", a: "Yes. We design customised programmes and deliver them at your office or online, with progress reports for managers." },
  { cat: "Corporate", q: "Can the training be customised for our industry?", a: "Of course. We start with a needs analysis and build the curriculum around your team's real situations: calls, emails, meetings and clients." },
];

/* ---------------- LEVEL TEST ---------------- */
export type Q = { q: string; options: string[]; answer: number };
export const QUIZ: Q[] = [
  { q: "She ___ to school every day.", options: ["go", "goes", "going", "gone"], answer: 1 },
  { q: "Choose the correct sentence.", options: ["I am agree with you.", "I agree with you.", "I agreeing with you.", "I am agreed you."], answer: 1 },
  { q: "I ___ my homework before dinner yesterday.", options: ["finish", "finishing", "finished", "finishes"], answer: 2 },
  { q: "What is the opposite of 'expensive'?", options: ["Costly", "Cheap", "Rich", "Heavy"], answer: 1 },
  { q: "If it rains tomorrow, we ___ at home.", options: ["stay", "stayed", "will stay", "staying"], answer: 2 },
  { q: "He has lived in Mumbai ___ 2015.", options: ["for", "since", "from", "during"], answer: 1 },
  { q: "Choose the best word: 'The meeting was ___ because the manager was ill.'", options: ["cancelled", "canceling", "cancel", "cancels"], answer: 0 },
  { q: "By the time we arrived, the film ___.", options: ["already started", "has already started", "had already started", "is already starting"], answer: 2 },
  { q: "Which sentence is the most polite?", options: ["Give me the report.", "I want the report now.", "Could you please share the report when you get a chance?", "Send report."], answer: 2 },
  { q: "'He is under the weather' means he is...", options: ["standing outside", "feeling unwell", "very angry", "late for work"], answer: 1 },
  { q: "Had I known about the delay, I ___ earlier.", options: ["would leave", "will have left", "would have left", "had left"], answer: 2 },
  { q: "Choose the correct word: 'Her argument was so ___ that nobody could disagree.'", options: ["compelling", "compelled", "compel", "compellingly"], answer: 0 },
];

export const LEVELS = [
  { min: 0, max: 3, name: "Beginner", course: "basic-communication", text: "You are at the starting line, and that is a great place to be. A guided course will take you from hesitation to simple, confident conversation quickly." },
  { min: 4, max: 6, name: "Elementary", course: "basic-communication", text: "You know the basics. With regular speaking practice you will quickly move from correct sentences to natural conversation." },
  { min: 7, max: 9, name: "Intermediate", course: "advanced-communication", text: "You communicate well. Now it is about fluency, polish and presence: speeches, interviews and presentations." },
  { min: 10, max: 12, name: "Advanced", course: "public-speaking", text: "Impressive. You are ready to sharpen your stage presence and leadership communication." },
];
