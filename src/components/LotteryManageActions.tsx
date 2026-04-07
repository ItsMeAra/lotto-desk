"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClaySpinner } from "@/components/ui/ClaySpinner";

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
  const [pending, setPending] = useState<null | "open" | "close" | "draw">(null);
  const [err, setErr] = useState<string | null>(null);
  const busy = pending !== null;

  async function patch(body: object) {
    setPending("open");
    setErr(null);
    const res = await fetch(`/api/lotteries/${lotteryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    setPending(null);
    if (!res.ok) {
      setErr(apiErrorMessage(data));
      return;
    }
    router.refresh();
  }

  async function closeLottery() {
    setPending("close");
    setErr(null);
    const res = await fetch(`/api/lotteries/${lotteryId}/close`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setPending(null);
    if (!res.ok) {
      setErr(apiErrorMessage(data));
      return;
    }
    router.refresh();
  }

  async function drawWinners() {
    if (!confirm(`Pick up to ${configuredWinners} winner(s) from ${entryCount} entries?`)) return;
    setPending("draw");
    setErr(null);
    const res = await fetch(`/api/lotteries/${lotteryId}/draw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json().catch(() => ({}));
    setPending(null);
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
            aria-busy={pending === "open"}
            aria-describedby={
              [!hasImage ? publishHintId : "", scheduledOpensInFuture ? scheduleHintId : ""]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className="btn-clay-matcha items-center gap-2 text-sm"
          >
            {pending === "open" ? <ClaySpinner variant="onDark" /> : null}
            {pending === "open" ? "Opening…" : "Open entries now"}
          </button>
        ) : null}
        {status === "OPEN" ? (
          <button
            type="button"
            disabled={busy}
            aria-busy={pending === "close"}
            onClick={closeLottery}
            className="btn-clay-lemon items-center gap-2 text-sm"
          >
            {pending === "close" ? <ClaySpinner /> : null}
            {pending === "close" ? "Closing…" : "Close entries"}
          </button>
        ) : null}
        {status === "CLOSED" && entryCount > 0 ? (
          <button
            type="button"
            disabled={busy}
            aria-busy={pending === "draw"}
            onClick={drawWinners}
            className="btn-clay-ube items-center gap-2 text-sm"
          >
            {pending === "draw" ? <ClaySpinner variant="onDark" /> : null}
            {pending === "draw" ? "Drawing…" : `Draw ${configuredWinners} winner${configuredWinners !== 1 ? "s" : ""}`}
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
