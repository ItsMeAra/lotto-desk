"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { useState } from "react";
import { SiteBrand } from "@/components/SiteBrand";
import { ClaySpinner } from "@/components/ui/ClaySpinner";

function NavLinkLabel({ children }: { children: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return (
    <span className="inline-flex items-center gap-2">
      {pending ? <ClaySpinner className="!size-[0.85em]" /> : null}
      <span className={pending ? "opacity-80" : undefined}>{children}</span>
    </span>
  );
}

function DashboardNavLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className}>
      <NavLinkLabel>{children}</NavLinkLabel>
    </Link>
  );
}

function SignOutButton() {
  const [busy, setBusy] = useState(false);
  return (
    <form action="/logout" method="post" onSubmit={() => setBusy(true)}>
      <button
        type="submit"
        disabled={busy}
        className="nav-link inline-flex items-center gap-2 disabled:cursor-wait disabled:opacity-70"
      >
        {busy ? <ClaySpinner className="!size-[0.85em]" /> : null}
        {busy ? "Signing out…" : "Sign out"}
      </button>
    </form>
  );
}

export function DashboardNav() {
  return (
    <header className="relative z-10 pt-5">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="nav-floating-bar nav-floating-bar--spacious">
          <div className="flex min-w-0 flex-1 items-center gap-5 sm:gap-8">
            <SiteBrand href="/dashboard/lotteries" />
            <nav className="flex min-w-0 flex-wrap items-center gap-1 sm:gap-2">
              <DashboardNavLink href="/dashboard/lotteries" className="nav-link no-underline">
                Lotteries
              </DashboardNavLink>
            </nav>
          </div>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
