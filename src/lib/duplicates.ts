import { prisma } from "@/lib/prisma";

export type DuplicateFlag = "duplicate_email" | "duplicate_paypal" | "duplicate_instagram";

export async function getEntryDuplicateFlags(
  lotteryId: string
): Promise<Map<string, DuplicateFlag[]>> {
  const entries = await prisma.entry.findMany({
    where: { lotteryId },
    select: {
      id: true,
      normEmail: true,
      normPaypal: true,
      normInstagram: true,
    },
  });

  const emailCount = new Map<string, number>();
  const paypalCount = new Map<string, number>();
  const igCount = new Map<string, number>();

  for (const e of entries) {
    emailCount.set(e.normEmail, (emailCount.get(e.normEmail) ?? 0) + 1);
    if (e.normPaypal) {
      paypalCount.set(e.normPaypal, (paypalCount.get(e.normPaypal) ?? 0) + 1);
    }
    if (e.normInstagram) {
      igCount.set(e.normInstagram, (igCount.get(e.normInstagram) ?? 0) + 1);
    }
  }

  const result = new Map<string, DuplicateFlag[]>();
  for (const e of entries) {
    const flags: DuplicateFlag[] = [];
    if ((emailCount.get(e.normEmail) ?? 0) > 1) flags.push("duplicate_email");
    if (e.normPaypal && (paypalCount.get(e.normPaypal) ?? 0) > 1) {
      flags.push("duplicate_paypal");
    }
    if (e.normInstagram && (igCount.get(e.normInstagram) ?? 0) > 1) {
      flags.push("duplicate_instagram");
    }
    if (flags.length) result.set(e.id, flags);
  }
  return result;
}
