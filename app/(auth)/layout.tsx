import Link from "next/link";
import { Logo } from "@/components/Navbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-theme grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-accent-50 via-white to-accent-100/70 p-12 lg:flex">
        <Logo />
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight text-brand-900">Practise English every day. Get certified in 3 months.</h2>
          <ul className="mt-8 space-y-3 text-brand-600">
            {["Live online classes with real trainers", "Grammar practice with instant feedback", "Track your streak and progress", "Certificate of Completion"].map((t) => (
              <li key={t} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />{t}</li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-brand-500">Mumbai · Online</p>
      </div>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-14">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo /></div>
          {children}
          <p className="mt-8 rounded-md bg-brand-50 p-3 text-xs leading-relaxed text-brand-800">
            Demo mode: accounts are saved only in this browser for now. Cloud accounts will be connected before launch.
          </p>
          <Link href="/" className="mt-6 inline-block text-sm text-muted hover:text-brand-800">← Back to website</Link>
        </div>
      </div>
    </div>
  );
}
