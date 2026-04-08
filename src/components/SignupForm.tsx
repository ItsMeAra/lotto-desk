"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClaySpinner } from "@/components/ui/ClaySpinner";

export function SignupForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setInfo(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    if (password.length < 8) {
      setErr("Password must be at least 8 characters.");
      setBusy(false);
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }
    setInfo("Check your email to confirm your account, then sign in.");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" aria-busy={busy}>
      {err ? (
        <p className="text-sm text-pomegranate-400" role="alert">
          {err}
        </p>
      ) : null}
      {info ? (
        <p className="rounded-[12px] border border-lemon-500/35 bg-lemon-500/10 p-3 text-sm text-clay-black" role="status">
          {info}
        </p>
      ) : null}
      <div>
        <label htmlFor="signup-email" className="clay-label">
          Email
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          disabled={busy}
          autoComplete="email"
          className="clay-input"
        />
      </div>
      <div>
        <label htmlFor="signup-password" className="clay-label">
          Password
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          required
          minLength={8}
          disabled={busy}
          autoComplete="new-password"
          className="clay-input"
        />
      </div>
      <button type="submit" disabled={busy} aria-busy={busy} className="btn-clay inline-flex w-full justify-center gap-2">
        {busy ? <ClaySpinner /> : null}
        {busy ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-base text-warm-silver">
        Already have an account?{" "}
        <Link href="/login" className="link-clay font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
