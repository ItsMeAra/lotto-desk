import Link from "next/link";
import { requireOrganizer } from "@/lib/auth";
import { refreshLotterySchedule } from "@/lib/lottery-schedule";
import { prisma } from "@/lib/prisma";

export default async function LotteriesListPage() {
  const { user } = await requireOrganizer();
  if (!user) return null;

  const rows = await prisma.lottery.findMany({
    where: { organizerId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { entries: true, winners: true } },
    },
  });
  const refreshed = await Promise.all(rows.map((l) => refreshLotterySchedule(l)));
  const lotteries = refreshed.map((lottery, i) => ({
    ...lottery,
    _count: rows[i]._count,
  }));

  return (
    <div>
      <header className="clay-card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <p className="font-mono text-xs font-normal uppercase tracking-[0.0675rem] text-warm-silver">Your lotteries</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-clay-black sm:text-3xl">Lotteries</h1>
          </div>
          <Link
            href="/dashboard/lotteries/new"
            className="pill-cta w-full shrink-0 no-underline px-5 py-2.5 text-center sm:w-auto"
          >
            New lottery
          </Link>
        </div>
      </header>
      {lotteries.length === 0 ? (
        <p className="mt-10 text-lg text-warm-silver">No lotteries yet. Create one to get a public link.</p>
      ) : (
        <ul className="mt-10 clay-card divide-y divide-oat overflow-hidden p-0">
          {lotteries.map((l) => (
            <li key={l.id}>
              <Link
                href={`/dashboard/lotteries/${l.id}`}
                className="flex flex-col gap-1 px-5 py-5 no-underline transition-colors hover:bg-oat-light/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-base font-medium text-clay-black">{l.title}</span>
                <span className="font-mono text-sm text-warm-silver">
                  {l.status} · {l._count.entries} entries · {l._count.winners} winners
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
