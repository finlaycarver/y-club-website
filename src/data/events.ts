/**
 * Single source of truth for Y events. Surfaces in:
 *   - WhatsonSection (home page line-up carousel — manually mirrored)
 *   - /whats-on (filterable grid)
 *   - /whats-on/[slug] (event detail page)
 *   - Event JSON-LD on /whats-on
 *
 * Manage manually — no CMS. Add new events at the bottom; the listing
 * page sorts featured first then by isoDate ascending.
 *
 * To get a real Skiddle ticketUrl: find the event on
 * https://www.skiddle.com/whats-on/Guildford/ and copy the full URL.
 */

export type Venue = "Y Club" | "Y Terrace" | "Y Bar & Lounge";

export interface EventItem {
  /** URL slug used for the internal /whats-on/[slug] detail page. Must be unique. */
  slug: string;
  title: string;
  date: string;
  /** ISO start date (YYYY-MM-DD). Drives sort, date grouping, and Event schema. */
  isoDate: string;
  /** Optional ISO end date — only set for multi-day events. */
  isoEndDate?: string;
  venue: Venue;
  description: string;
  imageUrl: string;
  /** Full external ticket URL (typically Skiddle). [TODO(fin)]: replace venue-search fallbacks with real event-specific URLs. */
  ticketUrl: string;
  featured?: boolean;
  /** When true: greyscale image + diagonal "SOLD OUT" stamp. */
  soldOut?: boolean;
  /**
   * 0–100 representing % of capacity sold. Drives the capacity bar
   * at the card foot. Omit to hide the bar. [CONFIRM with Michelle]
   */
  capacityPercent?: number;
  /** Override the default CTA label ("Get tickets" / "View event"). */
  ctaLabel?: string;
}

/** Skiddle search URLs scoped to each venue — used as a fallback when a
 *  real per-event ticket URL isn't yet available. Replace per event in
 *  the EVENTS array below as soon as we have real ticket pages. */
const SKIDDLE = {
  "Y Club":         "https://www.skiddle.com/whats-on/Guildford/Y-Club/",
  "Y Terrace":      "https://www.skiddle.com/whats-on/Guildford/Y-Terrace/",
  "Y Bar & Lounge": "https://www.skiddle.com/whats-on/Guildford/Y-Bar-and-Lounge/",
} satisfies Record<Venue, string>;

export const EVENTS: EventItem[] = [
  {
    slug: "mbs-1st-birthday",
    title: "MBS 1st Birthday",
    date: "Sat 6 Jun",
    isoDate: "2026-06-06",
    venue: "Y Club",
    description: "The full line-up to celebrate one year of MBS. An unforgettable day awaits.",
    imageUrl: "/images/13.webp",
    ticketUrl: SKIDDLE["Y Club"],
    featured: true,
  },
  {
    slug: "live-dj-set-29-may",
    title: "Live DJ Set",
    date: "Fri 29 May",
    isoDate: "2026-05-29",
    venue: "Y Club",
    description: "House and tech-house all night. Doors at 22:00.",
    imageUrl: "/images/9.webp",
    ticketUrl: SKIDDLE["Y Club"],
  },
  {
    slug: "saturday-sessions-16-may",
    title: "Saturday Sessions",
    date: "Sat 16 May",
    isoDate: "2026-05-16",
    venue: "Y Club",
    description: "Two rooms, two DJs, one big Saturday night.",
    imageUrl: "/images/club-y-image-5.webp",
    ticketUrl: SKIDDLE["Y Club"],
  },
  {
    slug: "bass-drop-friday-22-may",
    title: "Bass Drop Friday",
    date: "Fri 22 May",
    isoDate: "2026-05-22",
    venue: "Y Club",
    description: "Drum & bass night. Headliners TBA.",
    imageUrl: "/images/nadine-180.jpg",
    ticketUrl: SKIDDLE["Y Club"],
  },
  {
    slug: "student-night-27-may",
    title: "Student Night",
    date: "Wed 27 May",
    isoDate: "2026-05-27",
    venue: "Y Club",
    description: "Midweek with Surrey Uni. Discount entry with student ID.",
    imageUrl: "/images/img-1917.jpg",
    ticketUrl: SKIDDLE["Y Club"],
  },
  {
    slug: "summer-garden-party-13-jun",
    title: "Summer Garden Party",
    date: "Sat 13 Jun",
    isoDate: "2026-06-13",
    venue: "Y Terrace",
    description: "Outdoor terrace takeover. Cocktails, sun, and a stacked DJ line-up.",
    imageUrl: "/images/441900351_371148019313956_2396615588718096493_n-2-copy.webp",
    ticketUrl: SKIDDLE["Y Terrace"],
  },
];

/** O(1) lookup by slug — used by the detail page route. */
export const EVENT_BY_SLUG = Object.fromEntries(
  EVENTS.map((event) => [event.slug, event]),
) as Record<string, EventItem>;
