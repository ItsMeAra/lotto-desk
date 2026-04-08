type Props = {
  /** Dark / purple buttons and nav — white ring */
  variant?: "onDark" | "onLight";
  className?: string;
};

/** Inline loading ring; size follows `text-*` on parent when using `em` units. */
export function ClaySpinner({ variant = "onDark", className = "" }: Props) {
  const ring =
    variant === "onLight"
      ? "border-ink-on-light/25 border-t-ink-on-light"
      : "border-white/35 border-t-white";
  return (
    <span
      className={`inline-block size-[1em] min-h-[1em] min-w-[1em] shrink-0 animate-spin rounded-full border-2 ${ring} ${className}`}
      aria-hidden
    />
  );
}
