import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export async function purgeLotteryEntrantData(
  lotteryId: string,
  actorUserId: string,
  reason: "manual" | "retention_job"
) {
  const [entriesDeleted, winnersDeleted, blockedAttemptsDeleted] = await prisma.$transaction(async (tx) => {
    const [entriesCount, winnersCount, blockedAttemptsCount] = await Promise.all([
      tx.entry.count({ where: { lotteryId } }),
      tx.winner.count({ where: { lotteryId } }),
      tx.blockedEntryAttempt.count({ where: { lotteryId } }),
    ]);

    // Winner rows are removed by FK cascade from Entry delete, but explicit delete keeps behavior obvious.
    await tx.winner.deleteMany({ where: { lotteryId } });
    await tx.entry.deleteMany({ where: { lotteryId } });
    await tx.blockedEntryAttempt.deleteMany({ where: { lotteryId } });

    return [entriesCount, winnersCount, blockedAttemptsCount] as const;
  });

  await logAudit(actorUserId, "lottery.entries.purge", {
    lotteryId,
    metadata: {
      reason,
      entriesDeleted,
      winnersDeleted,
      blockedAttemptsDeleted,
    },
  });

  return { entriesDeleted, winnersDeleted, blockedAttemptsDeleted };
}
