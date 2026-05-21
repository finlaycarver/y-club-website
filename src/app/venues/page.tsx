import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VenuePanel } from "@/components/VenuePanel";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";

export const metadata: Metadata = {
  title: "Our Venues — Y Club, Y Terrace, Y Bar & Lounge",
  description:
    "Three venues in the heart of Guildford. Y Club, Y Terrace, and Y Bar & Lounge — all a short walk apart.",
  alternates: { canonical: "/venues" },
  openGraph: {
    title: "Our Venues — Y Club, Y Terrace, Y Bar & Lounge",
    description:
      "Three venues in the heart of Guildford. Y Club, Y Terrace, and Y Bar & Lounge — all a short walk apart.",
    url: "/venues",
    images: [{ url: "/images/14.webp", width: 1200, height: 630 }],
  },
};

interface VenueIndexItem {
  slug: string;
  name: string;
  kicker: string;
  body: string;
  imageUrl: string;
  href: string;
  cta: string;
}

const VENUES: VenueIndexItem[] = [
  {
    slug: "y-club",
    name: "Y Club",
    kicker: "Cornerhouse · Onslow Street",
    body: "Two rooms, two dance floors, two bars. Late nights every Friday and Saturday.",
    imageUrl: "/images/12.webp",
    href: "/venues/y-club",
    cta: "Explore Y Club",
  },
  {
    slug: "y-terrace",
    name: "Y Terrace",
    kicker: "The Quadrant · Bridge Street",
    body: "Guildford's outdoor terrace. Cocktails, sport on the big screen, long summer evenings.",
    imageUrl: "/images/club-y-image-4.webp",
    href: "/venues/y-terrace",
    cta: "Explore Y Terrace",
  },
  {
    slug: "y-bar-lounge",
    name: "Y Bar & Lounge",
    kicker: "Guildford",
    body: "Where the night starts. Cocktails, great music, the best warm-up in town.",
    imageUrl: "/images/nadine-195.jpg",
    href: "/venues/y-bar-lounge",
    cta: "Explore Y Bar & Lounge",
  },
];

export default function VenuesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section
          className="relative bg-black overflow-hidden flex items-end"
          style={{ minHeight: "50svh" }}
        >
          <Image
            src="/images/14.webp"
            alt="Y venues, Guildford"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.03, backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
          />
          <div className="relative z-10 text-white px-6 md:px-16 pb-16 pt-40 w-full">
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "16px",
            }}>
              Guildford&apos;s Late-Night Quarter
            </p>
            <h1
              className="text-[46px] md:text-[80px]"
              style={{
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.01em",
                maxWidth: "20ch",
              }}
            >
              Our Venues
            </h1>
            <p
              className="text-[18px] md:text-[22px]"
              style={{
                fontWeight: 400,
                lineHeight: 1.45,
                letterSpacing: "-0.005em",
                color: "rgba(255,255,255,0.7)",
                marginTop: "24px",
                maxWidth: "620px",
              }}
            >
              Three venues, a short walk apart. Each with its own
              personality, and built to take a night from cocktails
              all the way through to the after-hours dance floor.
            </p>
          </div>
        </section>

        {/* ── VENUE PANELS ───────────────────────────────────────────── */}
        {/* Alternates image side per row for visual rhythm. desktopHeight
            "viewport-70" keeps total scroll comfortable on desktop. */}
        <section>
          {VENUES.map((venue, i) => (
            <VenuePanel
              key={venue.slug}
              id={venue.slug}
              imageUrl={venue.imageUrl}
              imageAlt={venue.name}
              imageSide={i % 2 === 0 ? "left" : "right"}
              desktopHeight="viewport-70"
            >
              <p style={{
                fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "16px",
              }}>
                {venue.kicker}
              </p>
              <h2
                className="text-[40px] md:text-[56px]"
                style={{ fontWeight: 700, lineHeight: 1.05, color: "#FAFAFA", marginBottom: "20px", letterSpacing: "-0.01em" }}
              >
                {venue.name}
              </h2>
              <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", marginBottom: "40px", maxWidth: "400px" }}>
                {venue.body}
              </p>
              <Link
                href={venue.href}
                className="group inline-flex items-center justify-center gap-2 border border-white px-6 text-[16px] font-bold text-white hover:bg-white hover:text-black transition-colors duration-200 motion-reduce:transition-none w-full md:w-auto"
                style={{ height: "50px" }}
              >
                {venue.cta}
                <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
              </Link>
            </VenuePanel>
          ))}
        </section>

        {/* ── HIRE ANY VENUE CTA ─────────────────────────────────────── */}
        {/* Addresses the gap visitors hit when they want to enquire about
            hire without committing to a specific venue first. */}
        <section
          className="bg-white text-black relative overflow-hidden"
          style={{ padding: "80px 24px" }}
        >
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
            style={{ maxWidth: "1200px", margin: "0 auto" }}
          >
            <div>
              <p style={{
                fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "16px",
              }}>
                Hosting something?
              </p>
              <h2
                className="text-[36px] md:text-[50px]"
                style={{
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                  maxWidth: "16ch",
                }}
              >
                Hire any of our venues.
              </h2>
              <p style={{
                fontSize: "18px", color: "rgba(0,0,0,0.55)",
                marginTop: "16px", maxWidth: "520px", lineHeight: 1.65,
              }}>
                Birthdays, private parties, brand activations, corporate
                takeovers — up to 1,000 guests across the three venues.
                Tell us what you have in mind and we&apos;ll come back
                with options.
              </p>
            </div>
            <Link
              href="/venue-hire"
              className="group inline-flex items-center justify-center gap-2 border border-black px-8 text-[17px] font-bold text-black hover:bg-black hover:text-white transition-colors duration-200 motion-reduce:transition-none shrink-0"
              style={{ height: "54px" }}
            >
              Enquire about hire
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
