/* Speech checking helpers (pure, so they can be tested). The browser turns speech into text;
   we only compare that text to what was expected. No audio is stored or sent by us. */
const clean = (s: string) => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9'\s]/g, " ").replace(/\s+/g, " ").trim();
const words = (s: string) => clean(s).split(" ").filter(Boolean);
const NUM: Record<string, string> = { "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine", "10": "ten" };
const norm = (w: string) => (NUM[w] ?? w).replace(/^i'm$/, "i am").replace(/^it's$/, "it is");
const toks = (s: string) => words(s).flatMap((w) => norm(w).split(" "));

/** How much of the target sentence was said, in order (0 to 1). Uses the longest common word sequence. */
export function similarity(target: string, said: string) {
  const a = toks(target), b = toks(said);
  if (!a.length) return 1;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[a.length][b.length] / a.length;
}
/** Each target word marked heard or missed, to show the student where to improve. */
export function diffWords(target: string, said: string) {
  const heard = new Set(toks(said));
  return target.split(/\s+/).map((w) => ({ w, ok: toks(w).every((t) => heard.has(t)) }));
}
export const SAY_PASS = 0.75;

export type SpeakCheck = { minWords: number; mustInclude?: string[] };
export function checkSpeech(transcript: string, check: SpeakCheck | undefined) {
  const count = words(transcript).length;
  const text = " " + clean(transcript) + " ";
  const targets = (check?.mustInclude ?? []).map((t) => ({ t, ok: text.includes(" " + clean(t)) || text.includes(clean(t)) }));
  const needMatches = Math.min(2, targets.length);
  const matched = targets.filter((x) => x.ok).length;
  const minWords = check?.minWords ?? 10;
  return { count, minWords, enough: count >= minWords, targets, matched, needMatches, pass: count >= minWords && matched >= needMatches };
}
