import Link from "next/link";
import { SiteBrand } from "@/components/SiteBrand";

/** Marketing site header: floating bar with brand, sign in, and get started. */
export function SiteHeader() {
  return (
    <header className="relative z-10 pt-5">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="nav-floating-bar">
          <SiteBrand href="/" />
          <nav className="flex shrink-0 items-center gap-1 sm:gap-2" aria-label="Primary">
            <Link href="/login" className="nav-link no-underline">
              Sign in
            </Link>
            <Link href="/signup" className="pill-cta no-underline">
              Get started
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
