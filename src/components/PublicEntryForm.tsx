"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useId, useState } from "react";
import { ClaySpinner } from "@/components/ui/ClaySpinner";

type Props = {
  slug: string;
  siteKey: string | undefined;
  requireInstagram: boolean;
  requirePaypal: boolean;
};

export function PublicEntryForm({ slug, siteKey, requireInstagram, requirePaypal }: Props) {
  const formId = useId();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const website = String(fd.get("website") ?? "");
    if (website) {
      setStatus("err");
      setMessage("Could not submit.");
      return;
    }
    const body = {
      fullName: String(fd.get("fullName") ?? ""),
      email: String(fd.get("email") ?? ""),
      address: String(fd.get("address") ?? ""),
      instagram: requireInstagram ? String(fd.get("instagram") ?? "") : null,
      paypal: requirePaypal ? String(fd.get("paypal") ?? "") : null,
      website: "",
      turnstileToken: siteKey ? token ?? undefined : undefined,
    };
    const res = await fetch(`/api/public/lotteries/${encodeURIComponent(slug)}/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setStatus("err");
      setMessage(data.error ?? "Something went wrong.");
      return;
    }
    setStatus("ok");
    setMessage("You are entered. Good luck!");
    form.reset();
    setToken(null);
  }

  if (status === "ok") {
    return (
      <div className="clay-card border-lemon-500/40 bg-lemon-500/10 p-6 text-clay-black">
        <p className="text-base font-medium">{message}</p>
      </div>
    );
  }

  const submitDisabled = status === "loading" || (!!siteKey && !token);
  const loading = status === "loading";

  return (
    <form id={formId} onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={loading}>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />
      <div>
        <label htmlFor={`${formId}-fullName`} className="clay-label">
          Full name
        </label>
        <input
          id={`${formId}-fullName`}
          name="fullName"
          required
          disabled={loading}
          autoComplete="name"
          className="clay-input"
        />
      </div>
      <div>
        <label htmlFor={`${formId}-email`} className="clay-label">
          Email
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          required
          disabled={loading}
          autoComplete="email"
          className="clay-input"
        />
      </div>
      <div>
        <label htmlFor={`${formId}-address`} className="clay-label">
          Shipping address
        </label>
        <textarea
          id={`${formId}-address`}
          name="address"
          required
          rows={3}
          disabled={loading}
          autoComplete="street-address"
          className="clay-input min-h-[5rem] resize-y"
        />
      </div>
      {requireInstagram ? (
        <div>
          <label htmlFor={`${formId}-instagram`} className="clay-label">
            Instagram <span className="text-pomegranate-400">*</span>
          </label>
          <input
            id={`${formId}-instagram`}
            name="instagram"
            required
            disabled={loading}
            aria-required="true"
            autoComplete="off"
            className="clay-input"
          />
        </div>
      ) : null}
      {requirePaypal ? (
        <div>
          <label htmlFor={`${formId}-paypal`} className="clay-label">
            PayPal email <span className="text-pomegranate-400">*</span>
          </label>
          <input
            id={`${formId}-paypal`}
            name="paypal"
            type="email"
            required
            disabled={loading}
            aria-required="true"
            autoComplete="email"
            className="clay-input"
          />
        </div>
      ) : null}
      {siteKey ? (
        <Turnstile siteKey={siteKey} onSuccess={setToken} onExpire={() => setToken(null)} />
      ) : null}
      {status === "err" ? (
        <p className="text-sm text-pomegranate-400" role="alert">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitDisabled}
        aria-busy={loading}
        className="btn-clay inline-flex w-full justify-center gap-2"
      >
        {loading ? <ClaySpinner /> : null}
        {loading ? "Submitting…" : "Enter lottery"}
      </button>
    </form>
  );
}
