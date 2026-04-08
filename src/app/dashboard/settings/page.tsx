import Link from "next/link";
import { SettingsPasswordForm } from "@/components/SettingsPasswordForm";
import { SettingsProfileForm } from "@/components/SettingsProfileForm";
import { requireOrganizer } from "@/lib/auth";

export default async function SettingsPage() {
  const { profile } = await requireOrganizer();
  if (!profile) return null;

  return (
    <div>
      <Link href="/dashboard/lotteries" className="link-clay text-sm">
        ← Lotteries
      </Link>
      <header className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-clay-black sm:text-3xl">Account settings</h1>
        <p className="mt-2 max-w-xl text-base text-warm-silver">
          Update how you appear when signed in and manage your password.
        </p>
      </header>

      <div className="mt-10 flex max-w-xl flex-col gap-8">
        <SettingsProfileForm
          key={profile.updatedAt.toISOString()}
          initialDisplayName={profile.displayName}
          email={profile.email}
        />
        <SettingsPasswordForm />
      </div>
    </div>
  );
}
