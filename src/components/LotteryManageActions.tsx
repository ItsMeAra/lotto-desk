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
  const [pending, setPending] = useState<null | "open" | "close" | "draw" | "delete">(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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

  async function deleteLottery() {
    if (
      !confirm(
        "Delete this lottery permanently? This removes entries, winners, and audit-linked data for this lottery."
      )
    ) {
      return;
    }
    setPending("delete");
    setErr(null);
    const res = await fetch(`/api/lotteries/${lotteryId}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    setPending(null);
    if (!res.ok) {
      setErr(apiErrorMessage(data));
      return;
    }
    router.push("/dashboard/lotteries");
    router.refresh();
  }

  function copyPublicLink() {
    const url = `${window.location.origin}/l/${slug}`;
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }

  const publishHintId = "lottery-publish-image-hint";
  const scheduleHintId = "lottery-schedule-hint";
  const publicPath = `/l/${slug}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="clay-card-dashed flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="clay-label mb-1">Public link</p>
          <a
            href={publicPath}
            target="_blank"
            rel="noreferrer"
            className="link-clay block max-w-full truncate text-sm"
            title={publicPath}
          >
            {publicPath}
          </a>
        </div>
        <button
          type="button"
          aria-label="Copy public lottery link to clipboard"
          className={`btn-clay-muted ${copied ? "border-matcha-800/40 bg-matcha-300/50 text-matcha-800" : ""}`}
          onClick={copyPublicLink}
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
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
            {pending === "open" ? <ClaySpinner variant="onLight" /> : null}
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
            {pending === "close" ? <ClaySpinner variant="onLight" /> : null}
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
          disabled={busy}
          aria-busy={pending === "delete"}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-pomegranate-400/40 bg-pomegranate-400/15 px-4 py-2 text-sm font-semibold tracking-tight text-pomegranate-400 shadow-[var(--shadow-ring)] transition-colors hover:bg-pomegranate-400/25 disabled:opacity-45"
          onClick={deleteLottery}
        >
          {pending === "delete" ? <ClaySpinner /> : null}
          {pending === "delete" ? "Deleting…" : "Delete lottery"}
        </button>
      </div>
    </div>
  );
}
