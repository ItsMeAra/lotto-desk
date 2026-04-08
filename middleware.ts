import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

/** Limit to routes that need Supabase cookie refresh — skips public pages & static for faster nav. */
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/auth/:path*", "/logout"],
};
