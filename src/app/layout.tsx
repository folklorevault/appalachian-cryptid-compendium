import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { ClassificationStripe } from "@/components/ClassificationStripe";
import { Header } from "@/components/Header";
import { SiteHeaderGate } from "@/components/SiteHeaderGate";
import "./globals.css";

const workSans = localFont({
  src: [
    { path: "../../public/fonts/worksans-400-latin.woff2", weight: "400" },
    { path: "../../public/fonts/worksans-600-latin.woff2", weight: "600" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const rokkitt = localFont({
  src: [{ path: "../../public/fonts/rokkitt-700-latin.woff2", weight: "700" }],
  variable: "--font-display",
  display: "swap",
});

const specialElite = localFont({
  src: [
    {
      path: "../../public/fonts/specialelite-400-latin.woff2",
      weight: "400",
    },
  ],
  variable: "--font-typewriter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Appalachian Cryptids List | Appalachian Cryptid Bureau",
    template: "%s | Appalachian Cryptids List",
  },
  description:
    "A list of cryptids associated with the Appalachian region, cataloged and documented by the Appalachian Cryptid Bureau.",
  metadataBase: new URL("https://appalachiancryptid.com"),
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/rss.xml", title: "Appalachian Cryptid Bureau — Field Dispatches" },
      ],
    },
  },
  openGraph: {
    siteName: "Appalachian Cryptids List",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
  other: {
    "theme-color": "#3a5a47",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      </head>
      <body
        className={`${workSans.variable} ${rokkitt.variable} ${specialElite.variable}`}
      >
        {/* Rubber-stamp ink-distress filter, referenced site-wide via filter: url(#__svg-stamp-texture) */}
        <svg
          aria-hidden="true"
          focusable="false"
          width="0"
          height="0"
          style={{ position: "absolute" }}
        >
          <filter id="__svg-stamp-texture">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.35"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" />
          </filter>
        </svg>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <ClassificationStripe />
        <SiteHeaderGate>
          <Header />
        </SiteHeaderGate>
        {children}
        <Analytics />
        <Script
          src="https://rybbit.folklorevault.com/api/script.js"
          data-site-id="0a6c699fadfc"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
