"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ClaySpinner } from "@/components/ui/ClaySpinner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      setErr(error.message);
      return;
    }
    const next = searchParams.get("next");
    const dest = next?.startsWith("/") ? next : "/dashboard/lotteries";
    router.push(dest);
    router.refresh();
    // Stay busy until navigation replaces this screen (avoids dead air after the spinner stops)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" aria-busy={busy}>
      {searchParams.get("error") === "auth" ? (
        <p className="text-sm text-pomegranate-400" role="alert">
          Sign-in failed. Try again.
        </p>
      ) : null}
      {err ? (
        <p className="text-sm text-pomegranate-400" role="alert">
          {err}
        </p>
      ) : null}
      <div>
        <label htmlFor="email" className="clay-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={busy}
          autoComplete="email"
          className="clay-input"
        />
      </div>
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor="password" className="clay-label mb-0">
            Password
          </label>
          <Link href="/forgot-password" className="link-clay shrink-0 text-sm font-medium">
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          disabled={busy}
          autoComplete="current-password"
          className="clay-input mt-2"
        />
      </div>
      <button type="submit" disabled={busy} aria-busy={busy} className="btn-clay inline-flex w-full justify-center gap-2">
        {busy ? <ClaySpinner /> : null}
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-base text-warm-silver">
        No account?{" "}
        <Link href="/signup" className="link-clay font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
}
