"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { ClaySpinner } from "@/components/ui/ClaySpinner";

const MIN_LEN = 8;

export function SettingsPasswordForm() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setOk(false);
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
      setErr("New password and confirmation do not match.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: next });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setOk(true);
    (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <form onSubmit={onSubmit} className="clay-card-dashed flex flex-col gap-4 p-6 sm:p-8" aria-busy={busy}>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-clay-black">Password</h2>
        <p className="mt-2 text-sm text-warm-silver">Choose a new password for your account.</p>
      </div>
      <div>
        <label htmlFor="settings-new-password" className="clay-label">
          New password
        </label>
        <input
          id="settings-new-password"
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
        <label htmlFor="settings-confirm-password" className="clay-label">
          Confirm new password
        </label>
        <input
          id="settings-confirm-password"
          name="confirmPassword"
          type="password"
          required
          minLength={MIN_LEN}
          disabled={busy}
          autoComplete="new-password"
          className="clay-input"
        />
      </div>
      {err ? (
        <p className="text-sm text-pomegranate-400" role="alert">
          {err}
        </p>
      ) : null}
      {ok ? (
        <p className="text-sm font-medium text-matcha-800" role="status">
          Password updated.
        </p>
      ) : null}
      <button type="submit" disabled={busy} className="btn-clay inline-flex w-full max-w-xs justify-center gap-2 sm:w-auto">
        {busy ? <ClaySpinner /> : null}
        {busy ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
