"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { useState } from "react";
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
    <header className="border-b border-oat bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <nav className="flex items-center gap-8">
          <DashboardNavLink
            href="/dashboard"
            className="text-base font-medium text-clay-black no-underline hover:text-matcha-600"
          >
            Dashboard
          </DashboardNavLink>
          <DashboardNavLink href="/dashboard/lotteries" className="nav-link no-underline">
            Lotteries
          </DashboardNavLink>
        </nav>
        <SignOutButton />
      </div>
    </header>
  );
}
