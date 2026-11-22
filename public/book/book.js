/* Speak Up: one-page-at-a-time book sheet. Builds cover/contents and chapter pages. */
(function () {
  const READY = 20; // chapters 1..READY are written
  const parts = [
    { t: "Part 1: Starting Point", d: "Mindset, daily practice, self-assessment", ch: [
      ["Believe First, Speak Next", "You already know more English than you think."],
      ["Your 20-Minute Daily Practice System", "A simple daily habit that really sticks."],
      ["Know Your Level", "A friendly self-assessment, and one clear goal."]] },
    { t: "Part 2: Foundations", d: "Clear, confident building blocks", ch: [
      ["Pronunciation Made Simple", "Tricky sounds, word stress, mother-tongue influence."],
      ["Build Your Vocabulary", "Learn words in chunks, not lists."],
      ["Essential Grammar for Speaking", "Only the grammar you need when talking."],
      ["From Thought to Sentence", "Stop translating in your head."]] },
    { t: "Part 3: Everyday Communication", d: "English for real life", ch: [
      ["Everyday Conversations", "Greetings, small talk, shopping, travel."],
      ["Phone Calls & Social Situations", "Customer care, introductions, polite refusals."],
      ["The Art of Listening", "Fast speakers, accents, active listening."],
      ["Body Language & Voice", "Eye contact, posture, tone and pace."]] },
    { t: "Part 4: Advanced & Professional", d: "College, career and leadership", ch: [
      ["Public Speaking Without Fear", "Structure a speech and manage nerves."],
      ["Presentations That Work", "Slides, flow, handling questions."],
      ["Group Discussions", "Start, agree, disagree, summarise."],
      ["Interviews: Get the Job", "Tough questions, salary talk."],
      ["Email & Business Writing", "Emails, WhatsApp at work, templates."],
      ["Negotiation & Storytelling", "Persuade politely; stories that stick."]] },
    { t: "Part 5: Growth Plan", d: "Turn learning into a lifelong habit", ch: [
      ["Your 30/60/90-Day Plan", "A day-by-day roadmap."],
      ["Common Mistakes & How to Fix Them", "Wrong vs right, side by side."],
      ["Resources, Habits & Next Steps", "Apps, channels, partners, habits."]] }
  ];

  const flat = []; let n = 0;
  parts.forEach(p => p.ch.forEach(c => flat.push({ n: ++n, t: c[0], d: c[1], part: p.t })));
  const pad2 = k => String(k).padStart(2, "0");
  const cur = +document.body.dataset.ch || 0;
  const base = cur ? "" : "chapters/";
  const home = cur ? "../index.html" : "index.html";
  const link = k => base + "ch" + pad2(k) + ".html";
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  /* ---------- home: cover + contents ---------- */
  if (!cur) {
    let toc = "", k = 0;
    parts.forEach(p => {
      toc += `<div class="part"><h2>${p.t}</h2><p>${p.d}</p></div>`;
      p.ch.forEach(c => {
        k++;
        const inner = `<b>${k}</b><span><span class="t">${c[0]}</span><span class="d">${c[1]}</span></span><span class="tg">${k <= READY ? "READ" : "SOON"}</span>`;
        toc += k <= READY ? `<a class="ci" href="${link(k)}">${inner}</a>` : `<div class="ci off">${inner}</div>`;
      });
    });
    const book = el("div", "book",
      `<header class="cover"><div class="eyebrow">An English communication guide for India</div><h1>Speak Up</h1><div class="rule"></div>
        <p class="tag2">Your Complete Guide to English Communication</p>
        <div class="meta">5 PARTS &nbsp;·&nbsp; 20 CHAPTERS</div><a class="go" href="${link(1)}">Start reading →</a></header>
       <section class="page"><h2 class="ctitle">Contents</h2><div class="orn">❦</div>${toc}</section>
       <div class="folio">Speak Up · An English communication guide for India</div>`);
    document.body.append(book);
    return;
  }

  /* ---------- chapter ---------- */
  const me = flat[cur - 1], prev = flat[cur - 2], next = flat[cur];
  const src = document.getElementById("chapter");
  const mins = Math.max(5, Math.round((src.textContent.match(/\S+/g) || []).length / 190));

  const art = el("article", "page");
  art.innerHTML = `<div class="runhead"><a href="${home}">Speak Up</a><span>${me.part}</span></div>
    <div class="opener"><div class="eyebrow">Chapter</div><div class="big">${cur}</div><h1>${me.t}</h1>
    <p class="sub">${me.d}</p><div class="meta">${mins} MIN READ</div><div class="orn">❦</div></div>`;
  const body = el("div", "prose"); body.append(...src.childNodes);
  art.append(body);
  art.append(el("nav", "nav",
    (prev ? `<a href="${link(prev.n)}">← Chapter ${prev.n}</a>` : `<span class="off">← Start of book</span>`) +
    `<a href="${home}">Contents</a>` +
    (next ? (next.n <= READY ? `<a href="${link(next.n)}">Chapter ${next.n} →</a>` : `<span class="off">Chapter ${next.n} soon →</span>`) : `<span class="off">The end</span>`)));
  const book = el("div", "book"); book.append(art, el("div", "folio", `Chapter ${cur} · ${me.t}`));
  src.remove();
  document.body.append(book);
})();
