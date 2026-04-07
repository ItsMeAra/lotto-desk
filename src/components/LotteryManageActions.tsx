"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Status = "DRAFT" | "OPEN" | "CLOSED" | "DRAWN";

function apiErrorMessage(data: unknown): string {
  if (data && typeof data === "object" && "error" in data) {
    const e = (data as { error: unknown }).error;
    if (typeof e === "string") return e;
  }
  return "Request failed";
}

type Props = {
  lotteryId: string;
  slug: string;
  status: Status;
  entryCount: number;
  winnerCount: number;
  configuredWinners: number;
  hasImage: boolean;
  opensAt: string | null;
  scheduledOpensInFuture: boolean;
};

export function LotteryManageActions({
  lotteryId,
  slug,
  status,
  entryCount,
  winnerCount,
  configuredWinners,
  hasImage,
  opensAt,
  scheduledOpensInFuture,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function patch(body: object) {
    setBusy(true);
    setErr(null);
    const res = await fetch(`/api/lotteries/${lotteryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setErr(apiErrorMessage(data));
      return;
    }
    router.refresh();
  }

  async function closeLottery() {
    setBusy(true);
    setErr(null);
    const res = await fetch(`/api/lotteries/${lotteryId}/close`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setErr(apiErrorMessage(data));
      return;
    }
    router.refresh();
  }

  async function drawWinners() {
    if (!confirm(`Pick up to ${configuredWinners} winner(s) from ${entryCount} entries?`)) return;
    setBusy(true);
    setErr(null);
    const res = await fetch(`/api/lotteries/${lotteryId}/draw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setErr(apiErrorMessage(data));
      return;
    }
    router.refresh();
  }

  function copyPublicLink() {
    const url = `${window.location.origin}/l/${slug}`;
    void navigator.clipboard.writeText(url);
  }

  const publishHintId = "lottery-publish-image-hint";
  const scheduleHintId = "lottery-schedule-hint";

  return (
    <div className="flex flex-col gap-3">
      {err ? (
        <p className="text-sm text-pomegranate-400" role="alert">
          {err}
        </p>
      ) : null}
      {status === "DRAFT" && scheduledOpensInFuture && opensAt ? (
        <p id={scheduleHintId} className="text-sm text-warm-silver">
          Scheduled start: {new Date(opensAt).toLocaleString()}. Entries open automatically at that time once an image
          is uploaded—you can also open early with &ldquo;Open entries now&rdquo;.
        </p>
      ) : null}
      {status === "DRAFT" && !hasImage ? (
        <p id={publishHintId} className="text-sm font-medium text-lemon-700">
          Upload an image before you can open entries.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {status === "DRAFT" ? (
          <button
            type="button"
            disabled={busy || !hasImage}
            onClick={() => patch({ status: "OPEN" })}
            aria-describedby={
              [!hasImage ? publishHintId : "", scheduledOpensInFuture ? scheduleHintId : ""]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className="btn-clay-matcha"
          >
            Open entries now
          </button>
        ) : null}
        {status === "OPEN" ? (
          <button type="button" disabled={busy} onClick={closeLottery} className="btn-clay-lemon">
            Close entries
          </button>
        ) : null}
        {status === "CLOSED" && entryCount > 0 ? (
          <button type="button" disabled={busy} onClick={drawWinners} className="btn-clay-ube">
            Draw {configuredWinners} winner{configuredWinners !== 1 ? "s" : ""}
          </button>
        ) : null}
        <a
          href={`/api/lotteries/${lotteryId}/export?type=entries`}
          className="btn-clay-muted no-underline"
        >
          Export entries CSV
        </a>
        {winnerCount > 0 ? (
          <a
            href={`/api/lotteries/${lotteryId}/export?type=winners`}
            className="btn-clay-muted no-underline"
          >
            Export winners CSV
          </a>
        ) : null}
        <button
          type="button"
          aria-label="Copy public lottery link to clipboard"
          className="btn-clay-muted"
          onClick={copyPublicLink}
        >
          Copy public link
        </button>
      </div>
    </div>
  );
}
