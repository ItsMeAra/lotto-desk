import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-oat bg-cream/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-lg font-semibold tracking-tight text-clay-black">Lottery Desk</span>
          <nav className="flex items-center gap-6">
            <Link href="/login" className="nav-link no-underline">
              Sign in
            </Link>
            <Link href="/signup" className="pill-cta no-underline">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="font-mono text-xs font-normal uppercase tracking-[0.0675rem] text-warm-silver">
          For artists &amp; indie shops
        </p>
        <h1 className="mt-4 text-balance-safe text-4xl font-semibold leading-none tracking-tight text-clay-black sm:text-5xl md:text-6xl">
          Run fair lotteries for your drops
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-warm-silver">
          Collect entries, block duplicates, draw winners, and export contacts—then email winners and handle payment and
          shipping your way.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="pill-cta px-8 py-3 text-base no-underline">
            Create an account
          </Link>
          <Link href="/login" className="pill-cta-inverse px-8 py-3 text-base no-underline">
            Sign in
          </Link>
        </div>
      </main>

      <section className="mx-auto mb-12 w-full max-w-5xl px-4 sm:px-6">
        <div className="section-swatch-matcha">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Craft, not chaos</h2>
          <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-matcha-300">
            Warm tools for small teams: one public link per lottery, honest deduping, and a draw you control—so the
            experience feels as thoughtful as the work you sell.
          </p>
        </div>
      </section>
    </div>
  );
}
