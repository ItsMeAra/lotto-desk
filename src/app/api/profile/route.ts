import { NextResponse } from "next/server";
import { requireOrganizer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profilePatchSchema } from "@/lib/validation";

export async function PATCH(request: Request) {
  const { profile } = await requireOrganizer();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = profilePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const trimmed = parsed.data.displayName.trim();
  const displayName = trimmed === "" ? null : trimmed;

  const updated = await prisma.profile.update({
    where: { id: profile.id },
    data: { displayName },
    select: { id: true, email: true, displayName: true },
  });

  return NextResponse.json({ profile: updated });
}
