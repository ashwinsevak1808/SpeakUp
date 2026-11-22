/* =====================================================================
   MONTH 2: RICHER SENTENCES (weeks 5-8, days 21-40)
   Grammar: nouns and quantities, pronouns, determiners, adjectives, adverbs,
   comparison, there is/are, past continuous, used to, future forms,
   ability, obligation, present perfect continuous, imperatives.
   ===================================================================== */
import { choose, lesson, order, type, type Lesson, type Week } from "./path-helpers";

const wk = (n: number, title: string, theme: string, lessons: Lesson[]): Week => ({ n, month: 2, title, theme, lessons, checkpoint: { id: `cp${n}`, title: `Week ${n} Checkpoint` } });

/* ================= WEEK 5 : NOUNS, PRONOUNS AND AMOUNTS ================= */
const w5: Lesson[] = [
  lesson("d21", 21, 5, "Countable and Uncountable Nouns", "Grammar", 18, "Know when a noun can be counted, and use a, an and plurals correctly.",
    ["Can I get some information?", "'Information' cannot be counted, so we say 'some information', not 'an information'.", "Can I get some information about the course?"],
    [
      { title: "Things you can count", text: "Countable nouns have a singular and a plural. In the singular they need a, an, the, my or another word in front.", rule: "*a* book · two *books* · *the* books", examples: ["*a* chair, three *chairs*", "*an* idea, many *ideas*", "*a* child, two *children*"], pairs: [["I have car.", "I have *a* car."]] },
      { title: "Things you cannot count", text: "Uncountable nouns have no plural and never take a or an. Many of them are used differently in English than in Hindi.", rule: "no *a/an* · no *-s*", examples: ["information, advice, luggage, furniture", "news, money, work, homework, equipment", "water, rice, milk, sugar"], pairs: [["She gave me an advice.", "She gave me *some advice*."], ["How many luggages do you have?", "How *much* luggage do you have?"], ["I have many works today.", "I have *a lot of work* today."]] },
      { title: "Counting the uncountable", text: "To count an uncountable noun, use a unit word in front of it.", rule: "*a piece of* advice · *a cup of* tea", examples: ["*a piece of* information", "*a bottle of* water, *a kilo of* rice", "*two pieces of* luggage"], tip: "News is singular: 'The news *is* good.'" },
    ],
    [
      choose("d21-1", "Choose the correct sentence.", ["Can you give me an advice?", "Can you give me some advice?", "Can you give me advices?", "Can you give me a advices?"], 1, "'Advice' is uncountable: no 'an' and no plural.", "Is advice something you can count: one advice, two advices?"),
      choose("d21-2", "The news ___ very good today.", ["are", "is", "were", "have"], 1, "'News' looks plural but is uncountable, so it takes 'is'."),
      type("d21-3", "I'd like a ___ of tea, please. (cup or glass)", ["cup"], "We drink tea from a cup: 'a cup of tea'.", "It has a handle."),
      choose("d21-4", "Which word is uncountable?", ["chair", "suitcase", "furniture", "table"], 2, "'Furniture' is uncountable. Chair, suitcase and table can be counted."),
      order("d21-5", "Say in English: Mere paas aaj bahut kaam hai.", "I have a lot of work today."),
    ],
    { prompt: "Describe what is in your kitchen. Use at least three countable and three uncountable nouns, and one unit word like 'a packet of'.", model: "In my kitchen there are two shelves and a small fridge. We keep rice, sugar and tea on the shelf. There is some milk in the fridge and a packet of biscuits on the table. We also have a lot of spices.", checklist: ["I used a or an only with countable nouns", "I did not add -s to rice, milk or sugar", "I used one unit word like 'a packet of'"], minWords: 25, must: ["some"] },
    ["Countable: a book, two books.", "Uncountable: advice, news, work, luggage. No a/an, no -s.", "Use a unit: a piece of advice, a cup of tea."], { levels: ["beginner"] }),

  lesson("d22", 22, 5, "Some, Any, Much, Many, A Lot Of", "Grammar", 18, "Talk about amounts naturally in questions, positive and negative sentences.",
    ["Is there any milk left?", "A natural way to check if something is still there.", "Is there any milk left? I want to make tea."],
    [
      { title: "Some and any", text: "Use 'some' in positive sentences and in offers or requests. Use 'any' in most questions and negative sentences.", rule: "+ *some* · ? *any* · − *not any*", examples: ["I bought *some* apples.", "Do you have *any* questions?", "There isn't *any* sugar.", "Would you like *some* tea? (offer)"] },
      { title: "Much and many", text: "Use 'many' with countable plurals and 'much' with uncountable nouns, mostly in questions and negatives. Ask amounts with 'How many' and 'How much'.", rule: "*many* + books · *much* + money", examples: ["How *many* people came?", "How *much* time do we have?", "I don't have *much* money."], pairs: [["How much people are coming?", "How *many* people are coming?"]] },
      { title: "A lot of, a few, a little", text: "'A lot of' works with both kinds and sounds natural in positive sentences. 'A few' goes with countable nouns, 'a little' with uncountable.", rule: "*a few* friends · *a little* time", examples: ["We have *a lot of* work.", "I have *a few* friends in Pune.", "Add *a little* salt."], tip: "'Few' without 'a' sounds negative: 'Few people came' = almost nobody." },
    ],
    [
      choose("d22-1", "Do you have ___ brothers?", ["some", "any", "much", "a little"], 1, "Questions usually take 'any'."),
      choose("d22-2", "How ___ money do you need?", ["many", "much", "few", "lot"], 1, "Money is uncountable, so 'how much'."),
      type("d22-3", "There were only a ___ people at the meeting. (few or little)", ["few"], "People can be counted, so 'a few'.", "Used with countable nouns."),
      choose("d22-4", "Which offer sounds natural?", ["Would you like any coffee?", "Would you like some coffee?", "Would you like many coffee?", "Would you like few coffee?"], 1, "In offers we use 'some', even though it is a question."),
      order("d22-5", "Say in English: Humare paas zyada time nahi hai.", "We don't have much time.", [], ["We do not have much time."]),
    ],
    { prompt: "You are planning a small party. Say what you have and what you need to buy. Use some, any, a few, a little and a lot of.", model: "We have a lot of snacks, but we don't have any juice. I need to buy some cups and a few plates. We have a little sugar, so I will buy one more packet. Do we need any balloons?", checklist: ["I used 'any' in a question or a negative", "I used 'a few' with a countable noun", "I used 'much' or 'many' correctly"], minWords: 30, must: ["some", "any"] },
    ["+ some, ? any, − not any.", "many + countable, much + uncountable.", "a few friends, a little time, a lot of both."]),

  lesson("d23", 23, 5, "Pronouns: I, Me, My, Mine, Myself", "Grammar", 18, "Use subject, object, possessive and reflexive pronouns without mixing them up.",
    ["This one is mine.", "'Mine' means 'my one', so you do not repeat the noun.", "That bag is yours. This one is mine."],
    [
      { title: "Subject and object", text: "The subject does the action and comes before the verb. The object receives the action and comes after the verb or after a preposition.", rule: "*I* help *him*. *He* helps *me*.", examples: ["I / me, you / you, he / him, she / her", "we / us, they / them, it / it", "Please call *me*. Tell *them* the plan."], pairs: [["Me and Ravi went to the market.", "Ravi and *I* went to the market."], ["Between you and I, ...", "Between you and *me*, ..."]] },
      { title: "Possessives", text: "Use my, your, his, her, our and their before a noun. Use mine, yours, his, hers, ours and theirs when the noun is not repeated.", rule: "*my* book → it's *mine*", examples: ["This is *my* phone. That one is *yours*.", "*Her* house is big, but *ours* is closer.", "Is this pen *his*?"], pairs: [["This bag is my.", "This bag is *mine*."]] },
      { title: "Myself, yourself, themselves", text: "Use a reflexive pronoun when the subject and object are the same person, or to say 'without help'. Do not use it as the subject.", rule: "*I* hurt *myself*", examples: ["I made this *myself*.", "Did you enjoy *yourselves*?", "She taught *herself* English."], pairs: [["Myself Rahul.", "My name is Rahul. / *I'm* Rahul."]], tip: "In a list, put others first: 'Priya and I', not 'I and Priya'." },
    ],
    [
      choose("d23-1", "___ went to the cinema last night.", ["Me and Anil", "Anil and me", "Anil and I", "I and Anil"], 2, "As a subject we say 'Anil and I', with the other person first."),
      choose("d23-2", "Is this your umbrella? No, it's not ___.", ["my", "mine", "me", "myself"], 1, "Without a noun after it, use 'mine'."),
      type("d23-3", "Could you help ___? I can't lift this box. (I or me)", ["me"], "After the verb 'help', use the object pronoun 'me'.", "The object form."),
      choose("d23-4", "She cooked the whole dinner by ___.", ["her", "hers", "herself", "she"], 2, "'By herself' means without help."),
      order("d23-5", "Say in English: Yeh kitaab uski hai, meri nahi.", "This book is hers, not mine.", [], ["This book is his, not mine."]),
    ],
    { prompt: "Talk about your family: who lives with you, what belongs to whom, and one thing someone did by themselves.", model: "My parents and I live in a flat in Dadar. My brother has his own room, and mine is next to it. The car is ours, but my father drives it most days. Last year my mother learned to swim by herself.", checklist: ["I said 'My parents and I', not 'Me and my parents'", "I used mine, yours or ours", "I used one reflexive pronoun"], minWords: 30, must: ["my", "mine"] }),

  lesson("d24", 24, 5, "This, That, These, Those and 's", "Grammar", 15, "Point to things near and far, and show who owns something.",
    ["Whose phone is this?", "A natural way to ask who something belongs to.", "Whose phone is this? It was on the table."],
    [
      { title: "Near and far", text: "Use this and these for things near you. Use that and those for things farther away.", rule: "near: *this / these* · far: *that / those*", examples: ["*This* tea is hot.", "*These* shoes are new.", "Look at *that* building.", "Who are *those* people?"], pairs: [["These book is mine.", "*This* book is mine."]] },
      { title: "Possessive 's", text: "Add 's to a person's name or noun to show ownership. For a regular plural ending in s, add only the apostrophe.", rule: "Ravi*'s* bike · my parents*'* house", examples: ["Priya*'s* laptop", "my sister*'s* wedding", "the students*'* exams", "the children*'s* toys"] },
      { title: "Whose and of", text: "Ask about ownership with 'whose'. For things, not people, we often use 'of'.", rule: "*Whose* bag is this?", examples: ["*Whose* car is outside?", "the name *of* the hotel", "the end *of* the film"], tip: "Don't confuse whose (owner) with who's (who is)." },
    ],
    [
      choose("d24-1", "Can you pass me ___ files on the far desk?", ["this", "these", "that", "those"], 3, "Plural and far away: 'those'."),
      choose("d24-2", "Which is correct?", ["The car of my father", "My father's car", "My fathers car", "My father car"], 1, "For people we use 's: 'my father's car'."),
      type("d24-3", "___ bag is this? (Whose or Who's)", ["whose"], "'Whose' asks about the owner. 'Who's' means 'who is'.", "Asks about the owner."),
      choose("d24-4", "I really like ___ shoes you are wearing.", ["this", "that", "those", "these"], 2, "Shoes are plural and on the other person, so 'those'."),
      order("d24-5", "Say in English: Yeh meri behen ka laptop hai.", "This is my sister's laptop."),
    ],
    { prompt: "Imagine you are showing a guest around your home. Point to five things using this, that, these and those, and say who owns two of them.", model: "This is our living room. These photos on the wall are from my brother's wedding. That door goes to the kitchen. Those plants are my mother's. And this guitar is mine.", checklist: ["I used this or these for near things", "I used that or those for far things", "I used 's for an owner"], minWords: 25, must: ["this", "these"] },
    ["this/these = near, that/those = far.", "Ravi's bike, my parents' house.", "Whose = who owns it."], { levels: ["beginner"] }),

  lesson("d25", 25, 5, "Shopping and Prices", "Conversation", 15, "Ask for things, prices and sizes in a shop or market, using amounts correctly.",
    ["How much does this cost?", "The simplest way to ask a price.", "Excuse me, how much does this cost?"],
    [
      { title: "Asking for things", text: "Start politely and say how many or how much you want.", examples: ["Could I have two kilos of onions, please?", "Do you have this in a larger size?", "I'm looking for a black T-shirt."] },
      { title: "Prices and paying", text: "Ask for the price, compare, and pay.", examples: ["How much is this? / How much are these?", "That's a bit expensive. Is there a discount?", "Can I pay by UPI?"], pairs: [["How much this cost?", "How much *does* this cost?"]] },
      { title: "Returning and exchanging", text: "Explain the problem calmly and say what you want.", examples: ["I bought this yesterday, but it doesn't fit.", "Could I exchange it for a smaller size?", "Here is the bill."], tip: "'Is' for one thing, 'are' for more: How much is this shirt? How much are these shoes?" },
    ],
    [
      choose("d25-1", "How much ___ these mangoes?", ["is", "are", "does", "do"], 1, "Mangoes are plural: 'How much are these mangoes?'"),
      order("d25-2", "Say in English: Kya yeh bade size mein hai?", "Do you have this in a larger size?", [], ["Do you have this in a bigger size?"]),
      type("d25-3", "Can I pay ___ card? (by or with)", ["by"], "We say 'pay by card' or 'pay by UPI'.", "Two letters."),
      choose("d25-4", "The shirt doesn't fit. What do you say?", ["Give me other shirt.", "Could I exchange it for a smaller size?", "Your shirt is bad.", "I want money now."], 1, "Polite and clear: say what you want."),
    ],
    { prompt: "Role-play buying vegetables at a market. Ask for three items with amounts, ask the price, and pay.", model: "Good morning. Could I have one kilo of tomatoes, half a kilo of onions and a few lemons, please? How much is that altogether? Two hundred rupees? Can I pay by UPI? Thank you.", checklist: ["I used amounts like 'one kilo of'", "I asked 'How much is/are...'", "I said please and thank you"], minWords: 25, must: ["how much", "please"] },
    ["How much is this? How much are these?", "Could I have + amount + of + thing.", "Pay by card, pay by UPI."], { goals: ["everyday"] }),
];

/* ================= WEEK 6 : DESCRIBING PEOPLE AND PLACES ================= */
const w6: Lesson[] = [
  lesson("d26", 26, 6, "Adjectives: Order, -ed and -ing", "Grammar", 18, "Describe things richly with adjectives in the right order and the right form.",
    ["It was a really boring meeting.", "'Boring' describes the meeting. People feel 'bored'.", "It was a really boring meeting, so I felt bored."],
    [
      { title: "Where adjectives go", text: "Adjectives come before a noun, or after verbs like be, look, feel and seem. They never take a plural -s.", rule: "a *new* phone · the phone is *new*", examples: ["She has *long* hair.", "You look *tired*.", "They are *good* students."], pairs: [["They are goods students.", "They are *good* students."]] },
      { title: "-ed or -ing?", text: "-ing adjectives describe the thing that causes the feeling. -ed adjectives describe how a person feels.", rule: "the film is *boring* → I am *bored*", examples: ["The news was *shocking*. We were *shocked*.", "This game is *exciting*. I'm *excited*.", "The class was *interesting*. I was *interested*."], pairs: [["I am very boring in this class.", "I am very *bored* in this class."]] },
      { title: "Order of adjectives", text: "With two or three adjectives, opinion comes first, then size, age, colour, origin and material.", rule: "opinion · size · age · colour · origin · material", examples: ["a *beautiful old* house", "a *big black* bag", "a *lovely Indian silk* sari"], tip: "Use two adjectives at most when you speak. It sounds more natural." },
    ],
    [
      choose("d26-1", "The lecture was so long. I was really ___.", ["boring", "bored", "bore", "bores"], 1, "People feel 'bored'. The lecture was 'boring'."),
      choose("d26-2", "Which order is natural?", ["a red big car", "a big red car", "a car big red", "a red car big"], 1, "Size comes before colour: 'a big red car'."),
      type("d26-3", "The match was very ___. Everyone was shouting. (exciting or excited)", ["exciting"], "The match causes the feeling, so 'exciting'.", "The -ing form."),
      choose("d26-4", "Choose the correct sentence.", ["They are kinds people.", "They are kind people.", "They are people kinds.", "They kind people are."], 1, "Adjectives never take -s."),
      order("d26-5", "Say in English: Woh ek sundar purana ghar hai.", "It is a beautiful old house.", [], ["It's a beautiful old house."]),
    ],
    { prompt: "Describe your favourite place to relax. Use at least four adjectives, one -ing and one -ed adjective.", model: "My favourite place is a small quiet beach near Alibaug. The water is clear and the sand is soft. Watching the sunset there is amazing. After a tiring week at work, I always feel relaxed there.", checklist: ["I put adjectives before nouns", "I used one -ing and one -ed adjective correctly", "I did not add -s to an adjective"], minWords: 30 }),

  lesson("d27", 27, 6, "Adverbs: How and How Often", "Grammar", 18, "Say how people do things and how often, with the adverb in the right place.",
    ["I usually take the train.", "'Usually' tells how often, and goes before the main verb.", "I usually take the train to work."],
    [
      { title: "Adverbs of manner", text: "Many adverbs are an adjective + -ly. They describe how someone does something and usually come after the verb or object.", rule: "quick → *quickly* · careful → *carefully*", examples: ["She speaks *clearly*.", "Please drive *slowly*.", "He did the job *well*."], pairs: [["He speaks English very good.", "He speaks English very *well*."], ["Drive careful.", "Drive *carefully*."]] },
      { title: "How often", text: "Adverbs of frequency go before the main verb, but after am, is and are.", rule: "I *always* get up early · I *am always* late", examples: ["always, usually, often, sometimes, rarely, never", "I *often* cook on Sundays.", "She *is never* late."], pairs: [["I go always to the gym.", "I *always go* to the gym."]] },
      { title: "Irregular adverbs", text: "Some adverbs do not take -ly.", examples: ["good → *well*", "fast → *fast*, hard → *hard*", "late → *late* (lately means recently)"], tip: "'Hardly' means 'almost not', so 'I hardly work' is not the same as 'I work hard'." },
    ],
    [
      choose("d27-1", "She sings very ___.", ["good", "well", "goodly", "nice"], 1, "'Well' is the adverb of 'good'."),
      choose("d27-2", "Where does 'often' go? I ___ to my parents.", ["talk often", "often talk", "talk to often", "often to talk"], 1, "Frequency adverbs go before the main verb."),
      type("d27-3", "Please speak ___. The baby is sleeping. (quiet or quietly)", ["quietly"], "It describes how you speak, so use the adverb.", "Add -ly."),
      choose("d27-4", "Choose the correct sentence.", ["He is late always.", "He always is late.", "He is always late.", "Always he late is."], 2, "After 'is', the adverb comes next: 'is always late'."),
      order("d27-5", "Say in English: Main kabhi-kabhi ghar se kaam karta hoon.", "I sometimes work from home."),
    ],
    { prompt: "Describe your weekly routine with four frequency adverbs, and say how you do two things using -ly adverbs.", model: "I always wake up at six. I usually walk to the station quickly because I am often late. I sometimes cook dinner, and I cook slowly and carefully. I never work on Sundays.", checklist: ["I put frequency adverbs before the main verb", "I used 'well', not 'good', for how I do something", "I used two -ly adverbs"], minWords: 30, must: ["always", "usually"] }),

  lesson("d28", 28, 6, "Comparatives and Superlatives", "Grammar", 20, "Compare two things, pick the best of many, and say 'too' and 'enough'.",
    ["This one is much better.", "'Much' makes a comparison stronger.", "Try the new phone. This one is much better."],
    [
      { title: "Comparing two things", text: "Short adjectives add -er. Long adjectives use 'more'. Then use 'than'.", rule: "cheap*er than* · *more* expensive *than*", examples: ["Pune is *smaller than* Mumbai.", "This route is *more convenient than* that one.", "good → *better*, bad → *worse*, far → *farther*"], pairs: [["He is more taller than me.", "He is *taller than* me."], ["This is more better.", "This is *better*."]] },
      { title: "The best of all", text: "For one thing in a group, use 'the' + -est, or 'the most' for long adjectives.", rule: "*the* cheap*est* · *the most* expensive", examples: ["Mumbai is *the biggest* city in Maharashtra.", "It was *the most beautiful* day of my life.", "good → *the best*, bad → *the worst*"] },
      { title: "As...as, too and enough", text: "'As...as' says two things are equal. 'Too' means more than you want. 'Enough' comes after an adjective.", rule: "*as* tall *as* · *too* hot · old *enough*", examples: ["My brother is *as tall as* me.", "This tea is *too hot* to drink.", "She is *old enough* to drive."], pairs: [["The room is enough big.", "The room is *big enough*."]], tip: "Make a comparison stronger with 'much' or 'a lot': much cheaper, a lot easier." },
    ],
    [
      choose("d28-1", "My new office is ___ than the old one.", ["more big", "bigger", "biggest", "more bigger"], 1, "'Big' is short: bigger."),
      choose("d28-2", "This is ___ restaurant in the city.", ["the better", "the best", "the most good", "best"], 1, "Superlative of good: 'the best'."),
      type("d28-3", "This exam was ___ difficult than the last one. (more or most)", ["more"], "Comparing two exams: 'more difficult than'.", "Used with 'than'."),
      choose("d28-4", "Choose the correct sentence.", ["He is enough tall to play.", "He is tall enough to play.", "He is too tall enough.", "He tall enough is."], 1, "'Enough' goes after the adjective."),
      order("d28-5", "Say in English: Mumbai Pune se bada hai.", "Mumbai is bigger than Pune."),
    ],
    { prompt: "Compare two cities, phones or jobs you know. Use two comparatives, one superlative and 'too' or 'enough'.", model: "Mumbai is bigger and more exciting than Pune, but Pune is cheaper and less crowded. For me, the best thing about Mumbai is the sea. But the trains are too crowded in the morning, and the flats are not big enough.", checklist: ["I used -er or more + than", "I used the + -est or the most", "I used too or enough correctly"], minWords: 35, must: ["than", "the"] }),

  lesson("d29", 29, 6, "There Is, There Are and Have Got", "Grammar", 15, "Say what exists in a place, and what people have.",
    ["There's a problem with my order.", "'There's' is the short form of 'there is'. It introduces something new.", "Excuse me, there's a problem with my order."],
    [
      { title: "There is / there are", text: "Use 'there is' for one thing or uncountable nouns, and 'there are' for plurals. It introduces something for the first time.", rule: "*there is* a bank · *there are* two banks", examples: ["*There is* a park near my house.", "*There are* many shops on this road.", "*Is there* a lift? *There isn't* any water."], pairs: [["In my area have many shops.", "*There are* many shops in my area."]] },
      { title: "Past and future", text: "Change 'is' to 'was', 'are' to 'were', or use 'will be'.", examples: ["*There was* a lot of traffic.", "*There were* fifty people at the wedding.", "*There will be* a meeting at three."] },
      { title: "Have and have got", text: "Use 'have' or 'have got' for possession. 'Have got' is common in British English and only in the present.", rule: "I *have* a car = I *have got* a car", examples: ["She *has* two brothers.", "*Have you got* a pen?", "We *don't have* a car."], tip: "Don't say 'there is having'. Just 'there is'." },
    ],
    [
      choose("d29-1", "___ a lot of people at the station today.", ["There is", "There are", "It has", "They are"], 1, "'People' is plural: 'There are'."),
      choose("d29-2", "Is ___ a pharmacy near here?", ["it", "there", "that", "have"], 1, "Ask with 'Is there...?'"),
      type("d29-3", "There ___ a big storm last night. (was or were)", ["was"], "One storm, past time: 'there was'.", "Past of 'is'."),
      choose("d29-4", "Choose the natural sentence.", ["In our office has a canteen.", "Our office has a canteen.", "In our office is having a canteen.", "Our office there is a canteen."], 1, "Say 'Our office has a canteen' or 'There is a canteen in our office'."),
      order("d29-5", "Say in English: Mere ghar ke paas ek bada park hai.", "There is a big park near my house.", [], ["There's a big park near my house."]),
    ],
    { prompt: "Describe your neighbourhood: what there is, what there isn't, and what there was in the past.", model: "There is a big market near my house and there are three schools. There isn't a cinema, which is sad. Ten years ago there was a small lake here, but now there are tall buildings.", checklist: ["I used there is and there are correctly", "I used one negative: there isn't or there aren't", "I used there was or there were"], minWords: 30, must: ["there is", "there are"] }, ["There is + one; there are + many.", "There was / there were / there will be.", "Have = have got for owning."], { levels: ["beginner"] }),

  lesson("d30", 30, 6, "Describe Your City", "Speaking", 20, "Give a one-minute description of your city using everything from this week.",
    ["It's a city that never sleeps.", "A popular way to describe a lively city.", "Mumbai is a city that never sleeps."],
    [
      { title: "A clear structure", text: "Start with where it is and its size, then what there is, then compare it, and end with your opinion.", examples: ["Nashik is a city in Maharashtra, about four hours from Mumbai.", "There are many temples and vineyards.", "It's smaller and calmer than Mumbai.", "I love it because it's green and peaceful."] },
      { title: "Useful describing words", text: "Choose adjectives that paint a picture.", examples: ["busy, crowded, lively, noisy", "quiet, peaceful, green, clean", "historic, modern, affordable, expensive"] },
      { title: "Make it personal", text: "Add one memory or one recommendation.", examples: ["You should try the street food near the station.", "The best time to visit is during the monsoon."], tip: "Speak for one minute without notes. Use keywords only." },
    ],
    [
      choose("d30-1", "Which is the best first sentence?", ["City is good.", "Nashik is a city in Maharashtra, four hours from Mumbai.", "I am from city.", "Big city."], 1, "Start with where it is."),
      order("d30-2", "Say in English: Yahan bahut saare purane mandir hain.", "There are many old temples here."),
      type("d30-3", "It is ___ peaceful than Mumbai. (more or most)", ["more"], "Comparing two cities: 'more peaceful than'.", "Used with 'than'."),
      choose("d30-4", "Which recommendation sounds natural?", ["You should try the street food.", "You must to try food.", "Try food you.", "You should tried the food."], 0, "Should + base verb."),
    ],
    { prompt: "Describe your city or town for one minute: where it is, what there is, a comparison, and your opinion.", model: "I live in Nashik, a city in Maharashtra about four hours from Mumbai. There are many old temples and beautiful vineyards. It is smaller and much calmer than Mumbai, and the weather is cooler. The best thing is the food. You should visit during the grape festival. I love Nashik because it is green and peaceful.", checklist: ["I said where it is", "I used there is / there are", "I used a comparative and a superlative", "I gave my opinion"], minWords: 50, must: ["there", "than"] },
    ["Where, what there is, comparison, opinion.", "Choose adjectives that paint a picture.", "Add one recommendation."], { goals: ["everyday", "interview"] }),
];

/* ================= WEEK 7 : PAST HABITS AND FUTURE PLANS ================= */
const w7: Lesson[] = [
  lesson("d31", 31, 7, "Past Continuous: Was Doing", "Grammar", 18, "Describe what was happening at a moment in the past, and what interrupted it.",
    ["I was just about to call you.", "You were going to call in a moment, when they called you first.", "Oh, hi! I was just about to call you."],
    [
      { title: "was / were + -ing", text: "Use the past continuous for an action in progress at a time in the past.", rule: "I *was working* at 8 pm", examples: ["At nine o'clock I *was having* breakfast.", "They *were watching* TV.", "What *were* you *doing* last night?"] },
      { title: "Interrupted actions", text: "The longer action uses the past continuous. The short action that interrupts it uses the past simple. Use 'when' or 'while'.", rule: "I *was cooking* when the phone *rang*", examples: ["I *was walking* home when it *started* to rain.", "*While* she *was sleeping*, someone *knocked*."], pairs: [["When I reached, they had dinner.", "When I reached, they *were having* dinner."]] },
      { title: "Setting the scene", text: "Stories often begin with the past continuous to set the scene.", examples: ["The sun *was shining* and the birds *were singing*.", "Everyone *was waiting* for the bus."], tip: "State verbs like know and want do not use -ing: 'I knew', not 'I was knowing'." },
    ],
    [
      choose("d31-1", "At 10 pm yesterday I ___ a film.", ["watched", "was watching", "am watching", "watch"], 1, "An action in progress at a past time: 'was watching'."),
      choose("d31-2", "I was driving to work when I ___ an accident.", ["was seeing", "saw", "see", "have seen"], 1, "The short action that interrupts uses the past simple."),
      type("d31-3", "They ___ playing cricket when it started to rain. (was or were)", ["were"], "'They' takes 'were'.", "Plural of 'was'."),
      choose("d31-4", "Which sentence is correct?", ["I was knowing the answer.", "I knew the answer.", "I was know the answer.", "I knowing the answer."], 1, "'Know' is a state verb: no -ing."),
      order("d31-5", "Say in English: Jab tumne phone kiya tab main khana bana raha tha.", "I was cooking when you called."),
    ],
    { prompt: "Tell a short story about a surprising moment. Use the past continuous to set the scene and the past simple for what happened.", model: "Last Saturday I was walking along Juhu beach. The sun was setting and lots of people were taking photos. Suddenly I saw my old school friend. We were so surprised! We sat down and talked for two hours.", checklist: ["I set the scene with was/were + -ing", "I used the past simple for the main event", "I used when or while"], minWords: 35, must: ["was", "when"] }),

  lesson("d32", 32, 7, "Used To: Past Habits", "Grammar", 15, "Talk about things that were true in the past but are not true now.",
    ["I used to live in Nagpur.", "It was true before, but not now.", "I used to live in Nagpur, but now I live in Pune."],
    [
      { title: "used to + base verb", text: "Use 'used to' for past habits and states that have changed.", rule: "I *used to* play cricket (not any more)", examples: ["I *used to* walk to school.", "She *used to* have long hair.", "We *used to* live in a small flat."] },
      { title: "Questions and negatives", text: "With did and didn't, write 'use to' without the d.", rule: "*Did* you *use to*...? · I *didn't use to*...", examples: ["*Did* you *use to* play a sport?", "I *didn't use to* like coffee."], pairs: [["I am used to play football as a child.", "I *used to* play football as a child."]] },
      { title: "Used to vs be used to", text: "'Be used to' + -ing means something is normal for you now. It is a different meaning.", rule: "I *am used to* wak*ing* up early (it's normal)", examples: ["I *used to* drive. (past habit)", "I*'m used to* driving in traffic. (normal for me)"], tip: "For a single past action, use the past simple, not 'used to'." },
    ],
    [
      choose("d32-1", "When I was a child, I ___ climb trees.", ["use to", "used to", "am used to", "was use to"], 1, "Past habit: 'used to' + base verb."),
      choose("d32-2", "___ you use to live here?", ["Do", "Did", "Were", "Are"], 1, "Questions take 'Did ... use to'."),
      type("d32-3", "I didn't ___ to like vegetables. (use or used)", ["use"], "After 'didn't', write 'use to'.", "No d at the end."),
      choose("d32-4", "Which means 'It's normal for me now'?", ["I used to work at night.", "I'm used to working at night.", "I use to work at night.", "I used working at night."], 1, "'Be used to + -ing' = it is normal for me."),
      order("d32-5", "Say in English: Main pehle bahut TV dekhta tha.", "I used to watch a lot of TV."),
    ],
    { prompt: "Compare your life ten years ago with today. Say four things you used to do and one thing you didn't use to do.", model: "Ten years ago I used to live with my grandparents in a village. I used to walk to school and I used to play outside every evening. I didn't use to have a phone. Now I live in the city and I'm used to busy roads.", checklist: ["I used 'used to' + base verb", "I said 'didn't use to' without a d", "I contrasted it with now"], minWords: 30, must: ["used to"] }),

  lesson("d33", 33, 7, "Will or Going To?", "Grammar", 18, "Choose between will and going to for decisions, plans and predictions.",
    ["I'll get it!", "A decision made right now, as the phone rings.", "The phone's ringing. I'll get it!"],
    [
      { title: "Will: decisions now, promises, offers", text: "Use 'will' when you decide at the moment of speaking, and for promises, offers and requests.", rule: "*I'll* help you (decided now)", examples: ["It's hot. *I'll* open the window.", "*I'll* call you tomorrow, I promise.", "*Will* you help me with this?"] },
      { title: "Going to: plans and clear signs", text: "Use 'going to' for plans you made before, and for predictions based on what you can see now.", rule: "I'm *going to* visit Goa (already planned)", examples: ["We*'re going to* buy a car next month.", "Look at those clouds. It*'s going to* rain."], pairs: [["Tomorrow I will going to market.", "Tomorrow I*'m going to* go to the market."]] },
      { title: "Predictions and short forms", text: "Both can predict the future. 'Will' is for opinions; 'going to' is for evidence. In speech, use short forms.", examples: ["I think India *will* win.", "I'll, you'll, she'll, we'll, they'll", "won't = will not"], tip: "Never put 'to' after will: 'I will go', not 'I will to go'." },
    ],
    [
      choose("d33-1", "I'm thirsty. I think I ___ a glass of water.", ["am going to have", "will have", "have", "had"], 1, "A decision made right now: 'will'."),
      choose("d33-2", "We ___ visit my uncle on Sunday. We booked the tickets.", ["will", "are going to", "going to", "will to"], 1, "A plan made earlier: 'are going to'."),
      type("d33-3", "Look at the sky! It's ___ to rain. (going or will)", ["going"], "Evidence you can see: 'going to'.", "Followed by 'to'."),
      choose("d33-4", "Choose the correct sentence.", ["I will to call you.", "I will calling you.", "I'll call you.", "I'll calls you."], 2, "Will + base verb."),
      order("d33-5", "Say in English: Main agle saal MBA karne wala hoon.", "I am going to do an MBA next year.", [], ["I'm going to do an MBA next year."]),
    ],
    { prompt: "Talk about your plans for next weekend with 'going to', make one promise with 'will', and give one prediction.", model: "This weekend I'm going to visit my cousins in Thane. On Sunday we're going to watch a film. I'll call my mother on the way, I promise. I think it will be a lot of fun.", checklist: ["I used going to for plans", "I used will for a promise or decision", "I used will + base verb, no 'to'"], minWords: 30, must: ["going to", "will"] }),

  lesson("d34", 34, 7, "Future Plans and Time Clauses", "Grammar", 18, "Talk about fixed arrangements and use when, before and as soon as about the future.",
    ["I'm meeting a client at four.", "A fixed arrangement uses the present continuous.", "Sorry, I can't. I'm meeting a client at four."],
    [
      { title: "Present continuous for arrangements", text: "For plans with a time and other people involved, use the present continuous.", rule: "I*'m meeting* Ravi tomorrow", examples: ["We*'re flying* to Delhi on Friday.", "What *are* you *doing* this evening?"] },
      { title: "Present simple for timetables", text: "For trains, flights and schedules, use the present simple.", examples: ["The train *leaves* at 6:15.", "The class *starts* at 8."] },
      { title: "When, before, after, as soon as", text: "After these words, use the present simple even when you talk about the future.", rule: "*when* I *get* home, I'll call you", examples: ["I'll call you *as soon as* I *reach*.", "*Before* you *leave*, switch off the lights.", "We'll start *after* everyone *arrives*."], pairs: [["I will call you when I will reach.", "I will call you when I *reach*."]], tip: "The same rule works with 'if': 'If it rains, we'll stay in.'" },
    ],
    [
      choose("d34-1", "I'll message you as soon as I ___ the results.", ["will get", "get", "got", "am getting"], 1, "After 'as soon as', use the present simple."),
      choose("d34-2", "What ___ you ___ tonight? Any plans?", ["do / do", "are / doing", "will / doing", "did / do"], 1, "Arrangements: 'What are you doing tonight?'"),
      type("d34-3", "The flight ___ at 7:40 tomorrow. (leaves or will leaving)", ["leaves"], "Timetables use the present simple.", "Present simple with -s."),
      choose("d34-4", "Choose the correct sentence.", ["When I will finish, I will call.", "When I finish, I will call.", "When I finish, I call will.", "When finish, I call."], 1, "No 'will' after 'when'."),
      order("d34-5", "Say in English: Ghar pahunchte hi main tumhe phone karunga.", "I will call you as soon as I reach home.", [], ["I'll call you as soon as I reach home.", "I will call you as soon as I get home.", "I'll call you as soon as I get home."]),
    ],
    { prompt: "Describe your arrangements for tomorrow using the present continuous, then add two sentences with 'when' or 'as soon as'.", model: "Tomorrow I'm meeting my manager at ten and I'm having lunch with a friend. My train leaves at six. As soon as I reach home, I'll call my parents. When I finish dinner, I'll prepare for the presentation.", checklist: ["I used am/is/are + -ing for arrangements", "I used the present simple after when / as soon as", "I did not say 'when I will'"], minWords: 30, must: ["when", "tomorrow"] }, ["Arrangements: I'm meeting...", "Timetables: The train leaves...", "No will after when, before, as soon as, if."], { goals: ["work"] }),

  lesson("d35", 35, 7, "Making Plans and Invitations", "Conversation", 15, "Invite people, accept, decline politely and fix a time.",
    ["Are you free on Saturday?", "A friendly way to start an invitation.", "Are you free on Saturday? Let's go for lunch."],
    [
      { title: "Inviting", text: "Ask if they are free, then suggest the plan.", examples: ["Are you free this weekend?", "Would you like to come to my birthday party?", "How about watching a film on Friday?", "Let's meet for coffee."] },
      { title: "Accepting and declining", text: "Accept warmly. Decline politely with a reason and suggest another time.", examples: ["That sounds great! I'd love to.", "I'm sorry, I can't. I'm visiting my parents. Maybe next week?", "Thanks for asking!"], pairs: [["I will not come.", "I'm sorry, I *can't make it*."]] },
      { title: "Fixing the details", text: "Confirm the day, time and place.", examples: ["What time suits you?", "Shall we say seven o'clock?", "See you at the station at seven, then."], tip: "After 'How about', use -ing: 'How about going...'" },
    ],
    [
      choose("d35-1", "How about ___ to the beach on Sunday?", ["go", "to go", "going", "went"], 2, "'How about' + -ing."),
      choose("d35-2", "You can't go. What is the politest reply?", ["No.", "I won't come.", "I'm sorry, I can't make it. Maybe next week?", "Not interested."], 2, "Say sorry, give a short reason or another time."),
      type("d35-3", "Would you like ___ come to dinner? (to or for)", ["to"], "'Would you like to + verb'.", "Two letters."),
      order("d35-4", "Say in English: Kya tum shanivaar ko free ho?", "Are you free on Saturday?"),
    ],
    { prompt: "Invite a friend to a plan, then practise both: accept and fix a time, and decline politely with another suggestion.", model: "Hi Neha, are you free on Saturday? How about going to the new cafe in Bandra? ... Great! Shall we say five o'clock at the station? ... And if you can't: no problem, maybe next Sunday?", checklist: ["I asked if they are free", "I used 'How about + -ing' or 'Would you like to'", "I fixed a day, time and place"], minWords: 30, must: ["free", "how about"] },
    ["Are you free...? Would you like to...?", "I'd love to. / Sorry, I can't make it.", "Shall we say seven?"], { goals: ["everyday"] }),
];

/* ================= WEEK 8 : WORK ENGLISH ================= */
const w8: Lesson[] = [
  lesson("d36", 36, 8, "Can, Could and Be Able To", "Grammar", 15, "Talk about ability in the present, past and future.",
    ["I can manage it.", "A confident way to say you can do something.", "Don't worry about the report. I can manage it."],
    [
      { title: "Can and can't", text: "Use 'can' + base verb for present ability. The negative is can't (cannot).", rule: "She *can* speak three languages", examples: ["I *can* use Excel.", "He *can't* drive.", "*Can* you swim?"], pairs: [["I can to speak Hindi.", "I *can speak* Hindi."]] },
      { title: "Could for the past", text: "Use 'could' for general ability in the past.", rule: "I *could* run fast when I was young", examples: ["I *could* read when I was four.", "She *couldn't* come yesterday."] },
      { title: "Be able to", text: "Use 'be able to' where 'can' doesn't work: after will, in the present perfect, or after another verb. Use 'managed to' for one difficult success.", rule: "I *will be able to* finish by Friday", examples: ["I *won't be able to* attend.", "I *haven't been able to* call him.", "We *managed to* catch the last train."], tip: "Never say 'will can'. Say 'will be able to'." },
    ],
    [
      choose("d36-1", "I'm sorry, I ___ come to the meeting tomorrow.", ["can't will", "won't be able to", "will can't", "not can"], 1, "Future ability: 'won't be able to'."),
      choose("d36-2", "When she was five, she ___ swim.", ["can", "could", "is able", "cans"], 1, "Past ability: 'could'."),
      type("d36-3", "She can ___ the piano very well. (play or to play)", ["play"], "Can + base verb, no 'to'.", "Base form only."),
      choose("d36-4", "The traffic was terrible, but we ___ reach on time.", ["could", "managed to", "can", "able"], 1, "One difficult success: 'managed to'."),
      order("d36-5", "Say in English: Main kal tak report khatam kar paunga.", "I will be able to finish the report by tomorrow.", [], ["I'll be able to finish the report by tomorrow."]),
    ],
    { prompt: "Talk about your skills: three things you can do now, one thing you could do as a child, and one thing you will be able to do after this course.", model: "I can use Excel and I can speak Marathi and Hindi. I can also cook well. When I was a child, I could climb trees very fast. After this course, I will be able to speak confidently in meetings.", checklist: ["I used can + base verb", "I used could for the past", "I used will be able to for the future"], minWords: 30, must: ["can", "able to"] }, ["can / can't + base verb.", "could = past ability.", "will be able to, managed to."], { goals: ["interview", "work"] }),

  lesson("d37", 37, 8, "Have To, Must and Don't Have To", "Grammar", 18, "Talk about duties, rules and things that are not necessary.",
    ["You don't have to wear a tie.", "It is not necessary, but you can if you want.", "It's a casual office. You don't have to wear a tie."],
    [
      { title: "Have to and must", text: "Both mean something is necessary. 'Have to' often means a rule from outside; 'must' often means the speaker feels it is important.", rule: "I *have to* wear an ID card · I *must* call Mum", examples: ["We *have to* submit the report by Friday.", "She *has to* work on Saturdays.", "You *must* see this film!"] },
      { title: "Don't have to vs mustn't", text: "'Don't have to' means it is not necessary. 'Mustn't' means it is not allowed. They are very different.", rule: "*don't have to* = no need · *mustn't* = not allowed", examples: ["You *don't have to* come early. (optional)", "You *mustn't* smoke here. (forbidden)"], pairs: [["You mustn't pay, it's free.", "You *don't have to* pay, it's free."]] },
      { title: "Past and future", text: "Must has no past form. Use 'had to' for the past and 'will have to' for the future.", examples: ["I *had to* wait for an hour.", "You*'ll have to* show your ID.", "*Did* you *have to* pay?"], tip: "Need to works like have to: I need to leave. You don't need to bring anything." },
    ],
    [
      choose("d37-1", "It's a holiday tomorrow, so I ___ go to work.", ["mustn't", "don't have to", "have to", "must"], 1, "Not necessary: 'don't have to'."),
      choose("d37-2", "You ___ use your phone during the exam. It's against the rules.", ["don't have to", "mustn't", "haven't to", "don't must"], 1, "Not allowed: 'mustn't'."),
      type("d37-3", "Yesterday I ___ to stay late at the office. (had or must)", ["had"], "Past of 'have to' is 'had to'.", "Past form."),
      choose("d37-4", "She ___ wear a uniform at work.", ["have to", "has to", "must to", "having to"], 1, "He/she/it: 'has to'."),
      order("d37-5", "Say in English: Tumhe kuch laane ki zaroorat nahi hai.", "You don't have to bring anything.", [], ["You do not have to bring anything.", "You don't need to bring anything."]),
    ],
    { prompt: "Describe the rules at your job, college or home: two things you have to do, one thing you mustn't do, and one thing you don't have to do.", model: "At my office we have to wear an ID card and we have to reach by nine thirty. We mustn't use our personal phones in client meetings. But we don't have to wear formal clothes on Fridays.", checklist: ["I used have to / has to", "I used mustn't for a rule", "I used don't have to for 'not necessary'"], minWords: 30, must: ["have to", "don't have to"] }, ["have to / must = necessary.", "don't have to = no need. mustn't = not allowed.", "Past: had to."], { goals: ["work"] }),

  lesson("d38", 38, 8, "Present Perfect Continuous: For and Since", "Grammar", 18, "Say how long you have been doing something that is still going on.",
    ["I've been working here for three years.", "Started in the past, still true now, and we say how long.", "I've been working here for three years, since 2023."],
    [
      { title: "have/has been + -ing", text: "Use this tense for an activity that started in the past and is still continuing, especially when you say how long.", rule: "I *have been learning* English for six months", examples: ["She *has been waiting* since ten o'clock.", "How long *have* you *been living* in Pune?"], pairs: [["I am working here since 2020.", "I *have been working* here since 2020."], ["I am waiting for one hour.", "I *have been waiting* for an hour."]] },
      { title: "For and since", text: "Use 'for' with a length of time and 'since' with a starting point.", rule: "*for* two years · *since* 2022", examples: ["*for* ten minutes, *for* a week, *for* ages", "*since* Monday, *since* 9 am, *since* I was a child"] },
      { title: "With state verbs", text: "State verbs like know, have (own) and like use the present perfect simple instead.", examples: ["I *have known* him *for* years.", "We *have had* this car *since* 2019."], tip: "This is very common in interviews: 'I've been working in sales for four years.'" },
    ],
    [
      choose("d38-1", "I ___ here since 2021.", ["work", "am working", "have been working", "worked"], 2, "Started in the past and still true: 'have been working'."),
      choose("d38-2", "She has been studying ___ three hours.", ["since", "for", "from", "by"], 1, "Length of time: 'for'."),
      type("d38-3", "We have lived here ___ 2015. (for or since)", ["since"], "A starting point takes 'since'.", "Used with a year."),
      choose("d38-4", "Choose the correct sentence.", ["I know her since college.", "I have known her since college.", "I have been knowing her since college.", "I knew her since college."], 1, "'Know' is a state verb: 'have known'."),
      order("d38-5", "Say in English: Main do ghante se tumhara intezaar kar raha hoon.", "I have been waiting for you for two hours.", [], ["I've been waiting for you for two hours."]),
    ],
    { prompt: "Answer like in an interview: how long you have been doing your job or studies, and one skill you have been building. Use for and since.", model: "I have been working as a sales executive for four years, since I finished my degree. I have been handling key clients since last year. I have also been learning data analysis for six months.", checklist: ["I used have/has been + -ing", "I used for with a period", "I used since with a starting point"], minWords: 30, must: ["been", "since"] }, ["have/has been + -ing for things still going on.", "for + period, since + starting point.", "State verbs: have known, have had."], { goals: ["interview", "work"] }),

  lesson("d39", 39, 8, "Imperatives and Giving Instructions", "Grammar", 15, "Give clear instructions and directions, politely and in the right order.",
    ["Don't forget to save your work.", "A friendly reminder in the imperative.", "Don't forget to save your work before you log out."],
    [
      { title: "The imperative", text: "Use the base verb, with no subject, to give instructions. Use 'Don't' for the negative.", rule: "*Open* the file. *Don't close* the window.", examples: ["*Click* on Settings.", "*Turn* left at the signal.", "*Don't touch* that wire."] },
      { title: "Making it polite", text: "Add please, or use a softer question form for people you don't know well.", examples: ["*Please* fill in this form.", "*Could you* send it by five?", "*Let's* start the meeting."], pairs: [["You do one thing, send me the file.", "*Please send* me the file."]] },
      { title: "Sequencing", text: "Put steps in order with sequence words.", examples: ["*First*, log in. *Then* click on Reports.", "*Next*, choose the month. *Finally*, press Download."], tip: "One instruction per sentence makes it easy to follow." },
    ],
    [
      choose("d39-1", "Which is a clear instruction?", ["You will be clicking Save.", "Click Save.", "Saving click.", "To click Save."], 1, "Imperative: base verb, no subject."),
      choose("d39-2", "The negative of 'Open the door' is:", ["Not open the door.", "Don't open the door.", "No open the door.", "Open not the door."], 1, "Use 'Don't' + base verb."),
      type("d39-3", "___, switch on the computer. Then log in. (First or Last)", ["first"], "The first step starts with 'First'.", "The opposite of last."),
      order("d39-4", "Say in English: Kripya yeh form bhariye.", "Please fill in this form.", [], ["Please fill this form.", "Please fill out this form."]),
    ],
    { prompt: "Explain how to make tea, or how to send money on UPI, in five clear steps using sequence words.", model: "First, boil a cup of water. Then add tea leaves and sugar. Next, add milk and let it boil again. After that, turn off the gas. Finally, strain the tea into a cup and enjoy it.", checklist: ["I used base verbs with no subject", "I used first, then, next and finally", "I kept one step per sentence"], minWords: 30, must: ["first", "then", "finally"] }, ["Base verb for instructions; Don't for negatives.", "Please / Could you to be polite.", "First, then, next, finally."]),

  lesson("d40", 40, 8, "Emails and Meetings", "Conversation", 20, "Write a short professional email and take part in a meeting confidently.",
    ["Please find the report attached.", "A standard line when you attach a file.", "Hi Ankit, please find the report attached."],
    [
      { title: "A short professional email", text: "Greeting, purpose in one line, details, the action you need, and a polite close.", examples: ["Hi Meera,", "I'm writing about the client visit on Friday.", "Could you confirm the time by tomorrow?", "Thanks, / Best regards, Rohan"], pairs: [["PFA.", "Please find the file attached."], ["Kindly do the needful.", "Could you please *update the sheet* by Friday?"]] },
      { title: "Speaking in meetings", text: "Short phrases help you join in without interrupting rudely.", examples: ["Can I add something here?", "I agree with Priya.", "Sorry, could you repeat that?", "Just to confirm, the deadline is Friday?"] },
      { title: "Following up", text: "After a meeting, summarise the decisions and next steps in writing.", examples: ["Thanks for your time today.", "As discussed, I will share the draft by Monday.", "Please let me know if I missed anything."], tip: "Say exactly what you need. 'Do the needful' is vague; name the action." },
    ],
    [
      choose("d40-1", "Which is the best email opening line?", ["I am writing about the invoice for March.", "As per the subject.", "Hi, PFA.", "Kindly see."], 0, "State your purpose clearly."),
      choose("d40-2", "You missed something in a meeting. What do you say?", ["Repeat.", "What?", "Sorry, could you repeat that?", "Say again properly."], 2, "Polite and clear."),
      type("d40-3", "Please find the report ___. (attached or attachment)", ["attached"], "'Please find ... attached' is the standard phrase.", "Ends in -ed."),
      order("d40-4", "Say in English: Kya main yahan kuch jod sakta hoon?", "Can I add something here?", [], ["May I add something here?", "Could I add something here?"]),
    ],
    { prompt: "Say aloud a short email asking your manager for a day off next Friday, then say two phrases you would use in a meeting.", model: "Hi Sunil, I'm writing to ask for a day off next Friday, the 14th, for a family function. I have finished the weekly report, and Anita will handle any urgent calls. Please let me know if that's okay. Thanks, Rohan. In a meeting I would say: Can I add something here? Just to confirm, the deadline is Monday?", checklist: ["I stated my purpose in one line", "I asked clearly for an action", "I used a polite closing"], minWords: 40, must: ["writing", "please"] },
    ["Purpose, details, action, polite close.", "Name the action instead of 'do the needful'.", "Can I add something? Could you repeat that?"], { goals: ["work"] }),
];

export const M2_WEEKS: Week[] = [
  wk(5, "Nouns, Pronouns and Amounts", "Talk about things, people and quantities", w5),
  wk(6, "Describing People and Places", "Adjectives, adverbs and comparisons", w6),
  wk(7, "Past Habits and Future Plans", "Talk about then and next", w7),
  wk(8, "Work English", "Ability, duty and ongoing work", w8),
];
