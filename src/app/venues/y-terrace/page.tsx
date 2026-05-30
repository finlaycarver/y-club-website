import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VenueLayout, type VenueLayoutConfig } from "@/components/VenueLayout";
import { YLogoMark } from "@/components/YLogoMark";

export const metadata: Metadata = {
  title: "Y Terrace — Open-Air Venue, Guildford",
  description:
    "Guildford's outdoor terrace. Cocktails, sport on the big screen, and long summer evenings at The Quadrant, Bridge Street.",
  alternates: { canonical: "/venues/y-terrace" },
  openGraph: {
    title: "Y Terrace — Open-Air Venue, Guildford",
    description:
      "Guildford's outdoor terrace. Cocktails, sport on the big screen, late summer evenings.",
    url: "/venues/y-terrace",
    images: [{ url: "/images/club-y-image-4.webp", width: 1200, height: 630 }],
  },
};

const yTerrace: VenueLayoutConfig = {
  slug: "y-terrace",
  hero: {
    // Lighter outdoor image — the previous club-y-image-4.webp was near-black
    // in the upper section. This image shows the venue with better visual punch.
    imageSrc: "/images/10.webp",
    imageAlt: "Y Terrace — The Quadrant, Guildford",
    kicker: "The Quadrant · Bridge Street · Guildford",
    // "Y" in birdie italic matches the brand wordmark treatment
    title: (
      <>
        <YLogoMark height="0.78em" />
        {" Terrace"}
      </>
    ),
    // Tighter subhead — was 3 lines at desktop, now 2
    subhead: "Guildford's outdoor terrace. Cocktails, sport on the big screen, open all summer.",
    // Seasonal badge — communicates outdoor/seasonal nature immediately
    seasonalBadge: "Open: April – September",
    // Vertical line draw-in under H1 — outdoor editorial feel
    showVerticalLine: true,
    primaryCta: { href: "/whats-on?venue=Y+Terrace", label: "See What's On" },
  },
  overview: {
    kicker: "The Terrace",
    // Tighter heading — was too long and verbose
    heading: "Open-air, every weekend.",
    paragraphs: [
      "Y Terrace is Guildford's go-to outdoor venue. Four bars — including the VIP Roof Terrace — two DJ booths, and a large dance floor that stays open into the night.",
      "From long summer days to big sport screenings, Y Terrace is built for those nights that spill into the early hours. Up to 500 guests under the open sky.",
    ],
  },
  specs: [
    { label: "Capacity",  value: "500"                              },
    { label: "Bars",      value: "4"                                },
    { label: "DJ booths", value: "2"                                },
    // compact: true + accentBadge — "Summer only" pill at accent colour
    { label: "Season",    value: "Summer", compact: true, accentBadge: "Summer only" },
  ],
  specsStyle: "numeric",
  // cropTimestamp: true scales up + crops top-right corner to hide the
  photos: [
    { src: "/images/9.webp",                                                       alt: "Y Terrace open-air bar in the evening sun" },
    { src: "/images/441900351_371148019313956_2396615588718096493_n-2-copy.webp",  alt: "Y Terrace crowd watching live sport on the big screen" },
    { src: "/images/img-1917.jpg",                                                 alt: "Friends drinking cocktails on Y Terrace"   },
    { src: "/images/club-y-image-6.webp",                                          alt: "Y Terrace at night under the disco lights" },
  ],
  // "quad" — clean 2×2 grid, no row-span. Fixes the height mismatch
  // the old "split" layout created with the 3/4 feature photo (A4-VS [HIGH]).
  photoLayout: "quad",
  address: {
    variant: "street",
    kicker: "Find Us",
    title: <>2–4 The Quadrant,<br />Bridge Street</>,
    postalLine: "Guildford, GU1 4SG",
    directionsUrl:
      "https://maps.google.com/?q=Y+Guildford+Unit+2-4+The+Quadrant+Bridge+Street+Guildford+GU1+4SG",
  },
  hire: {
    heading: "Take over the terrace.",
    body: "Summer parties, sports events, corporate days. Y Terrace holds up to 500 guests outdoors.",
  },
};

export default function YTerracePage() {
  return (
    <>
      <SiteHeader />
      <VenueLayout config={yTerrace} />
      <SiteFooter />
    </>
  );
}
