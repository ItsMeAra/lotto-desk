import Link from "next/link";

export function DashboardNav() {
  return (
    <header className="border-b border-oat bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <nav className="flex items-center gap-8">
          <Link href="/dashboard" className="text-base font-medium text-clay-black no-underline hover:text-matcha-600">
            Dashboard
          </Link>
          <Link href="/dashboard/lotteries" className="nav-link no-underline">
            Lotteries
          </Link>
        </nav>
        <form action="/logout" method="post">
          <button type="submit" className="nav-link">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
