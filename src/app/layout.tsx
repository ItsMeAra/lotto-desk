import type { Metadata } from "next";
import Link from "next/link";
import { Archivo_Black, Inter } from "next/font/google";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { CookiePreferencesLink } from "@/components/CookiePreferencesLink";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Rafflehaus",
  description:
    "Rafflehaus — run lotteries for exclusive drops: entries, deduplication, draws, and CSV export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${archivoBlack.variable} h-full`}>
      <body className="flex min-h-dvh flex-col font-sans antialiased bg-cream text-clay-black">
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <CookieConsentBanner />
        <footer className="mx-auto w-full max-w-5xl shrink-0 px-4 pb-10 pt-12 text-sm text-muted sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p>© {new Date().getFullYear()} Rafflehaus. All rights reserved.</p>
            <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal">
              <Link href="/privacy" className="link-clay font-medium text-clay-black">
                Privacy Policy
              </Link>
              <Link href="/terms" className="link-clay font-medium text-clay-black">
                Terms of Service
              </Link>
              <CookiePreferencesLink />
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
