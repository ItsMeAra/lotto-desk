type Props = {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

/** Shared layout for Privacy / Terms. Template disclaimer is shown for counsel review. */
export function LegalDocument({ title, lastUpdated, children }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-10">
      <article className="space-y-10 text-base leading-relaxed text-clay-black">
        <header className="space-y-2">
          <h1 className="font-display text-3xl font-normal tracking-tight text-clay-black md:text-4xl">{title}</h1>
          <p className="text-sm text-warm-silver">Last updated: {lastUpdated}</p>
        </header>
        {children}
      </article>
    </div>
  );
}
