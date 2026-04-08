import { AuthHeroBackground } from "@/components/AuthHeroBackground";
import { UpdatePasswordForm } from "@/components/UpdatePasswordForm";
import Link from "next/link";

export default function UpdatePasswordPage() {
  return (
    <div className="relative isolate z-0 flex min-h-dvh flex-1 flex-col">
      <AuthHeroBackground />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="mb-8 text-center">
          <Link href="/" className="link-clay text-sm">
            ← Home
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-clay-black">Set a new password</h1>
          <p className="mt-2 text-base text-warm-silver">Choose a password for your account, then you will go to the dashboard.</p>
        </div>
        <div className="clay-card w-full max-w-md p-8 sm:p-10">
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
}
