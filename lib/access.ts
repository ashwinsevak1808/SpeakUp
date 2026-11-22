/**
 * WHO CAN OPEN WHAT. Edit the numbers here; every page follows them.
 *
 *  - Until FREE_UNTIL, every chapter, test and grammar lesson is free. Only live classes need the plan.
 *  - After that, ALWAYS_FREE_WEEKS stay free; each other week can be unlocked alone for WEEK_PRICE,
 *    or everything (live classes + all weeks for 3 months + certificate) with the full plan (PLAN in learn-data.ts).
 *  - The certificate needs the full plan.
 * If you change WEEK_PRICE or the plan price, also run `npm run db:payments` (the database charges the price).
 */
import type { Account } from "./auth";

export const FREE_UNTIL = new Date("2027-02-28T23:59:59+05:30"); // EDIT: end of the free period (India time)
export const FREE_UNTIL_LABEL = "28 February 2027";
export const ALWAYS_FREE_WEEKS = 2;   // EDIT: weeks that stay free after the free period (2 of 12, the rest lock)
export const WEEK_PRICE = 1000;       // EDIT: ₹ to unlock one more week

type Who = Pick<Account, "enrolled" | "unlockedWeeks"> | null | undefined;

/** Still inside the free period? */
export const freePeriod = (now: Date = new Date()) => +now <= +FREE_UNTIL;
/** Has the full plan right now (live classes + everything). */
export const hasPlan = (u: Who) => !!u?.enrolled;
/** Can this person open a week of the path? */
export const weekOpen = (u: Who, week: number, now: Date = new Date()) =>
  freePeriod(now) || week <= ALWAYS_FREE_WEEKS || hasPlan(u) || !!u?.unlockedWeeks?.includes(week);
/** The same check, ready to pass to statusOf(). */
export const opener = (u: Who) => (week: number) => weekOpen(u, week);
