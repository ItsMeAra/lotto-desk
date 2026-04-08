"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";
import { ClaySpinner } from "@/components/ui/ClaySpinner";

export function ForgotPasswordForm() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const origin = window.location.origin;
    const next = encodeURIComponent("/auth/update-password");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=${next}`,
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-base text-clay-black">
          If an account exists for that email, we sent a link to reset your password. Check your inbox (and spam).
        </p>
        <p className="text-sm text-warm-silver">The link expires after a while for security.</p>
        <Link href="/login" className="link-clay font-medium">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" aria-busy={busy}>
      {err ? (
        <p className="text-sm text-pomegranate-400" role="alert">
          {err}
        </p>
      ) : null}
      <div>
        <label htmlFor="forgot-email" className="clay-label">
          Email
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          required
          disabled={busy}
          autoComplete="email"
          className="clay-input"
        />
      </div>
      <button type="submit" disabled={busy} aria-busy={busy} className="btn-clay inline-flex w-full justify-center gap-2">
        {busy ? <ClaySpinner /> : null}
        {busy ? "Sending…" : "Send reset link"}
      </button>
      <p className="text-center text-base text-warm-silver">
        <Link href="/login" className="link-clay font-medium">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
