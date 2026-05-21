"use client";

import { useMemo, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRightIcon } from "@/components/icons";
import { EVENTS, type EventItem, type Venue } from "@/data/events";

const VENUES_FILTER: ("All" | Venue)[] = ["All", "Y Club", "Y Terrace", "Y Bar & Lounge"];

/**
 * Maps a free-form ?venue= search-param value back to a known filter
 * option. Anything we don't recognise falls back to "All" — this keeps
 * the filter state defensive against tampered or stale URLs.
 */
function readFilterFromParams(raw: string | null): typeof VENUES_FILTER[number] {
  if (!raw) return "All";
  const match = VENUES_FILTER.find((v) => v === raw);
  return match ?? "All";
}

type DateBucket = "today" | "this-week" | "coming-up";

interface DateBucketMeta {
  key: DateBucket;
  label: string;
}

const BUCKETS: DateBucketMeta[] = [
  { key: "today",      label: "Today" },
  { key: "this-week",  label: "This week" },
  { key: "coming-up",  label: "Coming up" },
];

/**
 * Buckets an event into Today / This week / Coming up based on its
 * isoDate. "This week" runs to the upcoming Sunday (rolling 7 days).
 * Past events fall into "today" so they don't get orphaned visually
 * — operationally Y removes past events from the EVENTS array.
 */
function bucketFor(isoDate: string, now: Date): DateBucket {
  const todayStr = now.toISOString().slice(0, 10);
  if (isoDate <= todayStr) return "today";

  const eventDate = new Date(`${isoDate}T00:00:00`);
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysAhead = Math.floor((eventDate.getTime() - now.getTime()) / msPerDay);
  if (daysAhead <= 7) return "this-week";

  return "coming-up";
}

function EventCard({ event, featured }: { event: EventItem; featured?: boolean }) {
  return (
    <Link
      href={`/whats-on/${event.slug}`}
      aria-label={`${event.title} — ${event.venue}, ${event.date}`}
      className={`group relative block overflow-hidden${featured ? " md:col-span-2 md:row-span-2" : ""}`}
      style={{ textDecoration: "none" }}
    >
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: featured ? "3/4" : "4/5", background: "#111" }}
      >
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
          style={{ objectFit: "cover" }}
          className="transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)" }}
        />

        {/* Venue tag — top left */}
        <div className="absolute" style={{ top: "16px", left: "16px" }}>
          <span
            style={{
              fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "#FAFAFA",
              background: "rgba(0,0,0,0.55)", padding: "6px 10px",
              backdropFilter: "blur(6px)",
            }}
          >
            {event.venue}
          </span>
        </div>

        <div className="absolute left-0 right-0 bottom-0 p-5 md:p-6 text-white">
          <p style={{
            fontSize: "12px", fontWeight: 500, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "8px",
          }}>
            {event.date}
          </p>
          <p className={featured ? "text-[28px] md:text-[42px]" : "text-[22px] md:text-[26px]"} style={{
            fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: "12px", color: "#FAFAFA",
          }}>
            {event.title}
          </p>
          {featured && (
            <p
              className="hidden md:block"
              style={{ fontSize: "16px", color: "rgba(255,255,255,0.75)", lineHeight: 1.55, maxWidth: "440px", marginBottom: "16px" }}
            >
              {event.description}
            </p>
          )}
          <div className="inline-flex items-center gap-1.5">
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#FAFAFA" }}>
              View event
            </span>
            <ChevronRightIcon className="size-4 group-hover:translate-x-1 transition-transform duration-200 ease-out motion-reduce:transition-none" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function EventsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const filter = readFilterFromParams(searchParams.get("venue"));

  function setFilter(next: typeof VENUES_FILTER[number]) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "All") {
      params.delete("venue");
    } else {
      params.set("venue", next);
    }
    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    // scroll: false keeps the user where they are when toggling filters.
    startTransition(() => router.replace(url, { scroll: false }));
  }

  /* Filtered + sorted (featured first, then by date ascending). */
  const filtered = useMemo(() => {
    const list = filter === "All" ? EVENTS : EVENTS.filter((e) => e.venue === filter);
    return [...list].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.isoDate.localeCompare(b.isoDate);
    });
  }, [filter]);

  /* Group filtered events into Today / This week / Coming up buckets. */
  const grouped = useMemo(() => {
    const now = new Date();
    const map = new Map<DateBucket, EventItem[]>();
    for (const event of filtered) {
      const key = bucketFor(event.isoDate, now);
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return BUCKETS.map((meta) => ({ ...meta, events: map.get(meta.key) ?? [] }))
      .filter((group) => group.events.length > 0);
  }, [filtered]);

  return (
    <>
      {/* ── FILTERS + COUNT ────────────────────────────────────────── */}
      <section className="bg-black text-white" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}
        >
          <div className="flex flex-wrap items-center gap-2 md:gap-3" role="tablist" aria-label="Filter events by venue">
            {VENUES_FILTER.map((v) => {
              const active = v === filter;
              return (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(v)}
                  className="transition-all duration-200 motion-reduce:transition-none"
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    padding: "10px 18px",
                    border: active ? "1px solid #FAFAFA" : "1px solid rgba(255,255,255,0.2)",
                    background: active ? "#FAFAFA" : "transparent",
                    color: active ? "#080808" : "rgba(255,255,255,0.75)",
                    cursor: "pointer",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {v}
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
            {filtered.length} {filtered.length === 1 ? "event" : "events"}
          </p>
        </div>
      </section>

      {/* ── EVENTS GRID ────────────────────────────────────────────── */}
      <section className="bg-black" style={{ padding: "48px 24px 96px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.5)" }}>
            <p style={{ fontSize: "22px", marginBottom: "12px", color: "#FAFAFA" }}>
              Nothing booked here yet.
            </p>
            <p>Check back soon, or try another venue.</p>
          </div>
        ) : (
          <div
            className="flex flex-col gap-12 md:gap-16"
            style={{ maxWidth: "1400px", margin: "0 auto" }}
          >
            {grouped.map((group) => (
              <div key={group.key}>
                <h2
                  className="text-[24px] md:text-[32px] text-white"
                  style={{
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                    marginBottom: "20px",
                  }}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                  {group.events.map((event) => (
                    <EventCard key={event.slug} event={event} featured={event.featured} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
