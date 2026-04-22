import { NextResponse } from "next/server";
import { requireOrganizer } from "@/lib/auth";
import { purgeLotteryEntrantData } from "@/lib/entry-retention";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { profile } = await requireOrganizer();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const lottery = await prisma.lottery.findFirst({
    where: { id, organizerId: profile.id },
  });
  if (!lottery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const entries = await prisma.entry.findMany({
    where: { lotteryId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ entries });
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { profile } = await requireOrganizer();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const lottery = await prisma.lottery.findFirst({
    where: { id, organizerId: profile.id },
  });
  if (!lottery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (lottery.status !== "DRAWN") {
    return NextResponse.json(
      { error: "Entrant data can only be purged after winners are drawn." },
      { status: 400 }
    );
  }

  const summary = await purgeLotteryEntrantData(id, profile.id, "manual");
  return NextResponse.json({ ok: true, summary });
}
