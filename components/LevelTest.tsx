"use client";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LEVELS, QUIZ } from "@/lib/data";
import { cn } from "@/lib/utils";
import { LeadForm, type Field } from "./LeadForm";

export function LevelTest() {
  const [step, setStep] = useState(-1); // -1 intro, 0..n-1 questions, n result
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const n = QUIZ.length;

  const score = answers.filter((a, i) => a === QUIZ[i].answer).length;
  const level = LEVELS.find((l) => score >= l.min && score <= l.max)!;

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setTimeout(() => { setAnswers((a) => [...a, i]); setPicked(null); setStep((s) => s + 1); }, 700);
  };
  const reset = () => { setAnswers([]); setPicked(null); setStep(-1); };

  const reportFields: Field[] = [
    { name: "name", label: "Your name", half: true, minLength: 2 },
    { name: "phone", label: "Mobile number", type: "tel", half: true },
  ];

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-line bg-white shadow-sm">
      {step >= 0 && step < n && (
        <div className="h-1.5 bg-brand-100"><div className="h-full bg-brand-600 transition-all duration-500" style={{ width: `${(step / n) * 100}%` }} /></div>
      )}
      <div className="p-6 sm:p-10">
        {step === -1 && (
          <div>
            <h2 className="font-display text-3xl font-bold text-brand-900">Check your English level</h2>
            <p className="mt-3 text-lg text-muted">{n} short multiple-choice questions. It takes about 3 minutes and needs no sign-up. You will get your level and a recommendation straight away.</p>
            <button onClick={() => setStep(0)} className="mt-8 rounded-md bg-brand-700 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-brand-800">Start the test</button>
          </div>
        )}

        {step >= 0 && step < n && (
          <div key={step}>
            <div className="mb-3 flex items-center justify-between text-sm font-medium">
              <span className="text-brand-600">Question {step + 1} of {n}</span>
              <span className="text-muted">{Math.round((step / n) * 100)}% complete</span>
            </div>
            <h2 className="mb-7 font-display text-2xl font-bold leading-snug text-brand-900">{QUIZ[step].q}</h2>
            <div className="grid gap-3" role="group" aria-label="Answer options">
              {QUIZ[step].options.map((o, i) => {
                const isPicked = picked === i;
                const isRight = picked !== null && i === QUIZ[step].answer;
                return (
                  <button
                    key={o}
                    data-option
                    onClick={() => choose(i)}
                    disabled={picked !== null}
                    className={cn(
                      "flex items-center gap-4 rounded-md border px-4 py-3.5 text-left text-base font-medium transition-colors",
                      picked === null && "border-line text-ink hover:border-brand-600 hover:bg-brand-50",
                      isRight && "border-brand-600 bg-brand-50 text-brand-900",
                      isPicked && !isRight && "border-slate-400 bg-slate-100 text-slate-700",
                      picked !== null && !isPicked && !isRight && "border-line opacity-50",
                    )}
                  >
                    <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold", isRight ? "bg-brand-600 text-white" : isPicked ? "bg-slate-500 text-white" : "bg-brand-100 text-brand-800")}>
                      {isRight ? <Check className="h-4 w-4" /> : isPicked ? <X className="h-4 w-4" /> : String.fromCharCode(65 + i)}
                    </span>
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === n && (
          <div data-result>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">Your level</p>
            <h2 className="mt-1 font-display text-4xl font-bold text-brand-900">{level.name}</h2>
            <div className="my-5 flex max-w-xs items-center gap-4">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-100"><div className="h-full rounded-full bg-brand-600" style={{ width: `${(score / n) * 100}%` }} /></div>
              <span className="font-display font-bold text-brand-900">{score} / {n}</span>
            </div>
            <p className="text-lg text-muted">{level.text}</p>

            <div className="mt-8 rounded-lg border border-line bg-brand-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Your next step</p>
              <div className="mt-1 font-display text-xl font-bold text-brand-900">Register free and choose “{level.pick}”</div>
              <div className="text-sm text-muted">All lessons are free until 28 February 2027</div>
              <Link href="/signup" className="mt-4 inline-block rounded-md bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800">Register for free</Link>
            </div>

            <div className="mt-10 border-t border-line pt-8">
              <h3 className="font-display text-xl font-bold text-brand-900">Get a free detailed report</h3>
              <p className="mb-6 mt-1 text-sm text-muted">Leave your number and a trainer will call you with personal tips.</p>
              <LeadForm kind={`level-test-${level.name.toLowerCase()}-${score}of${n}`} fields={reportFields} submitLabel="Send me my report" successText="Thank you. A trainer will call you soon with your personalised plan." />
            </div>
            <button onClick={reset} className="mt-8 text-sm font-semibold text-brand-700 underline underline-offset-4">Retake the test</button>
          </div>
        )}
      </div>
    </div>
  );
}
