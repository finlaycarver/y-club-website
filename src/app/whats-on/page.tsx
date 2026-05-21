import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";
import { EventsList } from "./EventsList";
import { EVENTS } from "@/data/events";
import { EventSchema, type EventSchemaItem } from "@/components/structured-data/EventSchema";

export const metadata: Metadata = {
  title: "What's On — Events at Y, Guildford",
  description:
    "Every Friday and Saturday and more. Live DJs, themed nights, sports screenings and seasonal events at Y Club, Y Terrace, and Y Bar & Lounge.",
  alternates: { canonical: "/whats-on" },
  openGraph: {
    title: "What's On at Y, Guildford",
    description:
      "Live DJs, themed nights, sports screenings and seasonal events.",
    url: "/whats-on",
    images: [{ url: "/images/club-y-image-6.webp", width: 1200, height: 630 }],
  },
};

export default function WhatsOnPage() {
  // Convert internal events into the Event JSON-LD shape
  const schemaEvents: EventSchemaItem[] = EVENTS.map((event) => ({
    title: event.title,
    startDate: event.isoDate,
    endDate: event.isoEndDate,
    venue: event.venue,
    imageUrl: event.imageUrl,
    description: event.description,
    ticketUrl: event.ticketUrl,
  }));

  return (
    <>
      <EventSchema events={schemaEvents} />
      <SiteHeader />
      <main id="main-content">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section className="relative bg-black overflow-hidden flex items-end" style={{ minHeight: "60svh" }}>
          <Image
            src="/images/club-y-image-6.webp"
            alt="What's on at Y"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.85) 100%)" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.03, backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
          />
          <div className="relative z-10 text-white px-6 md:px-16 pb-16 pt-40">
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "16px",
            }}>
              Every Friday and Saturday — and more
            </p>
            <h1 className="text-[46px] md:text-[80px]" style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em" }}>
              What&apos;s On
            </h1>
          </div>
        </section>

        {/* Interactive filter + grid (client island). Suspense boundary
            is required because EventsList reads useSearchParams. */}
        <Suspense fallback={<EventsListFallback />}>
          <EventsList />
        </Suspense>

        {/* ── NEWSLETTER PROMPT ──────────────────────────────────────── */}
        <section className="bg-white text-black" style={{ padding: "80px 24px" }}>
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
            style={{ maxWidth: "1200px", margin: "0 auto" }}
          >
            <div>
              <p style={{
                fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "16px",
              }}>
                Never miss a night
              </p>
              <h2
                className="text-[36px] md:text-[50px]"
                style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em" }}
              >
                First to know.
              </h2>
              <p style={{
                fontSize: "18px", color: "rgba(0,0,0,0.55)",
                marginTop: "16px", maxWidth: "460px", lineHeight: "1.65",
              }}>
                Sign up for early access to ticket releases and members-only events.
              </p>
            </div>
            <Link
              href="/members"
              className="group inline-flex items-center justify-center gap-2 border border-black px-8 text-[17px] font-bold text-black hover:bg-black hover:text-white transition-colors duration-200 motion-reduce:transition-none shrink-0"
              style={{ height: "54px" }}
            >
              Join the list
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}

/**
 * Lightweight skeleton shown while the client island is hydrating /
 * reading search params. Keeps the page layout stable so the user
 * doesn't see a flash of blank space. Visually mirrors the real
 * filter row + grid heights.
 */
function EventsListFallback() {
  return (
    <>
      <div
        aria-hidden="true"
        className="bg-black"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          height: "100px",
        }}
      />
      <div
        aria-hidden="true"
        className="bg-black"
        style={{ minHeight: "60vh" }}
      />
    </>
  );
}
