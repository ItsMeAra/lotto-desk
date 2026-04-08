"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ClaySpinner } from "@/components/ui/ClaySpinner";

function UserCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function MenuLinkLabel({ children }: { children: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return (
    <span className="inline-flex items-center gap-2">
      {pending ? <ClaySpinner className="!size-[0.85em]" /> : null}
      <span className={pending ? "opacity-80" : undefined}>{children}</span>
    </span>
  );
}

function MenuLink({
  href,
  onNavigate,
  children,
}: {
  href: string;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      role="menuitem"
      onClick={onNavigate}
      className="block rounded-[10px] px-3 py-2.5 text-sm font-medium text-clay-black outline-none hover:bg-oat-light/80 focus-visible:bg-oat-light/80 focus-visible:ring-2 focus-visible:ring-matcha-600/40"
    >
      <MenuLinkLabel>{children}</MenuLinkLabel>
    </Link>
  );
}

export function NavUserMenu({
  displayName,
  email,
}: {
  displayName: string | null;
  email: string;
}) {
  const menuId = useId();
  const signedInAs = displayName?.trim() || email;
  const [open, setOpen] = useState(false);
  const [signOutBusy, setSignOutBusy] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        className="flex size-10 items-center justify-center rounded-full border border-oat bg-card text-clay-black shadow-[var(--shadow-ring)] outline-none transition hover:bg-oat-light/50 focus-visible:ring-2 focus-visible:ring-matcha-600/40"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
      >
        <UserCircleIcon className="size-6" />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-[14px] border border-oat bg-card py-2 shadow-[var(--shadow-clay)]"
        >
          <div className="border-b border-oat px-3 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.0675rem] text-warm-silver">Signed in as</p>
            <p className="mt-1 break-words text-sm font-semibold text-clay-black" title={signedInAs}>
              {signedInAs}
            </p>
            {displayName?.trim() ? (
              <p className="mt-1 truncate text-xs text-warm-silver" title={email}>
                {email}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col px-1.5 py-1.5">
            <MenuLink href="/dashboard/settings" onNavigate={close}>
              Settings
            </MenuLink>
            <form
              action="/logout"
              method="post"
              role="none"
              className="px-0 py-0"
              onSubmit={() => setSignOutBusy(true)}
            >
              <button
                type="submit"
                role="menuitem"
                disabled={signOutBusy}
                className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2.5 text-left text-sm font-medium text-clay-black outline-none hover:bg-oat-light/80 focus-visible:bg-oat-light/80 focus-visible:ring-2 focus-visible:ring-matcha-600/40 disabled:cursor-wait disabled:opacity-70"
              >
                {signOutBusy ? <ClaySpinner className="!size-[0.85em]" /> : null}
                {signOutBusy ? "Signing out…" : "Sign out"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
