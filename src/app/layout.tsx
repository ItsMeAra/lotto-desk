import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
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
        <footer className="mx-auto w-full max-w-5xl shrink-0 px-4 pb-10 pt-12 text-sm text-muted sm:px-6">
          © {new Date().getFullYear()} Rafflehaus. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
