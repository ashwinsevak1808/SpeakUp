/* =====================================================================
   MONTH 3: PROFESSIONAL ENGLISH (weeks 9-12, days 41-60)
   Grammar: conjunctions, relative clauses, gerunds and infinitives, question
   tags, past perfect, reported speech, passive voice, conditionals 0-3, wish,
   modals of deduction, phrasal verbs, causative, dependent prepositions,
   future continuous and perfect, and a full tense review.
   ===================================================================== */
import { choose, lesson, order, type, type Lesson, type Week } from "./path-helpers";

const wk = (n: number, title: string, theme: string, lessons: Lesson[]): Week => ({ n, month: 3, title, theme, lessons, checkpoint: { id: `cp${n}`, title: `Week ${n} Checkpoint` } });

/* ================= WEEK 9 : LINKING YOUR IDEAS ================= */
const w9: Lesson[] = [
  lesson("d41", 41, 9, "Conjunctions: And, But, So, Because, Although", "Grammar", 18, "Join short sentences into longer, smoother ones.",
    ["Although it was late, we kept talking.", "'Although' shows a surprising contrast.", "Although it was late, we kept talking for another hour."],
    [
      { title: "And, but, so, because", text: "'And' adds, 'but' contrasts, 'so' gives a result and 'because' gives a reason.", rule: "reason: *because* · result: *so*", examples: ["I was tired, *so* I went to bed early.", "I went to bed early *because* I was tired.", "The flat is small *but* comfortable."], pairs: [["Because I was tired, so I slept.", "*Because* I was tired, I slept. / I was tired, *so* I slept."]] },
      { title: "Although and even though", text: "Use 'although' or 'even though' for a contrast inside one sentence. Do not add 'but' as well.", rule: "*Although* it rained, we went out", examples: ["*Although* he is young, he is very responsible.", "She came to work *even though* she was ill."], pairs: [["Although it was raining, but we went.", "*Although* it was raining, we went."]] },
      { title: "However, also, as well", text: "'However' starts a new sentence to show contrast. 'Also' goes before the main verb.", examples: ["The plan is good. *However*, it is expensive.", "I *also* speak Gujarati.", "She speaks Tamil *as well*."], tip: "Use one linking word per join. Two together ('although...but') is a common mistake." },
    ],
    [
      choose("d41-1", "I missed the bus, ___ I took an auto.", ["because", "so", "although", "but because"], 1, "Result: 'so'."),
      choose("d41-2", "Choose the correct sentence.", ["Although he was ill, but he came.", "Although he was ill, he came.", "He was ill although but he came.", "Although ill, but came."], 1, "Don't use 'although' and 'but' together."),
      type("d41-3", "I'm learning English ___ I want a better job. (because or so)", ["because"], "The reason: 'because'.", "It gives a reason."),
      choose("d41-4", "The hotel was lovely. ___, it was far from the beach.", ["Because", "So", "However", "And"], 2, "A contrast at the start of a new sentence: 'However'."),
      order("d41-5", "Say in English: Barish ho rahi thi, phir bhi hum bahar gaye.", "Although it was raining, we went out."),
    ],
    { prompt: "Talk about a decision you made recently. Give a reason with 'because', a result with 'so', and a contrast with 'although'.", model: "Last month I joined a gym because I wanted to feel healthier. Although it is expensive, it is close to my office, so I can go after work. I also walk every evening.", checklist: ["I used because for a reason", "I used so for a result", "I used although without 'but'"], minWords: 30, must: ["because", "although"] }),

  lesson("d42", 42, 9, "Relative Clauses: Who, Which, That, Where", "Grammar", 18, "Add information about people, things and places in one smooth sentence.",
    ["She's the person who helped me.", "'Who' adds information about a person.", "That's Neha. She's the person who helped me with my CV."],
    [
      { title: "Who, which, that", text: "Use 'who' for people and 'which' for things. 'That' can replace both in everyday English.", rule: "a man *who* · a phone *which / that*", examples: ["The woman *who* called was my aunt.", "The laptop *which* I bought is fast.", "This is the train *that* goes to Pune."], pairs: [["The man which lives here...", "The man *who* lives here..."], ["The book which I read it was good.", "The book *which* I read was good."]] },
      { title: "Where and whose", text: "Use 'where' for places and 'whose' for possession.", examples: ["That's the school *where* I studied.", "I have a friend *whose* father is a pilot."] },
      { title: "Extra information with commas", text: "When the information is extra, put it between commas and use who or which, not that.", examples: ["My brother, *who* lives in Dubai, is visiting.", "Mumbai, *which* is my home town, never sleeps."], tip: "Don't repeat the object: 'the book I read', not 'the book I read it'." },
    ],
    [
      choose("d42-1", "The doctor ___ treated me was very kind.", ["which", "who", "where", "whose"], 1, "For a person: 'who'."),
      choose("d42-2", "This is the café ___ we first met.", ["which", "who", "where", "whose"], 2, "For a place: 'where'."),
      type("d42-3", "I need a phone ___ has a good camera. (who or which)", ["which", "that"], "For a thing: 'which' or 'that'.", "Not for people."),
      choose("d42-4", "Choose the correct sentence.", ["The film which I saw it was long.", "The film which I saw was long.", "The film who I saw was long.", "The film where I saw was long."], 1, "Don't repeat 'it'."),
      order("d42-5", "Say in English: Mera ek dost hai jiske papa pilot hain.", "I have a friend whose father is a pilot."),
    ],
    { prompt: "Describe three people or places that matter to you, using who, which or where in each sentence.", model: "My best friend is someone who always tells me the truth. Dadar is the area where I grew up. My grandmother, who is eighty, still cooks for the whole family. I still have the bicycle which my father gave me.", checklist: ["I used who for people", "I used which or that for things", "I used where for a place"], minWords: 30, must: ["who", "where"] }),

  lesson("d43", 43, 9, "Gerund or Infinitive?", "Grammar", 18, "Choose between -ing and 'to' + verb after common verbs.",
    ["I'm looking forward to meeting you.", "After 'look forward to', always use -ing.", "Thank you for the invitation. I'm looking forward to meeting you."],
    [
      { title: "Verbs + -ing", text: "Some verbs are followed by the -ing form. Prepositions are always followed by -ing too.", rule: "enjoy / finish / avoid / mind + *-ing*", examples: ["I enjoy *cooking*.", "She finished *writing* the report.", "Thank you for *helping* me.", "I'm good at *drawing*."], pairs: [["I am looking forward to meet you.", "I am looking forward to *meeting* you."]] },
      { title: "Verbs + to", text: "Other verbs are followed by 'to' + base verb.", rule: "want / decide / hope / plan / need + *to*", examples: ["I want *to learn* French.", "We decided *to leave* early.", "She promised *to call*."], pairs: [["I want learning English.", "I want *to learn* English."]] },
      { title: "Either, with a change", text: "With like, love and start, both are fine. With stop, remember and try, the meaning changes.", examples: ["I stopped *smoking*. (I don't smoke now)", "I stopped *to smoke*. (I paused so I could smoke)", "Remember *to lock* the door. (don't forget)"], tip: "Learn verbs in chunks: enjoy doing, want to do, look forward to doing." },
    ],
    [
      choose("d43-1", "I really enjoy ___ in the rain.", ["walk", "to walk", "walking", "walked"], 2, "'Enjoy' + -ing."),
      choose("d43-2", "We've decided ___ a new car.", ["buying", "to buy", "buy", "bought"], 1, "'Decide' + to."),
      type("d43-3", "I'm looking forward to ___ you. (see or seeing)", ["seeing"], "'Look forward to' + -ing.", "The -ing form."),
      choose("d43-4", "Please remember ___ the lights before you leave.", ["switching off", "to switch off", "switch off", "switched off"], 1, "'Remember to' = don't forget to do it."),
      order("d43-5", "Say in English: Main naye log se milne ka intezaar kar raha hoon.", "I am looking forward to meeting new people.", [], ["I'm looking forward to meeting new people."]),
    ],
    { prompt: "Talk about your free time and goals: two things you enjoy doing, two things you want to do this year, and one thing you are looking forward to.", model: "In my free time I enjoy reading and I love going for long walks. This year I want to learn driving and I hope to visit Kerala. I'm also looking forward to joining a new team at work.", checklist: ["I used enjoy + -ing", "I used want or hope + to", "I said 'looking forward to + -ing'"], minWords: 30, must: ["enjoy", "want to"] }),

  lesson("d44", 44, 9, "Question Tags", "Grammar", 15, "Check information and invite agreement with short tags like 'isn't it?'.",
    ["It's a lovely day, isn't it?", "A friendly way to start a conversation and invite agreement.", "It's a lovely day, isn't it?"],
    [
      { title: "Positive sentence, negative tag", text: "Repeat the helper verb and make it negative. Use a pronoun, not the name.", rule: "You *are* coming, *aren't you*?", examples: ["She *is* your sister, *isn't she*?", "They *can* swim, *can't they*?", "You *will* help, *won't you*?"] },
      { title: "Negative sentence, positive tag", text: "If the sentence is negative, the tag is positive.", rule: "He *isn't* here, *is he*?", examples: ["You *don't* eat meat, *do you*?", "It *wasn't* expensive, *was it*?"] },
      { title: "When there is no helper verb", text: "Use do, does or did, matching the tense.", examples: ["You live in Thane, *don't you*?", "She works here, *doesn't she*?", "They called you, *didn't they*?"], pairs: [["You are coming, no?", "You are coming, *aren't you*?"], ["She likes tea, isn't it?", "She likes tea, *doesn't she*?"]], tip: "Special case: 'I am right, aren't I?'" },
    ],
    [
      choose("d44-1", "You're from Pune, ___?", ["isn't it", "aren't you", "don't you", "no"], 1, "'You are' → 'aren't you?'"),
      choose("d44-2", "She doesn't like coffee, ___?", ["doesn't she", "does she", "is she", "isn't it"], 1, "Negative sentence → positive tag."),
      type("d44-3", "They went to Goa, ___ they? (didn't or weren't)", ["didn't"], "Past simple without a helper → 'didn't'.", "Uses 'did'."),
      choose("d44-4", "Which tag is correct? 'He can drive, ___?'", ["can't he", "isn't it", "doesn't he", "can he"], 0, "Repeat 'can' in the negative."),
      order("d44-5", "Say in English: Aaj bahut garmi hai, hai na?", "It is very hot today, isn't it?", [], ["It's very hot today, isn't it?"]),
    ],
    { prompt: "Start three conversations with a colleague using question tags: one about the weather, one about work and one about their weekend.", model: "It's really hot today, isn't it? You're working on the new project, aren't you? You went to Lonavala last weekend, didn't you? It was beautiful, wasn't it?", checklist: ["I used a negative tag after a positive sentence", "I used do/does/did when there was no helper verb", "I used a pronoun in the tag"], minWords: 25, must: ["isn't it"] }, ["Positive + negative tag; negative + positive tag.", "No helper? Use do, does, did.", "Not 'no?' or 'isn't it?' for everything."], { goals: ["everyday"] }),

  lesson("d45", 45, 9, "Structure a Short Talk", "Speaking", 20, "Speak for two minutes with a clear beginning, middle and end.",
    ["Let me start with a quick story.", "A friendly way to open a talk.", "Good morning, everyone. Let me start with a quick story."],
    [
      { title: "Open, three points, close", text: "Tell people what you will say, say it in three points, then summarise.", examples: ["Today I'll talk about three things.", "First... Second... Finally...", "To sum up, ..."] },
      { title: "Signposts", text: "Signpost phrases help listeners follow you.", examples: ["Let's move on to...", "For example, ...", "This brings me to my last point.", "In short, ..."] },
      { title: "Voice and pace", text: "Pause after each point. Slow down for important words. Look at people, not at notes.", tip: "A pause sounds confident. 'Umm' does not." },
    ],
    [
      choose("d45-1", "Which is a good opening?", ["Okay so.", "Today I'll talk about three ways to save money.", "I am nervous.", "Start."], 1, "Tell people what you will talk about."),
      order("d45-2", "Say in English: Ab main apne aakhri point par aata hoon.", "This brings me to my last point."),
      type("d45-3", "To ___ up, practice every day. (sum or some)", ["sum"], "'To sum up' introduces a summary.", "Rhymes with 'come'."),
      choose("d45-4", "What should you do between points?", ["Say umm", "Pause briefly", "Speak faster", "Look at the floor"], 1, "A short pause helps listeners."),
    ],
    { prompt: "Give a two-minute talk on 'Three habits that helped me'. Use an opening, three signposted points and a summary.", model: "Good morning. Today I'll talk about three habits that changed my life. First, I wake up at six every day, so I have quiet time. Second, I read for twenty minutes before bed. For example, last month I finished two books. Finally, I write a to-do list every morning. To sum up: wake up early, read daily and plan your day. Thank you.", checklist: ["I told the audience what I would talk about", "I used first, second and finally", "I finished with 'To sum up'"], minWords: 60, must: ["first", "finally"] },
    ["Open, three points, close.", "Use signposts.", "Pause instead of 'umm'."], { goals: ["interview", "study", "work"] }),
];

/* ================= WEEK 10 : INTERVIEW GRAMMAR ================= */
const w10: Lesson[] = [
  lesson("d46", 46, 10, "Past Perfect: Had Done", "Grammar", 18, "Show which of two past actions happened first.",
    ["By the time I arrived, the meeting had started.", "The meeting started first; I arrived later.", "By the time I arrived, the meeting had already started."],
    [
      { title: "had + past participle", text: "Use the past perfect for an action that happened before another action in the past.", rule: "When I *reached*, the train *had left*", examples: ["I *had* never *seen* snow before I went to Manali.", "She *had finished* her work, so she went home."], pairs: [["When I reached, the train already left.", "When I reached, the train *had* already *left*."]] },
      { title: "Key words", text: "Already, by the time, before, after and never often go with the past perfect.", examples: ["*By the time* we got there, the shop *had closed*.", "*After* he *had eaten*, he slept."] },
      { title: "Only when order matters", text: "If the order is already clear, the past simple is fine. Don't use 'had' for every past action.", examples: ["I woke up, had tea and left. (simple order)", "I *went* to Goa last year. (not 'I had gone')"], tip: "A common Indian English habit is using 'had' for any past event. Use it only for the earlier of two past actions." },
    ],
    [
      choose("d46-1", "When I got to the station, the train ___.", ["already left", "had already left", "has already left", "was already leave"], 1, "The train left before I arrived: past perfect."),
      choose("d46-2", "Which sentence is natural for a simple past event?", ["I had visited Delhi last year.", "I visited Delhi last year.", "I have visited Delhi last year.", "I was visited Delhi last year."], 1, "One past event with a time: past simple."),
      type("d46-3", "She ___ never flown before her trip to Dubai. (had or has)", ["had"], "Before another past event: 'had'.", "Past of 'have'."),
      choose("d46-4", "By the time the doctor came, the pain ___.", ["stopped", "had stopped", "has stopped", "stops"], 1, "The pain stopped first."),
      order("d46-5", "Say in English: Jab tak main pahuncha, film shuru ho chuki thi.", "By the time I arrived, the film had started.", [], ["By the time I reached, the film had started."]),
    ],
    { prompt: "Tell a story about a day when you were late. Use the past perfect for two things that had already happened when you arrived.", model: "Last Monday my alarm didn't ring. By the time I reached the office, the meeting had already started and my manager had given my task to someone else. I had never been late before, so I felt terrible.", checklist: ["I used had + past participle", "I used the past simple for the main story", "I used 'by the time' or 'already'"], minWords: 35, must: ["had", "by the time"] }),

  lesson("d47", 47, 10, "Reported Speech: Said and Told", "Grammar", 20, "Report what other people said, asked and told you to do.",
    ["She said she would call back.", "Reporting what someone said earlier.", "I spoke to the bank. She said she would call back."],
    [
      { title: "Say and tell", text: "Use 'say' without a person, and 'tell' with a person.", rule: "He *said* that... · He *told me* that...", examples: ["She *said* she was tired.", "She *told me* she was tired."], pairs: [["He said me to wait.", "He *told me* to wait."], ["She told that she is busy.", "She *said* that she was busy."]] },
      { title: "One step back in time", text: "When the reporting verb is past, move the tense one step back. Change pronouns and time words too.", rule: "am → *was* · will → *would* · can → *could*", examples: ["'I am busy.' → He said he *was* busy.", "'I will help.' → She said she *would* help.", "'I saw it yesterday.' → He said he *had seen* it the day before."] },
      { title: "Questions and requests", text: "Reported questions use normal word order. Requests and orders use 'to' + verb.", examples: ["'Where do you live?' → She asked me where I *lived*.", "'Are you free?' → He asked *if* I was free.", "'Please sit down.' → She asked me *to sit* down."], tip: "In reported questions there is no question mark and no 'do/did'." },
    ],
    [
      choose("d47-1", "The manager ___ us to finish by six.", ["said", "told", "say", "tell to"], 1, "With a person and 'to', use 'told'."),
      choose("d47-2", "'I am tired.' → She said she ___ tired.", ["is", "was", "were", "has"], 1, "Move one step back: am → was."),
      type("d47-3", "He asked me where I ___. (lived or did I live)", ["lived"], "Reported questions use normal order and no 'did'.", "One past verb."),
      choose("d47-4", "'Will you help me?' → He asked ___ I would help him.", ["that", "if", "what", "do"], 1, "Yes/no questions are reported with 'if' or 'whether'."),
      order("d47-5", "Say in English: Usne kaha ki woh kal aayega.", "He said that he would come tomorrow.", [], ["He said he would come tomorrow."]),
    ],
    { prompt: "Report a recent conversation: two things someone said, one question they asked you, and one thing they told you to do.", model: "Yesterday my manager called me. She said that the client was happy with our work. She told me that the project would continue next month. She asked me if I could lead the next phase, and she told me to prepare a plan by Friday.", checklist: ["I used said without a person and told with a person", "I moved the tense one step back", "I reported a question with if or a question word"], minWords: 35, must: ["said", "told"] }, ["say something; tell someone something.", "am → was, will → would, can → could.", "asked if..., told me to..."], { goals: ["work", "interview"] }),

  lesson("d48", 48, 10, "Passive Voice", "Grammar", 20, "Focus on the action or result, not on who did it.",
    ["The report has been sent.", "We care that it is done, not who did it.", "Don't worry, the report has been sent to the client."],
    [
      { title: "be + past participle", text: "Make the passive with the right form of 'be' and the past participle. Use it when the doer is unknown or not important.", rule: "is / was / has been / will be + *done*", examples: ["English *is spoken* all over the world.", "My phone *was stolen*.", "The bridge *will be opened* next year."], pairs: [["The work is complete by our team yesterday.", "The work *was completed* by our team yesterday."]] },
      { title: "Active to passive", text: "The object of the active sentence becomes the subject. Add 'by' only if the doer is important.", examples: ["Someone cleaned the office. → The office *was cleaned*.", "Ravi wrote the report. → The report *was written by* Ravi."] },
      { title: "Where it is used", text: "The passive is common in news, processes and formal work English.", examples: ["The tea *is grown* in Assam.", "Your order *has been shipped*.", "Applications *must be submitted* by Friday."], tip: "In everyday speech, the active voice usually sounds friendlier." },
    ],
    [
      choose("d48-1", "This temple ___ in the 12th century.", ["built", "was built", "is build", "has built"], 1, "Past passive: was + past participle."),
      choose("d48-2", "Your parcel ___. It will arrive tomorrow.", ["has been shipped", "has shipped", "is shipping by", "shipped been"], 0, "Present perfect passive: has been + past participle."),
      type("d48-3", "Hindi is ___ in many countries. (spoke or spoken)", ["spoken"], "Passive uses the past participle: 'spoken'.", "The third form of speak."),
      choose("d48-4", "Make it passive: 'They will announce the results tomorrow.'", ["The results will announced tomorrow.", "The results will be announced tomorrow.", "The results are announce tomorrow.", "The results will being announced."], 1, "Future passive: will be + past participle."),
      order("d48-5", "Say in English: Mera phone chori ho gaya.", "My phone was stolen.", [], ["My phone has been stolen."]),
    ],
    { prompt: "Describe how something is made or done, for example tea, chapatis or a process at your work, using at least four passive sentences.", model: "First, the tea leaves are picked by hand in Assam. Then they are dried and rolled. After that, the tea is packed in boxes. Finally, it is sent to shops all over India.", checklist: ["I used is / are + past participle", "I used the correct past participle", "I described the steps in order"], minWords: 30, must: ["is", "are"] }, ["be + past participle.", "Use it when the doer is unknown or unimportant.", "Add 'by' only if the doer matters."], { goals: ["work", "study"] }),

  lesson("d49", 49, 10, "Zero and First Conditional", "Grammar", 18, "Talk about general truths and real possibilities with 'if'.",
    ["If you need anything, just let me know.", "A real offer: if this happens, here's the result.", "If you need anything, just let me know."],
    [
      { title: "Zero conditional: always true", text: "Use present + present for facts and things that are always true.", rule: "*If* you *heat* ice, it *melts*", examples: ["*If* I *drink* coffee at night, I *can't* sleep.", "Plants *die* *if* they *don't get* water."] },
      { title: "First conditional: real future", text: "Use if + present, will + base verb for a real possibility in the future.", rule: "*If* it *rains*, we *will stay* home", examples: ["*If* you *study* hard, you*'ll pass*.", "*If* the train *is* late, I*'ll call* you."], pairs: [["If it will rain, we will stay home.", "If it *rains*, we will stay home."]] },
      { title: "Unless and other forms", text: "'Unless' means 'if not'. You can also use a modal or an imperative in the result.", examples: ["We'll miss the bus *unless* we hurry.", "*If* you *see* Priya, *tell* her to call me.", "*If* you're free, we *can* meet."], tip: "The 'if' part can come first or second. Use a comma when 'if' comes first." },
    ],
    [
      choose("d49-1", "If you ___ ice, it melts.", ["will heat", "heat", "heated", "heating"], 1, "Zero conditional: present + present."),
      choose("d49-2", "If it ___ tomorrow, we'll cancel the trip.", ["will rain", "rains", "rained", "rain"], 1, "No 'will' after 'if'."),
      type("d49-3", "If you finish early, I ___ give you a call. (will or would)", ["will"], "Real future: 'will'.", "First conditional."),
      choose("d49-4", "We'll be late ___ we leave now.", ["if", "unless", "when", "because"], 1, "'Unless' = 'if not'."),
      order("d49-5", "Say in English: Agar tum jaldi aaoge toh hum saath mein lunch karenge.", "If you come early, we will have lunch together.", [], ["If you come early, we'll have lunch together."]),
    ],
    { prompt: "Talk about your plans for next month with four 'if' sentences about real possibilities, and one with 'unless'.", model: "If I get the promotion, I'll take my family out for dinner. If the weather is good, we'll go to Lonavala. If I have time, I'll join a dance class. If my friend visits, I'll show her Marine Drive. But unless I save money, I won't buy a new phone.", checklist: ["I used if + present, will + verb", "I did not say 'if ... will'", "I used unless once"], minWords: 35, must: ["if", "will"] }),

  lesson("d50", 50, 10, "Interview Answers with STAR", "Speaking", 20, "Answer 'Tell me about a time when...' questions clearly and confidently.",
    ["Let me give you an example.", "A strong way to start an answer with evidence.", "That's a good question. Let me give you an example."],
    [
      { title: "The STAR method", text: "Situation, Task, Action, Result. It keeps your answer short and clear.", examples: ["Situation: Last year our biggest client was unhappy.", "Task: I had to win back their trust.", "Action: I called them weekly and fixed the delays.", "Result: They renewed the contract for two years."] },
      { title: "Grammar for STAR", text: "Use the past simple for actions, the past perfect for background, and 'I' to show your role.", examples: ["The client *had complained* twice. (background)", "*I organised* a meeting. (your action)", "*As a result*, sales *went up* by 20%."] },
      { title: "Useful phrases", text: "These make your answers sound structured.", examples: ["That's a good question.", "Let me give you an example.", "What I learned from this was...", "Looking back, I would..."], tip: "Two minutes at most. Practise three STAR stories before any interview." },
    ],
    [
      choose("d50-1", "What does the A in STAR stand for?", ["Answer", "Action", "Attitude", "Ability"], 1, "Situation, Task, Action, Result."),
      choose("d50-2", "Which sentence describes your action clearly?", ["Things were done.", "We did something.", "I organised a weekly call with the client.", "It happened."], 2, "Use 'I' and a clear past verb."),
      type("d50-3", "As a ___, the client renewed the contract. (result or results)", ["result"], "'As a result' introduces the outcome.", "Singular."),
      order("d50-4", "Say in English: Main aapko ek udaharan deta hoon.", "Let me give you an example."),
    ],
    { prompt: "Answer this interview question using STAR: 'Tell me about a time when you solved a problem at work or college.'", model: "That's a good question. Let me give you an example. In my final year, our project team had lost two members a month before the deadline. My task was to make sure we still finished on time. I divided the work again, set up daily fifteen-minute calls and took on the testing myself. As a result, we submitted the project on time and got an A grade. What I learned was that clear planning reduces stress.", checklist: ["I covered Situation, Task, Action and Result", "I used 'I' for my actions", "I finished with what I learned"], minWords: 60, must: ["task", "result"] },
    ["Situation, Task, Action, Result.", "Past simple for actions; 'I' for your role.", "End with what you learned."], { goals: ["interview"] }),
];

/* ================= WEEK 11 : ADVANCED MEANING ================= */
const w11: Lesson[] = [
  lesson("d51", 51, 11, "Second Conditional: If I Were", "Grammar", 18, "Talk about imaginary situations and give advice with 'If I were you'.",
    ["If I were you, I'd take the job.", "Advice by imagining yourself in their place.", "If I were you, I'd take the job. It's a great opportunity."],
    [
      { title: "if + past, would + verb", text: "Use the second conditional for situations that are imaginary or unlikely now or in the future.", rule: "*If* I *had* more time, I *would* travel", examples: ["*If* I *won* the lottery, I*'d buy* a house.", "*If* she *lived* nearer, we*'d meet* more often."], pairs: [["If I would have money, I would buy it.", "If I *had* money, I *would* buy it."]] },
      { title: "If I were you", text: "Use 'were' for all persons in careful English, especially in 'If I were you' for advice.", examples: ["*If I were you*, I*'d* talk to the manager.", "*If* he *were* here, he*'d* know what to do."] },
      { title: "First or second?", text: "First conditional = a real possibility. Second conditional = imaginary or unlikely.", examples: ["If I *get* the job, I'll move. (it might happen)", "If I *were* the Prime Minister, I'd... (imaginary)"], tip: "'Would' never goes in the 'if' part." },
    ],
    [
      choose("d51-1", "If I ___ a car, I would drive to work.", ["have", "had", "would have", "will have"], 1, "Second conditional: if + past."),
      choose("d51-2", "If I were you, I ___ apologise.", ["will", "would", "am", "did"], 1, "Advice: 'If I were you, I would...'."),
      type("d51-3", "If she ___ more money, she would travel the world. (had or has)", ["had"], "Imaginary situation: past form.", "Past of have."),
      choose("d51-4", "Choose the correct sentence.", ["If I would know, I would tell you.", "If I knew, I would tell you.", "If I know, I would tell you.", "If I knew, I will tell you."], 1, "if + past, would + base verb."),
      order("d51-5", "Say in English: Agar main tumhari jagah hota toh main manager se baat karta.", "If I were you, I would talk to the manager.", [], ["If I were you, I'd talk to the manager."]),
    ],
    { prompt: "Answer: 'What would you do if you didn't have to work for a year?' Then give a friend one piece of advice with 'If I were you'.", model: "If I didn't have to work for a year, I would travel around India. I would learn to cook Kerala food and I would write a blog. If I had enough money, I would also visit Japan. And to my friend: if I were you, I'd start saving now.", checklist: ["I used if + past", "I used would + base verb", "I used 'If I were you'"], minWords: 35, must: ["would", "if"] }),

  lesson("d52", 52, 11, "Third Conditional and Wish", "Grammar", 20, "Talk about past regrets and imagine a different past, and say what you wish.",
    ["If I had known, I would have come.", "Imagining a different past.", "Why didn't you tell me? If I had known, I would have come."],
    [
      { title: "Third conditional", text: "Use if + had + past participle, would have + past participle for a past that did not happen.", rule: "*If* I *had left* earlier, I *would have caught* the train", examples: ["*If* you *had told* me, I *would have helped*.", "We *wouldn't have got* lost *if* we *had used* the map."], pairs: [["If I would have known, I would have come.", "If I *had known*, I would have come."]] },
      { title: "Wish about now", text: "Use 'wish' + past to say you want the present to be different.", rule: "I *wish* I *had* more time (I don't)", examples: ["I *wish* I *lived* closer to the sea.", "I *wish* I *could* speak French.", "I *wish* I *were* taller."] },
      { title: "Wish about the past", text: "Use 'wish' + had + past participle for regrets about the past.", rule: "I *wish* I *had studied* harder (I didn't)", examples: ["I *wish* I *hadn't eaten* so much.", "She *wishes* she *had taken* the job."], tip: "In speech, would have often sounds like 'would've' and had like 'I'd'." },
    ],
    [
      choose("d52-1", "If I ___ earlier, I would have caught the train.", ["left", "had left", "would leave", "have left"], 1, "Third conditional: if + had + past participle."),
      choose("d52-2", "I wish I ___ the answer. I really don't know.", ["know", "knew", "will know", "known"], 1, "Wish about now: past form."),
      type("d52-3", "I wish I ___ studied harder at school. (had or have)", ["had"], "A regret about the past: wish + had + past participle.", "Past perfect."),
      choose("d52-4", "If she had asked me, I ___ her.", ["would help", "would have helped", "will help", "helped"], 1, "Result in the past: would have + past participle."),
      order("d52-5", "Say in English: Kaash main zyada paise bachata.", "I wish I had saved more money."),
    ],
    { prompt: "Talk about one past decision: what would have been different if you had chosen differently, and two wishes, one about now and one about the past.", model: "After college I chose a job in Pune instead of Bangalore. If I had moved to Bangalore, I would have earned more, but I wouldn't have met my best friends. I wish I could speak Kannada now, and I wish I had travelled more when I was a student.", checklist: ["I used if + had + past participle", "I used would have + past participle", "I used wish for now and wish for the past"], minWords: 40, must: ["would have", "wish"] }),

  lesson("d53", 53, 11, "Must Be, Can't Be, Might Have", "Grammar", 18, "Make guesses about now and the past, from very sure to not sure.",
    ["You must be tired.", "A confident guess based on what you see.", "You've been travelling all day. You must be tired."],
    [
      { title: "Guessing about now", text: "Use must when you are almost sure something is true, can't when you are almost sure it is not, and might or could when it is possible.", rule: "sure: *must be* · not true: *can't be* · possible: *might be*", examples: ["She *must be* at home. Her car is outside.", "That *can't be* Ravi. He's in Dubai.", "He *might be* in a meeting."], pairs: [["He mustn't be at home, the lights are off.", "He *can't be* at home, the lights are off."]] },
      { title: "Guessing about the past", text: "Add 'have' + past participle to guess about the past.", rule: "*must have* / *can't have* / *might have* + done", examples: ["You *must have* worked hard. You look exhausted.", "She *can't have* seen us. She didn't wave.", "I *might have* left my keys in the car."] },
      { title: "Should have and could have", text: "Use 'should have' for a past mistake and 'could have' for a chance that was not taken.", examples: ["I *should have* called you. Sorry.", "You *could have* asked me for help."], tip: "In speech: must've, might've, should've, could've." },
    ],
    [
      choose("d53-1", "He's been working for twelve hours. He ___ tired.", ["can't be", "must be", "mustn't be", "should be"], 1, "Almost sure it's true: 'must be'."),
      choose("d53-2", "That ___ be the right address. The building number is different.", ["must", "can't", "might", "should"], 1, "Almost sure it's not true: 'can't'."),
      type("d53-3", "I can't find my wallet. I might ___ left it at the shop. (have or had)", ["have"], "Past guess: might have + past participle.", "Modal + have."),
      choose("d53-4", "You failed because you didn't study. You ___ studied.", ["must have", "should have", "can't have", "might"], 1, "A past mistake: 'should have'."),
      order("d53-5", "Say in English: Woh ghar par hi hogi, uski gaadi bahar hai.", "She must be at home, her car is outside.", [], ["She must be at home. Her car is outside."]),
    ],
    { prompt: "Look around you and make four guesses: two about the present and two about the past, using must, can't and might.", model: "My neighbour's lights are on, so he must be home. The street is very quiet; it can't be a holiday. There's water on the road, so it must have rained last night. My colleague hasn't replied; she might have gone home early.", checklist: ["I used must / can't / might + be", "I used must / might have + past participle", "I gave a reason for each guess"], minWords: 30, must: ["must", "might"] }),

  lesson("d54", 54, 11, "Phrasal Verbs for Daily Life", "Grammar", 18, "Use the common two-word verbs that make English sound natural.",
    ["Let's call it off.", "'Call off' means cancel.", "It's raining too hard. Let's call off the match."],
    [
      { title: "What they are", text: "A phrasal verb is a verb + a small word (up, off, on, out, back). Together they have a new meaning.", rule: "give *up* = stop trying · find *out* = discover", examples: ["wake *up*, get *up*, turn *on*, turn *off*", "look *for* (search), look *after* (take care of)", "find *out*, give *up*, put *off* (postpone)"] },
      { title: "Separable verbs", text: "With many phrasal verbs, a noun can go before or after the small word, but a pronoun must go in the middle.", rule: "turn off the TV · turn *it* off", examples: ["Pick up the phone. / Pick it up.", "Fill in the form. / Fill it in."], pairs: [["Turn off it.", "Turn *it* off."]] },
      { title: "Work and daily life", text: "These appear in almost every office and home.", examples: ["set *up* a meeting, carry *on* (continue)", "get *back* to someone (reply later)", "run *out* of (have none left), come *across* (find by chance)"], tip: "Learn each with an example sentence from your own life." },
    ],
    [
      choose("d54-1", "We've ___ milk. Can you buy some?", ["run out of", "run off", "run into", "run up"], 0, "'Run out of' = have none left."),
      choose("d54-2", "The meeting has been ___ until Monday.", ["put off", "put on", "put up", "put in"], 0, "'Put off' = postpone."),
      type("d54-3", "Can you turn the music ___? It's too loud. (down or off)", ["down"], "'Turn down' = make quieter.", "Opposite of up."),
      choose("d54-4", "Choose the correct sentence.", ["Please switch off it.", "Please switch it off.", "Please it switch off.", "Please switch of it."], 1, "A pronoun goes in the middle."),
      order("d54-5", "Say in English: Main aapko kal jawab deta hoon.", "I will get back to you tomorrow.", [], ["I'll get back to you tomorrow."]),
    ],
    { prompt: "Describe your morning and your work day using at least six phrasal verbs.", model: "I wake up at six, but I usually get up at six fifteen. I turn on the geyser and put on my clothes. At work I set up meetings and I look after two new interns. When I run out of ideas, I take a short break and then carry on.", checklist: ["I used six phrasal verbs", "I put a pronoun in the middle when needed", "I used them about my own life"], minWords: 35, must: ["up", "on"] }, ["verb + up/off/on/out = new meaning.", "turn it off, not turn off it.", "Learn them in real sentences."], { goals: ["everyday", "work"] }),

  lesson("d55", 55, 11, "Presentations and Group Discussions", "Conversation", 20, "Present an opinion, agree, disagree politely and summarise in a group.",
    ["I see your point, but...", "A polite way to disagree.", "I see your point, but I think we need more data."],
    [
      { title: "Giving opinions", text: "Start clearly and give one reason.", examples: ["In my opinion, ...", "I strongly believe that ...", "The main reason is that ..."] },
      { title: "Agreeing and disagreeing", text: "Disagree with respect. Accept part of the idea, then add yours.", examples: ["I completely agree with Ankit.", "I see your point, but ...", "That's true, however ...", "I'm not sure I agree, because ..."], pairs: [["You are wrong.", "*I see your point, but* I think..."]] },
      { title: "Joining and closing", text: "Enter the conversation politely and summarise at the end.", examples: ["Could I add something?", "Coming back to the main question, ...", "So, to summarise, we all agree that ..."], tip: "In group discussions, speaking early and clearly matters more than speaking a lot." },
    ],
    [
      choose("d55-1", "Which is a polite way to disagree?", ["You are wrong.", "No.", "I see your point, but I think it's too expensive.", "That's stupid."], 2, "Accept their point, then add yours."),
      order("d55-2", "Say in English: Meri raay mein yeh achha idea hai.", "In my opinion, this is a good idea.", [], ["In my opinion this is a good idea."]),
      type("d55-3", "So, to ___, we all agree on the budget. (summarise or summary)", ["summarise", "summarize"], "'To summarise' introduces a summary.", "The verb form."),
      choose("d55-4", "How do you join a discussion politely?", ["Stop talking.", "Could I add something?", "Listen to me.", "My turn."], 1, "Ask to add something."),
    ],
    { prompt: "Topic: 'Should offices allow work from home?' Give your opinion with a reason, agree with one point, disagree politely with another, and summarise.", model: "In my opinion, offices should allow work from home two days a week. The main reason is that people save time travelling. I agree with Priya that teamwork is important. However, I see your point about meetings, but we can do many of them online. So, to summarise, a mix of home and office is the best option.", checklist: ["I gave an opinion and a reason", "I agreed and disagreed politely", "I summarised at the end"], minWords: 50, must: ["opinion", "agree"] },
    ["In my opinion... The main reason is...", "I see your point, but...", "To summarise, ..."], { goals: ["interview", "study", "work"] }),
];

/* ================= WEEK 12 : FINAL POLISH ================= */
const w12: Lesson[] = [
  lesson("d56", 56, 12, "Have Something Done", "Grammar", 15, "Say that you arrange for someone else to do something for you.",
    ["I'm getting my car serviced.", "Someone else is servicing it for you.", "I can't drive today. I'm getting my car serviced."],
    [
      { title: "have / get + object + past participle", text: "Use this form when you pay or ask someone else to do a job for you.", rule: "I *had* my hair *cut* (the barber cut it)", examples: ["We *had* the kitchen *painted*.", "I need to *get* my phone *repaired*.", "She *is having* her eyes *tested*."], pairs: [["I cut my hair yesterday.", "I *had my hair cut* yesterday. (at a salon)"], ["I am getting repaired my laptop.", "I am getting *my laptop repaired*."]] },
      { title: "Any tense", text: "Change the form of have or get for the tense.", examples: ["I *have* my car *washed* every week.", "I *had* the AC *fixed* last month.", "I*'ll get* the documents *printed* tomorrow."] },
      { title: "Bad experiences", text: "The same form describes something bad that happened to you.", examples: ["He *had* his wallet *stolen* on the train."], tip: "Word order matters: have + thing + past participle." },
    ],
    [
      choose("d56-1", "I don't cut my own hair. I ___.", ["cut it", "have it cut", "have cut it", "am cutting"], 1, "Someone else does it: have + it + cut."),
      choose("d56-2", "We're ___ our house painted next week.", ["having", "doing", "making", "giving"], 0, "'Having our house painted'."),
      type("d56-3", "I need to get my laptop ___. (repair or repaired)", ["repaired"], "Use the past participle.", "Ends in -ed."),
      choose("d56-4", "Choose the correct order.", ["I had repaired my phone.", "I had my phone repaired.", "I had my phone repair.", "I repaired had my phone."], 1, "have + object + past participle."),
      order("d56-5", "Say in English: Maine apni car ki servicing karwayi.", "I had my car serviced.", [], ["I got my car serviced."]),
    ],
    { prompt: "Talk about three things you have done for you by other people: one regularly, one last month and one you will arrange soon.", model: "I have my clothes ironed every week by the istriwala. Last month I had my eyes tested and got new glasses. Next week I'm going to get my phone screen replaced.", checklist: ["I used have/get + object + past participle", "I used three different tenses", "I put the object before the past participle"], minWords: 25, must: ["had", "get"] }),

  lesson("d57", 57, 12, "Prepositions: Movement and Partners", "Grammar", 18, "Use the right preposition for movement and after common words.",
    ["I'm good at solving problems.", "'Good' always takes 'at'.", "In interviews I say: I'm good at solving problems."],
    [
      { title: "Movement", text: "Use these to describe how something moves.", rule: "*into* · *out of* · *through* · *across* · *along*", examples: ["She walked *into* the room.", "We drove *through* the tunnel.", "Walk *across* the road carefully.", "Go *along* this road for a kilometre."] },
      { title: "Adjective + preposition", text: "Many adjectives have a fixed partner. Learn them together.", examples: ["good *at*, interested *in*, afraid *of*", "proud *of*, married *to*, responsible *for*"], pairs: [["I am interested for music.", "I am interested *in* music."], ["She is married with Rahul.", "She is married *to* Rahul."]] },
      { title: "Verb + preposition", text: "Some verbs need a preposition; others never take one.", examples: ["depend *on*, listen *to*, wait *for*, apply *for*", "discuss the plan, enter the room, reach the station (no preposition)"], pairs: [["We discussed about the plan.", "We *discussed* the plan."], ["I reached to office late.", "I *reached* the office late."]], tip: "When you learn a word, write down its partner preposition too." },
    ],
    [
      choose("d57-1", "I'm really interested ___ photography.", ["on", "in", "at", "for"], 1, "'Interested in'."),
      choose("d57-2", "Which is correct?", ["We discussed about the problem.", "We discussed the problem.", "We discussed on the problem.", "We discussed for the problem."], 1, "'Discuss' takes no preposition."),
      type("d57-3", "It depends ___ the weather. (on or of)", ["on"], "'Depend on'.", "Two letters."),
      choose("d57-4", "The cat jumped ___ the window and ran away.", ["out of", "out", "outside of", "off from"], 0, "Moving from inside to outside: 'out of'."),
      order("d57-5", "Say in English: Main is naukri ke liye apply karna chahta hoon.", "I want to apply for this job.", [], ["I would like to apply for this job."]),
    ],
    { prompt: "Describe yourself for an interview using five adjective + preposition partners, like good at, interested in and responsible for.", model: "I'm good at managing people and I'm interested in digital marketing. In my current role I'm responsible for a team of five. I'm proud of our results this year. I'm also keen on learning new tools.", checklist: ["I used five partner prepositions", "I said 'interested in' and 'good at'", "I did not add a preposition after discuss or reach"], minWords: 30, must: ["good at", "interested in"] }, ["into, out of, through, across, along.", "good at, interested in, responsible for.", "discuss / reach / enter: no preposition."], { goals: ["interview"] }),

  lesson("d58", 58, 12, "Future Continuous and Future Perfect", "Grammar", 18, "Say what will be happening and what will be finished at a future time.",
    ["This time next week, I'll be flying to Delhi.", "An action in progress at a future time.", "This time next week, I'll be flying to Delhi."],
    [
      { title: "Future continuous", text: "Use will be + -ing for an action that will be in progress at a time in the future.", rule: "At 9 tomorrow I *will be travelling*", examples: ["Don't call at eight. I*'ll be driving*.", "This time tomorrow we*'ll be sitting* on the beach."] },
      { title: "Future perfect", text: "Use will have + past participle for something that will be finished before a time in the future.", rule: "By Friday I *will have finished* the report", examples: ["*By* 2027 I*'ll have completed* my degree.", "The film *will have started* by the time we arrive."], pairs: [["By next month I will complete the course.", "By next month I *will have completed* the course."]] },
      { title: "Polite questions", text: "The future continuous makes questions about plans sound polite.", examples: ["*Will* you *be using* the car tonight?", "*Will* you *be joining* us for dinner?"], tip: "'By' + a time is the signal for the future perfect." },
    ],
    [
      choose("d58-1", "At 10 am tomorrow I ___ an interview.", ["will have", "will be having", "have had", "had"], 1, "In progress at a future time: will be + -ing."),
      choose("d58-2", "By the end of this year, I ___ this course.", ["will finish", "will have finished", "finish", "am finishing"], 1, "Finished before a future time: will have + past participle."),
      type("d58-3", "By 2030 I will ___ saved enough for a house. (have or be)", ["have"], "Future perfect: will have + past participle.", "Not 'be'."),
      choose("d58-4", "Which is a polite question about plans?", ["Will you use the room?", "Will you be using the meeting room at three?", "You use the room?", "Using the room?"], 1, "Future continuous sounds polite."),
      order("d58-5", "Say in English: Kal is samay main train mein safar kar raha hounga.", "This time tomorrow I will be travelling by train.", [], ["This time tomorrow I'll be travelling by train."]),
    ],
    { prompt: "Talk about your future: what you will be doing this time next year, and two things you will have achieved by then.", model: "This time next year I'll be working in a bigger company, and I'll be leading my own small team. By then I'll have finished my certification and I'll have saved enough money for a trip to Europe.", checklist: ["I used will be + -ing", "I used will have + past participle", "I used 'by' with a time"], minWords: 30, must: ["will be", "will have"] }),

  lesson("d59", 59, 12, "All the Tenses on One Page", "Grammar", 20, "See all twelve tenses together and choose the right one quickly.",
    ["Practice makes progress.", "A friendly reminder: you don't need perfect, you need progress.", "Don't worry about mistakes. Practice makes progress."],
    [
      { title: "Present", text: "Simple for habits and facts. Continuous for now. Perfect for experience or a result now. Perfect continuous for how long until now.", rule: "I *work* · I *am working* · I *have worked* · I *have been working*", examples: ["I *work* in a bank. (fact)", "I*'m working* from home today. (now)", "I*'ve worked* with clients before. (experience)", "I*'ve been working* here since 2021. (how long)"] },
      { title: "Past", text: "Simple for finished actions. Continuous for the background. Perfect for the earlier past. Perfect continuous for how long before a past moment.", rule: "I *worked* · I *was working* · I *had worked* · I *had been working*", examples: ["I *worked* late yesterday.", "I *was working* when you called.", "I *had* already *worked* there for a year when I got promoted.", "I *had been working* for hours, so I was tired."] },
      { title: "Future", text: "Will or going to for the future. Continuous for in progress then. Perfect for finished by then. Perfect continuous for how long until then.", rule: "I *will work* · I *will be working* · I *will have worked* · I *will have been working*", examples: ["I*'ll work* on it tomorrow.", "I*'ll be working* at 10 am.", "I*'ll have finished* by Friday.", "By June I*'ll have been working* here for five years."], tip: "Ask two questions: When? (past, present, future) and What kind? (simple fact, in progress, finished, how long)." },
    ],
    [
      choose("d59-1", "Look! It ___.", ["snows", "is snowing", "has snowed", "snowed"], 1, "Happening now: present continuous."),
      choose("d59-2", "I ___ to Delhi three times.", ["went", "have been", "am going", "was going"], 1, "Experience with no time: present perfect."),
      choose("d59-3", "When the phone rang, I ___ a shower.", ["had", "was having", "have had", "am having"], 1, "Background action: past continuous."),
      choose("d59-4", "By next June, I ___ here for five years.", ["will work", "will have been working", "am working", "worked"], 1, "How long until a future time: future perfect continuous."),
      type("d59-5", "She ___ in Mumbai since 2018. (has lived or lives)", ["has lived", "has been living"], "Since + start point: present perfect.", "Uses 'has'."),
      order("d59-6", "Say in English: Jab main pahuncha, sab log khana kha chuke the.", "When I arrived, everyone had eaten.", [], ["When I reached, everyone had eaten."]),
    ],
    { prompt: "Tell your English story in one minute: what you did before, what you have been doing in this course, what you are doing now, and what you will have achieved in a year.", model: "Before this course, I was nervous about speaking. I had never given a talk in English. For three months I have been practising every day, and now I am speaking more confidently. Next month I'm going to apply for a new role, and in a year I will have given many presentations.", checklist: ["I used at least one past, present and future tense", "I used a perfect tense", "I used a continuous tense"], minWords: 45, must: ["have been", "will"] },
    ["When? past, present or future.", "What kind? simple, continuous, perfect, perfect continuous.", "You now know all twelve tenses."], { goals: ["interview", "study", "work"] }),

  lesson("d60", 60, 12, "Final Showcase", "Project", 25, "Give a confident three-minute talk that shows everything you have learned.",
    ["Thank you all for listening.", "A clear, confident way to finish a talk.", "That brings me to the end. Thank you all for listening."],
    [
      { title: "Your final talk", text: "Three minutes in four parts: who you are, your journey in this course, one story with a lesson, and your next goal.", examples: ["Good evening, everyone. My name is...", "Three months ago, I couldn't...", "One day in Week 8, something happened...", "My next goal is..."] },
      { title: "Show your range", text: "Use a mix of what you learned.", examples: ["tenses: I used to..., I have been..., I will have...", "conditionals: If I hadn't joined, I wouldn't have...", "linking: although, because, however", "passive: I was given a chance to..."] },
      { title: "Deliver it well", text: "Practise three times. Record the last one. Pause, look up and smile.", tip: "Your trainer reviews this talk in the final live class for your certificate." },
    ],
    [
      choose("d60-1", "Which sentence is the strongest opening?", ["Hello I am nervous.", "Good evening, everyone. Three months ago, I couldn't speak for one minute in English.", "So.", "My talk is about me."], 1, "A greeting and a short 'before' story."),
      order("d60-2", "Say in English: Agar maine yeh course join nahi kiya hota, toh main itna confident nahi hota.", "If I had not joined this course, I would not be so confident.", [], ["If I hadn't joined this course, I wouldn't be so confident."]),
      type("d60-3", "Although I was nervous, I ___ to speak. (decided or decide)", ["decided"], "A finished past action: past simple.", "Ends in -ed."),
      choose("d60-4", "How should you end?", ["Bye.", "That's it.", "That brings me to the end. Thank you all for listening.", "Over."], 2, "A clear, polite closing."),
    ],
    { prompt: "Give your three-minute final talk: who you are, your journey, one story with a lesson, and your next goal. Record it if you can.", model: "Good evening, everyone. My name is Asha and I work in a bank in Mumbai. Three months ago, I couldn't speak English for even one minute without stopping. Since then, I have been practising every day. In Week 10, I was asked to present in a team meeting. Although I was nervous, I used the STAR method and it went well. If I hadn't joined this course, I wouldn't have had the courage. My next goal is to lead client meetings in English. By the end of this year, I will have done ten presentations. That brings me to the end. Thank you all for listening.", checklist: ["I covered all four parts", "I used at least three tenses and one conditional", "I closed with a clear thank you"], minWords: 90, must: ["goal", "thank you"] },
    ["Who you are, your journey, one story, your goal.", "Show your range of grammar.", "Pause, look up, smile."], { goals: ["interview", "study", "work", "everyday"] }),
];

export const M3_WEEKS: Week[] = [
  wk(9, "Linking Your Ideas", "Longer, smoother sentences", w9),
  wk(10, "Interview Grammar", "Report, explain and describe processes", w10),
  wk(11, "Advanced Meaning", "Imagine, guess and use natural verbs", w11),
  wk(12, "Final Polish", "Complete grammar and your final talk", w12),
];
