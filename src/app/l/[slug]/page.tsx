import { PublicEntryForm } from "@/components/PublicEntryForm";
import { isLotteryAcceptingEntries } from "@/lib/lottery-window";
import { refreshLotteryScheduleBySlug } from "@/lib/lottery-schedule";
import { notFound } from "next/navigation";

export default async function PublicLotteryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lottery = await refreshLotteryScheduleBySlug(slug);
  if (!lottery) notFound();

  const accepting = isLotteryAcceptingEntries(lottery.status, lottery.opensAt, lottery.closesAt);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16">
      {lottery.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={lottery.imageUrl}
          alt={`Item for lottery: ${lottery.title}`}
          className="mb-8 w-full rounded-[24px] border border-oat object-cover shadow-[var(--shadow-clay)]"
        />
      ) : null}
      <div className="clay-card p-6 sm:p-8">
        <p className="font-mono text-xs font-normal uppercase tracking-[0.0675rem] text-warm-silver">Lottery</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-clay-black sm:text-3xl">{lottery.title}</h1>
        {lottery.description ? (
          <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-warm-silver">{lottery.description}</p>
        ) : null}
        <div className="mt-4 space-y-1 font-mono text-sm text-warm-silver">
          {lottery.opensAt ? <p>Opens: {lottery.opensAt.toLocaleString()}</p> : null}
          {lottery.closesAt ? <p>Closes: {lottery.closesAt.toLocaleString()}</p> : null}
          <p>Status: {lottery.status}</p>
        </div>
      </div>

      <div className="mt-8">
        {accepting ? (
          <div className="clay-card-dashed p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-semibold tracking-tight text-clay-black">Enter the lottery</h2>
            <PublicEntryForm
              slug={lottery.slug}
              siteKey={siteKey}
              requireInstagram={lottery.collectInstagram}
              requirePaypal={lottery.collectPaypal}
            />
          </div>
        ) : (
          <div className="clay-card border-slushie-500/40 bg-slushie-500/10 p-8 text-center">
            <p className="text-base font-medium text-clay-black">
              This lottery is not accepting entries right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
