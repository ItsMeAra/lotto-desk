type Props = {
  /** Near-black or dark green buttons — light ring */
  variant?: "onDark" | "onLight";
  className?: string;
};

/** Inline loading ring; size follows `text-*` on parent when using `em` units. */
export function ClaySpinner({ variant = "onLight", className = "" }: Props) {
  const ring =
    variant === "onDark"
      ? "border-white/35 border-t-white"
      : "border-clay-black/20 border-t-clay-black";
  return (
    <span
      className={`inline-block size-[1em] min-h-[1em] min-w-[1em] shrink-0 animate-spin rounded-full border-2 ${ring} ${className}`}
      aria-hidden
    />
  );
}
