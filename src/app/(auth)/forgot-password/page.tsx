import { AuthHeroBackground } from "@/components/AuthHeroBackground";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="relative isolate z-0 flex flex-1 flex-col">
      <AuthHeroBackground />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="mb-8 text-center">
          <Link href="/" className="link-clay text-sm">
            ← Home
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-clay-black">Forgot password</h1>
          <p className="mt-2 text-base text-warm-silver">We will email you a link to choose a new password.</p>
        </div>
        <div className="clay-card w-full max-w-md p-8 sm:p-10">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
