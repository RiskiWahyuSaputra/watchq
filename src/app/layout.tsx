import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import ScrollProgress from "@/components/layout/ScrollProgress";
import ClientChrome from "@/components/layout/ClientChrome";

// Self-hosted (OFL) so builds never depend on a network fetch.
const serif = localFont({
  src: [
    { path: "../fonts/cormorant-garamond.woff2", weight: "300 500", style: "normal" },
    { path: "../fonts/cormorant-garamond-italic.woff2", weight: "300 500", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const sans = localFont({
  src: [{ path: "../fonts/manrope.woff2", weight: "300 600", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const title = "WatchQ — Timeless. Beyond Time.";
const description = "Discover WatchQ, where timeless elegance meets precision and craftsmanship.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  applicationName: "WatchQ",
  openGraph: {
    type: "website",
    siteName: "WatchQ",
    title,
    description,
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "WatchQ silver chronograph under a spotlight" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint so hero copy can start hidden (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="bg-ink font-sans text-fg antialiased">
        <SmoothScroll>
          <a href="#philosophy" className="skip-link">Skip to content</a>
          <ScrollProgress />
          <Navbar />
          {children}
          <ClientChrome />
        </SmoothScroll>
      </body>
    </html>
  );
}
