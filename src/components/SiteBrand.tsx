import Link from "next/link";

type Props = {
  href?: string;
  className?: string;
};

/** Minimal wordmark for floating nav. */
export function SiteBrand({ href = "/", className = "" }: Props) {
  return (
    <Link href={href} className={`nav-floating-brand no-underline ${className}`}>
      Lotto Locker
    </Link>
  );
}
