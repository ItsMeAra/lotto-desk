import { LoginForm } from "@/components/LoginForm";
import Link from "next/link";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="mb-8 text-center">
        <Link href="/" className="link-clay text-sm">
          ← Home
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-clay-black">Sign in</h1>
        <p className="mt-2 text-base text-warm-silver">Organizer dashboard access</p>
      </div>
      <div className="clay-card w-full max-w-md p-8 sm:p-10">
        <Suspense fallback={<p className="text-center text-sm text-warm-silver">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
