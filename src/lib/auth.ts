import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Ensures Profile row exists for Supabase auth user. */
export async function ensureProfile(user: { id: string; email?: string | null }) {
  const email = user.email ?? "";
  return prisma.profile.upsert({
    where: { id: user.id },
    create: { id: user.id, email },
    update: email ? { email } : {},
  });
}

export async function requireOrganizer() {
  const user = await getSessionUser();
  if (!user) return { user: null, profile: null as Awaited<ReturnType<typeof ensureProfile>> | null };
  const profile = await ensureProfile(user);
  return { user, profile };
}
