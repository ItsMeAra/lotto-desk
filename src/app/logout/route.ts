import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const origin = new URL(request.url).origin;
  // 303 so the browser follows with GET; 302 after POST can repeat POST to /login → 405.
  return NextResponse.redirect(`${origin}/login`, 303);
}
