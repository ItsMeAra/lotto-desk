"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClaySpinner } from "@/components/ui/ClaySpinner";

type Props = {
  initialDisplayName: string | null;
  email: string;
};

export function SettingsProfileForm({ initialDisplayName, email }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setOk(false);
    const fd = new FormData(e.currentTarget);
    const displayName = String(fd.get("displayName") ?? "");
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: unknown; profile?: unknown };
    setBusy(false);
    if (!res.ok) {
      setErr("Could not save your name.");
      console.error(data.error);
      return;
    }
    setOk(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="clay-card-dashed flex flex-col gap-4 p-6 sm:p-8" aria-busy={busy}>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-clay-black">Profile</h2>
        <p className="mt-2 text-sm text-warm-silver">
          This name appears in the dashboard header. Your sign-in email stays the same.
        </p>
      </div>
      <div>
        <label htmlFor="settings-email" className="clay-label">
          Email
        </label>
        <input
          id="settings-email"
          type="email"
          value={email}
          disabled
          readOnly
          className="clay-input bg-oat-light/30 text-warm-silver"
        />
      </div>
      <div>
        <label htmlFor="settings-display-name" className="clay-label">
          Display name <span className="font-normal text-warm-silver">(optional)</span>
        </label>
        <input
          id="settings-display-name"
          name="displayName"
          type="text"
          maxLength={120}
          defaultValue={initialDisplayName ?? ""}
          disabled={busy}
          autoComplete="name"
          placeholder="e.g. Alex"
          className="clay-input"
        />
        <p className="mt-2 text-xs text-warm-silver">Leave blank to show your email in the header instead.</p>
      </div>
      {err ? (
        <p className="text-sm text-pomegranate-400" role="alert">
          {err}
        </p>
      ) : null}
      {ok ? (
        <p className="text-sm font-medium text-matcha-800" role="status">
          Saved.
        </p>
      ) : null}
      <button type="submit" disabled={busy} className="btn-clay inline-flex w-full max-w-xs justify-center gap-2 sm:w-auto">
        {busy ? <ClaySpinner /> : null}
        {busy ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
