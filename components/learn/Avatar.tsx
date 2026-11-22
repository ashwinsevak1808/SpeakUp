"use client";
import { cn } from "@/lib/utils";

/** Illustrated avatars. Add one by adding a line: background pair, skin, hair, shirt, hair style. */
type Look = { bg: [string, string]; skin: string; hair: string; shirt: string; style: "short" | "long" | "bun" | "curly" | "cap" | "bald" };
export const AVATARS: Record<string, Look> = {
  sun: { bg: ["#fde68a", "#fbbf24"], skin: "#c68642", hair: "#1f1308", shirt: "#4f46e5", style: "short" },
  sky: { bg: ["#bae6fd", "#38bdf8"], skin: "#f1c27d", hair: "#6b3f1d", shirt: "#0f766e", style: "long" },
  rose: { bg: ["#fecdd3", "#fb7185"], skin: "#8d5524", hair: "#0b0b0b", shirt: "#7c3aed", style: "bun" },
  mint: { bg: ["#bbf7d0", "#4ade80"], skin: "#e0ac69", hair: "#2b1b0e", shirt: "#be123c", style: "curly" },
  lilac: { bg: ["#ddd6fe", "#a78bfa"], skin: "#ffdbac", hair: "#b45309", shirt: "#1d4ed8", style: "short" },
  peach: { bg: ["#fed7aa", "#fb923c"], skin: "#a0673a", hair: "#111111", shirt: "#0e7490", style: "cap" },
  night: { bg: ["#c7d2fe", "#6366f1"], skin: "#d9a066", hair: "#3b2412", shirt: "#db2777", style: "long" },
  stone: { bg: ["#e2e8f0", "#94a3b8"], skin: "#f5cba7", hair: "#4a4a4a", shirt: "#15803d", style: "bald" },
};
export const AVATAR_IDS = Object.keys(AVATARS);

const initials = (n: string) => n.split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

function Illustration({ id, look }: { id: string; look: Look }) {
  const { bg, skin, hair, shirt, style } = look;
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <defs><linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={bg[0]} /><stop offset="1" stopColor={bg[1]} /></linearGradient></defs>
      <rect width="100" height="100" fill={`url(#g-${id})`} />
      {style === "long" && <path d="M26 46c0-20 12-30 24-30s24 10 24 30v30H26z" fill={hair} />}
      {style === "bun" && <circle cx="50" cy="15" r="9" fill={hair} />}
      <path d="M12 104c2-22 16-30 38-30s36 8 38 30z" fill={shirt} />
      <rect x="43" y="60" width="14" height="16" rx="6" fill={skin} />
      <ellipse cx="50" cy="46" rx="18" ry="21" fill={skin} />
      {style === "short" && <path d="M31 44c-2-18 8-27 19-27s21 9 19 27c-3-8-9-12-19-12s-16 4-19 12z" fill={hair} />}
      {style === "long" && <path d="M31 44c-2-18 8-27 19-27s21 9 19 27c-4-7-10-11-19-11s-15 4-19 11z" fill={hair} />}
      {style === "bun" && <path d="M31 44c-2-16 8-26 19-26s21 10 19 26c-3-8-9-11-19-11s-16 3-19 11z" fill={hair} />}
      {style === "curly" && <g fill={hair}><circle cx="34" cy="32" r="8" /><circle cx="44" cy="25" r="9" /><circle cx="56" cy="25" r="9" /><circle cx="66" cy="32" r="8" /><circle cx="50" cy="30" r="9" /></g>}
      {style === "cap" && <g><path d="M30 38c0-14 9-21 20-21s20 7 20 21z" fill="#1e293b" /><rect x="28" y="36" width="44" height="5" rx="2.5" fill="#0f172a" /></g>}
      <circle cx="43" cy="47" r="2" fill="#1f2937" /><circle cx="57" cy="47" r="2" fill="#1f2937" />
      <path d="M43 56c3 3 11 3 14 0" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** The student's picture: their photo, else the chosen illustration, else their initials. */
export function Avatar({ name, photo, avatar, size = 32, className }: { name: string; photo?: string; avatar?: string; size?: number; className?: string }) {
  const look = avatar ? AVATARS[avatar] : undefined;
  return (
    <span style={{ width: size, height: size, fontSize: Math.max(10, size * 0.36) }} className={cn("grid shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--accent-subtle)] font-semibold text-[var(--accent-text)]", className)}>
      {photo ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={photo} alt="" className="h-full w-full object-cover" />
        : look ? <Illustration id={avatar!} look={look} />
        : initials(name)}
    </span>
  );
}

/** Downscale a chosen image to a small square JPEG so it fits in local storage. */
export function fileToAvatar(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(img.width, img.height); const c = document.createElement("canvas"); c.width = c.height = size;
      c.getContext("2d")!.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url); resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read that image.")); };
    img.src = url;
  });
}
