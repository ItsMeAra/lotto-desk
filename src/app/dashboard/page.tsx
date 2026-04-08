import { redirect } from "next/navigation";

/** Hub is the lotteries list — thin overview added little value for organizers. */
export default function DashboardPage() {
  redirect("/dashboard/lotteries");
}
