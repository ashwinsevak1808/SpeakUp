// Renders the 10 SpeakUp Instagram posts (1080x1350) into this folder.
// Photos: put photos/post-01.jpg and photos/post-09.jpg (see PROMPTS.md) and run again; without them a drawn illustration is used.
// Run: node render.mjs   (needs playwright-core and Google Chrome)
import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const W = 1080, H = 1350;
const G = { deep: "#124a31", brand: "#1f7249", mid: "#2b9a5f", soft: "#8fd3ad", muted: "#c3dfce", pale: "#edf6f0", ink: "#131a16", grey: "#59645d", line: "#e3e7e4" };

const B = "M74 30 H126 C151.4 30 172 50.6 172 76 V112 C172 137.4 151.4 158 126 158 H92 L62 182 C57.5 185.6 51 182 52.2 176.4 L56 153 C39 145 28 129.6 28 112 V76 C28 50.6 48.6 30 74 30 Z";
const A = "M100 56 L134 94 H113 V128 H87 V94 H66 Z";
const mark = (s, white) => `<svg width="${s}" height="${s}" viewBox="0 0 200 200">${white ? "" : `<path transform="translate(0 8)" d="${B}" fill="${G.deep}"/>`}<path d="${B}" fill="${white ? "#fff" : G.brand}"/><path d="${A}" fill="${white ? G.brand : "#fff"}" stroke="${white ? G.brand : "#fff"}" stroke-width="10" stroke-linejoin="round"/></svg>`;
const logo = (dark) => `<div style="display:flex;align-items:center;gap:14px">${mark(64, dark)}<span style="font-family:Nunito;font-weight:900;font-size:40px;letter-spacing:-0.02em;color:${dark ? "#fff" : G.ink}">Speak<span style="color:${dark ? G.soft : G.brand}">Up</span></span></div>`;
const footer = (dark, text = "Learn free · link in bio") => `<div style="display:flex;justify-content:space-between;align-items:center;font-family:Inter;font-weight:600;font-size:28px;color:${dark ? G.muted : G.grey}"><span>${text}</span><span style="display:flex;align-items:center;gap:10px">${mark(40, dark)}</span></div>`;
const arrow = (c) => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const check = (c, s = 34) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const cross = (c, s = 34) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
const pill = (text, bg, fg, size = 32) => `<span style="display:inline-block;font-family:Inter;font-weight:700;font-size:${size}px;background:${bg};color:${fg};border-radius:999px;padding:${size * 0.55}px ${size * 1.3}px">${text}</span>`;
const h = (text, size, color, extra = "") => `<h1 style="margin:0;font-family:Nunito;font-weight:900;font-size:${size}px;line-height:1.04;letter-spacing:-0.025em;color:${color};${extra}">${text}</h1>`;
const p = (text, size, color, extra = "") => `<p style="margin:0;font-family:Inter;font-weight:500;font-size:${size}px;line-height:1.4;color:${color};${extra}">${text}</p>`;
const frame = (bg, inner) => `<div style="width:${W}px;height:${H}px;box-sizing:border-box;padding:80px;background:${bg};display:flex;flex-direction:column;justify-content:space-between;gap:40px;position:relative;overflow:hidden">${inner}</div>`;

const photo = (n) => { const f = path.join(DIR, "photos", `post-${String(n).padStart(2, "0")}.jpg`); return fs.existsSync(f) ? `data:image/jpeg;base64,${fs.readFileSync(f).toString("base64")}` : null; };

// Drawn video-call grid (used until a photo is added)
const person = (x, y, skin, hair, shirt) => `<g transform="translate(${x} ${y})"><path d="M-62 120 C-62 70 62 70 62 120 Z" fill="${shirt}"/><circle cx="0" cy="18" r="36" fill="${skin}"/><path d="M-37 14 C-37 -22 37 -22 37 14 C30 0 -30 0 -37 14 Z" fill="${hair}"/></g>`;
const callGrid = (w, hgt) => `<svg width="${w}" height="${hgt}" viewBox="0 0 900 600">
  <rect width="900" height="600" rx="40" fill="${G.deep}"/>
  ${[[30, 30], [460, 30], [30, 310], [460, 310]].map(([x, y], i) => `<g><rect x="${x}" y="${y}" width="410" height="260" rx="26" fill="${["#2b5f46", "#2f6a4e", "#28563f", "#336f52"][i]}" ${i === 0 ? `stroke="${G.soft}" stroke-width="8"` : ""}/>
    <svg x="${x}" y="${y}" width="410" height="260" viewBox="-205 -110 410 260">${person(0, 0, ["#c68642", "#8d5524", "#e0ac69", "#a0673a"][i], ["#1f1308", "#0b0b0b", "#3b2412", "#111"][i], ["#8fd3ad", "#edf6f0", "#c3dfce", "#5ea67f"][i])}</svg></g>`).join("")}
  <rect x="300" y="548" width="300" height="0" />
</svg>`;
const photoOr = (n, w, hgt, radius = 36) => { const src = photo(n); return src ? `<img src="${src}" style="width:${w}px;height:${hgt}px;object-fit:cover;border-radius:${radius}px;display:block"/>` : callGrid(w, hgt); };

const posts = [
  // 1. Join us
  () => frame(G.brand, `${logo(true)}
    <div style="display:flex;flex-direction:column;gap:34px">
      ${photoOr(1, 920, 470)}
      ${h("Learn English<br>with SpeakUp", 104, "#fff")}
      ${p("Daily 15-minute lessons, every grammar topic and live online classes with skilled trainers.", 36, G.muted)}
      <div style="display:flex;gap:20px;align-items:center">${pill("Join free today", "#fff", G.deep)}${pill("Free till 28 Feb 2027", "transparent", "#fff", 28).replace("transparent;", "transparent;box-shadow:inset 0 0 0 3px rgba(255,255,255,.5);")}</div>
    </div>
    ${footer(true)}`),

  // 2. Stop translating
  () => frame("#fff", `${logo(false)}
    <div style="display:flex;flex-direction:column;gap:46px">
      ${h(`Stop <span style="text-decoration:line-through;text-decoration-thickness:10px;text-decoration-color:${G.soft}">translating</span><br>in your head.`, 112, G.ink)}
      ${p("Do this instead:", 40, G.grey, "font-weight:600")}
      <div style="display:flex;flex-direction:column;gap:24px">
        ${["Think in short English sentences", "Learn phrases, not single words", "Speak out loud for 5 minutes a day"].map((t, i) => `<div style="display:flex;gap:26px;align-items:center;background:${G.pale};border-radius:28px;padding:30px 36px"><span style="font-family:Nunito;font-weight:900;font-size:56px;color:${G.brand};width:44px">${i + 1}</span>${p(t, 40, G.ink, "font-weight:600")}</div>`).join("")}
      </div>
    </div>
    ${footer(false, "Save this · Practise free, link in bio")}`),

  // 3. Say this, not this
  () => frame(G.pale, `${logo(false)}
    <div style="display:flex;flex-direction:column;gap:30px">
      ${p("COMMON MISTAKE", 30, G.brand, "font-weight:700;letter-spacing:.14em")}
      ${h("Don&#39;t say this.<br>Say this.", 112, G.ink)}
      <div style="display:flex;align-items:center;gap:28px;background:#fff;border-radius:30px;padding:40px 44px;box-shadow:inset 0 0 0 3px ${G.line}">${cross("#8c968f", 52)}<span style="font-family:Nunito;font-weight:800;font-size:60px;color:#8c968f;text-decoration:line-through;text-decoration-thickness:5px">I am having a car.</span></div>
      <div style="display:flex;align-items:center;gap:28px;background:${G.brand};border-radius:30px;padding:40px 44px">${check("#fff", 52)}<span style="font-family:Nunito;font-weight:900;font-size:64px;color:#fff">I have a car.</span></div>
      ${p(`<b style="color:${G.ink}">Why?</b> "Have" for owning something is a state, not an action, so we don't use -ing.`, 36, G.grey)}
    </div>
    ${footer(false, "Follow for one fix a day")}`),

  // 4. A or An
  () => frame(G.brand, `${logo(true)}
    <div style="display:flex;flex-direction:column;gap:36px">
      ${h(`<span style="color:${G.soft}">A</span> or <span style="color:${G.soft}">An</span>?`, 150, "#fff")}
      ${p("It is the <b style=\"color:#fff\">sound</b> that matters, not the letter.", 44, G.muted)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px">
        ${[["an", "hour", "the h is silent"], ["a", "university", "sounds like 'you'"], ["an", "MBA", "sounds like 'em'"], ["a", "one-day course", "sounds like 'won'"]].map(([art, w, why]) => `<div style="background:rgba(255,255,255,.1);border-radius:28px;padding:30px 32px;box-shadow:inset 0 0 0 2px rgba(255,255,255,.18)"><div style="font-family:Nunito;font-weight:900;font-size:54px;color:#fff"><span style="color:${G.soft}">${art}</span> ${w}</div>${p(why, 28, G.muted, "margin-top:6px")}</div>`).join("")}
      </div>
    </div>
    ${footer(true, "Save this · Learn free, link in bio")}`),

  // 5. Since vs For
  () => frame("#fff", `${logo(false)}
    <div style="display:flex;flex-direction:column;gap:40px">
      ${h(`<span style="color:${G.brand}">Since</span> or <span style="color:${G.brand}">For</span>?`, 124, G.ink)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:26px">
        ${[["FOR", "a length of time", ["for 3 years", "for two hours", "for a long time"]], ["SINCE", "a starting point", ["since 2020", "since Monday", "since I was 10"]]].map(([t, d, ex]) => `<div style="background:${G.pale};border-radius:32px;padding:40px 36px;display:flex;flex-direction:column;gap:18px"><div style="font-family:Nunito;font-weight:900;font-size:64px;color:${G.brand}">${t}</div>${p("+ " + d, 32, G.ink, "font-weight:700")}${ex.map((e) => p(e, 34, G.grey)).join("")}</div>`).join("")}
      </div>
      <div style="background:${G.ink};border-radius:30px;padding:34px 40px">${p(`I have lived in Pune <b style="color:${G.soft}">for</b> 3 years, <b style="color:${G.soft}">since</b> 2023.`, 38, "#fff", "font-weight:600")}</div>
    </div>
    ${footer(false, "Save this · Learn free, link in bio")}`),

  // 6. How SpeakUp works
  () => frame(G.pale, `${logo(false)}
    <div style="display:flex;flex-direction:column;gap:30px">
      ${h("How SpeakUp<br>works", 112, G.ink)}
      ${[["Register free", "Takes one minute. Choose your level and goal."], ["One lesson a day", "15 minutes: learn, practise and speak."], ["Join live classes", "Speak with trainers on Google Meet."], ["Get certified", "Finish 12 weeks and earn your certificate."]].map(([t, d], i) => `<div style="display:flex;gap:28px;align-items:center;background:#fff;border-radius:30px;padding:28px 34px;box-shadow:inset 0 0 0 3px ${G.line}"><span style="flex-shrink:0;width:84px;height:84px;border-radius:24px;background:${G.brand};color:#fff;display:grid;place-items:center;font-family:Nunito;font-weight:900;font-size:46px">${i + 1}</span><div>${p(t, 40, G.ink, "font-weight:700")}${p(d, 30, G.grey, "margin-top:4px")}</div></div>`).join("")}
    </div>
    ${footer(false)}`),

  // 7. 15 minutes a day (phone)
  () => frame(G.brand, `${logo(true)}
    <div style="display:flex;gap:50px;align-items:center">
      <div style="flex:1;display:flex;flex-direction:column;gap:30px">
        ${h("One lesson.<br>15 minutes.<br>Every day.", 88, "#fff")}
        ${p("Small daily practice beats one long class a week.", 34, G.muted)}
      </div>
      <div style="flex-shrink:0;width:380px;height:760px;border-radius:60px;background:#0d2a1c;padding:18px;box-shadow:0 30px 60px rgba(0,0,0,.25)">
        <div style="width:100%;height:100%;border-radius:44px;background:#fff;padding:36px 28px;box-sizing:border-box;display:flex;flex-direction:column;gap:20px">
          <div style="display:flex;align-items:center;gap:10px">${mark(40)}<span style="font-family:Nunito;font-weight:900;font-size:26px;color:${G.ink}">Day 4</span></div>
          ${["Warm-up", "Learn", "Try it", "Speak", "Finish"].map((s, i) => `<div style="display:flex;align-items:center;gap:14px;border-radius:18px;padding:16px 18px;background:${i < 3 ? G.pale : "#f4f6f5"}"><span style="width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:${i < 3 ? G.brand : "#fff"};box-shadow:${i < 3 ? "none" : "inset 0 0 0 3px " + G.line}">${i < 3 ? check("#fff", 22) : ""}</span>${p(s, 28, i < 3 ? G.ink : G.grey, "font-weight:700")}</div>`).join("")}
          <div style="margin-top:auto;border-radius:18px;background:${G.brand};padding:18px;text-align:center">${p("Continue", 28, "#fff", "font-weight:700")}</div>
        </div>
      </div>
    </div>
    ${footer(true)}`),

  // 8. Interview phrases
  () => frame("#fff", `${logo(false)}
    <div style="display:flex;flex-direction:column;gap:28px">
      ${p("JOB INTERVIEW ENGLISH", 30, G.brand, "font-weight:700;letter-spacing:.14em")}
      ${h("5 phrases that<br>sound confident", 104, G.ink)}
      ${["I'd be happy to walk you through that.", "One example that comes to mind is...", "That's a great question. Let me think.", "What I learned from that was...", "I'm confident I can add value by..."].map((t, i) => `<div style="display:flex;gap:22px;align-items:flex-start;border-bottom:3px solid ${G.line};padding-bottom:22px"><span style="font-family:Nunito;font-weight:900;font-size:40px;color:${G.brand};width:34px">${i + 1}</span>${p(`"${t}"`, 38, G.ink, "font-weight:600")}</div>`).join("")}
    </div>
    ${footer(false, "Save this for your next interview")}`),

  // 9. Live classes
  () => frame(G.deep, `${logo(true)}
    <div style="display:flex;flex-direction:column;gap:36px">
      ${photoOr(9, 920, 500)}
      ${h("Live online classes<br>with skilled trainers", 86, "#fff")}
      <div style="display:flex;flex-wrap:wrap;gap:16px">${["Speak every class", "Ask anything", "Get corrected kindly"].map((t) => pill(t, "rgba(255,255,255,.12)", "#fff", 28)).join("")}</div>
    </div>
    ${footer(true, "Full plan ₹3,000 · 3 months · link in bio")}`),

  // 10. Pricing / register
  () => frame(G.pale, `${logo(false)}
    <div style="display:flex;flex-direction:column;gap:30px">
      ${h(`Every lesson is<br><span style="color:${G.brand}">free</span> until<br>28 Feb 2027`, 112, G.ink)}
      ${[["Free", "₹0", "All lessons, tests and grammar topics"], ["Single week", "₹1,000", "Unlock one week, keep it forever"], ["Full plan", "₹3,000", "Live classes, every chapter, certificate"]].map(([t, pr, d], i) => `<div style="display:flex;align-items:center;gap:24px;border-radius:30px;padding:30px 36px;background:${i === 2 ? G.brand : "#fff"};box-shadow:${i === 2 ? "none" : "inset 0 0 0 3px " + G.line}"><div style="flex:1">${p(t, 38, i === 2 ? "#fff" : G.ink, "font-weight:700")}${p(d, 28, i === 2 ? G.muted : G.grey, "margin-top:4px")}</div><span style="font-family:Nunito;font-weight:900;font-size:56px;color:${i === 2 ? "#fff" : G.brand}">${pr}</span></div>`).join("")}
      <div>${pill("Register free · link in bio", G.ink, "#fff", 34)}</div>
    </div>
    ${footer(false, "100% online · learn from anywhere")}`),
];

const html = (body) => `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&family=Inter:wght@500;600;700&display=swap" rel="stylesheet"><style>html,body{margin:0}*{box-sizing:border-box}</style></head><body>${body}</body></html>`;
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
for (let i = 0; i < posts.length; i++) {
  const page = await b.newPage({ viewport: { width: W, height: H } });
  await page.setContent(html(posts[i]()), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const over = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
  const out = path.join(DIR, `post-${String(i + 1).padStart(2, "0")}.png`);
  await page.screenshot({ path: out });
  console.log(path.basename(out), over > 0 ? `WARNING: content ${over}px too tall` : "ok");
  await page.close();
}
await b.close();
