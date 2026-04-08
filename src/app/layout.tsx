import type { Metadata } from "next";
import { Rubik, Syne } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Lottery Desk",
  description: "Run lotteries for exclusive drops—entries, deduplication, draws, and CSV export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rubik.variable} ${syne.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased bg-cream text-clay-black">
        {children}
      </body>
    </html>
  );
}
