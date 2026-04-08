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

  const countryOptions = [
    { code: "US", label: "United States" },
    { code: "CA", label: "Canada" },
    { code: "GB", label: "United Kingdom" },
    { code: "AU", label: "Australia" },
    { code: "NZ", label: "New Zealand" },
    { code: "DE", label: "Germany" },
    { code: "FR", label: "France" },
    { code: "NL", label: "Netherlands" },
    { code: "SE", label: "Sweden" },
    { code: "NO", label: "Norway" },
    { code: "DK", label: "Denmark" },
    { code: "IE", label: "Ireland" },
    { code: "ES", label: "Spain" },
    { code: "IT", label: "Italy" },
    { code: "PT", label: "Portugal" },
    { code: "CH", label: "Switzerland" },
    { code: "AT", label: "Austria" },
    { code: "BE", label: "Belgium" },
    { code: "PL", label: "Poland" },
    { code: "JP", label: "Japan" },
    { code: "KR", label: "South Korea" },
    { code: "SG", label: "Singapore" },
  ] as const;

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
      country: String(fd.get("country") ?? ""),
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
          Full name <span className="text-pomegranate-400">*</span>
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
          Email <span className="text-pomegranate-400">*</span>
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
          Shipping address <span className="text-pomegranate-400">*</span>
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
      <div>
        <label htmlFor={`${formId}-country`} className="clay-label">
          Shipping country <span className="text-pomegranate-400">*</span>
        </label>
        <select
          id={`${formId}-country`}
          name="country"
          required
          disabled={loading}
          autoComplete="country"
          defaultValue=""
          className="clay-input"
        >
          <option value="" disabled>
            Select a country
          </option>
          {countryOptions.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      {requireInstagram ? (
        <div>
          <label htmlFor={`${formId}-instagram`} className="clay-label">
            Instagram username <span className="text-pomegranate-400">*</span>
          </label>
          <input
            id={`${formId}-instagram`}
            name="instagram"
            required
            disabled={loading}
            aria-required="true"
            autoComplete="off"
            placeholder="username (no @)"
            className="clay-input"
          />
          <p className="mt-2 text-sm text-warm-silver">Just the username (example: <span className="font-mono">artistname</span>).</p>
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
        className="btn-clay inline-flex w-full justify-center gap-2 py-3 text-base"
      >
        {loading ? <ClaySpinner /> : null}
        {loading ? "Submitting…" : "Enter lottery"}
      </button>
    </form>
  );
}
