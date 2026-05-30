import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";
import { EventsList } from "./EventsList";
import { WhatsOnCountdown } from "./WhatsOnCountdown";
import { localTodayIso, upcomingEvents } from "@/data/events";
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
    images: [{ url: "/images/14.webp", width: 1200, height: 630 }],
  },
};

export const revalidate = 3600;

export default function WhatsOnPage() {
  // Convert internal events into the Event JSON-LD shape
  const events = upcomingEvents();
  const schemaEvents: EventSchemaItem[] = events.map((event) => ({
    title: event.title,
    startDate: event.isoDate,
    endDate: event.isoEndDate,
    venue: event.venue,
    imageUrl: event.imageUrl,
    description: event.description,
    ticketUrl: event.ticketUrl,
  }));

  // Next upcoming event — soonest isoDate on or after today.
  // Drives the live countdown strip in the hero.
  const todayStr = localTodayIso();
  const nextEvent =
    events
      .filter((e) => e.isoDate >= todayStr)
      .sort((a, b) => a.isoDate.localeCompare(b.isoDate))[0] ?? null;

  return (
    <>
      <EventSchema events={schemaEvents} />
      <SiteHeader />
      <main id="main-content">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        {/* Height reduced 60svh → 50svh so the filter bar lands in the
            viewport on most desktops without scrolling. Image swapped to
            an evergreen crowd shot — no event-specific poster. */}
        <section
          className="relative bg-black overflow-hidden flex items-end"
          style={{ minHeight: "65svh" }}
        >
          <Image
            src="/images/_MG_7938.jpg"
            alt="What's on at Y, Guildford"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          {/* Gradient scrim */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.88) 100%)",
            }}
          />
          {/* Grain */}
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

          <div className="relative z-10 text-white px-6 md:px-16 pb-16 pt-40">

            {/* Frosted-glass kicker pill — single line on all desktop
                sizes; backdrop-blur gives it atmosphere against the image */}
            <p
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "5px 12px",
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.18)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                marginBottom: "20px",
                whiteSpace: "nowrap",
              }}
            >
              {/* Responsive variant — the full phrase overflows the pill
                  at 320–375px viewports (audit: kicker wraps to 2 lines).
                  Short variant fits at 320px+. */}
              <span className="md:hidden">Friday, Saturday — and more</span>
              <span className="hidden md:inline">Every Friday and Saturday — and more</span>
            </p>

            {/* H1 — word-stagger using the shared .hero-word pull-up
                animation (same keyframe as the home page hero). */}
            <h1
              className="text-[46px] md:text-[80px]"
              style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em" }}
            >
              <span className="hero-word" style={{ animationDelay: "100ms" }}>
                What&apos;s
              </span>
              {" "}
              <span className="hero-word" style={{ animationDelay: "260ms" }}>
                On
              </span>
            </h1>

            {/* Live countdown — client island, returns null until hydrated
                to avoid SSR/client mismatch on the time value. */}
            {nextEvent && <WhatsOnCountdown event={nextEvent} />}

            {/* Hero CTA — clear first action without scrolling */}
            <Link
              href="#events-filter"
              className="group inline-flex items-center gap-2 text-white hover:bg-white/10 active:scale-[0.98] transition-all duration-200 motion-reduce:transition-none"
              style={{
                marginTop: "28px",
                height: "48px",
                padding: "0 20px",
                fontSize: "15px",
                fontWeight: 600,
                letterSpacing: "-0.005em",
                border: "1.5px solid rgba(255,255,255,0.5)",
              }}
            >
              Browse events
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
          </div>
        </section>

        {/* Interactive filter + grid (client island). Suspense boundary
            is required because EventsList reads useSearchParams. */}
        <Suspense fallback={<EventsListFallback />}>
          <EventsList />
        </Suspense>

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
