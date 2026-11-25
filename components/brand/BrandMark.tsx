import { cn } from "@/lib/utils";

/**
 * The SpeakUp mark ("Up"): a speech bubble with an up arrow. Masters in /brand/*.svg.
 * color = green bubble, white arrow (light backgrounds). white = white bubble, green arrow (green/dark backgrounds).
 */
const BUBBLE = "M74 30 H126 C151.4 30 172 50.6 172 76 V112 C172 137.4 151.4 158 126 158 H92 L62 182 C57.5 185.6 51 182 52.2 176.4 L56 153 C39 145 28 129.6 28 112 V76 C28 50.6 48.6 30 74 30 Z";
const ARROW = "M100 56 L134 94 H113 V128 H87 V94 H66 Z";

export function BrandMark({ variant = "color", className, title }: { variant?: "color" | "white"; className?: string; title?: string }) {
  const white = variant === "white";
  return (
    <svg viewBox="0 0 200 200" className={cn("shrink-0", className)} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {!white && <path transform="translate(0 8)" d={BUBBLE} fill="#124a31" />}
      <path d={BUBBLE} fill={white ? "#ffffff" : "#1f7249"} />
      <path d={ARROW} fill={white ? "#1f7249" : "#ffffff"} stroke={white ? "#1f7249" : "#ffffff"} strokeWidth={10} strokeLinejoin="round" />
    </svg>
  );
}

/** The wordmark: "Speak" in ink, "Up" in green, Nunito Black. */
export function Wordmark({ light, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("font-brand font-black tracking-[-0.02em] leading-none", light ? "text-white" : "text-[#131a16]", className)}>
      Speak<span className={light ? "text-[#8fd3ad]" : "text-[#1f7249]"}>Up</span>
    </span>
  );
}
