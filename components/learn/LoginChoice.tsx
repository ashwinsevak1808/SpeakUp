"use client";
/** Login page body: choose "Email code" (no password) or "Password". ?method=code opens the code tab. */
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AuthForm } from "./AuthForm";
import { CodeLogin } from "./CodeLogin";

export function LoginChoice() {
  const params = useSearchParams();
  const [method, setMethod] = useState<"password" | "code">(params.get("method") === "code" ? "code" : "password");
  return (
    <>
      <div role="tablist" aria-label="How do you want to log in?" className="mb-6 grid grid-cols-2 rounded-lg bg-brand-100/60 p-1 shadow-[inset_0_0_0_1px_var(--border)]">
        {([["password", "Password"], ["code", "Email code"]] as const).map(([id, label]) => (
          <button key={id} role="tab" type="button" aria-selected={method === id} onClick={() => setMethod(id)}
            className={cn("rounded-md py-2 text-sm font-semibold transition-colors", method === id ? "bg-white text-brand-900 shadow-sm" : "text-muted hover:text-brand-900")}>{label}</button>
        ))}
      </div>
      {method === "password" ? <AuthForm mode="login" /> : <CodeLogin />}
    </>
  );
}
