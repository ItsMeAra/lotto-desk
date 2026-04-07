"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

export function NewLotteryForm() {
  const router = useRouter();
  const fieldsetId = useId();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const opensRaw = String(fd.get("opensAt") || "");
    const closesRaw = String(fd.get("closesAt") || "");
    const body = {
      title: String(fd.get("title")),
      description: String(fd.get("description") || ""),
      imageUrl: null,
      opensAt: opensRaw ? new Date(opensRaw).toISOString() : null,
      closesAt: closesRaw ? new Date(closesRaw).toISOString() : null,
      winnerCount: Number(fd.get("winnerCount") || 1),
      collectInstagram: fd.get("collectInstagram") === "on",
      collectPaypal: fd.get("collectPaypal") === "on",
    };
    const res = await fetch("/api/lotteries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { lottery?: { id: string }; error?: unknown };
    setBusy(false);
    if (!res.ok || !data.lottery) {
      setErr("Could not create lottery");
      console.error(data.error);
      return;
    }
    router.push(`/dashboard/lotteries/${data.lottery.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-lg flex-col gap-5" aria-busy={busy}>
      {err ? (
        <p className="text-sm text-pomegranate-400" role="alert">
          {err}
        </p>
      ) : null}
      <div>
        <label htmlFor="new-lottery-title" className="clay-label">
          Title
        </label>
        <input id="new-lottery-title" name="title" required className="clay-input" />
      </div>
      <div>
        <label htmlFor="new-lottery-desc" className="clay-label">
          Description
        </label>
        <textarea id="new-lottery-desc" name="description" rows={4} className="clay-input min-h-[6rem] resize-y" />
      </div>
      <p className="text-base text-warm-silver">
        After creating, upload an image on the next screen before entries can open.
      </p>
      <fieldset className="min-w-0 space-y-2 border-0 p-0">
        <legend id={fieldsetId} className="clay-label mb-2">
          Public entry form
        </legend>
        <div className="flex flex-col gap-3" role="group" aria-labelledby={fieldsetId}>
          <label className="flex cursor-pointer items-start gap-3 text-base font-normal text-clay-black">
            <input type="checkbox" name="collectInstagram" value="on" className="mt-1 size-4 rounded border-input-border" />
            <span>
              Collect Instagram{" "}
              <span className="text-warm-silver">(required on public form when checked)</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-base font-normal text-clay-black">
            <input type="checkbox" name="collectPaypal" value="on" className="mt-1 size-4 rounded border-input-border" />
            <span>
              Collect PayPal email{" "}
              <span className="text-warm-silver">(required on public form when checked)</span>
            </span>
          </label>
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="new-opens" className="clay-label">
            Opens (optional)
          </label>
          <input id="new-opens" name="opensAt" type="datetime-local" className="clay-input" />
          <p className="mt-1 text-xs text-warm-silver">Auto-opens at this time once an image is uploaded.</p>
        </div>
        <div>
          <label htmlFor="new-closes" className="clay-label">
            Closes (optional)
          </label>
          <input id="new-closes" name="closesAt" type="datetime-local" className="clay-input" />
        </div>
      </div>
      <div>
        <label htmlFor="new-winners" className="clay-label">
          Winners to draw
        </label>
        <input
          id="new-winners"
          name="winnerCount"
          type="number"
          min={1}
          max={100}
          defaultValue={1}
          className="clay-input max-w-[8rem]"
        />
      </div>
      <button type="submit" disabled={busy} className="btn-clay self-start">
        {busy ? "Creating…" : "Create lottery"}
      </button>
    </form>
  );
}
