"use client";

import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { ClaySpinner } from "@/components/ui/ClaySpinner";
import { fireDrawWinnerConfetti } from "@/lib/draw-confetti";

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
  const [drawCelebration, setDrawCelebration] = useState(false);
  const celebrationCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = pending !== null;

  useEffect(() => {
    return () => {
      if (celebrationCloseTimerRef.current) {
        clearTimeout(celebrationCloseTimerRef.current);
      }
    };
  }, []);

  const dismissDrawCelebration = useCallback(() => {
    if (celebrationCloseTimerRef.current) {
      clearTimeout(celebrationCloseTimerRef.current);
      celebrationCloseTimerRef.current = null;
    }
    setDrawCelebration(false);
  }, []);

  useEffect(() => {
    if (!drawCelebration) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") dismissDrawCelebration();
    }
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [drawCelebration, dismissDrawCelebration]);

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
    setDrawCelebration(true);
    requestAnimationFrame(() => {
      fireDrawWinnerConfetti();
    });
    router.refresh();
    if (celebrationCloseTimerRef.current) clearTimeout(celebrationCloseTimerRef.current);
    celebrationCloseTimerRef.current = setTimeout(() => {
      celebrationCloseTimerRef.current = null;
      setDrawCelebration(false);
    }, 2400);
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

  const celebrationOverlay =
    drawCelebration && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-clay-black/45 p-4 backdrop-blur-[3px]"
            role="presentation"
            onClick={dismissDrawCelebration}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="draw-win-title"
              className="clay-card max-w-sm p-8 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-display text-4xl leading-none text-matcha-800" aria-hidden>
                <span className="inline-block">🎉</span>
              </p>
              <h2 id="draw-win-title" className="mt-4 text-xl font-semibold tracking-tight text-clay-black">
                Winners drawn!
              </h2>
              <p className="mt-2 text-sm text-warm-silver">
                Your raffle is complete—winner details are below.
              </p>
              <button
                type="button"
                className="btn-clay-matcha mt-6 w-full justify-center text-sm"
                onClick={dismissDrawCelebration}
              >
                Done
              </button>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="flex flex-col gap-3">
      {celebrationOverlay}
      <div className="clay-card-dashed flex flex-col gap-3 p-4">
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
          aria-label={copied ? "Link copied to clipboard" : "Copy public lottery URL to clipboard"}
          title={copied ? "Copied" : "Copy URL"}
          className={`btn-clay-muted inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 ${copied ? "border-matcha-800/40 bg-matcha-300/50 text-matcha-800" : ""}`}
          onClick={copyPublicLink}
        >
          {copied ? (
            <>
              <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <rect x="9" y="9" width="13" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Copy URL</span>
            </>
          )}
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
      <div className="clay-card-dashed flex flex-col gap-3 p-4">
        <div>
          <p className="clay-label">Entries &amp; exports</p>
          <p className="mt-1 text-xs text-warm-silver">Open or close entries, draw winners, and download CSVs.</p>
        </div>
        <div className="flex flex-col gap-2">
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
              className="btn-clay-matcha w-full items-center justify-center gap-2 text-sm"
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
              className="btn-clay-lemon w-full items-center justify-center gap-2 text-sm"
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
              className="btn-clay-ube w-full items-center justify-center gap-2 text-sm"
            >
              {pending === "draw" ? <ClaySpinner variant="onDark" /> : null}
              {pending === "draw" ? "Drawing…" : `Draw ${configuredWinners} winner${configuredWinners !== 1 ? "s" : ""}`}
            </button>
          ) : null}
          <a
            href={`/api/lotteries/${lotteryId}/export?type=entries`}
            className="btn-clay-muted no-underline flex w-full items-center justify-center"
          >
            Export entries CSV
          </a>
          {winnerCount > 0 ? (
            <a
              href={`/api/lotteries/${lotteryId}/export?type=winners`}
              className="btn-clay-muted no-underline flex w-full items-center justify-center"
            >
              Export winners CSV
            </a>
          ) : null}
        </div>
      </div>
      <div
        className="rounded-[16px] border border-pomegranate-400/30 bg-pomegranate-400/[0.07] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
        role="region"
        aria-label="Delete lottery"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.065em] text-pomegranate-500">Delete lottery</p>
        <p className="mt-1.5 text-sm leading-snug text-warm-silver">
          Permanently removes this lottery and related entries, winners, and audit data.{" "}
          <span className="font-medium text-clay-black">This can&apos;t be undone.</span>
        </p>
        <button
          type="button"
          disabled={busy}
          aria-busy={pending === "delete"}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-pomegranate-400/40 bg-pomegranate-400/15 px-4 py-2 text-sm font-semibold tracking-tight text-pomegranate-400 shadow-[var(--shadow-ring)] transition-colors hover:bg-pomegranate-400/25 disabled:opacity-45"
          onClick={deleteLottery}
        >
          {pending === "delete" ? <ClaySpinner /> : null}
          {pending === "delete" ? "Deleting…" : "Delete lottery"}
        </button>
      </div>
    </div>
  );
}
