"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRightIcon } from "@/components/icons";
import { EventBottomSheet } from "@/components/EventBottomSheet";
import { isUpcomingEvent, localTodayIso, sortEventsForDisplay, EVENTS, type EventItem, type Venue } from "@/data/events";
import { BRAND } from "@/lib/site";
import { buildEventIcsDataUrl } from "@/lib/ics";

const VENUES_FILTER: ("All" | Venue)[] = ["All", "Y Club", "Y Terrace", "Y Bar & Lounge"];

function readFilterFromParams(raw: string | null): typeof VENUES_FILTER[number] {
  if (!raw) return "All";
  const match = VENUES_FILTER.find((v) => v === raw);
  return match ?? "All";
}

/**
 * Maps the canonical EventItem onto the smaller shape the
 * EventBottomSheet consumes. urgency is derived from soldOut +
 * capacityPercent so the sheet shows a "Selling fast" pill without
 * needing a separate flag on the data.
 */
function eventToSheetData(event: EventItem) {
  let urgency: string | undefined;
  if (event.soldOut) {
    urgency = "Sold out";
  } else if (event.capacityPercent !== undefined && event.capacityPercent >= 80) {
    urgency = "Selling fast";
  }
  return {
    title:       event.title,
    venue:       event.venue,
    date:        event.date,
    imageUrl:    event.imageUrl,
    href:        event.ticketUrl,
    featured:    event.featured,
    description: event.description,
    urgency,
  };
}

/* ──────────────────────────────────────────────────────────────────────
   EventCard — desktop grid card. On touch devices, taps intercept and
   open the bottom sheet instead of navigating directly.
   ────────────────────────────────────────────────────────────────────── */
function EventCard({
  event,
  featured,
  onMobileTap,
  className,
}: {
  event: EventItem;
  featured?: boolean;
  onMobileTap: (event: EventItem) => void;
  className?: string;
}) {
  const cardRef    = useRef<HTMLAnchorElement>(null);
  const isInternal = !event.ticketUrl.startsWith("http");
  const cta        = event.ctaLabel ?? (isInternal ? "View event" : "Get tickets");

  /* Stagger entrance — adds .event-card-visible to each card on intersect */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("event-card-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function handleClick(e: React.MouseEvent) {
    // Mobile / touch: intercept and open the bottom sheet so the user
    // can see venue / description / Add-to-calendar without leaving the
    // listing page. Desktop click follows the link normally.
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      e.preventDefault();
      onMobileTap(event);
    }
  }

  return (
    <Link
      ref={cardRef}
      href={event.ticketUrl}
      target={isInternal ? undefined : "_blank"}
      rel={isInternal ? undefined : "noopener noreferrer"}
      onClick={handleClick}
      aria-label={`${event.title} — ${event.venue}, ${event.date}${event.soldOut ? " (Sold out)" : ""}`}
      className={`event-card group relative block overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,255,255,0.10)] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none${className ? ` ${className}` : ""}`}
      style={{ textDecoration: "none" }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "4/5",
          background: "#111",
          filter: event.soldOut ? "grayscale(0.85)" : undefined,
          transition: "filter 0.3s ease",
        }}
      >
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          className="transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)" }}
        />

        {/* ── Venue tag — top left ── */}
        <div className="absolute" style={{ top: "12px", left: "12px" }}>
          <span style={{
            fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "#FAFAFA",
            background: "rgba(0,0,0,0.55)", padding: "5px 9px",
            backdropFilter: "blur(6px)",
          }}>
            {event.venue}
          </span>
        </div>

        {/* ── Featured badge — top right ── */}
        {featured && (
          <div className="absolute" style={{ top: "12px", right: "12px" }}>
            <span style={{
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "#080808",
              background: "#FAFAFA", padding: "5px 9px",
            }}>
              Featured
            </span>
          </div>
        )}

        {/* ── Sold out diagonal stamp ── */}
        {event.soldOut && (
          <div className="event-sold-out-stamp" aria-hidden="true">
            Sold out
          </div>
        )}

        {/* ── Card content foot ── */}
        <div className="absolute left-0 right-0 bottom-0 p-4 md:p-6 text-white">
          <p
            className="event-card-date"
            style={{
              fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "6px",
            }}
          >
            {event.date}
          </p>

          <p
            className={featured ? "text-[22px] md:text-[42px]" : "text-[16px] md:text-[26px]"}
            style={{ fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: "10px", color: "#FAFAFA" }}
          >
            {event.title}
          </p>

          {/* Featured description — desktop only inside the grid (mobile
              users see featured events in the carousel above with their
              own description treatment). */}
          {featured && event.description && (
            <p className="hidden md:block" style={{
              fontSize: "15px", color: "rgba(255,255,255,0.75)",
              lineHeight: 1.55, maxWidth: "440px", marginBottom: "16px",
            }}>
              {event.description}
            </p>
          )}

          {!event.soldOut && (
            <div className="inline-flex items-center gap-1.5 border-b border-white/50 pb-px group-hover:border-white transition-colors duration-200">
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#FAFAFA", letterSpacing: "0.02em" }}>
                {cta}
              </span>
              <ChevronRightIcon className="size-3.5 group-hover:translate-x-0.5 transition-transform duration-200 ease-out motion-reduce:transition-none" />
            </div>
          )}
          {event.soldOut && (
            <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Sold out
            </span>
          )}
        </div>

        {/* Capacity remaining bar */}
        {event.capacityPercent !== undefined && !event.soldOut && (
          <div className="absolute bottom-0 left-0 right-0" style={{ height: "3px", background: "rgba(255,255,255,0.1)" }}>
            <div
              style={{
                height: "100%",
                width: `${event.capacityPercent}%`,
                background: event.capacityPercent >= 80
                  ? "rgba(239,68,68,0.85)"
                  : event.capacityPercent >= 50
                    ? "rgba(251,191,36,0.85)"
                    : "rgba(74,222,128,0.85)",
                transition: "width 0.6s ease-out",
              }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   FeaturedMobileCard — mobile-only horizontal carousel card.
   Wider (80vw), portrait, opens the bottom sheet on tap (button, not link).
   ────────────────────────────────────────────────────────────────────── */
function FeaturedMobileCard({
  event,
  onTap,
}: {
  event: EventItem;
  onTap: (event: EventItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onTap(event)}
      className="events-featured-card relative block overflow-hidden text-left bg-transparent border-0 p-0 cursor-pointer"
      aria-label={`${event.title} — ${event.venue}, ${event.date}`}
    >
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "4/5", background: "#111" }}
      >
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="80vw"
          style={{ objectFit: "cover" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.88) 100%)" }}
        />

        {/* Venue + Featured chips */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span style={{
            fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "#FAFAFA",
            background: "rgba(0,0,0,0.55)", padding: "5px 9px",
            backdropFilter: "blur(6px)",
          }}>
            {event.venue}
          </span>
          <span style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "#080808",
            background: "#FAFAFA", padding: "5px 9px",
          }}>
            Featured
          </span>
        </div>

        {/* Foot content */}
        <div className="absolute left-0 right-0 bottom-0 p-5 text-white">
          <p style={{
            fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "6px",
          }}>
            {event.date}
          </p>
          <p style={{
            fontSize: "26px", fontWeight: 700, lineHeight: 1.1,
            letterSpacing: "-0.01em", marginBottom: "10px", color: "#FAFAFA",
          }}>
            {event.title}
          </p>
          {event.description && (
            <p style={{
              fontSize: "14px", color: "rgba(255,255,255,0.75)",
              lineHeight: 1.5, marginBottom: "14px",
            }}>
              {event.description}
            </p>
          )}
          <div className="inline-flex items-center gap-1.5 border-b border-white/50 pb-px">
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#FAFAFA", letterSpacing: "0.02em" }}>
              View details
            </span>
            <ChevronRightIcon className="size-3.5" />
          </div>
        </div>
      </div>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   EventsList
   ────────────────────────────────────────────────────────────────────── */
export function EventsList() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Active event drives the bottom sheet. ICS URL is built from the
  // active EventItem each time the sheet opens (cheap; pure function).
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);

  const filter = readFilterFromParams(searchParams.get("venue"));
  const todayIso = useMemo(() => localTodayIso(), []);

  function setFilter(next: typeof VENUES_FILTER[number]) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "All") {
      params.delete("venue");
    } else {
      params.set("venue", next);
    }
    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    startTransition(() => router.replace(url, { scroll: false }));
  }

  const filtered = useMemo(() => {
    const list = filter === "All" ? EVENTS : EVENTS.filter((e) => e.venue === filter);
    return sortEventsForDisplay(list.filter((event) => isUpcomingEvent(event, todayIso)));
  }, [filter, todayIso]);

  /** Featured events power the mobile carousel above the main grid.
   *  Capped at 3 so the carousel doesn't sprawl. Desktop renders these
   *  in-grid via the featured prop on EventCard. */
  const featuredEvents = useMemo(
    () => filtered.filter((e) => e.featured).slice(0, 3),
    [filtered],
  );

  const grouped = useMemo(() => [
    {
      key: "coming-up",
      label: "Coming up",
      events: filtered,
    },
  ], [filtered]);

  // Pre-build the ICS URL for the active event when it changes.
  const activeIcsUrl = useMemo(
    () => (activeEvent ? buildEventIcsDataUrl(activeEvent) : undefined),
    [activeEvent],
  );

  return (
    <>
      {/* ── FILTERS + COUNT (sticky on mobile, just below the fixed header) ─ */}
      <section
        className="events-filters-section bg-black text-white"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "18px 20px" }}
        >
          {/* Horizontal-scroll chip row on mobile (no wrap), flex-wrap on desktop.
              Styling for the scroll behaviour lives in globals.css. */}
          <div
            className="events-filter-chips flex items-center gap-2 md:gap-2.5 md:flex-wrap"
            role="tablist"
            aria-label="Filter events by venue"
          >
            {VENUES_FILTER.map((v) => {
              const active = v === filter;
              return (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(v)}
                  className={[
                    "filter-chip transition-all duration-200 motion-reduce:transition-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                    "hover:border-white/60 shrink-0",
                  ].join(" ")}
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    padding: "9px 16px",
                    border: active ? "1px solid #FAFAFA" : "1px solid rgba(255,255,255,0.2)",
                    background: active ? "#FAFAFA" : "transparent",
                    color: active ? "#080808" : "rgba(255,255,255,0.75)",
                    cursor: "pointer",
                    letterSpacing: "-0.005em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {v}
                </button>
              );
            })}

            {filter !== "All" && (
              <button
                type="button"
                onClick={() => setFilter("All")}
                aria-label="Clear filter"
                className="inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-100 motion-reduce:transition-none shrink-0"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 8px",
                  opacity: 0.8,
                  whiteSpace: "nowrap",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Clear
              </button>
            )}
          </div>

          <p style={{ fontSize: "15px", fontWeight: 700, color: "#FAFAFA", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
            {/* Count only upcoming events — past events are hidden from the grid */}
            {grouped.reduce((n, g) => n + g.events.length, 0)}{" "}
            <span style={{ fontWeight: 450, color: "rgba(255,255,255,0.55)" }}>
              upcoming
            </span>
          </p>
        </div>
      </section>

      {/* ── MOBILE FEATURED CAROUSEL (md:hidden) ─────────────────────── */}
      {featuredEvents.length > 0 && (
        <section
          className="md:hidden bg-black"
          aria-label="Featured events"
          style={{ padding: "24px 0 8px" }}
        >
          <p style={{
            fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.45)",
            padding: "0 24px", marginBottom: "14px",
          }}>
            Featured
          </p>
          <div className="events-featured-carousel" role="list" style={{ justifyContent: "center", overflowX: "visible" }}>
            {featuredEvents.map((event) => (
              <div key={event.slug} role="listitem">
                <FeaturedMobileCard event={event} onTap={setActiveEvent} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EVENTS GRID — 2-col mobile, 3-col desktop ────────────────── */}
      <section className="bg-black" style={{ padding: "32px 12px 64px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.5)" }}>
            <p style={{ fontSize: "22px", marginBottom: "12px", color: "#FAFAFA" }}>
              Nothing booked here yet.
            </p>
            <p>Check back soon, or try another venue.</p>
          </div>
        ) : (
          <div
            className="flex flex-col gap-10 md:gap-16"
            style={{ maxWidth: "1400px", margin: "0 auto" }}
          >
            {grouped.map((group) => (
              <div key={group.key}>
                <h2
                  className="text-[22px] md:text-[32px] text-white"
                  style={{ fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: "16px", paddingLeft: "0" }}
                >
                  {group.label}
                  <span
                    aria-hidden="true"
                    className="text-white/40"
                    style={{ marginLeft: "12px", fontSize: "0.65em", fontWeight: 500 }}
                  >
                    {group.events.length}
                  </span>
                </h2>
                <div className="events-bucket-grid md:grid md:grid-cols-3 md:gap-5">
                  {group.events.map((event) => (
                    <EventCard
                      key={event.slug}
                      event={event}
                      featured={event.featured}
                      onMobileTap={setActiveEvent}
                      // On mobile, featured events live in the carousel
                      // above — hide them in the grid to avoid duplication.
                      className={event.featured ? "hidden md:block" : ""}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CLICK-TO-CALL BACKUP CTA ─────────────────────────────────── */}
      {/* Sits between the grid and the members CTA. Picks up users who
          didn't find a matching event and just want to call. */}
      <section className="bg-black" style={{ padding: "24px 24px 48px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-md mx-auto text-center">
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", marginBottom: "14px" }}>
            Can&apos;t find what you&apos;re after? Call us — we run private events too.
          </p>
          <a
            href={`tel:${BRAND.phone}`}
            className="inline-flex items-center justify-center gap-2 transition-colors duration-200 active:opacity-80"
            style={{
              padding: "14px 28px",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "#FAFAFA",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <Phone size={16} aria-hidden="true" />
            Call {BRAND.phoneDisplay}
          </a>
        </div>
      </section>

      {/* ── Bottom sheet (mobile-first, but also works on desktop) ───── */}
      <EventBottomSheet
        event={activeEvent ? eventToSheetData(activeEvent) : null}
        icsUrl={activeIcsUrl}
        onClose={() => setActiveEvent(null)}
      />
    </>
  );
}
