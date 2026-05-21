import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VenueLayout, type VenueLayoutConfig } from "@/components/VenueLayout";

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
  hero: {
    imageSrc: "/images/12.webp",
    imageAlt: "Y Club — Cornerhouse, Guildford",
    kicker: "Cornerhouse · Onslow Street · Guildford",
    title: "Y Club",
    subhead:
      "Where the night goes loud. Big floors, big sound — open late every Friday and Saturday.",
    // Hero CTA deep-links to the What's On listing pre-filtered to this venue.
    primaryCta: { href: "/whats-on?venue=Y+Club", label: "See What's On" },
  },
  overview: {
    kicker: "The Club",
    heading: "The home of Guildford's best nights.",
    paragraphs: [
      "Y Club is Guildford's destination for late-night dancing. Two rooms. Two dance floors. Two bars. State-of-the-art sound and lighting — and a crowd that knows how to move.",
      "Every Friday and Saturday we host DJs and artists from across the UK. Whether you're celebrating something big or just need a night out, this is where it happens.",
    ],
  },
  specs: [
    { label: "Capacity",     value: "500"      },
    { label: "Dance floors", value: "2"        },
    { label: "Bars",         value: "2"        },
    { label: "Open",         value: "Fri + Sat" },
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
  },
  hire: {
    heading: "Make it yours.",
    body: "Birthdays, graduations, corporate nights. Y Club takes up to 500 guests across two rooms.",
  },
};

export default function YClubPage() {
  return (
    <>
      <SiteHeader />
      <VenueLayout config={yClub} />
      <SiteFooter />
    </>
  );
}
