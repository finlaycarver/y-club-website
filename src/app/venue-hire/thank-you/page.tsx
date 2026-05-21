import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";
import { BRAND } from "@/lib/site";

export const metadata: Metadata = {
  title: "Enquiry received — Thanks",
  description:
    "We've got your venue hire enquiry. We'll be back to you within 48 hours.",
  alternates: { canonical: "/venue-hire/thank-you" },
  robots: { index: false, follow: true },
};

interface ThankYouProps {
  // Next.js 15+ passes searchParams as a Promise on the server
  searchParams: Promise<{ name?: string; eventType?: string }>;
}

export default async function VenueHireThankYouPage({ searchParams }: ThankYouProps) {
  const { name = "", eventType = "" } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="relative bg-black overflow-hidden flex items-center"
        style={{ minHeight: "100svh" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.03,
            backgroundImage: GRAIN_SVG,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />

        <div
          className="relative z-10 text-white px-6 md:px-16 w-full"
          style={{ maxWidth: "880px", margin: "0 auto" }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
              marginBottom: "18px",
            }}
          >
            Enquiry received
          </p>
          <h1
            className="text-[48px] md:text-[80px]"
            style={{
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
              marginBottom: "24px",
            }}
          >
            {name ? `Thanks, ${name}.` : "Thanks."}
          </h1>
          <p
            className="text-[18px] md:text-[22px]"
            style={{
              fontWeight: 400,
              color: "rgba(255,255,255,0.75)",
              marginBottom: "32px",
              maxWidth: "620px",
              lineHeight: 1.5,
            }}
          >
            We&apos;ve got your{eventType ? ` ${eventType.toLowerCase()}` : ""} enquiry.
            We&apos;ll be back to you within 48 hours with availability and a bespoke package.
          </p>

          <div
            style={{
              padding: "20px 24px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.04)",
              marginBottom: "40px",
              maxWidth: "560px",
            }}
          >
            <p style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "10px" }}>
              Need us sooner?
            </p>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", marginBottom: "6px" }}>
              Call <a href={`tel:${BRAND.phone}`} className="underline">{BRAND.phoneDisplay}</a>
            </p>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)" }}>
              Email <a href={`mailto:${BRAND.email}`} className="underline">{BRAND.email}</a>
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 border border-white px-6 text-[17px] font-bold hover:-translate-y-0.5 transition-transform duration-200 motion-reduce:transition-none bg-white text-black w-full md:w-auto"
              style={{ height: "52px" }}
            >
              Back to Home
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
            <Link
              href="/whats-on"
              className="group inline-flex items-center justify-center gap-2 border border-white/60 px-6 text-[17px] font-bold text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 motion-reduce:transition-none w-full md:w-auto"
              style={{ height: "52px" }}
            >
              See What&apos;s On
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
