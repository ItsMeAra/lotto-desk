import type { Lottery, LotteryStatus } from "@prisma/client";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

/** Dashboard copy: true when draft has a start time still in the future. */
export function isDraftScheduledForFuture(status: LotteryStatus, opensAt: Date | null): boolean {
  if (status !== "DRAFT" || !opensAt) return false;
  return opensAt.getTime() > Date.now();
}

/**
 * Applies time-based status changes:
 * - DRAFT → OPEN when opensAt has passed (or is now) and an image exists.
 * - OPEN → CLOSED when closesAt has passed (or is now).
 */
export async function refreshLotterySchedule(lottery: Lottery): Promise<Lottery> {
  const now = Date.now();
  let current = lottery;

  if (current.status === "DRAFT" && current.opensAt) {
    if (current.opensAt.getTime() <= now && current.imageUrl?.trim()) {
      current = await prisma.lottery.update({
        where: { id: current.id },
        data: { status: "OPEN" },
      });
    }
  }

  if (current.status === "OPEN" && current.closesAt && current.closesAt.getTime() <= now) {
    const closed = await prisma.lottery.update({
      where: { id: current.id },
      data: { status: "CLOSED" },
    });
    await logAudit(current.organizerId, "lottery.auto_close", {
      lotteryId: current.id,
      metadata: { closesAt: current.closesAt.toISOString() },
    });
    return closed;
  }

  return current;
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
