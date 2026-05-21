import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { CookieBanner } from "@/components/CookieBanner";
import { Analytics } from "@/components/Analytics";
import { LocalBusinessSchema } from "@/components/structured-data/LocalBusinessSchema";
import { SITE_URL, SITE_NAME, SITE_FULL_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_FULL_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  icons: {
    icon: "/seo/favicon-y.png",
    apple: "/seo/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: SITE_FULL_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: "/seo/og-image.png", width: 1200, height: 630 }],
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_FULL_NAME,
    description: SITE_DESCRIPTION,
    images: ["/seo/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className="h-full antialiased">
      <head>
        {/* Preload primary woff2 weights to avoid FOIT/FOUT on first paint */}
        <link
          rel="preload"
          href="/fonts/NeueHaasDisplay_Roman.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/NeueHaasDisplay_Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full bg-white text-[#080808]">
        {/* Skip-to-content — visually hidden until keyboard focused */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:text-sm focus:font-bold focus:outline-none"
        >
          Skip to content
        </a>
        {/* Sitewide LocalBusiness structured data */}
        <LocalBusinessSchema />
        {/* Privacy-friendly analytics — only renders when env is configured */}
        <Analytics />
        <CustomCursor />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
