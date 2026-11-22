/* =====================================================================
   THE COURSE PATH: 12 weeks, 5 daily lessons per week + a weekly checkpoint.
   Month 1 (weeks 1-4) is in this file; Month 2 (weeks 5-8) is in path-month2.ts
   and Month 3 (weeks 9-12) in path-month3.ts. Together they cover the full
   grammar syllabus (see GRAMMAR_MAP in grammar-map.ts).

   A lesson = 5 steps: Warm-up -> Learn -> Try it -> Speak -> Finish.
   Add a lesson by copying one below. Practice items come in 3 kinds:
     choose (pick an option), type (fill the gap), order (build the sentence).
   Grammar lessons reuse vetted questions from lib/practice-data.ts via bank().
   ===================================================================== */
import { bank, choose, order, type, type Card, type Goal, type Lesson, type Level, type Say, type Week } from "./path-helpers";
import { M2_WEEKS } from "./path-month2";
import { M3_WEEKS } from "./path-month3";
export type { Card, Choose, Goal, Item, Lesson, LessonKind, Level, Order, Say, TypeIn, Week } from "./path-helpers";

/* ================= WEEK 1 : START HERE ================= */
const w1: Lesson[] = [
  {
    id: "d01", day: 1, week: 1, title: "Welcome: Your First 20 Minutes", kind: "Start here", minutes: 15,
    goal: "Know how the course works and say your first sentences in English.",
    warm: { phrase: "Nice to meet you.", meaning: "A friendly thing to say when you meet someone for the first time.", example: "Hi, I'm Asha. Nice to meet you." },
    learn: [
      { title: "How the course works", text: "Every day has five short steps: Warm-up, Learn, Try it, Speak and Finish. A lesson takes about 20 minutes. Do one lesson a day, and join your live class twice a week.", tip: "Small and daily beats big and rare." },
      { title: "Choose one goal", text: "Pick one reason for learning English. It keeps you going on busy days. Make it specific and give it a date.", examples: ["In 30 days I will talk for two minutes without stopping.", "By March I will answer 'Tell me about yourself' in an interview."] },
      { title: "Mistakes are welcome", text: "Nobody learns to speak without making mistakes. In this course there are no scores and no failing. If an answer is wrong, you simply try again, and we explain why." },
    ],
    practice: [
      choose("d01-1", "Someone says 'Nice to meet you.' What do you say back?", ["Nice to meet you too.", "Thank you, goodbye.", "I am fine.", "Yes, I meet you."], 0, "We repeat the greeting back: 'Nice to meet you too.'"),
      order("d01-2", "Say in English: Mera naam Asha hai.", "My name is Asha."),
      type("d01-3", "How ___ you?", ["are"], "'How are you?' is the usual way to ask about someone's day.", "It starts with a and has three letters."),
      choose("d01-4", "It is 8 in the morning. You say 'Good ___!'", ["morning", "night", "evening", "afternoon"], 0, "We say 'Good morning' until about noon."),
    ],
    speak: { prompt: "Say hello, tell us your name, your city, and why you want to improve your English. Three sentences are enough.", model: "Hello, my name is Asha. I live in Mumbai. I want to improve my English to get a better job.", checklist: ["I said it aloud, not only in my head", "I kept going even after a mistake", "I said my name clearly"] },
    recap: ["Each lesson has five steps and takes about 20 minutes.", "Pick one specific goal.", "'Nice to meet you too' is the natural reply."],
  },
  {
    id: "d02", day: 2, week: 1, title: "Introduce Yourself", kind: "Speaking", minutes: 18,
    goal: "Give a clear 30-second introduction.",
    warm: { phrase: "How about you?", meaning: "A polite way to turn the question back to the other person.", example: "I'm from Nagpur. How about you?" },
    learn: [
      { title: "The four-line introduction", text: "A good introduction has four short parts: your name, where you live, what you do, and why you are learning English.", examples: ["My name is Rahul.", "I live in Thane.", "I work in a bank.", "I want to speak confidently with customers."] },
      { title: "Useful phrases", text: "Learn these as whole phrases. Change only the last word.", examples: ["I'm from ___.", "I work as a ___.", "I'm studying ___.", "I study at ___ College."] },
      { title: "Say 'My name is', not 'Myself'", text: "Many speakers say 'Myself Rahul'. In English, 'myself' cannot be the subject of the sentence. Say 'My name is Rahul' or 'I'm Rahul'.", tip: "Short and clear sounds confident." },
    ],
    practice: [
      choose("d02-1", "Which introduction is correct?", ["Myself Rahul.", "My name is Rahul.", "Me Rahul.", "I called myself Rahul."], 1, "'My name is...' or 'I'm Rahul' are the natural ways."),
      order("d02-2", "Say in English: Main Nagpur se hoon.", "I am from Nagpur.", [], ["I'm from Nagpur."]),
      type("d02-3", "I study ___ Mumbai University.", ["at"], "We say 'study at' a college or university.", "It is a small word with two letters."),
      order("d02-4", "Say in English: Main ek bank mein kaam karta hoon.", "I work in a bank."),
    ],
    speak: { prompt: "Introduce yourself in 30 seconds: name, where you live, what you do, why you want to learn English.", model: "Hello, my name is Rahul. I live in Thane. I work in a bank, and I talk to customers every day. I want to speak English more confidently at work.", checklist: ["I included all four parts", "I said 'My name is', not 'Myself'", "I spoke slowly and clearly"] },
    recap: ["Name, place, work or study, reason.", "Say 'My name is...', not 'Myself...'.", "Use 'study at' and 'work in' or 'work as'."],
  },
  {
    id: "d03", day: 3, week: 1, title: "Present Simple: Your Daily Routine", kind: "Grammar", minutes: 20,
    goal: "Talk about habits and routines with the right verb forms.",
    warm: { phrase: "What do you do on weekends?", meaning: "A common small-talk question about someone's habits.", example: "I usually watch cricket and meet my friends." },
    learn: [
      { title: "Habits and facts", text: "Use the present simple for things you do regularly and for facts.", examples: ["I drink tea every morning.", "Water boils at 100 degrees.", "She works in Andheri."] },
      { title: "He, she, it: add -s", text: "With he, she and it, the verb takes -s or -es. With I, you, we and they, it does not.", examples: ["I live in Mumbai. / He lives in Pune.", "They go to office. / She goes to college."] },
      { title: "Questions and 'not'", text: "Use do or does to ask a question, and don't or doesn't to say no. After does and doesn't, the verb stays in its base form.", examples: ["Do you like tea?", "Does she like tea?", "He doesn't like coffee."], tip: "Does + base verb: 'Does he like...', not 'Does he likes...'." },
    ],
    practice: [
      ...bank("present-tenses", [1, 4]),
      type("d03-3", "She ___ (drink) tea every morning. Write the correct form.", ["drinks"], "With 'she', the present simple verb needs -s: drinks."),
      order("d03-4", "Say in English: Main chhe baje uthta hoon.", "I wake up at six.", [], ["I get up at six."]),
      type("d03-5", "He ___ not like coffee. (do or does)", ["does"], "After 'he', we use 'does not' (doesn't).", "Think: he, she, it use does."),
      ...bank("present-tenses", [8]),
    ],
    speak: { prompt: "Describe your morning routine in five sentences. Use the present simple.", model: "I wake up at six. I drink tea and read the news. My brother goes to college at eight. My mother makes breakfast for us. I leave for work at nine.", checklist: ["I used 'wake up', 'go' or 'leave' at least once", "I added -s for he or she", "I spoke in five sentences"] },
    recap: ["Present simple = habits and facts.", "He, she, it + verb with -s.", "Does + base verb in questions."],
  },
  {
    id: "d04", day: 4, week: 1, title: "A, An and The", kind: "Grammar", minutes: 18,
    goal: "Choose the right article without stopping to think.",
    warm: { phrase: "Could you pass me the salt, please?", meaning: "A polite request. Both people know which salt you mean.", example: "Could you pass me the salt, please?" },
    learn: [
      { title: "A or an: listen to the sound", text: "Use 'an' before a vowel sound and 'a' before a consonant sound. The spelling does not decide it; the sound does.", rule: "*a* + consonant sound · *an* + vowel sound", examples: ["*an* engineer, *an* hour (the h is silent)", "*a* university, *a* house (you hear y and h)", "*an* MBA, *an* honest man"], pairs: [["She is engineer.", "She is *an* engineer."], ["I waited for a hour.", "I waited for *an* hour."]] },
      { title: "The: when it is specific", text: "Use 'the' when you and the listener both know which one you mean, when you mention it a second time, or when there is only one.", rule: "*the* + the one we both know", examples: ["I saw *a* film. *The* film was great.", "Please close *the* door.", "*The* sun rises in *the* east."], pairs: [["Sun is very hot today.", "*The* sun is very hot today."]] },
      { title: "No article", text: "Do not use an article for ideas in general, for plural and uncountable things in general, or for school, college and work as activities.", rule: "general idea → no article", examples: ["Honesty is important.", "I like dogs.", "My children go to school."], pairs: [["The life is beautiful.", "Life is beautiful."], ["He is a good in maths.", "He is good at maths."]], tip: "Instruments take 'the': the guitar, the piano." },
    ],
    practice: [
      ...bank("articles", [1, 3]),
      type("d04-3", "I saw ___ elephant at the zoo. (a or an)", ["an"], "'Elephant' begins with a vowel sound, so we say 'an'.", "Elephant starts with the sound 'e'."),
      ...bank("articles", [5, 8]),
      order("d04-5", "Say in English: Woh ek doctor hai.", "She is a doctor.", [], ["He is a doctor."]),
    ],
    speak: { prompt: "Describe your room or your workplace in five sentences. Use a, an and the.", model: "I have a small room. There is a bed and a table. The table is next to the window. I keep an old clock on the wall. The room is quiet in the evening.", checklist: ["I used 'a' and 'an' correctly", "I used 'the' for something already mentioned", "I did not use 'a' with plural words"] },
    recap: ["a/an depends on the sound.", "The = specific or already mentioned.", "No article for general ideas."],
  },
  {
    id: "d05", day: 5, week: 1, title: "Polite Requests", kind: "Conversation", minutes: 15,
    goal: "Ask for things politely in shops, offices and cafes.",
    warm: { phrase: "Would you mind opening the window?", meaning: "A very polite way to ask someone to do something.", example: "Would you mind opening the window? It's hot." },
    learn: [
      { title: "Could and Can", text: "'Could you...?' is polite. 'Can you...?' is friendlier and fine with friends. Add 'please' to sound kind.", examples: ["Could you help me, please?", "Can you send me the file?"] },
      { title: "May I and Would you mind", text: "'May I...?' asks for permission. 'Would you mind...ing?' is extra polite.", examples: ["May I use your phone?", "Would you mind speaking more slowly?"] },
      { title: "Ordering and asking", text: "In shops and cafes, use 'Could I have...?' and 'Do you have...?'.", examples: ["Could I have a cup of tea, please?", "Do you have this in a larger size?"], tip: "A calm voice matters as much as the words." },
    ],
    practice: [
      ...bank("modals", [2, 8]),
      order("d05-3", "Say in English: Kya mujhe paani mil sakta hai?", "Could I have some water, please?", [], ["Could I have some water please?"]),
      choose("d05-4", "Which request is the most polite?", ["Give me the menu.", "I want the menu.", "Could I have the menu, please?", "Menu now."], 2, "'Could I have...?' with 'please' is polite and natural."),
      type("d05-5", "___ you mind opening the window? (Would or Did)", ["would"], "'Would you mind...?' is a polite request.", "It rhymes with 'good'."),
    ],
    speak: { prompt: "Imagine you are in a cafe. Order a tea and a sandwich, then ask for the bill. Use polite phrases.", model: "Good evening. Could I have a tea and a sandwich, please? ... Thank you. Could I have the bill, please?", checklist: ["I used 'Could I have'", "I said please and thank you", "I used a calm, friendly voice"] },
    recap: ["Could you / Could I have = polite.", "May I = permission.", "Add 'please' and a smile."],
  },
];

/* ================= WEEK 2 : BUILD YOUR SENTENCES ================= */
const w2: Lesson[] = [
  {
    id: "d06", day: 6, week: 2, title: "Present Continuous: Right Now", kind: "Grammar", minutes: 18,
    goal: "Describe what is happening now.",
    warm: { phrase: "What are you doing?", meaning: "Asks what someone is doing at this moment.", example: "What are you doing? I'm watching a video." },
    learn: [
      { title: "am, is, are + verb-ing", text: "Use the present continuous for actions happening now, or around now.", examples: ["I am studying English.", "She is talking on the phone.", "They are playing cricket."] },
      { title: "Present simple or continuous?", text: "Habits use the present simple. Right now uses the continuous.", examples: ["I drink tea every day. (habit)", "I am drinking tea now. (now)"] },
      { title: "State verbs", text: "Verbs like know, want, like, love and have (own) are not used with -ing.", examples: ["I know the answer.", "I want some water."], tip: "Say 'I love this song', not 'I am loving'." },
    ],
    practice: [
      ...bank("present-tenses", [2, 5, 7]),
      type("d06-4", "They ___ playing cricket now. (are or is)", ["are"], "'They' goes with 'are'.", "Think: you, we, they go with this word."),
      order("d06-5", "Say in English: Main abhi English padh raha hoon.", "I am studying English now.", [], ["I'm studying English now."]),
    ],
    speak: { prompt: "Look around you and describe what is happening right now. Say five sentences.", model: "I am sitting at my desk. My brother is watching TV. A bus is passing outside. My mother is cooking dinner. I am practising English.", checklist: ["I used am, is or are each time", "I added -ing to the verb", "I described five things"] },
    recap: ["am/is/are + verb-ing = happening now.", "Habits = present simple.", "Do not use -ing with state verbs like know and want."],
  },
  {
    id: "d07", day: 7, week: 2, title: "Subject and Verb Agreement", kind: "Grammar", minutes: 15,
    goal: "Make the verb match the subject.",
    warm: { phrase: "Everyone is here.", meaning: "'Everyone' is singular in English, so it takes 'is'.", example: "Everyone is happy today." },
    learn: [
      { title: "Singular and plural", text: "A singular subject takes a singular verb, and a plural subject takes a plural verb.", examples: ["The book is on the table.", "The books are on the table."] },
      { title: "Words that look plural but are singular", text: "Everyone, each, news and subjects like mathematics are singular.", examples: ["Everyone is ready.", "The news is good.", "Mathematics is difficult."] },
      { title: "Do and does", text: "Use 'does' with he, she and it. Use 'do' with I, you, we and they.", examples: ["She doesn't like coffee.", "They don't live here."] },
    ],
    practice: [
      ...bank("agreement", [1, 2, 3]),
      type("d07-4", "He ___ to the office by bus. (go or goes)", ["goes"], "With 'he' the verb needs -es: goes.", "It ends with -es."),
      ...bank("agreement", [7]),
    ],
    speak: { prompt: "Talk about your family. Say what each person does. Use five sentences.", model: "My father works in a bank. My mother teaches in a school. My sister studies at a college. My brothers play cricket on Sundays. Everyone in my family likes tea.", checklist: ["I added -s for he and she", "I used 'everyone' with 'is' or a singular verb", "I spoke five sentences"] },
    recap: ["Singular subject = singular verb.", "Everyone, each and news are singular.", "She doesn't, they don't."],
  },
  {
    id: "d08", day: 8, week: 2, title: "In, On, At: Time and Place", kind: "Grammar", minutes: 15,
    goal: "Use the small words that confuse everyone.",
    warm: { phrase: "See you on Monday.", meaning: "A common way to end a conversation when you will meet on a certain day.", example: "See you on Monday at ten." },
    learn: [
      { title: "Time", text: "Use 'at' for exact times, 'on' for days and dates, and 'in' for months, years and seasons.", examples: ["at 5 o'clock, at night", "on Monday, on 5 May", "in June, in 2026, in summer"] },
      { title: "Place", text: "Use 'at' for a point, 'on' for a surface, and 'in' for inside a space or a city.", examples: ["at the bus stop", "on the table", "in the room, in Mumbai"] },
      { title: "Fixed phrases", text: "Some combinations simply have to be learned.", examples: ["good at maths", "interested in music", "arrive in Mumbai / arrive at the station"] },
    ],
    practice: [
      ...bank("prepositions", [1, 2, 3, 6]),
      type("d08-5", "My birthday is ___ March. (in, on or at)", ["in"], "We use 'in' with months.", "Months and years use this word."),
    ],
    speak: { prompt: "Tell us about your week: when and where things happen. Use in, on and at at least four times.", model: "I wake up at six. On Monday I go to work in Andheri. On Saturday I meet my friends at a cafe. In the evening I practise English at home.", checklist: ["I used 'at' with a time", "I used 'on' with a day", "I used 'in' with a place or month"] },
    recap: ["at = exact time or point.", "on = day, date or surface.", "in = month, year or inside."],
  },
  {
    id: "d09", day: 9, week: 2, title: "Asking Questions", kind: "Grammar", minutes: 18,
    goal: "Ask clear questions in the right word order.",
    warm: { phrase: "Could you tell me where the station is?", meaning: "A polite question inside another sentence.", example: "Could you tell me where the station is?" },
    learn: [
      { title: "Question words", text: "Who, what, where, when, why and how start many questions.", examples: ["Where do you live?", "What time does the train leave?", "Why are you late?"] },
      { title: "Helper verb first", text: "In a question the helper verb (do, does, did, is, are, can) comes before the subject.", examples: ["You are working. -> Are you working?", "She likes tea. -> Does she like tea?"] },
      { title: "Polite indirect questions", text: "After 'Could you tell me', the word order goes back to normal.", examples: ["Could you tell me where the station is?"], tip: "Not 'where is the station' inside the sentence." },
    ],
    practice: [
      ...bank("questions", [1, 2, 3]),
      order("d09-4", "Say in English: Aap kahaan rehte hain?", "Where do you live?"),
      type("d09-5", "___ do you study? (Where or Which)", ["where"], "We ask about a place with 'where'.", "It starts with wh and has five letters."),
      ...bank("questions", [8]),
    ],
    speak: { prompt: "Imagine you meet someone new. Ask them five questions to get to know them.", model: "Where do you live? What do you do? Do you have any brothers or sisters? What do you like to do on weekends? Where would you love to travel?", checklist: ["I used a different question word each time", "I put do or does before the subject", "I used a friendly voice"] },
    recap: ["Helper verb before the subject.", "Use who, what, where, when, why, how.", "Indirect questions keep normal order."],
  },
  {
    id: "d10", day: 10, week: 2, title: "Project: Describe Your Day", kind: "Project", minutes: 20,
    goal: "Put the week together and speak for one minute.",
    warm: { phrase: "First, then, after that, finally.", meaning: "Words that put your sentences in order.", example: "First I have tea. Then I read the news. Finally I leave for work." },
    learn: [
      { title: "Daily-routine phrases", text: "These phrases make your day easy to describe. Learn them as chunks.", examples: ["wake up, get ready, have breakfast", "leave for work, reach the office", "have lunch, go back home, go to sleep"] },
      { title: "Joining your sentences", text: "Use first, then, after that and finally to show the order. Use 'and', 'but' and 'because' to add detail.", examples: ["I wake up early because I have a long commute."] },
      { title: "Plan, then speak", text: "Before you speak, write three keywords for the morning, afternoon and evening. Then speak from the keywords, not from a script.", tip: "Keywords, not sentences." },
    ],
    practice: [
      order("d10-1", "Say in English: Main subah chai peeta hoon.", "I have tea in the morning."),
      order("d10-2", "Say in English: Phir main office jaata hoon.", "Then I go to the office."),
      type("d10-3", "I ___ breakfast at eight. (have or take)", ["have"], "We say 'have breakfast'.", "The same word as 'I have a car'."),
      choose("d10-4", "Which word shows the last step?", ["First", "Then", "Finally", "Because"], 2, "'Finally' introduces the last step."),
    ],
    speak: { prompt: "Describe a normal day, from morning to night, in about one minute. Use first, then, after that and finally.", model: "First I wake up at six and have tea. Then I get ready and leave for work. After that I work until six. In the evening I have dinner with my family. Finally I read for a while and go to sleep.", checklist: ["I used first, then, after that and finally", "I used the present simple", "I spoke for about a minute"] },
    recap: ["Chunks like 'wake up' and 'have breakfast' save time.", "Use order words to guide the listener.", "Speak from keywords."],
  },
];

/* ================= WEEK 3 : PAST AND EXPERIENCE ================= */
const w3: Lesson[] = [
  {
    id: "d11", day: 11, week: 3, title: "Past Simple: What Happened", kind: "Grammar", minutes: 18,
    goal: "Talk about finished actions in the past.",
    warm: { phrase: "How was your weekend?", meaning: "A friendly question about the past few days.", example: "It was great. I visited my cousins." },
    learn: [
      { title: "Regular verbs add -ed", text: "Use the past simple for finished actions with a time in the past.", examples: ["I worked yesterday.", "She watched a film last night."] },
      { title: "Irregular verbs", text: "Many common verbs change completely. Learn these as pairs.", examples: ["go - went, see - saw, buy - bought", "eat - ate, have - had, make - made"] },
      { title: "Questions and not", text: "Use did for questions and didn't for 'not'. The main verb stays in its base form.", examples: ["Did you go to the market?", "I didn't go yesterday."], tip: "Did + base verb. Never 'Did you went'." },
    ],
    practice: [
      ...bank("past-perfect", [1, 6]),
      type("d11-3", "Yesterday I ___ (go) to the market. Write the past form.", ["went"], "The past of 'go' is 'went'.", "Not 'goed'."),
      type("d11-4", "She ___ (watch) a film last night.", ["watched"], "Regular verbs add -ed: watched.", "Add -ed."),
      ...bank("past-perfect", [8]),
    ],
    speak: { prompt: "Tell us what you did yesterday, from morning to night. Use at least five past verbs.", model: "Yesterday I woke up at seven. I had breakfast and went to work. I met my friend for lunch. In the evening I watched a film. I slept at eleven.", checklist: ["I used five past verbs", "I used irregular verbs like went and had", "I said 'yesterday' or another past time"] },
    recap: ["Past simple = finished actions.", "Learn common irregular verbs in pairs.", "Did + base verb."],
  },
  {
    id: "d12", day: 12, week: 3, title: "Tell a Short Story", kind: "Speaking", minutes: 18,
    goal: "Link past events into a clear short story.",
    warm: { phrase: "Guess what happened!", meaning: "A fun way to begin telling a story.", example: "Guess what happened! I met my old teacher yesterday." },
    learn: [
      { title: "A story in three parts", text: "Start with where and when. Then say what happened. End with how you felt or what you learned.", examples: ["Last Sunday I went to Marine Drive.", "It started to rain, so we ran inside.", "It was a lovely evening."] },
      { title: "Linking words", text: "Use these to move the story along.", examples: ["first, then, after that, finally", "so (result), because (reason), but (contrast)"] },
      { title: "Feelings", text: "A short comment about your feelings makes a story human.", examples: ["I was nervous.", "I felt really proud.", "It was so funny."] },
    ],
    practice: [
      order("d12-1", "Say in English: Pehle maine chai pi.", "First I had tea."),
      choose("d12-2", "Which word shows a reason?", ["but", "because", "then", "finally"], 1, "'Because' gives the reason for something."),
      type("d12-3", "I woke up late, ___ I missed the bus. (so or because)", ["so"], "'So' shows the result: I woke up late, so I missed the bus.", "It is a very short word."),
      order("d12-4", "Say in English: Hum ghar ke andar bhaag gaye.", "We ran inside."),
    ],
    speak: { prompt: "Tell a short story about something memorable that happened to you. Say where, when, what happened and how you felt.", model: "Last year I went to Lonavala with my friends. First we walked to a waterfall. Then it started to rain, so we ran into a small cafe. We drank hot tea and laughed a lot. It was one of my best days.", checklist: ["I said where and when", "I used first, then or so", "I said how I felt"] },
    recap: ["Where and when, what happened, how you felt.", "Use first, then, so, because, but.", "Add a feeling."],
  },
  {
    id: "d13", day: 13, week: 3, title: "Present Perfect: Experiences", kind: "Grammar", minutes: 18,
    goal: "Talk about experiences and things that connect to now.",
    warm: { phrase: "Have you ever been to Goa?", meaning: "Asks about a life experience.", example: "Yes, I have. I've been there twice." },
    learn: [
      { title: "have/has + past participle", text: "Use the present perfect for experiences without a finished time, and for things that started in the past and continue now.", examples: ["I have visited Delhi.", "She has lived here since 2019."] },
      { title: "Ever, never, already, yet", text: "These words are often used with the present perfect.", examples: ["Have you ever eaten sushi?", "I have never seen snow.", "I have already finished.", "I haven't finished yet."] },
      { title: "Past simple or present perfect?", text: "If you say when it happened (yesterday, last year), use the past simple. If you do not say when, use the present perfect.", examples: ["I went to Goa last year.", "I have been to Goa."] },
    ],
    practice: [
      ...bank("past-perfect", [2, 3, 5, 7]),
      type("d13-5", "I have never ___ (see) snow. Write the correct form.", ["seen"], "The past participle of 'see' is 'seen'.", "See - saw - ..."),
    ],
    speak: { prompt: "Tell us three things you have done in your life, and one thing you have never done.", model: "I have visited Goa and Jaipur. I have learned to cook biryani. I have never ridden a horse, but I would like to try.", checklist: ["I used 'have' or 'has' each time", "I used 'never' once", "I did not say a finished time with the present perfect"] },
    recap: ["have/has + past participle.", "Ever, never, already, yet.", "No finished time with the present perfect."],
  },
  {
    id: "d14", day: 14, week: 3, title: "Places and Directions", kind: "Conversation", minutes: 15,
    goal: "Ask for and give directions.",
    warm: { phrase: "Excuse me, how do I get to the station?", meaning: "A polite way to ask for directions.", example: "Excuse me, how do I get to the station?" },
    learn: [
      { title: "Directions", text: "These words help you give and understand directions.", examples: ["go straight, turn left, turn right", "at the signal, at the corner", "on your left, on your right"] },
      { title: "Where is it?", text: "Use next to, opposite, behind and near to place things.", examples: ["The bank is opposite the post office.", "The cafe is next to the pharmacy."] },
      { title: "Check and thank", text: "After directions, repeat them to confirm, then say thank you.", examples: ["So I go straight and turn left at the signal?", "Thank you so much."] },
    ],
    practice: [
      ...bank("prepositions", [4, 5, 7, 8]),
      order("d14-5", "Say in English: Seedha jaaiye aur baayein mudiye.", "Go straight and turn left."),
    ],
    speak: { prompt: "Give directions from your home to the nearest railway station or bus stop.", model: "Leave the building and turn left. Go straight for two minutes. At the signal, turn right. The station is on your left, opposite the bank.", checklist: ["I used go straight, turn left or turn right", "I used a place word like opposite or next to", "I spoke slowly so the listener could follow"] },
    recap: ["Go straight, turn left/right.", "Opposite, next to, behind.", "Repeat directions to confirm."],
  },
  {
    id: "d15", day: 15, week: 3, title: "Word Chunks That Sound Natural", kind: "Vocabulary", minutes: 15,
    goal: "Use common word partners (collocations) correctly.",
    warm: { phrase: "Let me think about it.", meaning: "A natural way to buy time before you decide.", example: "Let me think about it and get back to you." },
    learn: [
      { title: "Make or do?", text: "English chooses fixed partners. You make a decision, a mistake and a plan. You do homework, a job and your best.", examples: ["make a decision, make a mistake, make tea", "do homework, do the dishes, do your best"] },
      { title: "Take, pay, keep", text: "More partners to learn as pairs.", examples: ["take a photo, take a break", "pay attention", "keep a promise"] },
      { title: "Learn chunks, not single words", text: "When you learn 'make a decision' as one piece, you never say 'do a decision'.", tip: "Write the whole chunk in your notebook." },
    ],
    practice: [
      ...bank("collocations", [1, 2, 3, 4, 6]),
      type("d15-6", "Please ___ attention. (pay or give)", ["pay"], "We say 'pay attention'.", "The word you use with money."),
    ],
    speak: { prompt: "Use five chunks in a short talk: make a decision, take a break, do homework, pay attention, keep a promise.", model: "I want to make a decision about my career. First I take a break from work every hour to stay fresh. I do my homework every night. I pay attention in class, and I always keep my promises.", checklist: ["I used all five chunks", "I did not say 'do a decision'", "I made the sentences about my life"] },
    recap: ["Make a decision, do homework.", "Take a break, pay attention, keep a promise.", "Learn the whole chunk."],
  },
];

/* ================= WEEK 4 : REAL CONVERSATIONS ================= */
const w4: Lesson[] = [
  {
    id: "d16", day: 16, week: 4, title: "Advice and Rules: Should, Must, Might", kind: "Grammar", minutes: 18,
    goal: "Give advice, state rules and talk about possibility.",
    warm: { phrase: "You should take a break.", meaning: "Friendly advice.", example: "You look tired. You should take a break." },
    learn: [
      { title: "Advice and rules", text: "Use 'should' for advice, 'must' for strong rules, and 'mustn't' for things that are forbidden.", examples: ["You should sleep early.", "You must wear a helmet.", "You mustn't park here."] },
      { title: "Possibility", text: "Use 'might' or 'may' when something is possible but not certain.", examples: ["It might rain later.", "She may be late."] },
      { title: "Base verb after a modal", text: "After a modal, use the base verb. No 'to', no -s.", examples: ["He can swim.", "She should go."], tip: "Not 'can swims' or 'should to go'." },
    ],
    practice: [
      ...bank("modals", [1, 3, 5, 7]),
      type("d16-5", "You ___ drive without a licence. (must or mustn't)", ["mustn't", "must not"], "'Mustn't' means it is forbidden.", "It is the negative of must."),
    ],
    speak: { prompt: "A friend is nervous about a job interview. Give them five pieces of advice using should, must and might.", model: "You should prepare for common questions. You must reach on time. You should speak slowly and smile. You mustn't look at your phone. The interviewer might ask about your hobbies, so you should be ready.", checklist: ["I used 'should' for advice", "I used 'must' or 'mustn't' for a rule", "I used a base verb after each modal"] },
    recap: ["Should = advice.", "Must / mustn't = rule.", "Might = possible."],
  },
  {
    id: "d17", day: 17, week: 4, title: "Small Talk That Feels Easy", kind: "Conversation", minutes: 15,
    goal: "Keep a friendly conversation going with anyone.",
    warm: { phrase: "That sounds interesting!", meaning: "Shows you are interested in what someone said.", example: "You went to Kerala? That sounds interesting!" },
    learn: [
      { title: "The F.O.R.D. topics", text: "When you do not know what to say, use four safe topics: Family, Occupation, Recreation and Dreams.", examples: ["Do you have any brothers or sisters?", "What do you do?", "What do you do in your free time?", "Where would you love to travel?"] },
      { title: "Ask, listen, add", text: "Ask a question, listen, then add a small comment or a follow-up question.", examples: ["Oh, you like cricket! Which team do you support?"] },
      { title: "Keep it going", text: "Show interest with short phrases.", examples: ["Really? / Oh, nice!", "What was that like?", "Me too. Last year I..."] },
    ],
    practice: [
      order("d17-1", "Say in English: Aapke bhai-behen hain?", "Do you have any brothers or sisters?"),
      choose("d17-2", "Which is the best follow-up? 'I love cricket.'", ["Which team do you support?", "Cricket is cricket.", "Okay.", "I do not understand."], 0, "A follow-up question keeps the conversation going."),
      type("d17-3", "What do you do ___ your free time? (in or on)", ["in"], "We say 'in your free time'.", "A two-letter word, also used with months."),
      choose("d17-4", "What does F.O.R.D. stand for?", ["Family, Occupation, Recreation, Dreams", "Food, Office, Rain, Dance", "Friends, Order, Rules, Days", "Fun, Opinion, Reading, Dinner"], 0, "F.O.R.D. = Family, Occupation, Recreation, Dreams."),
    ],
    speak: { prompt: "Role-play meeting a new neighbour. Introduce yourself and ask at least four small-talk questions.", model: "Hi, I'm Neha. I just moved here. Do you live nearby? What do you do? Do you have any brothers or sisters? What do you like to do on weekends? That sounds interesting!", checklist: ["I used at least two F.O.R.D. topics", "I added one comment like 'That sounds interesting'", "I smiled while I spoke"] },
    recap: ["F.O.R.D. gives four safe topics.", "Ask, listen, add.", "Short phrases keep it going."],
  },
  {
    id: "d18", day: 18, week: 4, title: "Phone Calls", kind: "Conversation", minutes: 15,
    goal: "Open, hold and close a phone call confidently.",
    warm: { phrase: "May I know who's calling, please?", meaning: "A polite way to ask who is on the phone.", example: "Hello, this is Anita. May I know who's calling, please?" },
    learn: [
      { title: "The call structure", text: "Open, say your purpose, listen and respond, confirm, then close.", examples: ["Hello, this is Rohan speaking.", "I'm calling about the job opening.", "So I'll send it by Friday. Is that correct?", "Thank you for your time. Bye."] },
      { title: "Useful phrases", text: "Learn these for common phone moments.", examples: ["Could you hold on a moment, please?", "Could I speak to Mr Kulkarni, please?", "Sorry, the line is breaking up. Could you repeat that?"] },
      { title: "Spell it out", text: "Spell names clearly with a simple word for each letter, and say numbers in small groups.", examples: ["A for Apple, B for Boy, D for Delhi"], tip: "Smile while you speak. The listener can hear it." },
    ],
    practice: [
      choose("d18-1", "How do you introduce yourself on the phone?", ["I am Rahul speaking.", "This is Rahul speaking.", "Rahul is me.", "Who are you?"], 1, "Say 'This is Rahul speaking.'"),
      order("d18-2", "Say in English: Kya main jaan sakta hoon ki kaun bol raha hai?", "May I know who is calling, please?", [], ["May I know who's calling, please?"]),
      type("d18-3", "Could you ___ on a moment, please? (hold or wait)", ["hold"], "'Hold on' is the phone phrase.", "Used with the word 'on'."),
      choose("d18-4", "The line is bad. What do you say?", ["Sorry, the line is breaking up. Could you repeat that?", "Speak properly.", "Bye.", "I cannot talk."], 0, "A polite request to repeat is best."),
    ],
    speak: { prompt: "Make a pretend call to book a doctor's appointment. Open, say your purpose, confirm the time and close.", model: "Hello, this is Priya speaking. I'm calling to book an appointment with Doctor Joshi. ... Tomorrow at ten o'clock? Yes, that works. Thank you for your help. Goodbye.", checklist: ["I said 'This is ... speaking'", "I confirmed the time", "I closed politely"] },
    recap: ["This is ___ speaking.", "Confirm the key details.", "Close with a thank you."],
  },
  {
    id: "d19", day: 19, week: 4, title: "Fix Common Mistakes", kind: "Grammar", minutes: 15,
    goal: "Spot and fix the mistakes many speakers make without noticing.",
    warm: { phrase: "I'll get back to you.", meaning: "The natural way to say you will reply later.", example: "I'll get back to you tomorrow." },
    learn: [
      { title: "Extra words we can drop", text: "Some verbs already contain the meaning, so we do not add extra words.", examples: ["discuss the plan (not discuss about)", "return the book (not return back)", "cousin (not cousin brother)"] },
      { title: "Natural phrases", text: "A few phrases sound more natural in international English.", examples: ["I'll get back to you. (not revert back)", "She is out of town. (not out of station)", "What's your name? (not your good name)"] },
      { title: "Introductions", text: "Say 'My name is Rahul' or 'I'm Rahul'. 'Myself' cannot be the subject.", tip: "Say each corrected sentence aloud five times." },
    ],
    practice: [...bank("indian-english", [1, 2, 4, 5, 6, 8])],
    speak: { prompt: "Say each corrected sentence aloud five times, then use two of them in your own sentences.", model: "Let's discuss the plan. Please return the book. I'll get back to you tomorrow. She is out of town. My name is Asha. I have a car.", checklist: ["I said every corrected sentence aloud", "I used two in my own sentences", "I noticed which mistake I make most"] },
    recap: ["Discuss and return need no extra word.", "I'll get back to you.", "My name is..., not Myself..."],
  },
  {
    id: "d20", day: 20, week: 4, title: "Month 1 Showcase", kind: "Project", minutes: 25,
    goal: "Speak for two minutes about yourself using everything from Month 1.",
    warm: { phrase: "Let me tell you about myself.", meaning: "A confident way to begin a talk about yourself.", example: "Let me tell you about myself and my goals." },
    learn: [
      { title: "Your two-minute talk", text: "Use four parts: who you are, your daily routine, something that happened recently, and your goal.", examples: ["I'm Asha and I live in Mumbai.", "I wake up at six and go to work.", "Last week I visited my cousins.", "I want to speak confidently at work."] },
      { title: "A checklist of skills", text: "Try to use at least one example of each skill from this month.", examples: ["present simple (routine)", "past simple (what happened)", "present perfect (experience)", "a linking word like because, so or then"] },
      { title: "Prepare, practise, record", text: "Write four keywords, practise once, then speak without stopping.", tip: "Do not aim for perfect. Aim for clear and complete." },
    ],
    practice: [
      order("d20-1", "Say in English: Main aksar chhe baje uthta hoon.", "I usually wake up at six."),
      order("d20-2", "Say in English: Pichhle hafte main apne cousins se mila.", "Last week I met my cousins."),
      type("d20-3", "I have ___ been to Kerala, but I would love to go one day. (ever or never)", ["never"], "'Never' means 'not at any time'.", "The opposite of always."),
      choose("d20-4", "Which is a good way to end your talk?", ["That's all, bye.", "Thank you for listening. I hope to keep improving.", "Finished.", "I forgot."], 1, "End with a calm, positive closing sentence."),
    ],
    speak: { prompt: "Give a two-minute talk: who you are, your routine, something that happened recently, and your goal. Record yourself if you can.", model: "I'm Asha and I live in Mumbai. I work in a bank. I wake up at six, have tea and leave for work at eight. Last week I visited my cousins in Pune, and we had a great time. I have never been to Kerala, but I would love to go. My goal is to speak English confidently with customers. Thank you for listening.", checklist: ["I used present simple, past simple and present perfect", "I used at least one linking word", "I finished with a closing sentence"] },
    recap: ["Four parts: who, routine, recent event, goal.", "Mix the tenses you learned.", "Finish with a clear closing."],
  },
];

/* ---------------- per-lesson extras (speech-check targets, level/goal tags, say-it exercises) ---------------- */
const CHECKS: Record<string, { minWords: number; mustInclude?: string[] }> = {
  d01: { minWords: 12, mustInclude: ["name", "english"] }, d02: { minWords: 18, mustInclude: ["name", "work", "live"] },
  d03: { minWords: 25, mustInclude: ["wake", "tea", "go"] }, d04: { minWords: 20 }, d05: { minWords: 12, mustInclude: ["could", "please"] },
  d06: { minWords: 25, mustInclude: ["ing"] }, d07: { minWords: 25, mustInclude: ["father", "mother", "works"] },
  d08: { minWords: 25, mustInclude: ["on", "at", "in"] }, d09: { minWords: 20, mustInclude: ["where", "what", "do you"] },
  d10: { minWords: 40, mustInclude: ["first", "then", "finally"] }, d11: { minWords: 25, mustInclude: ["yesterday", "went"] },
  d12: { minWords: 35, mustInclude: ["then", "so", "because"] }, d13: { minWords: 20, mustInclude: ["have", "never"] },
  d14: { minWords: 20, mustInclude: ["left", "right", "straight"] }, d15: { minWords: 30, mustInclude: ["decision", "break", "promise"] },
  d16: { minWords: 30, mustInclude: ["should", "must"] }, d17: { minWords: 25, mustInclude: ["do you", "what"] },
  d18: { minWords: 25, mustInclude: ["speaking", "appointment", "thank"] }, d19: { minWords: 20, mustInclude: ["discuss", "return", "get back"] },
  d20: { minWords: 60, mustInclude: ["goal", "last"] },
};
const TAGS: Record<string, { levels?: Level[]; goals?: Goal[] }> = {
  d03: { levels: ["beginner"] }, d04: { levels: ["beginner"] }, d06: { levels: ["beginner"] }, d07: { levels: ["beginner"] },
  d02: { goals: ["everyday", "interview"] }, d05: { goals: ["everyday", "work"] }, d09: { goals: ["everyday"] }, d10: { goals: ["everyday"] },
  d14: { goals: ["everyday"] }, d16: { goals: ["interview", "work"] }, d17: { goals: ["everyday"] }, d18: { goals: ["work"] },
  d19: { goals: ["interview", "work", "study"] }, d20: { goals: ["interview", "study"] },
};
const SAY: Record<string, string[]> = {
  d01: ["Nice to meet you."], d02: ["My name is Rahul and I live in Thane."], d05: ["Could I have a cup of tea, please?"],
  d09: ["Where do you live?"], d12: ["Guess what happened yesterday."], d14: ["Go straight and turn left at the signal."],
  d17: ["That sounds interesting!"], d18: ["Hello, this is Rohan speaking."], d19: ["I'll get back to you tomorrow."],
};
/* Rule lines and common-mistake pairs for the Month 1 grammar cards (by lesson id and card position). */
type CardExtra = Pick<Card, "rule" | "pairs">;
const CARD_EXTRAS: Record<string, (CardExtra | undefined)[]> = {
  d03: [{ rule: "habits and facts → present simple" }, { rule: "I / you / we / they *work* · he / she / it *works*", pairs: [["He go to office.", "He *goes* to office."]] }, { rule: "*do / does* + subject + base verb", pairs: [["Does she likes tea?", "Does she *like* tea?"], ["He don't like coffee.", "He *doesn't* like coffee."]] }],
  d06: [{ rule: "*am / is / are* + verb*-ing*", pairs: [["I am study now.", "I am *studying* now."]] }, { rule: "every day → *I drink* · now → *I am drinking*" }, { rule: "know, want, like, own → no *-ing*", pairs: [["I am knowing him.", "I *know* him."], ["I am having a car.", "I *have* a car."]] }],
  d07: [{ rule: "one → *is* · more than one → *are*", pairs: [["The books is on the table.", "The books *are* on the table."]] }, { pairs: [["Everyone are ready.", "Everyone *is* ready."], ["The news are good.", "The news *is* good."]] }, { rule: "he / she / it *does* · I / you / we / they *do*", pairs: [["She don't know.", "She *doesn't* know."]] }],
  d08: [{ rule: "*at* 5 pm · *on* Monday · *in* June", pairs: [["on the morning", "*in* the morning"], ["in Monday", "*on* Monday"]] }, { rule: "*at* a point · *on* a surface · *in* a space" }, { pairs: [["good in maths", "good *at* maths"]] }],
  d09: [{ rule: "question word + helper + subject + verb" }, { rule: "*do / does / did / is / can* + subject + verb?", pairs: [["Where you are going?", "Where *are you* going?"], ["Why you didn't come?", "Why *didn't you* come?"]] }, { rule: "Could you tell me where the station *is*?", pairs: [["Can you tell me where is the bank?", "Can you tell me where *the bank is*?"]] }],
  d11: [{ rule: "verb + *-ed* for finished past actions" }, { pairs: [["I goed there.", "I *went* there."]] }, { rule: "*did* + base verb", pairs: [["Did you went?", "Did you *go*?"], ["I didn't saw him.", "I didn't *see* him."]] }],
  d13: [{ rule: "*have / has* + past participle", pairs: [["I have went to Delhi.", "I have *been* to Delhi."]] }, undefined, { rule: "time given → past simple · no time → present perfect", pairs: [["I have seen him yesterday.", "I *saw* him yesterday."]] }],
  d16: [{ rule: "*should* = advice · *must* = rule · *mustn't* = not allowed" }, { rule: "*might / may* = possible, not sure" }, { rule: "modal + base verb", pairs: [["He can swims.", "He can *swim*."], ["You should to go.", "You should *go*."]] }],
  d19: [{ pairs: [["discuss about the plan", "*discuss* the plan"], ["return back the book", "*return* the book"], ["my cousin brother", "my *cousin*"]] }, { pairs: [["I will revert back.", "I'll *get back* to you."], ["She is out of station.", "She is out of *town*."], ["What is your good name?", "What's your *name*?"]] }, { pairs: [["Myself Rahul.", "*My name is* Rahul."]] }],
};
export const decorate = (ls: Lesson[]): Lesson[] => ls.map((l) => ({
  ...l, ...TAGS[l.id],
  learn: l.learn.map((c, i) => ({ ...CARD_EXTRAS[l.id]?.[i], ...c })),
  speak: { ...l.speak, check: l.speak.check ?? CHECKS[l.id] },
  practice: [...l.practice, ...(SAY[l.id] ?? []).map((text, n): Say => ({ t: "say", id: `${l.id}-s${n + 1}`, text }))],
}));

/* ---------------- assemble weeks ---------------- */
export const mk = (n: number, month: number, title: string, theme: string, lessons: Lesson[]): Week => ({
  n, month, title, theme, lessons: decorate(lessons), checkpoint: { id: `cp${n}`, title: `Week ${n} Checkpoint` },
});

export const WEEKS: Week[] = [
  mk(1, 1, "Start Here", "Confidence and the basics", w1),
  mk(2, 1, "Build Your Sentences", "Core grammar for speaking", w2),
  mk(3, 1, "Past and Experience", "Tell stories and share experiences", w3),
  mk(4, 1, "Real Conversations", "Everyday situations", w4),
  ...[...M2_WEEKS, ...M3_WEEKS].map((w) => ({ ...w, lessons: decorate(w.lessons) })),
];
export const MONTHS = [
  { n: 1, title: "Month 1: Foundations" },
  { n: 2, title: "Month 2: Richer Sentences" },
  { n: 3, title: "Month 3: Professional English" },
];
export const FREE_WEEKS = 1; // week 1 is free to try; the rest unlock on enrolment
