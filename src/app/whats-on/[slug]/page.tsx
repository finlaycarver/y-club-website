import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";
import { EVENTS, EVENT_BY_SLUG } from "@/data/events";
import { EventSchema } from "@/components/structured-data/EventSchema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-generate every event detail page at build time. */
export function generateStaticParams() {
  return EVENTS.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = EVENT_BY_SLUG[slug];
  if (!event) {
    return { title: "Event not found" };
  }
  return {
    title: `${event.title} — ${event.venue}, Guildford`,
    description: event.description,
    alternates: { canonical: `/whats-on/${event.slug}` },
    openGraph: {
      title: event.title,
      description: event.description,
      url: `/whats-on/${event.slug}`,
      type: "article",
      images: [{ url: event.imageUrl, width: 1200, height: 630 }],
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = EVENT_BY_SLUG[slug];

  if (!event) {
    notFound();
  }

  const isExternal = event.ticketUrl.startsWith("http");

  return (
    <>
      <EventSchema
        events={[
          {
            title: event.title,
            startDate: event.isoDate,
            endDate: event.isoEndDate,
            venue: event.venue,
            imageUrl: event.imageUrl,
            description: event.description,
            ticketUrl: event.ticketUrl,
          },
        ]}
      />
      <SiteHeader />
      <main id="main-content">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section
          className="relative bg-black overflow-hidden flex items-end"
          style={{ minHeight: "70svh" }}
        >
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.9) 100%)",
            }}
          />
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
          <div className="relative z-10 text-white px-6 md:px-16 pb-16 pt-40 max-w-[1200px] w-full mx-auto">
            <Link
              href="/whats-on"
              className="group inline-flex items-center gap-1.5 mb-8 hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none"
              style={{ fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.7)" }}
            >
              <ChevronRightIcon
                className="size-4 rotate-180 group-hover:-translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none"
              />
              All events
            </Link>

            <p
              style={{
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.65)",
                marginBottom: "16px",
              }}
            >
              {event.venue} · {event.date}
            </p>
            <h1
              className="text-[40px] md:text-[80px]"
              style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em" }}
            >
              {event.title}
            </h1>
          </div>
        </section>

        {/* ── BODY ───────────────────────────────────────────────────── */}
        <section className="bg-black text-white" style={{ padding: "64px 24px 96px" }}>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            style={{ maxWidth: "1200px", margin: "0 auto" }}
          >
            <div className="md:col-span-2">
              <h2
                className="text-[28px] md:text-[36px]"
                style={{
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                  marginBottom: "24px",
                }}
              >
                About the event
              </h2>
              <p style={{ fontSize: "19px", color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}>
                {event.description}
              </p>
            </div>

            <aside className="space-y-6">
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.45)",
                    marginBottom: "8px",
                  }}
                >
                  Date
                </p>
                <p style={{ fontSize: "19px", color: "#FAFAFA" }}>{event.date}</p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.45)",
                    marginBottom: "8px",
                  }}
                >
                  Venue
                </p>
                <p style={{ fontSize: "19px", color: "#FAFAFA" }}>{event.venue}</p>
              </div>

              <Link
                href={event.ticketUrl}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group inline-flex w-full items-center justify-center gap-2 bg-white text-black px-6 py-4 text-[17px] font-bold hover:-translate-y-0.5 active:scale-[0.98] transition-transform duration-200 motion-reduce:transition-none"
                aria-label={`Get tickets for ${event.title}${isExternal ? " (opens in new tab)" : ""}`}
              >
                Get Tickets
                <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
              </Link>
              {isExternal && (
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
                  Tickets via Skiddle — opens in a new tab.
                </p>
              )}
            </aside>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
