import { DashboardNav } from "@/components/DashboardNav";
import { requireOrganizer } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireOrganizer();
  if (!user || !profile) {
    redirect("/login");
  }
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-cream-deep">
      <DashboardNav />
      <main className="mx-auto min-h-0 w-full max-w-5xl flex-1 px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6">
        {children}
      </main>
    </div>
  );
}
