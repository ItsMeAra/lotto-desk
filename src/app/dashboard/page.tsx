import Link from "next/link";
import { requireOrganizer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardHomePage() {
  const { user } = await requireOrganizer();
  if (!user) return null;
  const count = await prisma.lottery.count({ where: { organizerId: user.id } });

  return (
    <div>
      <p className="font-mono text-xs font-normal uppercase tracking-[0.0675rem] text-warm-silver">Overview</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-clay-black">Dashboard</h1>
      <p className="mt-3 text-lg text-warm-silver">
        You have {count} lottery{count !== 1 ? "ies" : "y"}.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/dashboard/lotteries/new" className="pill-cta no-underline px-6 py-3">
          New lottery
        </Link>
        <Link href="/dashboard/lotteries" className="pill-cta-inverse no-underline px-6 py-3">
          View all
        </Link>
      </div>
    </div>
  );
}
