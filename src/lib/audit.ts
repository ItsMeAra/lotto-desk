import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function logAudit(
  userId: string,
  action: string,
  options?: { lotteryId?: string; metadata?: Record<string, unknown> }
) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      lotteryId: options?.lotteryId,
      metadata: options?.metadata as Prisma.InputJsonValue | undefined,
    },
  });
}
