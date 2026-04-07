import { NextResponse } from "next/server";
import { requireOrganizer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { refreshLotterySchedule } from "@/lib/lottery-schedule";

export async function POST(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { profile } = await requireOrganizer();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const found = await prisma.lottery.findFirst({
    where: { id, organizerId: profile.id },
  });
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const lottery = await refreshLotterySchedule(found);
  if (lottery.status !== "OPEN") {
    return NextResponse.json({ error: "Lottery must be OPEN to close" }, { status: 400 });
  }
  const updated = await prisma.lottery.update({
    where: { id },
    data: { status: "CLOSED" },
  });
  await logAudit(profile.id, "lottery.close", { lotteryId: id });
  return NextResponse.json({ lottery: updated });
}
