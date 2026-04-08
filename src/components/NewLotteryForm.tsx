"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ClaySpinner } from "@/components/ui/ClaySpinner";

export function NewLotteryForm() {
  const router = useRouter();
  const fieldsetId = useId();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function parseCountryList(value: FormDataEntryValue | null): string[] {
    const raw = String(value ?? "")
      .split(/[,\\n]/g)
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    // unique + keep only ISO-ish codes
    return Array.from(new Set(raw)).filter((c) => /^[A-Z]{2}$/.test(c));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const opensRaw = String(fd.get("opensAt") || "");
    const closesRaw = String(fd.get("closesAt") || "");
    const shippingPolicy = String(fd.get("shippingPolicy") || "ANY");
    const allowedCountries =
      shippingPolicy === "ALLOW_LIST" ? parseCountryList(fd.get("allowedCountries")) : [];
    const blockedCountries =
      shippingPolicy === "BLOCK_LIST" ? parseCountryList(fd.get("blockedCountries")) : [];
    const body = {
      title: String(fd.get("title")),
      description: String(fd.get("description") || ""),
      imageUrl: null,
      opensAt: opensRaw ? new Date(opensRaw).toISOString() : null,
      closesAt: closesRaw ? new Date(closesRaw).toISOString() : null,
      winnerCount: Number(fd.get("winnerCount") || 1),
      collectInstagram: fd.get("collectInstagram") === "on",
      collectPaypal: fd.get("collectPaypal") === "on",
      shippingPolicy,
      allowedCountries,
      blockedCountries,
    };
    const res = await fetch("/api/lotteries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { lottery?: { id: string }; error?: unknown };
    if (!res.ok || !data.lottery) {
      setBusy(false);
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
        <input id="new-lottery-title" name="title" required disabled={busy} className="clay-input" />
      </div>
      <div>
        <label htmlFor="new-lottery-desc" className="clay-label">
          Description
        </label>
        <textarea
          id="new-lottery-desc"
          name="description"
          rows={4}
          disabled={busy}
          className="clay-input min-h-[6rem] resize-y"
        />
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
            <input
              type="checkbox"
              name="collectInstagram"
              value="on"
              disabled={busy}
              className="mt-1 size-4 rounded border-input-border"
            />
            <span>
              Collect Instagram{" "}
              <span className="text-warm-silver">(required on public form when checked)</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-base font-normal text-clay-black">
            <input
              type="checkbox"
              name="collectPaypal"
              value="on"
              disabled={busy}
              className="mt-1 size-4 rounded border-input-border"
            />
            <span>
              Collect PayPal email{" "}
              <span className="text-warm-silver">(required on public form when checked)</span>
            </span>
          </label>
        </div>
      </fieldset>

      <fieldset disabled={busy} className="min-w-0 space-y-3 border-0 p-0">
        <legend className="clay-label mb-1">Shipping restrictions</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="new-shipping-policy" className="clay-label">
              Eligible countries
            </label>
            <select id="new-shipping-policy" name="shippingPolicy" defaultValue="ANY" className="clay-input">
              <option value="ANY">International (any country)</option>
              <option value="US_ONLY">United States only</option>
              <option value="ALLOW_LIST">Allow only selected countries…</option>
              <option value="BLOCK_LIST">Block certain countries…</option>
            </select>
            <p className="mt-2 text-sm text-warm-silver">
              Country is collected on the entry form and validated server-side.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="new-allowed-countries" className="clay-label">
              Allowed countries (ISO codes, comma or newline separated)
            </label>
            <textarea
              id="new-allowed-countries"
              name="allowedCountries"
              rows={2}
              placeholder="US, CA, GB"
              className="clay-input min-h-[4rem] resize-y"
            />
            <p className="mt-1 text-xs text-warm-silver">Used only when policy is “Allow only selected countries”.</p>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="new-blocked-countries" className="clay-label">
              Blocked countries (ISO codes, comma or newline separated)
            </label>
            <textarea
              id="new-blocked-countries"
              name="blockedCountries"
              rows={2}
              placeholder="RU, BY"
              className="clay-input min-h-[4rem] resize-y"
            />
            <p className="mt-1 text-xs text-warm-silver">Used only when policy is “Block certain countries”.</p>
          </div>
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="new-opens" className="clay-label">
            Opens (optional)
          </label>
          <input id="new-opens" name="opensAt" type="datetime-local" disabled={busy} className="clay-input" />
          <p className="mt-1 text-xs text-warm-silver">Auto-opens at this time once an image is uploaded.</p>
        </div>
        <div>
          <label htmlFor="new-closes" className="clay-label">
            Closes (optional)
          </label>
          <input id="new-closes" name="closesAt" type="datetime-local" disabled={busy} className="clay-input" />
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
          disabled={busy}
          className="clay-input max-w-[8rem]"
        />
      </div>
      <button type="submit" disabled={busy} aria-busy={busy} className="btn-clay inline-flex gap-2 self-start">
        {busy ? <ClaySpinner /> : null}
        {busy ? "Creating…" : "Create lottery"}
      </button>
    </form>
  );
}
