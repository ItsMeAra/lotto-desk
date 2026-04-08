import { PublicEntryForm } from "@/components/PublicEntryForm";
import { PublicLotteryBackground } from "@/components/PublicLotteryBackground";
import { isLotteryAcceptingEntries } from "@/lib/lottery-window";
import { refreshLotteryScheduleBySlug } from "@/lib/lottery-schedule";
import { notFound } from "next/navigation";

function shippingEligibilityText(lottery: {
  shippingPolicy: "ANY" | "US_ONLY" | "ALLOW_LIST" | "BLOCK_LIST";
  allowedCountries: string[];
  blockedCountries: string[];
}) {
  if (lottery.shippingPolicy === "US_ONLY") return "United States only";
  if (lottery.shippingPolicy === "ALLOW_LIST") {
    const list = lottery.allowedCountries.join(", ");
    return list ? `Allowed countries: ${list}` : "Allowed countries: not specified";
  }
  if (lottery.shippingPolicy === "BLOCK_LIST") {
    const list = lottery.blockedCountries.join(", ");
    return list ? `International except: ${list}` : "International (blocked countries not specified)";
  }
  return "International (all countries)";
}

function formatDateParts(value: Date | null): { date: string; time: string } {
  if (!value) return { date: "—", time: "—" };
  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(value);
  return { date, time };
}

export default async function PublicLotteryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lottery = await refreshLotteryScheduleBySlug(slug);
  if (!lottery) notFound();

  const accepting = isLotteryAcceptingEntries(lottery.status, lottery.opensAt, lottery.closesAt);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const opens = formatDateParts(lottery.opensAt);
  const closes = formatDateParts(lottery.closesAt);
  const eligibility = shippingEligibilityText(lottery);
  const statusLabel = accepting ? "OPEN" : lottery.status;
  const statusClass =
    lottery.status === "OPEN"
      ? "inline-flex items-center rounded-full border border-[#163300]/20 bg-[#9fe870]/70 px-3 py-1 text-xs font-bold tracking-tight text-[#163300] shadow-[var(--shadow-ring)]"
      : lottery.status === "CLOSED" || lottery.status === "DRAWN"
        ? "inline-flex items-center rounded-full border border-oat bg-oat-light px-3 py-1 text-xs font-bold tracking-tight text-clay-black shadow-[var(--shadow-ring)]"
        : "inline-flex items-center rounded-full border border-[#ffd11a]/40 bg-[#ffd11a]/55 px-3 py-1 text-xs font-bold tracking-tight text-clay-black shadow-[var(--shadow-ring)]";

  return (
    <div className="relative isolate z-0 min-h-dvh">
      <PublicLotteryBackground />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="clay-card overflow-hidden p-0">
          <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            {lottery.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lottery.imageUrl}
                alt={`Item for lottery: ${lottery.title}`}
                className="h-full min-h-[16rem] w-full border-b border-oat object-cover md:border-b-0 md:border-r"
              />
            ) : (
              <div className="flex min-h-[16rem] items-center justify-center border-b border-oat bg-oat-light/40 text-sm text-warm-silver md:border-b-0 md:border-r">
                No image yet
              </div>
            )}

            <div className="p-6 sm:p-8">
              <p className="font-mono text-xs font-normal uppercase tracking-[0.0675rem] text-warm-silver">Lottery</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-clay-black sm:text-3xl">{lottery.title}</h1>
              {lottery.description ? (
                <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-warm-silver">{lottery.description}</p>
              ) : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] border border-oat bg-card px-4 py-3 shadow-[var(--shadow-clay)]">
                  <p className="font-mono text-xs uppercase tracking-[0.0675rem] text-warm-silver">Opens</p>
                  {lottery.opensAt ? (
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-warm-silver">
                        Date: <span className="font-semibold tracking-tight text-clay-black">{opens.date}</span>
                      </p>
                      <p className="text-warm-silver">
                        Time: <span className="font-semibold tracking-tight text-clay-black">{opens.time}</span>
                      </p>
                    </div>
                  ) : (
                    <p className="mt-1 text-base font-semibold tracking-tight text-clay-black">Now</p>
                  )}
                </div>
                <div className="rounded-[18px] border border-oat bg-card px-4 py-3 shadow-[var(--shadow-clay)]">
                  <p className="font-mono text-xs uppercase tracking-[0.0675rem] text-warm-silver">Closes</p>
                  {lottery.closesAt ? (
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-warm-silver">
                        Date: <span className="font-semibold tracking-tight text-clay-black">{closes.date}</span>
                      </p>
                      <p className="text-warm-silver">
                        Time: <span className="font-semibold tracking-tight text-clay-black">{closes.time}</span>
                      </p>
                    </div>
                  ) : (
                    <p className="mt-1 text-base font-semibold tracking-tight text-clay-black">When filled / announced</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={statusClass}>{statusLabel}</span>
                <span className="inline-flex items-center rounded-full border border-oat bg-white/70 px-3 py-1 text-xs font-semibold tracking-tight text-clay-black shadow-[var(--shadow-ring)]">
                  {eligibility}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 w-full max-w-2xl">
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
              <p className="text-base font-medium text-clay-black">This lottery is not accepting entries right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
