import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClipCash — Pay per verified view",
  description:
    "Brands pay creators per verified view. Launch a campaign in under 20 minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-neutral-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">
              ClipCash<span className="text-accent">.</span>
            </Link>
            <nav className="flex gap-2 text-sm">
              <Link className="btn-ghost" href="/brand">
                Brand
              </Link>
              <Link className="btn-ghost" href="/creator">
                Creator
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
        <footer className="max-w-5xl mx-auto px-6 py-10 text-xs text-neutral-500">
          ClipCash MVP · Demo only · Data stored locally in your browser
        </footer>
      </body>
    </html>
  );
}
