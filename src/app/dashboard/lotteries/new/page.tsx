import Link from "next/link";
import { NewLotteryForm } from "@/components/NewLotteryForm";

export default function NewLotteryPage() {
  return (
    <div>
      <Link href="/dashboard/lotteries" className="link-clay text-sm">
        ← Lotteries
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-clay-black">New lottery</h1>
      <p className="mt-2 text-base text-warm-silver">Save as draft, add an image, then open entries when you are ready.</p>
      <div className="mt-10 clay-card p-8 sm:p-10">
        <NewLotteryForm />
      </div>
    </div>
  );
}
