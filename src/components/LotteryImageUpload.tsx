"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

type Props = {
  lotteryId: string;
  disabled?: boolean;
};

export function LotteryImageUpload({ lotteryId, disabled }: Props) {
  const router = useRouter();
  const inputId = useId();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || disabled) return;
    setBusy(true);
    setMessage(null);
    const fd = new FormData();
    fd.set("file", file);
    const res = await fetch(`/api/lotteries/${lotteryId}/image`, {
      method: "POST",
      body: fd,
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string; status?: string };
    setBusy(false);
    if (!res.ok) {
      setMessage(data.error ?? "Upload failed");
      return;
    }
    setMessage("Image saved.");
    router.refresh();
  }

  return (
    <div className="clay-card p-6 sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight text-clay-black">Lottery image</h2>
      <p className="mt-2 text-base text-warm-silver">
        Add at least one image before entries can open. JPEG, PNG, WebP, or GIF, up to 5MB.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          disabled={disabled || busy}
          aria-busy={busy}
          aria-label="Upload lottery image file"
          onChange={onChange}
        />
        <label
          htmlFor={inputId}
          className={`btn-clay-muted ${disabled || busy ? "pointer-events-none opacity-50" : ""}`}
        >
          {busy ? "Uploading…" : "Choose image file"}
        </label>
        {message ? (
          <p className="text-sm text-warm-silver" role="status">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
