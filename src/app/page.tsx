import Link from "next/link";
import { HomeHeroBackground } from "@/components/HomeHeroBackground";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  const faqs = [
    {
      q: "How do you prevent duplicate entries?",
      a: "We normalize entry fields and generate a dedupe key so repeat submissions can be blocked per lottery.",
    },
    {
      q: "Do entrants need an account?",
      a: "No. Entrants submit a form via a public link. Only organizers sign in to manage lotteries and export data.",
    },
    {
      q: "Can I require Instagram or PayPal?",
      a: "Yes. You can optionally require Instagram and/or PayPal on a per-lottery basis.",
    },
    {
      q: "Can I schedule when entries open and close?",
      a: "Yes. Set opens/closes times and the status updates automatically during that window (when an image is uploaded).",
    },
    {
      q: "How do I contact winners?",
      a: "Export winners as CSV, then email them and handle payment/shipping in whatever system you already use.",
    },
    {
      q: "Does it have bot protection?",
      a: "Turnstile support is built-in. When configured, entrants must pass verification before submitting.",
    },
  ] as const;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="relative isolate z-0 flex min-h-dvh flex-1 flex-col">
      <HomeHeroBackground />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
        {/* Hero */}
        <section className="mx-auto max-w-5xl py-10 text-center">
          <div className="hero-panel px-5 py-12 sm:px-10 sm:py-14">
            <p className="font-mono text-xs font-normal uppercase tracking-[0.0675rem] text-warm-silver">
              For artists &amp; indie shops
            </p>
            <h1 className="font-display mt-4 text-balance-safe text-4xl font-normal leading-[0.85] tracking-tight text-clay-black sm:text-5xl md:text-6xl">
              Run fair lotteries for your drops
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-warm-silver">
              Collect entries, block duplicates, draw winners, and export contacts—then email winners and handle payment and
              shipping your way.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/signup" className="pill-cta px-8 py-3 text-base no-underline">
                Get started
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-16 sm:mt-20 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-normal leading-[0.9] tracking-tight text-clay-black sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-warm-silver">
              A simple loop: publish, collect, pick.
            </p>
          </div>

          <ol className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
            <li className="clay-card p-6 sm:p-7">
              <p className="font-mono text-xs uppercase tracking-[0.0675rem] text-warm-silver">Step 01</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-clay-black">Create a lottery</h3>
              <p className="mt-3 text-base text-warm-silver">Add an image, a description, and your entry window.</p>
            </li>
            <li className="clay-card p-6 sm:p-7">
              <p className="font-mono text-xs uppercase tracking-[0.0675rem] text-warm-silver">Step 02</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-clay-black">Share the link</h3>
              <p className="mt-3 text-base text-warm-silver">Entrants submit details—duplicates are blocked.</p>
            </li>
            <li className="clay-card p-6 sm:p-7">
              <p className="font-mono text-xs uppercase tracking-[0.0675rem] text-warm-silver">Step 03</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-clay-black">Draw &amp; export</h3>
              <p className="mt-3 text-base text-warm-silver">Pick winners, then export CSVs for your workflow.</p>
            </li>
          </ol>

        </section>

        {/* Feature grid */}
        <section className="mt-16 sm:mt-20 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-balance-safe text-3xl font-normal leading-[0.9] tracking-tight text-clay-black sm:text-4xl">
              Features
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="clay-card p-6 sm:p-7">
              <p className="font-mono text-xs uppercase tracking-[0.0675rem] text-warm-silver">Integrity</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-clay-black">Duplicate protection</h3>
              <p className="mt-3 text-base text-warm-silver">
                Entries are normalized and deduped so repeats don&rsquo;t slip through.
              </p>
            </div>
            <div className="clay-card p-6 sm:p-7">
              <p className="font-mono text-xs uppercase tracking-[0.0675rem] text-warm-silver">Automation</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-clay-black">Scheduled open &amp; close</h3>
              <p className="mt-3 text-base text-warm-silver">
                Set a window for entries—status updates happen automatically.
              </p>
            </div>
            <div className="clay-card p-6 sm:p-7">
              <p className="font-mono text-xs uppercase tracking-[0.0675rem] text-warm-silver">Fairness</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-clay-black">Winner draws</h3>
              <p className="mt-3 text-base text-warm-silver">
                Draw winners with one click after entries close.
              </p>
            </div>
            <div className="clay-card p-6 sm:p-7">
              <p className="font-mono text-xs uppercase tracking-[0.0675rem] text-warm-silver">Workflow</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-clay-black">CSV exports</h3>
              <p className="mt-3 text-base text-warm-silver">
                Export entries and winners for email, payment, and shipping.
              </p>
            </div>
            <div className="clay-card p-6 sm:p-7">
              <p className="font-mono text-xs uppercase tracking-[0.0675rem] text-warm-silver">Control</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-clay-black">Flexible fields</h3>
              <p className="mt-3 text-base text-warm-silver">
                Optionally require Instagram and/or PayPal for your drop.
              </p>
            </div>
            <div className="clay-card p-6 sm:p-7">
              <p className="font-mono text-xs uppercase tracking-[0.0675rem] text-warm-silver">Protection</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-clay-black">Bot resistance</h3>
              <p className="mt-3 text-base text-warm-silver">
                Add Turnstile verification when you need extra friction.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16 sm:mt-20 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-normal leading-[0.9] tracking-tight text-clay-black sm:text-4xl">
              FAQ
            </h2>
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="faq-item clay-card px-6 py-5 sm:px-7 sm:py-6">
                <summary className="faq-summary cursor-pointer list-none text-lg font-semibold tracking-tight text-clay-black">
                  <span className="min-w-0">{f.q}</span>
                  <span className="faq-icon" aria-hidden />
                </summary>
                <p className="mt-3 text-base text-warm-silver">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
