import { NextResponse } from "next/server";
import { requireOrganizer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lotteryCreateSchema } from "@/lib/validation";
import { generateLotterySlug } from "@/lib/slug";
import { logAudit } from "@/lib/audit";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

export async function GET() {
  const { profile } = await requireOrganizer();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const lotteries = await prisma.lottery.findMany({
    where: { organizerId: profile.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { entries: true, winners: true } },
    },
  });
  return NextResponse.json({ lotteries });
}

export async function POST(request: Request) {
  const { profile } = await requireOrganizer();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rl = checkRateLimit(rateLimitKey(profile.id, "create-lottery"));
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests", retryAfterSec: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec ?? 60) } }
    );
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = lotteryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const {
    title,
    description,
    imageUrl,
    opensAt,
    closesAt,
    winnerCount,
    collectInstagram,
    collectPaypal,
  } = parsed.data;
  const opens = opensAt && opensAt !== "" ? new Date(opensAt) : null;
  const closes = closesAt && closesAt !== "" ? new Date(closesAt) : null;

  let slug = generateLotterySlug(title);
  for (let i = 0; i < 5; i++) {
    const existing = await prisma.lottery.findUnique({ where: { slug } });
    if (!existing) break;
    slug = generateLotterySlug(`${title}-${i}`);
  }

  const lottery = await prisma.lottery.create({
    data: {
      organizerId: profile.id,
      title,
      description: description ?? "",
      imageUrl: imageUrl ?? null,
      slug,
      opensAt: opens,
      closesAt: closes,
      winnerCount,
      collectInstagram,
      collectPaypal,
      status: "DRAFT",
    },
  });
  await logAudit(profile.id, "lottery.create", { lotteryId: lottery.id, metadata: { slug } });
  return NextResponse.json({ lottery });
}
