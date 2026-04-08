import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
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
  duplicate_phone: "Same phone number as another entry",
};

/** Header status pill — aligned with lottery lifecycle (Wise matcha green when open). */
const lotteryStatusBadgeClass: Record<string, string> = {
  DRAFT: "border-oat bg-oat-light/80 text-clay-black",
  OPEN: "border-matcha-600/45 bg-matcha-300/85 text-matcha-800",
  CLOSED: "border-lemon-500/50 bg-lemon-500/20 text-lemon-700",
  DRAWN: "border-ube-800/35 bg-ube-800/[0.14] text-ube-800",
};

export default async function LotteryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await requireOrganizer();
  if (!user) return null;

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const origin = host ? `${proto}://${host}` : null;

  const lotteryInclude = {
    _count: { select: { entries: true, winners: true, blockedAttempts: true } },
    winners: { include: { entry: true }, orderBy: { createdAt: "asc" as const } },
  };

  const found = await prisma.lottery.findFirst({
    where: { id, organizerId: user.id },
    include: lotteryInclude,
  });
  if (!found) notFound();

  const refreshed = await refreshLotterySchedule(found);
  const lottery =
    refreshed === found
      ? found
      : await prisma.lottery.findFirstOrThrow({
          where: { id, organizerId: user.id },
          include: lotteryInclude,
        });

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
      <header className="mt-4 clay-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-clay-black sm:text-3xl">{lottery.title}</h1>
            <p className="mt-3 break-all font-mono text-xs leading-relaxed text-warm-silver sm:break-normal">
              Public URL:{" "}
              <a
                href={origin ? `${origin}/l/${lottery.slug}` : `/l/${lottery.slug}`}
                className="link-clay"
                target="_blank"
                rel="noreferrer"
              >
                {origin ? `${origin}/l/${lottery.slug}` : `/l/${lottery.slug}`}
              </a>
            </p>
          </div>
          <span
            className={`inline-flex w-fit shrink-0 items-center self-start rounded-[11px] border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.0675rem] ${lotteryStatusBadgeClass[lottery.status] ?? "border-oat bg-oat-light/60 text-clay-black"}`}
          >
            {lottery.status}
          </span>
        </div>
      </header>

      <div className="mt-10 space-y-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 space-y-8">
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
                collectPhone: lottery.collectPhone,
                shippingPolicy: lottery.shippingPolicy,
                allowedCountries: lottery.allowedCountries,
                blockedCountries: lottery.blockedCountries,
              }}
            />

            {lottery._count.blockedAttempts > 0 ? (
              <p className="rounded-[12px] border border-lemon-500/50 bg-lemon-500/15 px-4 py-3 text-sm font-medium text-lemon-700">
                Blocked duplicate attempts: {lottery._count.blockedAttempts}
              </p>
            ) : null}

            {lottery.winners.length > 0 ? (
              <section>
                <h2 className="text-xl font-semibold tracking-tight text-clay-black">Winners</h2>
                <ul className="mt-4 space-y-2">
                  {lottery.winners.map((w, i) =>
                    (() => {
                      const instagramUser = (w.entry.instagram ?? "").trim().replace(/^@+/, "");
                      const instagramUrl = instagramUser ? `https://instagram.com/${instagramUser}` : null;
                      const instagramLabel = instagramUrl ? `instagram.com/${instagramUser}` : "—";
                      return (
                        <li
                          key={w.id}
                          className="rounded-[12px] border border-oat bg-card px-4 py-4 text-sm shadow-[var(--shadow-clay)]"
                        >
                          <p className="font-medium text-clay-black">
                            #{i + 1} {w.entry.fullName}
                          </p>
                          <p className="mt-1 text-warm-silver">{w.entry.email}</p>
                          <dl className="mt-3 space-y-1 text-sm">
                            <div className="grid grid-cols-[7.5rem_1fr] gap-2">
                              <dt className="font-medium text-clay-black">Address</dt>
                              <dd className="whitespace-pre-wrap break-words text-warm-silver">{w.entry.address}</dd>
                            </div>
                            <div className="grid grid-cols-[7.5rem_1fr] gap-2">
                              <dt className="font-medium text-clay-black">Instagram</dt>
                              <dd className="break-words text-warm-silver">
                                {instagramUrl ? (
                                  <a href={instagramUrl} className="link-clay" target="_blank" rel="noreferrer">
                                    {instagramLabel}
                                  </a>
                                ) : (
                                  "—"
                                )}
                              </dd>
                            </div>
                            <div className="grid grid-cols-[7.5rem_1fr] gap-2">
                              <dt className="font-medium text-clay-black">PayPal</dt>
                              <dd className="break-words text-warm-silver">{w.entry.paypal || "—"}</dd>
                            </div>
                            <div className="grid grid-cols-[7.5rem_1fr] gap-2">
                              <dt className="font-medium text-clay-black">Phone</dt>
                              <dd className="break-words text-warm-silver">{w.entry.phone || "—"}</dd>
                            </div>
                          </dl>
                        </li>
                      );
                    })(),
                  )}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="w-full shrink-0 space-y-8 lg:sticky lg:top-6 lg:w-80 xl:w-96">
            <LotteryImageUpload
              lotteryId={lottery.id}
              disabled={lottery.status !== "DRAFT" && lottery.status !== "OPEN"}
              imageUrl={lottery.imageUrl}
              imageAlt={`Image for ${lottery.title}`}
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
          </aside>
        </div>

        <section className="w-full min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-clay-black">Entries ({entries.length})</h2>
          <div className="mt-4 overflow-x-auto clay-card p-0">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-oat bg-oat-light/40 text-xs font-semibold uppercase tracking-[0.0675rem] text-warm-silver">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
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
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-warm-silver">
                        {e.phone || "—"}
                      </td>
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
    </div>
  );
}
