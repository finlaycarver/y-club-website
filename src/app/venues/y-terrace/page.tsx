import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VenueLayout, type VenueLayoutConfig } from "@/components/VenueLayout";

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
  hero: {
    imageSrc: "/images/club-y-image-4.webp",
    imageAlt: "Y Terrace — The Quadrant, Guildford",
    kicker: "The Quadrant · Bridge Street · Guildford",
    title: "Y Terrace",
    subhead:
      "Open-air. All season. Guildford's outdoor terrace — cocktails, sport on the big screen, late summer evenings.",
    // Hero CTA deep-links to the What's On listing pre-filtered to this venue.
    primaryCta: { href: "/whats-on?venue=Y+Terrace", label: "See What's On" },
  },
  overview: {
    kicker: "The Terrace",
    heading: "Guildford's finest outdoor experience.",
    paragraphs: [
      "Y Terrace is Guildford's go-to outdoor venue. Four bars — including the VIP Roof Terrace — two DJ booths, and a large dance floor that stays open into the night.",
      "From long summer days to big sport screenings, Y Terrace is built for those nights that spill into the early hours. Up to 500 guests under the open sky.",
    ],
  },
  specs: [
    { label: "Capacity",  value: "500"     },
    { label: "Bars",      value: "4"       },
    { label: "DJ booths", value: "2"       },
    { label: "Season",    value: "Summer"  },
  ],
  specsStyle: "numeric",
  video: {
    src: "/videos/y-terrace-loop.mp4",
    posterSrc: "/images/club-y-image-4.webp",
    kicker: "Sports & Summer",
    caption: "The outdoor terrace, alive.",
  },
  photos: [
    { src: "/images/9.webp",                                                       alt: "Y Terrace open-air bar in the evening sun" },
    { src: "/images/441900351_371148019313956_2396615588718096493_n-2-copy.webp",  alt: "Y Terrace crowd watching live sport on the big screen" },
    { src: "/images/img-1917.jpg",                                                 alt: "Friends drinking cocktails on Y Terrace"   },
    { src: "/images/club-y-image-6.webp",                                          alt: "Y Terrace at night under the disco lights" },
  ],
  photoLayout: "split",
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
