import { randomInt } from "crypto";
import { NextResponse } from "next/server";
import { requireOrganizer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { drawWinnersSchema } from "@/lib/validation";
import { logAudit } from "@/lib/audit";

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { profile } = await requireOrganizer();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const lottery = await prisma.lottery.findFirst({
    where: { id, organizerId: profile.id },
    include: {
      winners: { select: { entryId: true } },
    },
  });
  if (!lottery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (lottery.status !== "CLOSED") {
    return NextResponse.json({ error: "Close the lottery before drawing winners" }, { status: 400 });
  }
  if (lottery.winners.length > 0) {
    return NextResponse.json({ error: "Winners already drawn. Clear winners first (not supported in MVP)." }, { status: 400 });
  }

  let body: unknown = {};
  try {
    const text = await request.text();
    if (text) body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = drawWinnersSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const count = parsed.data.count ?? lottery.winnerCount;

  const entries = await prisma.entry.findMany({
    where: { lotteryId: id },
    select: { id: true },
  });
  if (entries.length === 0) {
    return NextResponse.json({ error: "No entries to draw from" }, { status: 400 });
  }
  const pick = Math.min(count, entries.length);
  const pool = entries.map((e) => e.id);
  shuffleInPlace(pool);
  const chosen = pool.slice(0, pick);

  await prisma.$transaction([
    prisma.winner.createMany({
      data: chosen.map((entryId) => ({ lotteryId: id, entryId })),
    }),
    prisma.lottery.update({
      where: { id },
      data: { status: "DRAWN" },
    }),
  ]);

  await logAudit(profile.id, "lottery.draw", {
    lotteryId: id,
    metadata: { winnerCount: pick },
  });

  const winners = await prisma.winner.findMany({
    where: { lotteryId: id },
    include: { entry: true },
  });
  return NextResponse.json({ winners });
}
