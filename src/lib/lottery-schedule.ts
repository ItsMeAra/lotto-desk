import type { Lottery, LotteryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Dashboard copy: true when draft has a start time still in the future. */
export function isDraftScheduledForFuture(status: LotteryStatus, opensAt: Date | null): boolean {
  if (status !== "DRAFT" || !opensAt) return false;
  return opensAt.getTime() > Date.now();
}

/**
 * If a lottery is DRAFT, has a start time in the past (or now), and has an image,
 * transition to OPEN so entries can begin without a manual publish click.
 */
export async function refreshLotterySchedule(lottery: Lottery): Promise<Lottery> {
  if (lottery.status !== "DRAFT") return lottery;
  if (!lottery.opensAt) return lottery;
  const now = Date.now();
  if (lottery.opensAt.getTime() > now) return lottery;
  if (!lottery.imageUrl?.trim()) return lottery;
  return prisma.lottery.update({
    where: { id: lottery.id },
    data: { status: "OPEN" },
  });
}

export async function refreshLotteryScheduleBySlug(slug: string): Promise<Lottery | null> {
  const lottery = await prisma.lottery.findUnique({ where: { slug } });
  if (!lottery) return null;
  return refreshLotterySchedule(lottery);
}

export async function refreshLotteryScheduleById(id: string): Promise<Lottery | null> {
  const lottery = await prisma.lottery.findUnique({ where: { id } });
  if (!lottery) return null;
  return refreshLotterySchedule(lottery);
}
