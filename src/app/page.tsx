import Link from "next/link";
import { VantaHaloBackground } from "@/components/VantaHaloBackground";

export default function HomePage() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <VantaHaloBackground />
      <header className="app-header-glass relative z-10 border-b">
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

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-16 text-center sm:px-6 sm:py-24">
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
            Create an account
          </Link>
          <Link href="/login" className="pill-cta-inverse px-8 py-3 text-base no-underline">
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
