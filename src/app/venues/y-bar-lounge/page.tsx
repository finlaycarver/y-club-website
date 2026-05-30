import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VenueLayout, type VenueLayoutConfig } from "@/components/VenueLayout";
import { YLogoMark } from "@/components/YLogoMark";

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
  slug: "y-bar-lounge",
  hero: {
    imageSrc: "/images/nadine-195.jpg",
    imageAlt: "Y Bar & Lounge — Guildford",
    // Kicker improved from "Guildford" alone → adds context.
    // [TODO(fin)] prepend actual street once Michelle confirms address.
    kicker: "Cocktail Bar & Lounge · Town Centre · Guildford",
    title: (
      <>
        <YLogoMark height="0.78em" />
        {" Bar & Lounge"}
      </>
    ),
    subhead: "Where the night starts. Cocktails, conversation, and the best warm-up for the night ahead.",
    // Frosted-glass kicker pill — intimate bar aesthetic (A4-VX [LOW])
    kickerFrosted: true,
    primaryCta: { href: "/whats-on?venue=Y+Bar+%26+Lounge", label: "See What's On" },
  },
  overview: {
    kicker: "The Bar",
    // More evocative than "The perfect start to any night."
    heading: "The place before the place.",
    paragraphs: [
      "Y Bar & Lounge is where you set the tone. Come early, settle in, and let the night build around you. Cocktails, great music, and a room that knows how to warm up.",
      "Whether you're kicking off a group night or just want somewhere to unwind before the club opens, Y Bar & Lounge is the place to be.",
    ],
  },
  // Text-grid specs give the page the same visual authority as Y Club /
  // Y Terrace (A4-VFP [HIGH]: "lacks punchy numerical anchors").
  // "Open" is confirmed from the footer; others are confirmed from copy.
  specs: [
    { label: "Open",     value: "Wed – Sat",   compact: true },
    { label: "Vibe",     value: "Cocktail bar", compact: true },
    { label: "Music",    value: "Live DJs",     compact: true },
    { label: "Service",  value: "Full bar",     compact: true },
  ],
  specsStyle: "text",
  photos: [
    { src: "/images/nadine-189.jpg",      alt: "Friends laughing over cocktails at Y Bar & Lounge"      },
    { src: "/images/nadine-180.jpg",      alt: "Cocktail being shaken behind the bar at Y Bar & Lounge" },
    { src: "/images/tempimage0cgvsr.jpg", alt: "Y Bar & Lounge late-night ambience"                     },
  ],
  photoLayout: "row",

  // Cocktail feature section — unique differentiator vs the club/terrace
  // pages. No menu items or prices fabricated — copy is factual and
  // descriptive. CTA links to the confirmed Cocktail Hour Sundays event.
  featureSection: {
    kicker: "The Drinks",
    heading: "Cocktails from scratch.",
    body: "The bar team at Y Bar & Lounge take cocktails seriously. From classic builds to bar team specials — every drink is made properly. Come early, take your time, and let the night find its pace.",
    cta: { href: "/whats-on?venue=Y+Bar+%26+Lounge", label: "Cocktail Hour Sundays" },
  },

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
