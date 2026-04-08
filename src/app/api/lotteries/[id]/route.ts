import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireOrganizer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lotteryUpdateSchema } from "@/lib/validation";
import { logAudit } from "@/lib/audit";
import { refreshLotteryScheduleById, refreshLotterySchedule } from "@/lib/lottery-schedule";

async function getOwnedLottery(id: string, organizerId: string) {
  return prisma.lottery.findFirst({
    where: { id, organizerId },
    include: {
      _count: { select: { entries: true, winners: true } },
    },
  });
}

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { profile } = await requireOrganizer();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const found = await getOwnedLottery(id, profile.id);
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await refreshLotterySchedule(found);
  const lottery = await prisma.lottery.findFirst({
    where: { id, organizerId: profile.id },
    include: { _count: { select: { entries: true, winners: true } } },
  });
  return NextResponse.json({ lottery });
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { profile } = await requireOrganizer();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const existing = await getOwnedLottery(id, profile.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = lotteryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const update: Prisma.LotteryUpdateInput = {};
  if (data.title !== undefined) update.title = data.title;
  if (data.description !== undefined) update.description = data.description;
  if (data.imageUrl !== undefined) update.imageUrl = data.imageUrl;
  if (data.winnerCount !== undefined) update.winnerCount = data.winnerCount;
  if (data.status !== undefined) update.status = data.status;
  if (data.collectInstagram !== undefined) update.collectInstagram = data.collectInstagram;
  if (data.collectPaypal !== undefined) update.collectPaypal = data.collectPaypal;
  if (data.shippingPolicy !== undefined) update.shippingPolicy = data.shippingPolicy;
  if (data.allowedCountries !== undefined) update.allowedCountries = data.allowedCountries;
  if (data.blockedCountries !== undefined) update.blockedCountries = data.blockedCountries;
  if (data.opensAt !== undefined) {
    update.opensAt =
      data.opensAt && data.opensAt !== "" ? new Date(data.opensAt) : null;
  }
  if (data.closesAt !== undefined) {
    update.closesAt =
      data.closesAt && data.closesAt !== "" ? new Date(data.closesAt) : null;
  }

  const nextImageUrl =
    data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl;
  if (data.status === "OPEN" && !String(nextImageUrl ?? "").trim()) {
    return NextResponse.json(
      { error: "Add an image before opening entries." },
      { status: 400 }
    );
  }

  await prisma.lottery.update({
    where: { id },
    data: update,
  });
  await refreshLotteryScheduleById(id);
  await logAudit(profile.id, "lottery.update", {
    lotteryId: id,
    metadata: { ...data } as Record<string, unknown>,
  });
  const lottery = await prisma.lottery.findFirst({
    where: { id, organizerId: profile.id },
    include: { _count: { select: { entries: true, winners: true } } },
  });
  if (!lottery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ lottery });
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { profile } = await requireOrganizer();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const existing = await getOwnedLottery(id, profile.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await logAudit(profile.id, "lottery.delete", {
    lotteryId: id,
    metadata: { title: existing.title, slug: existing.slug },
  });
  await prisma.lottery.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
