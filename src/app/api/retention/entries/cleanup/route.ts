import { NextResponse } from "next/server";
import { purgeLotteryEntrantData } from "@/lib/entry-retention";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const expected = process.env.RETENTION_JOB_SECRET;
  if (!expected) {
    return NextResponse.json({ error: "Missing RETENTION_JOB_SECRET" }, { status: 500 });
  }
  if (auth !== `Bearer ${expected}`) {
    return unauthorized();
  }

  const retentionDaysRaw = Number(process.env.ENTRY_RETENTION_DAYS ?? 60);
  const retentionDays = Number.isFinite(retentionDaysRaw) && retentionDaysRaw > 0 ? retentionDaysRaw : 60;
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

  const lotteries = await prisma.lottery.findMany({
    where: {
      status: "DRAWN",
      updatedAt: { lt: cutoff },
      entries: { some: {} },
    },
    select: { id: true, organizerId: true },
    orderBy: { updatedAt: "asc" },
    take: 200,
  });

  let lotteriesProcessed = 0;
  let entriesDeleted = 0;
  let winnersDeleted = 0;
  let blockedAttemptsDeleted = 0;

  for (const lottery of lotteries) {
    const result = await purgeLotteryEntrantData(lottery.id, lottery.organizerId, "retention_job");
    lotteriesProcessed += 1;
    entriesDeleted += result.entriesDeleted;
    winnersDeleted += result.winnersDeleted;
    blockedAttemptsDeleted += result.blockedAttemptsDeleted;
  }

  return NextResponse.json({
    ok: true,
    retentionDays,
    cutoffIso: cutoff.toISOString(),
    lotteriesProcessed,
    entriesDeleted,
    winnersDeleted,
    blockedAttemptsDeleted,
  });
}
