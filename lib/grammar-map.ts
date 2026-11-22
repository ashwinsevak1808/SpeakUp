/* The full grammar syllabus, and the lesson that teaches each topic. EDIT to add a topic. */
export type GrammarTopic = { topic: string; lesson: string; level: "Beginner" | "Intermediate" | "Advanced" };
export type GrammarGroup = { title: string; desc: string; topics: GrammarTopic[] };

export const GRAMMAR_MAP: GrammarGroup[] = [
  { title: "Sentence basics", desc: "The building blocks of every sentence", topics: [
    { topic: "Present simple: habits and facts", lesson: "d03", level: "Beginner" },
    { topic: "Articles: a, an, the", lesson: "d04", level: "Beginner" },
    { topic: "Present continuous: right now", lesson: "d06", level: "Beginner" },
    { topic: "Subject and verb agreement", lesson: "d07", level: "Beginner" },
    { topic: "Asking questions and indirect questions", lesson: "d09", level: "Beginner" },
    { topic: "There is, there are, have got", lesson: "d29", level: "Beginner" },
    { topic: "Imperatives and instructions", lesson: "d39", level: "Beginner" },
  ] },
  { title: "Nouns, pronouns and amounts", desc: "Things, people and quantities", topics: [
    { topic: "Countable and uncountable nouns", lesson: "d21", level: "Beginner" },
    { topic: "Some, any, much, many, a few, a little", lesson: "d22", level: "Beginner" },
    { topic: "Pronouns: I, me, my, mine, myself", lesson: "d23", level: "Beginner" },
    { topic: "This, that, these, those and possessive 's", lesson: "d24", level: "Beginner" },
  ] },
  { title: "Describing", desc: "Adjectives, adverbs and comparison", topics: [
    { topic: "Adjectives: order, -ed and -ing", lesson: "d26", level: "Intermediate" },
    { topic: "Adverbs of manner and frequency", lesson: "d27", level: "Beginner" },
    { topic: "Comparatives, superlatives, too and enough", lesson: "d28", level: "Intermediate" },
  ] },
  { title: "Talking about the past", desc: "Finished actions, background and experience", topics: [
    { topic: "Past simple: regular and irregular verbs", lesson: "d11", level: "Beginner" },
    { topic: "Present perfect: experiences", lesson: "d13", level: "Intermediate" },
    { topic: "Past continuous: was doing", lesson: "d31", level: "Intermediate" },
    { topic: "Used to: past habits", lesson: "d32", level: "Intermediate" },
    { topic: "Past perfect: had done", lesson: "d46", level: "Advanced" },
  ] },
  { title: "Talking about the future", desc: "Plans, predictions and arrangements", topics: [
    { topic: "Will or going to", lesson: "d33", level: "Intermediate" },
    { topic: "Arrangements, timetables and time clauses", lesson: "d34", level: "Intermediate" },
    { topic: "Future continuous and future perfect", lesson: "d58", level: "Advanced" },
  ] },
  { title: "Time and the tense system", desc: "How long, and all twelve tenses together", topics: [
    { topic: "Present perfect continuous: for and since", lesson: "d38", level: "Intermediate" },
    { topic: "All twelve tenses on one page", lesson: "d59", level: "Advanced" },
  ] },
  { title: "Modal verbs", desc: "Ability, advice, rules, requests and guesses", topics: [
    { topic: "Polite requests: could, may, would you mind", lesson: "d05", level: "Beginner" },
    { topic: "Should, must, might", lesson: "d16", level: "Intermediate" },
    { topic: "Can, could, be able to", lesson: "d36", level: "Beginner" },
    { topic: "Have to, must, don't have to, mustn't", lesson: "d37", level: "Intermediate" },
    { topic: "Must be, can't be, might have, should have", lesson: "d53", level: "Advanced" },
  ] },
  { title: "Conditionals and wishes", desc: "Real, imaginary and past situations", topics: [
    { topic: "Zero and first conditional, unless", lesson: "d49", level: "Intermediate" },
    { topic: "Second conditional: if I were you", lesson: "d51", level: "Advanced" },
    { topic: "Third conditional and wish", lesson: "d52", level: "Advanced" },
  ] },
  { title: "Linking and complex sentences", desc: "Longer sentences that flow", topics: [
    { topic: "Conjunctions: and, but, so, because, although", lesson: "d41", level: "Intermediate" },
    { topic: "Relative clauses: who, which, that, where, whose", lesson: "d42", level: "Intermediate" },
    { topic: "Question tags", lesson: "d44", level: "Intermediate" },
    { topic: "Reported speech: said, told, asked", lesson: "d47", level: "Advanced" },
    { topic: "Passive voice", lesson: "d48", level: "Advanced" },
  ] },
  { title: "Verb patterns and word partners", desc: "What comes after a verb", topics: [
    { topic: "Collocations: make, do, take", lesson: "d15", level: "Beginner" },
    { topic: "Gerund or infinitive", lesson: "d43", level: "Intermediate" },
    { topic: "Phrasal verbs", lesson: "d54", level: "Intermediate" },
    { topic: "Have something done", lesson: "d56", level: "Advanced" },
  ] },
  { title: "Prepositions", desc: "Small words with big meaning", topics: [
    { topic: "In, on, at: time and place", lesson: "d08", level: "Beginner" },
    { topic: "Movement and preposition partners", lesson: "d57", level: "Intermediate" },
  ] },
  { title: "Fixing common mistakes", desc: "Errors many Indian speakers make", topics: [
    { topic: "Common Indian English mistakes", lesson: "d19", level: "Intermediate" },
  ] },
];

export const GRAMMAR_TOPIC_COUNT = GRAMMAR_MAP.reduce((n, g) => n + g.topics.length, 0);
