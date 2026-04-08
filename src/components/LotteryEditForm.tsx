"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClaySpinner } from "@/components/ui/ClaySpinner";

type Lottery = {
  id: string;
  title: string;
  description: string;
  opensAt: string | null;
  closesAt: string | null;
  winnerCount: number;
  status: string;
  collectInstagram: boolean;
  collectPaypal: boolean;
};

function toInputDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}

export function LotteryEditForm({ lottery }: { lottery: Lottery }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const body = {
      title: String(fd.get("title")),
      description: String(fd.get("description")),
      opensAt: String(fd.get("opensAt") || "") || null,
      closesAt: String(fd.get("closesAt") || "") || null,
      winnerCount: Number(fd.get("winnerCount")),
      collectInstagram: fd.get("collectInstagram") === "on",
      collectPaypal: fd.get("collectPaypal") === "on",
    };
    const res = await fetch(`/api/lotteries/${lottery.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: unknown };
    setBusy(false);
    if (!res.ok) {
      setErr("Could not save changes");
      console.error(data.error);
      return;
    }
    router.refresh();
  }

  const locked = lottery.status !== "DRAFT" && lottery.status !== "OPEN";
  const fieldsDisabled = locked || busy;

  return (
    <form onSubmit={onSubmit} className="clay-card-dashed flex flex-col gap-4 p-6 sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight text-clay-black">Details</h2>
      {err ? (
        <p className="text-sm text-pomegranate-400" role="alert">
          {err}
        </p>
      ) : null}
      <div>
        <label htmlFor={`title-${lottery.id}`} className="clay-label">
          Title
        </label>
        <input
          id={`title-${lottery.id}`}
          name="title"
          defaultValue={lottery.title}
          required
          disabled={fieldsDisabled}
          className="clay-input"
        />
      </div>
      <div>
        <label htmlFor={`desc-${lottery.id}`} className="clay-label">
          Description
        </label>
        <textarea
          id={`desc-${lottery.id}`}
          name="description"
          defaultValue={lottery.description}
          rows={4}
          disabled={fieldsDisabled}
          className="clay-input min-h-[6rem] resize-y"
        />
      </div>
      <fieldset disabled={fieldsDisabled} className="min-w-0 space-y-3 border-0 p-0">
        <legend className="clay-label mb-1">Public entry form</legend>
        <div className="flex flex-col gap-3">
          <label className="flex cursor-pointer items-start gap-3 text-base text-clay-black">
            <input
              type="checkbox"
              name="collectInstagram"
              value="on"
              defaultChecked={lottery.collectInstagram}
              className="mt-1 size-4 rounded border border-input-border"
            />
            <span>
              Ask for Instagram <span className="text-warm-silver">(required when enabled)</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-base text-clay-black">
            <input
              type="checkbox"
              name="collectPaypal"
              value="on"
              defaultChecked={lottery.collectPaypal}
              className="mt-1 size-4 rounded border border-input-border"
            />
            <span>
              Ask for PayPal email <span className="text-warm-silver">(required when enabled)</span>
            </span>
          </label>
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`opens-${lottery.id}`} className="clay-label">
            Opens (optional)
          </label>
          <input
            id={`opens-${lottery.id}`}
            name="opensAt"
            type="datetime-local"
            defaultValue={toInputDate(lottery.opensAt)}
            disabled={fieldsDisabled}
            className="clay-input"
          />
          <p className="mt-1 text-xs text-warm-silver">
            After this time, entries open automatically once an image is set.
          </p>
        </div>
        <div>
          <label htmlFor={`closes-${lottery.id}`} className="clay-label">
            Closes (optional)
          </label>
          <input
            id={`closes-${lottery.id}`}
            name="closesAt"
            type="datetime-local"
            defaultValue={toInputDate(lottery.closesAt)}
            disabled={fieldsDisabled}
            className="clay-input"
          />
        </div>
      </div>
      <div>
        <label htmlFor={`winners-${lottery.id}`} className="clay-label">
          Number of winners
        </label>
        <input
          id={`winners-${lottery.id}`}
          name="winnerCount"
          type="number"
          min={1}
          max={100}
          defaultValue={lottery.winnerCount}
          disabled={fieldsDisabled}
          className="clay-input max-w-[8rem]"
        />
      </div>
      {!locked ? (
        <button type="submit" disabled={busy} aria-busy={busy} className="btn-clay inline-flex gap-2 self-start">
          {busy ? <ClaySpinner /> : null}
          {busy ? "Saving…" : "Save changes"}
        </button>
      ) : (
        <p className="text-sm text-warm-silver">Editing is limited after entries are closed or drawn.</p>
      )}
    </form>
  );
}
