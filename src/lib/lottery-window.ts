import type { LotteryStatus } from "@prisma/client";

export function isLotteryAcceptingEntries(status: LotteryStatus, opensAt: Date | null, closesAt: Date | null): boolean {
  if (status !== "OPEN") return false;
  const now = Date.now();
  if (opensAt && opensAt.getTime() > now) return false;
  if (closesAt && closesAt.getTime() < now) return false;
  return true;
}
