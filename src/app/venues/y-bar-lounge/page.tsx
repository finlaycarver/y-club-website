import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VenueLayout, type VenueLayoutConfig } from "@/components/VenueLayout";

export const metadata: Metadata = {
  title: "Y Bar & Lounge — Start Your Night Here",
  description:
    "Cocktails, conversation, and the best warm-up for the night ahead. Y Bar & Lounge, Guildford.",
  alternates: { canonical: "/venues/y-bar-lounge" },
  openGraph: {
    title: "Y Bar & Lounge — Start Your Night Here",
    description:
      "Cocktails, conversation, and the best warm-up for the night ahead.",
    url: "/venues/y-bar-lounge",
    images: [{ url: "/images/nadine-195.jpg", width: 1200, height: 630 }],
  },
};

const yBarLounge: VenueLayoutConfig = {
  hero: {
    imageSrc: "/images/nadine-195.jpg",
    imageAlt: "Y Bar & Lounge — Guildford",
    // [TODO(fin)] swap kicker to include street address once Michelle confirms.
    // Kicker shape mirrors the other venues (descriptor · town) for consistency.
    kicker: "Cocktail Bar · Guildford",
    title: <>Y Bar<br />&amp; Lounge</>,
    subhead:
      "Where the night starts. Cocktails, conversation, and the best warm-up for the night ahead.",
    primaryCta: { href: "/whats-on?venue=Y+Bar+%26+Lounge", label: "See What's On" },
  },
  overview: {
    kicker: "The Bar",
    heading: "The perfect start to any night.",
    paragraphs: [
      "Y Bar & Lounge is where you set the tone. Come early, settle in, and let the night build around you. Cocktails, great music, and a room that knows how to warm up.",
      "Whether you're kicking off a group night or just want somewhere to unwind before the club opens, Y Bar & Lounge is the place to be.",
    ],
  },
  specs: [
    { label: "Vibe",      value: "Bar"        },
    { label: "Service",   value: "Cocktails"  },
    { label: "Seating",   value: "Lounge"     },
    { label: "Best for",  value: "Pre-night"  },
  ],
  specsStyle: "text",
  video: {
    src: "/videos/y-bar-lounge-loop.mp4",
    posterSrc: "/images/nadine-195.jpg",
    kicker: "Inside the Bar",
    caption: "Where the night starts.",
  },
  photos: [
    { src: "/images/nadine-189.jpg",      alt: "Friends laughing over cocktails at Y Bar & Lounge"      },
    { src: "/images/nadine-180.jpg",      alt: "Cocktail being shaken behind the bar at Y Bar & Lounge" },
    { src: "/images/tempimage0cgvsr.jpg", alt: "Y Bar & Lounge late-night ambience"                     },
  ],
  photoLayout: "row",
  address: {
    variant: "contact",
    kicker: "Find Us",
    title: <>In the heart of<br />Guildford.</>,
    body: "A short walk from Y Club and Y Terrace. Get in touch and we'll point you straight to the door.",
    contactHref: "/about#contact",
  },
  hire: {
    // Mirrors the verb-led pattern of the other venues:
    //   Y Club:    "Make it yours."
    //   Y Terrace: "Take over the terrace."
    //   Y Bar:     "Take over the bar."
    heading: "Take over the bar.",
    body: "Pre-drinks, celebrations, private bar takeovers. Get in touch to put something together.",
  },
};

export default function YBarLoungePage() {
  return (
    <>
      <SiteHeader />
      <VenueLayout config={yBarLounge} />
      <SiteFooter />
    </>
  );
}
