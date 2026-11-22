/* =====================================================================
   GRAMMAR PRACTICE BANK
   10 topics x 8 questions. Add more questions or topics here; the
   practice pages, progress and certificate rules pick them up automatically.
   Each question: q (prompt), options, answer (index), why (shown after answering).
   ===================================================================== */
export type Question = { id: string; q: string; options: string[]; answer: number; why: string };
export type Topic = { id: string; title: string; level: "Beginner" | "Intermediate"; blurb: string; free?: boolean; questions: Question[] };

type Raw = [string, string[], number, string];
const make = (topic: string, rows: Raw[]): Question[] => rows.map(([q, options, answer, why], i) => ({ id: `${topic}-${i + 1}`, q, options, answer, why }));

export const TOPICS: Topic[] = [
  {
    id: "articles", title: "Articles: a, an, the", level: "Beginner", free: true,
    blurb: "When to use a, an, the, or no article at all.",
    questions: make("articles", [
      ["She is ___ engineer.", ["a", "an", "the", "no article"], 1, "Use 'an' before a vowel sound. 'Engineer' starts with the vowel sound /e/."],
      ["I saw ___ movie yesterday. ___ movie was great.", ["a / The", "the / A", "a / A", "the / The"], 0, "Use 'a' the first time something is mentioned, and 'the' when we talk about it again."],
      ["He plays ___ guitar very well.", ["a", "an", "the", "no article"], 2, "We use 'the' with musical instruments: the guitar, the piano, the violin."],
      ["___ honesty is the best policy.", ["The", "A", "An", "No article"], 3, "We do not use an article when we talk about an idea or quality in general."],
      ["My brother is ___ university student.", ["a", "an", "the", "no article"], 0, "'University' begins with a 'yoo' sound (a consonant sound), so we say 'a'."],
      ["Can you pass me ___ salt, please?", ["a", "an", "the", "no article"], 2, "Both people know which salt (the one on the table), so we use 'the'."],
      ["My children go to ___ school every day.", ["a", "an", "the", "no article"], 3, "When we talk about the normal purpose of a place (studying), we say 'go to school' with no article."],
      ["It took me ___ hour to reach there.", ["a", "an", "the", "no article"], 1, "The 'h' in 'hour' is silent, so the word starts with a vowel sound: 'an hour'."],
    ]),
  },
  {
    id: "present-tenses", title: "Present Simple vs Continuous", level: "Beginner", free: true,
    blurb: "Habits and facts versus things happening now.",
    questions: make("present-tenses", [
      ["She ___ tea every morning.", ["drink", "drinks", "is drinking", "drinking"], 1, "A daily habit uses the present simple. With he/she/it, add -s: drinks."],
      ["Look! The baby ___.", ["sleeps", "sleep", "is sleeping", "sleeping"], 2, "'Look!' shows something happening right now, so we use the present continuous."],
      ["I ___ the answer.", ["know", "am knowing", "knowing", "knows"], 0, "'Know' describes a state, not an action. We do not use state verbs in the continuous form."],
      ["Water ___ at 100 degrees Celsius.", ["boil", "boils", "is boiling", "boiled"], 1, "A scientific fact uses the present simple."],
      ["Please be quiet. The students ___ an exam.", ["take", "takes", "are taking", "taking"], 2, "The action is happening now, so we use 'are taking'."],
      ["He usually goes to work by bus, but today he ___ a taxi.", ["takes", "is taking", "take", "taken"], 1, "'Today' shows a temporary action around now, so we use the present continuous."],
      ["I ___ this song. It is my favourite.", ["am loving", "love", "loving", "loves"], 1, "'Love' is a state verb. In standard English we say 'I love', not 'I am loving'."],
      ["My sister ___ in Mumbai. She works at a bank.", ["live", "lives", "is living", "living"], 1, "A permanent situation uses the present simple, and 'she' needs -s."],
    ]),
  },
  {
    id: "past-perfect", title: "Past Simple vs Present Perfect", level: "Intermediate",
    blurb: "Finished past actions versus experiences and results.",
    questions: make("past-perfect", [
      ["I ___ him yesterday.", ["have met", "met", "meet", "have meet"], 1, "'Yesterday' is a finished time, so we use the past simple."],
      ["I have never ___ sushi.", ["eat", "ate", "eaten", "eating"], 2, "Present perfect = have/has + past participle. The participle of 'eat' is 'eaten'."],
      ["She ___ here since 2019.", ["lives", "lived", "has lived", "is living"], 2, "'Since 2019' connects the past to now, so we use the present perfect."],
      ["When ___ you finish your homework?", ["have", "did", "do", "had"], 1, "A question with 'when' about a finished time uses the past simple: 'did'."],
      ["I ___ to Goa three times in my life.", ["went", "have been", "am going", "go"], 1, "'In my life' is a period that is not finished, so we use the present perfect."],
      ["He ___ the office an hour ago.", ["has left", "left", "leaves", "have left"], 1, "'An hour ago' gives a finished time, so we use the past simple."],
      ["Have you ___ the report yet?", ["finish", "finished", "finishing", "finishes"], 1, "After 'have you', we use the past participle: finished."],
      ["Last week, I ___ a new phone.", ["have bought", "buy", "bought", "buying"], 2, "'Last week' is a finished time. Past simple of 'buy' is 'bought'."],
    ]),
  },
  {
    id: "prepositions", title: "Prepositions: in, on, at", level: "Beginner",
    blurb: "Time and place prepositions that confuse everyone.",
    questions: make("prepositions", [
      ["The meeting is ___ 5 o'clock.", ["in", "on", "at", "by"], 2, "Use 'at' for exact times: at 5 o'clock, at noon, at night."],
      ["My birthday is ___ June.", ["in", "on", "at", "to"], 0, "Use 'in' for months, years and seasons: in June, in 2025, in summer."],
      ["See you ___ Monday.", ["in", "on", "at", "by"], 1, "Use 'on' for days and dates: on Monday, on 5 May."],
      ["She is good ___ maths.", ["in", "on", "at", "with"], 2, "We say 'good at' a subject or skill."],
      ["I am interested ___ music.", ["on", "at", "in", "for"], 2, "The correct phrase is 'interested in'."],
      ["She is waiting ___ the bus stop.", ["in", "at", "on", "to"], 1, "Use 'at' for a specific point or place like a bus stop."],
      ["We arrived ___ Mumbai at midnight.", ["at", "in", "on", "to"], 1, "Use 'arrive in' for cities and countries, and 'arrive at' for small places or points."],
      ["The book is ___ the table.", ["in", "on", "at", "over"], 1, "Use 'on' for something resting on a surface."],
    ]),
  },
  {
    id: "modals", title: "Modal Verbs", level: "Intermediate",
    blurb: "can, could, should, must, might and may.",
    questions: make("modals", [
      ["You ___ wear a helmet. It's the law.", ["might", "must", "could", "may"], 1, "'Must' shows a strong rule or obligation."],
      ["___ you help me, please?", ["Could", "Must", "Might", "Should"], 0, "'Could you...?' is a polite request."],
      ["You look tired. You ___ rest.", ["must", "should", "can", "will"], 1, "'Should' gives advice."],
      ["I ___ swim when I was five.", ["can", "could", "must", "should"], 1, "'Could' describes general ability in the past."],
      ["It ___ rain later, so take an umbrella.", ["might", "must", "shall", "did"], 0, "'Might' shows a possibility."],
      ["He ___ speak three languages.", ["can", "can to", "cans", "can speaks"], 0, "After a modal, we use the base verb with no 'to' and no -s."],
      ["You ___ park here. It's not allowed.", ["must", "mustn't", "needn't", "might"], 1, "'Mustn't' means it is forbidden."],
      ["___ I use your phone?", ["Must", "Shall", "May", "Would"], 2, "'May I...?' is a polite way to ask for permission."],
    ]),
  },
  {
    id: "agreement", title: "Subject-Verb Agreement", level: "Beginner",
    blurb: "Making the verb match the subject.",
    questions: make("agreement", [
      ["She ___ like coffee.", ["don't", "doesn't", "not", "isn't"], 1, "With he/she/it we use 'doesn't', not 'don't'."],
      ["The books on the table ___ mine.", ["is", "are", "was", "be"], 1, "'Books' is plural, so we use 'are'."],
      ["Each of the students ___ a book.", ["have", "has", "are having", "having"], 1, "'Each' is singular, so we use 'has'."],
      ["My friends ___ coming tonight.", ["is", "are", "was", "be"], 1, "'Friends' is plural, so we use 'are'."],
      ["Everyone ___ happy.", ["are", "is", "were", "am"], 1, "'Everyone' is singular and takes 'is'."],
      ["The news ___ good today.", ["are", "is", "were", "have"], 1, "'News' looks plural but is uncountable, so it takes a singular verb."],
      ["He ___ to the office by bus.", ["go", "goes", "going", "gone"], 1, "With he/she/it in the present simple, add -s/-es: goes."],
      ["Mathematics ___ my favourite subject.", ["are", "is", "were", "be"], 1, "Names of subjects like mathematics and physics are singular."],
    ]),
  },
  {
    id: "questions", title: "Making Questions", level: "Intermediate",
    blurb: "Question words, helper verbs and polite indirect questions.",
    questions: make("questions", [
      ["___ you like tea?", ["Are", "Do", "Does", "Is"], 1, "With 'you' in the present simple we start the question with 'Do'."],
      ["What time ___ the train leave?", ["do", "does", "is", "are"], 1, "'The train' is singular (it), so we use 'does'."],
      ["Which question is correct?", ["What you are doing?", "What are you doing?", "What you doing?", "What do you doing?"], 1, "In questions, the helper verb comes before the subject: What are you doing?"],
      ["Which is correct?", ["Could you tell me where is the station?", "Could you tell me where the station is?", "Could you tell me where does the station is?", "Could you tell me the station where is?"], 1, "In an indirect question, the order goes back to normal: where the station is."],
      ["You are coming tomorrow, ___?", ["do you", "aren't you", "don't you", "won't you"], 1, "The tag repeats the helper verb 'are' in the opposite form: aren't you?"],
      ["She can swim, ___?", ["does she", "can't she", "isn't she", "won't she"], 1, "The tag uses the same modal in the opposite form: can't she?"],
      ["___ did he arrive?", ["When", "What", "Who", "Whose"], 0, "We ask about time with 'when'."],
      ["Which is correct?", ["Where he is going?", "Where is he going?", "Where he going is?", "Where does he going?"], 1, "Helper verb first: Where is he going?"],
    ]),
  },
  {
    id: "indian-english", title: "Common Indian English Errors", level: "Intermediate",
    blurb: "Fix the mistakes that many Indian speakers make without noticing.",
    questions: make("indian-english", [
      ["Choose the correct sentence.", ["Let's discuss about the plan.", "Let's discuss the plan.", "Let's discussing the plan.", "Let's discuss on the plan."], 1, "'Discuss' already means 'talk about', so we do not add 'about'."],
      ["Choose the correct sentence.", ["Please return back the book.", "Please return the book.", "Please returning the book.", "Please back return the book."], 1, "'Return' already means 'give back'. 'Return back' is repetition."],
      ["Choose the correct sentence.", ["He is my cousin brother.", "He is my cousin.", "He is my brother cousin.", "He is cousin of brother."], 1, "'Cousin' is enough. It can be a boy or a girl."],
      ["Choose the clearest sentence.", ["I will revert back to you tomorrow.", "I will get back to you tomorrow.", "I will revert to back you tomorrow.", "I will back revert tomorrow."], 1, "'Get back to you' is the natural phrase for replying later."],
      ["Choose the correct sentence.", ["She is out of station.", "She is out of town.", "She is out from town.", "She is outside station."], 1, "Say 'out of town' when someone is away from the city."],
      ["Choose the correct introduction.", ["Myself Rahul.", "My name is Rahul.", "Me Rahul.", "I am called myself Rahul."], 1, "Use 'My name is...' or 'I'm Rahul'. 'Myself' is not a subject."],
      ["Choose the correct question.", ["What is your good name?", "What's your name?", "Your good name?", "What name is your good?"], 1, "'Good name' is unnecessary. Simply ask 'What's your name?'."],
      ["Choose the correct sentence.", ["I am having a car.", "I have a car.", "I having a car.", "I am have a car."], 1, "'Have' meaning 'own' is a state verb, so we do not use -ing."],
    ]),
  },
  {
    id: "conditionals", title: "If Sentences (Conditionals)", level: "Intermediate",
    blurb: "Real, unreal and past conditions.",
    questions: make("conditionals", [
      ["If it rains, we ___ at home.", ["stay", "will stay", "would stay", "stayed"], 1, "For a real future possibility: if + present simple, will + base verb."],
      ["If I ___ rich, I would travel the world.", ["am", "was being", "were", "will be"], 2, "For an imaginary situation, we use 'if I were' (past form)."],
      ["If you heat ice, it ___.", ["will melt", "melts", "melted", "would melt"], 1, "For general truths, use the present simple in both parts."],
      ["If she had studied, she ___ the exam.", ["will pass", "would pass", "would have passed", "passed"], 2, "For an imaginary past, use if + had + participle, would have + participle."],
      ["I will call you if I ___ time.", ["will have", "have", "would have", "had"], 1, "After 'if', we do not use 'will'. We use the present simple: if I have time."],
      ["If I ___ you, I would apologise.", ["am", "was", "were", "be"], 2, "'If I were you' is the standard way to give advice."],
      ["Unless you hurry, you ___ the train.", ["miss", "will miss", "would miss", "missed"], 1, "'Unless' means 'if not'. We use the present after it, and will + base in the result."],
      ["If he ___ earlier, he wouldn't have missed the bus.", ["left", "had left", "would leave", "leaves"], 1, "For a past regret: if + had + past participle."],
    ]),
  },
  {
    id: "collocations", title: "Collocations: make, do, take", level: "Beginner",
    blurb: "Words that naturally go together.",
    questions: make("collocations", [
      ["___ a decision", ["do", "make", "take up", "give"], 1, "We say 'make a decision'."],
      ["___ a photo", ["do", "make", "take", "put"], 2, "We say 'take a photo' or 'take a picture'."],
      ["___ my homework", ["make", "take", "do", "play"], 2, "We say 'do homework'."],
      ["___ a mistake", ["do", "make", "take", "have"], 1, "We say 'make a mistake'."],
      ["Which phrase is natural?", ["strong rain", "heavy rain", "big rain", "hard rain"], 1, "We say 'heavy rain' and 'heavy traffic'."],
      ["___ a break", ["do", "make", "take", "put"], 2, "We say 'take a break' (or 'have a break')."],
      ["Please ___ attention.", ["give", "pay", "make", "do"], 1, "We say 'pay attention'."],
      ["She always ___ her promises.", ["keeps", "holds", "makes", "does"], 0, "We say 'keep a promise' and 'make a promise'."],
    ]),
  },
];

export const TOTAL_QUESTIONS = TOPICS.reduce((n, t) => n + t.questions.length, 0);
export const topicById = (id: string) => TOPICS.find((t) => t.id === id);
