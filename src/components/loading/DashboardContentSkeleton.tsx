/** Shared pulse blocks for dashboard route `loading.tsx` files. */
export function DashboardContentSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading">
      <div className="h-3 w-28 rounded bg-oat" />
      <div className="h-9 w-56 max-w-full rounded bg-oat" />
      <div className="h-5 w-full max-w-lg rounded bg-oat-light" />
      <div className="h-5 w-2/3 max-w-md rounded bg-oat-light" />
      <div className="mt-10 h-24 rounded-[24px] bg-oat-light" />
    </div>
  );
}

export function LotteryListSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="h-3 w-32 rounded bg-oat" />
          <div className="h-9 w-48 rounded bg-oat" />
        </div>
        <div className="h-10 w-36 rounded-full bg-oat-light" />
      </div>
      <ul className="mt-10 divide-y divide-oat overflow-hidden rounded-[24px] border border-oat bg-card p-0">
        {[1, 2, 3].map((i) => (
          <li key={i} className="px-5 py-5">
            <div className="h-5 w-2/5 rounded bg-oat" />
            <div className="mt-2 h-4 w-3/5 max-w-sm rounded bg-oat-light" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LotteryDetailSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="h-4 w-28 rounded bg-oat-light" />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="h-10 w-64 max-w-full rounded bg-oat" />
          <div className="h-4 w-48 rounded bg-oat-light" />
        </div>
        <div className="h-8 w-20 rounded-[11px] bg-oat-light" />
      </div>
      <div className="mt-8 h-48 max-w-lg rounded-[24px] bg-oat-light" />
      <div className="mt-10 space-y-8">
        <div className="rounded-[24px] border border-dashed border-oat bg-card p-8">
          <div className="h-6 w-40 rounded bg-oat" />
          <div className="mt-4 h-4 w-full rounded bg-oat-light" />
          <div className="mt-6 h-10 w-44 rounded-[12px] bg-oat-light" />
        </div>
        <div className="rounded-[24px] border border-oat bg-card p-8">
          <div className="h-6 w-32 rounded bg-oat" />
          <div className="mt-6 space-y-3">
            <div className="h-10 w-full rounded bg-oat-light" />
            <div className="h-24 w-full rounded bg-oat-light" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PublicLotterySkeleton() {
  return (
    <div className="mx-auto max-w-lg animate-pulse px-4 py-12 sm:px-6 sm:py-16" aria-busy="true" aria-label="Loading">
      <div className="mb-8 aspect-[4/3] w-full rounded-[24px] bg-oat-light" />
      <div className="rounded-[24px] border border-oat bg-card p-8">
        <div className="h-3 w-20 rounded bg-oat" />
        <div className="mt-3 h-8 w-4/5 rounded bg-oat" />
        <div className="mt-4 h-4 w-full rounded bg-oat-light" />
        <div className="mt-2 h-4 w-full rounded bg-oat-light" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-1/2 rounded bg-oat-light" />
          <div className="h-4 w-1/3 rounded bg-oat-light" />
        </div>
      </div>
      <div className="mt-8 rounded-[24px] border border-dashed border-oat bg-card p-8">
        <div className="h-6 w-48 rounded bg-oat" />
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-full rounded bg-oat-light" />
          ))}
        </div>
      </div>
    </div>
  );
}
