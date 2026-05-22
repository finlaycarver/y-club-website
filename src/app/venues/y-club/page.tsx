import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VenueLayout, type VenueLayoutConfig } from "@/components/VenueLayout";
import { YLogoMark } from "@/components/YLogoMark";
import { EVENTS } from "@/data/events";

export const metadata: Metadata = {
  title: "Y Club — Guildford's Premier Nightclub",
  description:
    "Big floors. Big sound. Y Club at Cornerhouse, Onslow Street, Guildford. Open every Friday and Saturday night.",
  alternates: { canonical: "/venues/y-club" },
  openGraph: {
    title: "Y Club — Guildford's Premier Nightclub",
    description:
      "Big floors. Big sound. Y Club at Cornerhouse, Onslow Street, Guildford.",
    url: "/venues/y-club",
    images: [{ url: "/images/12.webp", width: 1200, height: 630 }],
  },
};

const yClub: VenueLayoutConfig = {
  slug: "y-club",
  openDays: [5, 6], // Fri, Sat
  hero: {
    imageSrc: "/images/12.webp",
    imageAlt: "Y Club — Cornerhouse, Guildford",
    kicker: "Cornerhouse · Onslow Street · Guildford",
    // "Y" in birdie italic matches the home hero "Y." treatment.
    title: (
      <>
        <YLogoMark height="0.78em" />
        {" Club"}
      </>
    ),
    subhead:
      "Where the night goes loud. Big floors, big sound — open late every Friday and Saturday.",
    // Looped venue reel — already in public/videos/, compressed and ready.
    videoSrc: "/videos/y-club-loop.mp4",
    // Hero CTA deep-links to the What's On listing pre-filtered to this venue.
    primaryCta: { href: "/whats-on?venue=Y+Club", label: "See What's On" },
  },
  overview: {
    kicker: "The Club",
    heading: "The home of Guildford's best nights.",
    // 01 / 02 — decorative numerals for the two rooms (A4-VX [HIGH])
    accentNumerals: ["01", "02"],
    paragraphs: [
      "Y Club is Guildford's destination for late-night dancing. Two rooms. Two dance floors. Two bars. State-of-the-art sound and lighting — and a crowd that knows how to move.",
      "Every Friday and Saturday we host DJs and artists from across the UK. Whether you're celebrating something big or just need a night out, this is where it happens.",
    ],
  },
  specs: [
    { label: "Capacity",     value: "500"       },
    { label: "Dance floors", value: "2"         },
    { label: "Bars",         value: "2"         },
    // compact: true — renders at 28px so "Fri + Sat" doesn't dwarf the numbers
    { label: "Open",         value: "Fri + Sat", compact: true },
  ],
  specsStyle: "numeric",
  video: {
    src: "/videos/y-club-loop.mp4",
    posterSrc: "/images/12.webp",
    kicker: "Friday Night",
    caption: "The view from the balcony.",
  },
  photos: [
    { src: "/images/mg-7942.webp",    alt: "DJ playing to a packed Y Club crowd"            },
    { src: "/images/img-1890.jpg",    alt: "Friends dancing under red lights at Y Club"     },
    { src: "/images/img-1901.jpg",    alt: "Y Club crowd cheering during a DJ drop"         },
    { src: "/images/img-1903-2.jpg",  alt: "Late-night dance floor at Y Club"               },
    { src: "/images/img-0959.jpeg",   alt: "Y Club dance floor in full flow"                },
    { src: "/images/13.webp",         alt: "Y Club main stage with truss and lighting rig"  },
  ],
  photoLayout: "feature",
  address: {
    variant: "street",
    kicker: "Find Us",
    title: <>Cornerhouse,<br />Onslow Street</>,
    postalLine: "Guildford, GU1 4SQ",
    directionsUrl:
      "https://maps.google.com/?q=Y+Club+Corner+House+Onslow+Street+Guildford",
    mapQuery: "Y+Club+Corner+House+Onslow+Street+Guildford+GU1+4SQ",
  },
  hire: {
    heading: "Make it yours.",
    body: "Birthdays, graduations, corporate nights. Y Club takes up to 500 guests across two rooms.",
    trustHint: "Avg. response time under 48 hours",
  },
};

export default function YClubPage() {
  // Next upcoming event at Y Club — drives the hero countdown ticker
  const todayStr = new Date().toISOString().slice(0, 10);
  const nextYClubEvent =
    EVENTS
      .filter((e) => e.venue === "Y Club" && e.isoDate >= todayStr)
      .sort((a, b) => a.isoDate.localeCompare(b.isoDate))[0] ?? undefined;

  return (
    <>
      <SiteHeader />
      <VenueLayout config={{ ...yClub, nextEvent: nextYClubEvent }} />
      <SiteFooter />
    </>
  );
}
