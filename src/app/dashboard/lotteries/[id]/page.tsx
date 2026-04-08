import Link from "next/link";
import { notFound } from "next/navigation";
import { LotteryEditForm } from "@/components/LotteryEditForm";
import { LotteryManageActions } from "@/components/LotteryManageActions";
import { requireOrganizer } from "@/lib/auth";
import { LotteryImageUpload } from "@/components/LotteryImageUpload";
import { getEntryDuplicateFlags } from "@/lib/duplicates";
import { isDraftScheduledForFuture, refreshLotterySchedule } from "@/lib/lottery-schedule";
import { prisma } from "@/lib/prisma";

const flagLabels: Record<string, string> = {
  duplicate_email: "Same email as another entry",
  duplicate_paypal: "Same PayPal as another entry",
  duplicate_instagram: "Same Instagram as another entry",
};

export default async function LotteryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requireOrganizer();
  if (!user) return null;

  const found = await prisma.lottery.findFirst({
    where: { id, organizerId: user.id },
    include: {
      _count: { select: { entries: true, winners: true, blockedAttempts: true } },
      winners: { include: { entry: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!found) notFound();
  await refreshLotterySchedule(found);
  const lottery = await prisma.lottery.findFirst({
    where: { id, organizerId: user.id },
    include: {
      _count: { select: { entries: true, winners: true, blockedAttempts: true } },
      winners: { include: { entry: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!lottery) notFound();

  const entries = await prisma.entry.findMany({
    where: { lotteryId: id },
    orderBy: { createdAt: "desc" },
  });
  const dupFlags = await getEntryDuplicateFlags(id);

  const scheduledOpensInFuture = isDraftScheduledForFuture(lottery.status, lottery.opensAt);

  return (
    <div>
      <Link href="/dashboard/lotteries" className="link-clay text-sm">
        ← Lotteries
      </Link>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-clay-black">{lottery.title}</h1>
          <p className="mt-2 font-mono text-xs text-warm-silver">
            Public URL: /l/{lottery.slug}
          </p>
        </div>
        <span className="inline-flex items-center rounded-[11px] border border-oat bg-oat-light/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.0675rem] text-clay-black">
          {lottery.status}
        </span>
      </div>

      {lottery.imageUrl ? (
        <div className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lottery.imageUrl}
            alt={`Image for ${lottery.title}`}
            className="max-h-72 w-full max-w-lg rounded-[24px] border border-oat object-cover shadow-[var(--shadow-clay)]"
          />
        </div>
      ) : null}

      <div className="mt-10 flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-8">
          <LotteryImageUpload
            lotteryId={lottery.id}
            disabled={lottery.status !== "DRAFT" && lottery.status !== "OPEN"}
          />
          <div className="clay-card p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-clay-black">Actions</h2>
            <LotteryManageActions
              lotteryId={lottery.id}
              slug={lottery.slug}
              status={lottery.status}
              entryCount={lottery._count.entries}
              winnerCount={lottery._count.winners}
              configuredWinners={lottery.winnerCount}
              hasImage={Boolean(lottery.imageUrl?.trim())}
              opensAt={lottery.opensAt?.toISOString() ?? null}
              scheduledOpensInFuture={scheduledOpensInFuture}
            />
          </div>
          <LotteryEditForm
            lottery={{
              id: lottery.id,
              title: lottery.title,
              description: lottery.description,
              opensAt: lottery.opensAt?.toISOString() ?? null,
              closesAt: lottery.closesAt?.toISOString() ?? null,
              winnerCount: lottery.winnerCount,
              status: lottery.status,
              collectInstagram: lottery.collectInstagram,
              collectPaypal: lottery.collectPaypal,
            }}
          />
        </div>
      </div>

      {lottery._count.blockedAttempts > 0 ? (
        <p className="mt-8 rounded-[12px] border border-lemon-500/50 bg-lemon-500/15 px-4 py-3 text-sm font-medium text-lemon-700">
          Blocked duplicate attempts: {lottery._count.blockedAttempts}
        </p>
      ) : null}

      {lottery.winners.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">Winners</h2>
          <ul className="mt-4 space-y-2">
            {lottery.winners.map((w, i) => (
              <li
                key={w.id}
                className="rounded-[12px] border border-oat bg-card px-4 py-3 text-sm shadow-[var(--shadow-clay)]"
              >
                <span className="font-medium text-clay-black">
                  #{i + 1} {w.entry.fullName}
                </span>
                <span className="text-warm-silver"> — {w.entry.email}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-clay-black">Entries ({entries.length})</h2>
        <div className="mt-4 overflow-x-auto clay-card p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-oat bg-oat-light/40 text-xs font-semibold uppercase tracking-[0.0675rem] text-warm-silver">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-oat">
              {entries.map((e) => {
                const flags = dupFlags.get(e.id) ?? [];
                return (
                  <tr key={e.id} className="bg-card">
                    <td className="px-4 py-3 font-medium text-clay-black">{e.fullName}</td>
                    <td className="px-4 py-3 text-warm-silver">{e.email}</td>
                    <td className="px-4 py-3">
                      {flags.length === 0 ? (
                        "—"
                      ) : (
                        <ul className="text-xs text-lemon-700">
                          {flags.map((f) => (
                            <li key={f}>{flagLabels[f] ?? f}</li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-warm-silver">
                      {e.createdAt.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
