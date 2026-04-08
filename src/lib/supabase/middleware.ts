import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Clears Supabase auth cookies when the session cannot be refreshed (stale / missing refresh token). */
function clearSupabaseAuthCookies(response: NextResponse, request: NextRequest) {
  for (const cookie of request.cookies.getAll()) {
    if (!cookie.name.startsWith("sb-")) continue;
    response.cookies.set(cookie.name, "", {
      path: "/",
      maxAge: 0,
    });
  }
}

function isStaleSessionAuthError(message: string | undefined, code: string | undefined) {
  if (code === "refresh_token_not_found") return true;
  const m = (message ?? "").toLowerCase();
  return m.includes("refresh token") || m.includes("invalid refresh");
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return supabaseResponse;
  }
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
        Object.entries(headers).forEach(([key, value]) => {
          supabaseResponse.headers.set(key, value);
        });
      },
    },
  });

  const { error } = await supabase.auth.getUser();

  if (error && isStaleSessionAuthError(error.message, error.code)) {
    clearSupabaseAuthCookies(supabaseResponse, request);
  }

  return supabaseResponse;
}
