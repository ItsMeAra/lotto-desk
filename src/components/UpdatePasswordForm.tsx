"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClaySpinner } from "@/components/ui/ClaySpinner";

const MIN_LEN = 8;

/** Used after email recovery link — session is already established by /auth/callback. */
export function UpdatePasswordForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const next = String(fd.get("newPassword") ?? "");
    const confirm = String(fd.get("confirmPassword") ?? "");
    if (next.length < MIN_LEN) {
      setBusy(false);
      setErr(`Use at least ${MIN_LEN} characters.`);
      return;
    }
    if (next !== confirm) {
      setBusy(false);
      setErr("Password and confirmation do not match.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: next });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push("/dashboard/lotteries");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" aria-busy={busy}>
      {err ? (
        <p className="text-sm text-pomegranate-400" role="alert">
          {err}
        </p>
      ) : null}
      <div>
        <label htmlFor="recovery-new-password" className="clay-label">
          New password
        </label>
        <input
          id="recovery-new-password"
          name="newPassword"
          type="password"
          required
          minLength={MIN_LEN}
          disabled={busy}
          autoComplete="new-password"
          className="clay-input"
        />
      </div>
      <div>
        <label htmlFor="recovery-confirm-password" className="clay-label">
          Confirm new password
        </label>
        <input
          id="recovery-confirm-password"
          name="confirmPassword"
          type="password"
          required
          minLength={MIN_LEN}
          disabled={busy}
          autoComplete="new-password"
          className="clay-input"
        />
      </div>
      <button type="submit" disabled={busy} aria-busy={busy} className="btn-clay inline-flex w-full justify-center gap-2">
        {busy ? <ClaySpinner /> : null}
        {busy ? "Saving…" : "Save password and continue"}
      </button>
      <p className="text-center text-sm text-warm-silver">
        <Link href="/login" className="link-clay font-medium">
          Cancel and sign in
        </Link>
      </p>
    </form>
  );
}
