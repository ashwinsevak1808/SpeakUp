import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Runs before /learn, /admin and the API: keeps the Supabase session cookie fresh,
 * and lets only trainers and the owner into /admin. (The database checks roles again on every query.)
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const sb = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await sb.auth.getUser();

  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin")) {
    const to = (p: string) => { const u = request.nextUrl.clone(); u.pathname = p; u.search = p === "/login" ? `?next=${encodeURIComponent(path)}` : ""; const r = NextResponse.redirect(u); response.cookies.getAll().forEach((c) => r.cookies.set(c)); return r; };
    if (!user) return to("/login");
    const { data } = await sb.from("profiles").select("role").eq("id", user.id).single();
    if (data?.role !== "trainer" && data?.role !== "owner") return to("/learn");
  }
  return response;
}

export const config = { matcher: ["/learn/:path*", "/admin/:path*", "/api/:path*", "/auth/:path*"] };
