import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { ClassificationStripe } from "@/components/ClassificationStripe";
import { Header } from "@/components/Header";
import { StampFilter } from "@/components/Stamp";
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
    default:
      "Appalachian Cryptids List | Field Guide to Monsters of the Mountains & American South",
    template: "%s | Appalachian Cryptid Field Guide",
  },
  description:
    "Complete list of Appalachian cryptids, monsters, and strange creatures. Browse documented sightings of Mothman, Wampus Cat, and more from the mountains and hollers of the American South.",
  metadataBase: new URL("https://appalachiancryptid.com"),
  alternates: {
    canonical: "./",
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
  manifest: "/site.webmanifest",
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <StampFilter />
        <ClassificationStripe />
        <Header />
        {children}
        <Script
          src="https://rybbit.folklorevault.com/api/script.js"
          data-site-id="0a6c699fadfc"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
