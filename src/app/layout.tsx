import type { Metadata } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Club Y — Guildford's Late-Night Quarter",
  description:
    "Two venues in the heart of Guildford. The Cornerhouse for the late nights. The Quadrant for the long summer evenings.",
  icons: {
    icon: "/seo/favicon-y.png",
    apple: "/seo/apple-touch-icon.png",
  },
  openGraph: {
    images: ["/images/logo/y-white-no-background.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-white text-[#080808]">
        {/* Skip-to-content — visually hidden until keyboard focused */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:text-sm focus:font-bold focus:outline-none"
        >
          Skip to content
        </a>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
