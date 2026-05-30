import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VenuePanel } from "@/components/VenuePanel";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";
import { VenuesStickyBar } from "./VenuesStickyBar";

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

// ── Venue data ────────────────────────────────────────────────────────────────

interface VenueIndexItem {
  slug: string;
  name: string;
  kicker: string;
  body: string;
  imageUrl: string;
  href: string;
  cta: string;
  venueFilterParam: string;
  /** Per-venue accent colour — sourced from venue signature lighting */
  accent: string;
  /** Short fact chips shown beneath the body copy */
  specs: string[];
  /** Decorative ordinal overlaid on the panel image */
  ordinal: string;
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
    venueFilterParam: "Y+Club",
    accent: "#D4206A",   // magenta — club signature lighting
    ordinal: "01",
    specs: ["2 dance floors", "2 bars", "Fri + Sat"],
  },
  {
    slug: "y-terrace",
    name: "Y Terrace",
    kicker: "The Quadrant · Bridge Street",
    body: "Guildford's outdoor terrace. Cocktails, sport on the big screen, long summer evenings.",
    imageUrl: "/images/club-y-image-4.webp",
    href: "/venues/y-terrace",
    cta: "Explore Y Terrace",
    venueFilterParam: "Y+Terrace",
    accent: "#2AAD6A",   // green — outdoor terrace lighting
    ordinal: "02",
    specs: ["Outdoor terrace", "Big screens", "Cocktail bar"],
  },
  {
    slug: "y-bar-lounge",
    name: "Y Bar & Lounge",
    kicker: "Guildford Town Centre",
    body: "Where the night starts. Cocktails, great music, the best warm-up in town.",
    imageUrl: "/images/nadine-195.jpg",
    href: "/venues/y-bar-lounge",
    cta: "Explore Y Bar & Lounge",
    venueFilterParam: "Y+Bar+%26+Lounge",
    accent: "#C08A1E",   // gold — warm bar lighting
    ordinal: "03",
    specs: ["Cocktail bar", "Live DJ sets", "Wed – Sat"],
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function VenuesPage() {
  return (
    <>
      <SiteHeader />
      {/* pb-[58px] clears the sticky mobile CTA bar (md:pb-0 resets on desktop) */}
      <main id="main-content" className="pb-[58px] md:pb-0">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section
          className="relative bg-black overflow-hidden flex items-end"
          style={{ minHeight: "100svh" }}
        >
          {/* Background video — autoplays muted on loop. Static poster
              image shows instantly while the video buffers. */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/club-y-image-5.webp"
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 40%",
            }}
          >
            <source src="/videos/venues-hero.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.88) 100%)" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.03, backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
          />

          {/* Editorial numerals — top-right, desktop only */}
          <div
            aria-hidden="true"
            className="hidden md:flex absolute top-32 right-16 gap-8 items-center"
            style={{ zIndex: 2 }}
          >
            {(["01", "02", "03"] as const).map((n, i) => (
              <span
                key={n}
                className="hero-word"
                style={{
                  animationDelay: `${i * 180}ms`,
                  fontSize: "72px",
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: "rgba(255,255,255,0.12)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {n}
              </span>
            ))}
          </div>

          <div className="relative z-10 text-white px-6 md:px-16 pb-16 pt-40 w-full">
            <p className="hidden md:block" style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "16px" }}>
              Guildford&apos;s Late-Night Quarter
            </p>
            <h1
              className="text-[46px] md:text-[80px]"
              style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em" }}
            >
              <span className="hero-word" style={{ animationDelay: "80ms" }}>Three</span>
              {" "}
              <span className="hero-word" style={{ animationDelay: "200ms" }}>doors.</span>
              {" "}
              <span className="hero-word" style={{ animationDelay: "320ms" }}>One</span>
              {" "}
              <span className="hero-word" style={{ animationDelay: "440ms" }}>night.</span>
            </h1>
            <p
              className="hidden md:block text-[22px]"
              style={{ fontWeight: 400, lineHeight: 1.45, letterSpacing: "-0.005em", color: "rgba(255,255,255,0.7)", marginTop: "24px", maxWidth: "620px" }}
            >
              Three venues, a short walk apart. Each with its own
              personality — cocktails to start, terrace to settle,
              club to finish.
            </p>
          </div>
        </section>

        {/* ── VENUE PANELS ───────────────────────────────────────────── */}
        {/* Mobile: .venue-index-carousel (CSS scroll-snap) — kills the
            6-viewport scroll depth (A4-MX [HIGH]).
            Desktop: vertical split-grid at 55vh — reduces page from
            ~4 viewports to ~2 (A4-VFP [HIGH]). */}

        {/* Mobile carousel */}
        <div className="venue-index-carousel md:hidden">
          {VENUES.map((venue, i) => (
            <div key={venue.slug}>
              <VenuePanel
                id={venue.slug}
                imageUrl={venue.imageUrl}
                imageAlt={venue.name}
                imageSide={i % 2 === 0 ? "left" : "right"}
                desktopHeight="viewport-55"
                ordinal={venue.ordinal}
                priority={i === 0}
              >
                <PanelContent venue={venue} />
              </VenuePanel>
            </div>
          ))}
        </div>

        {/* Desktop vertical stack */}
        <div className="hidden md:block">
          {VENUES.map((venue, i) => (
            <VenuePanel
              key={venue.slug}
              id={venue.slug}
              imageUrl={venue.imageUrl}
              imageAlt={venue.name}
              imageSide={i % 2 === 0 ? "left" : "right"}
              desktopHeight="viewport-55"
              ordinal={venue.ordinal}
              priority={i === 0}
            >
              <PanelContent venue={venue} />
            </VenuePanel>
          ))}
        </div>

        {/* ── FIND US ─────────────────────────────────────────────────── */}
        {/* Location section (A4-VFP [MED]) — links to Google Maps rather
            than an iframe so no API key is needed. */}
        <section
          className="bg-black text-white"
          style={{ padding: "64px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="flex flex-col md:flex-row md:items-start md:justify-between gap-10"
            style={{ maxWidth: "1400px", margin: "0 auto" }}
          >
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "16px" }}>
                Find us
              </p>
              <h2
                className="text-[28px] md:text-[40px]"
                style={{ fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: "8px" }}
              >
                Guildford town centre.
              </h2>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: "400px" }}>
                All three venues are a short walk from each other — plan
                one night across all of them.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              {VENUES.map((v) => (
                <a
                  key={v.slug}
                  href={`https://www.google.com/maps/search/${encodeURIComponent(v.name + " Guildford")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-4 transition-opacity duration-200 motion-reduce:transition-none"
                  style={{ textDecoration: "none", opacity: 0.85 }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: v.accent, paddingTop: "3px", minWidth: "28px" }}>
                    {v.ordinal}
                  </span>
                  <div>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: "#FAFAFA", marginBottom: "2px" }}>
                      {v.name}
                    </p>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
                      {v.kicker}
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200 inline-block ml-1.5" style={{ fontSize: "11px" }}>↗</span>
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── HIRE ANY VENUE CTA ─────────────────────────────────────── */}
        <section className="bg-white text-black relative overflow-hidden" style={{ padding: "80px 24px" }}>
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
            style={{ maxWidth: "1200px", margin: "0 auto" }}
          >
            <div>
              <p style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "16px" }}>
                Hosting something?
              </p>
              <h2
                className="text-[36px] md:text-[50px]"
                style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em", maxWidth: "16ch" }}
              >
                Hire any of our venues.
              </h2>
              <p style={{ fontSize: "18px", color: "rgba(0,0,0,0.55)", marginTop: "16px", maxWidth: "520px", lineHeight: 1.65 }}>
                Birthdays, private parties, brand activations, corporate
                takeovers — up to 1,500 guests across the three venues.
                Tell us what you have in mind and we&apos;ll come back with options.
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

// ── PanelContent ─────────────────────────────────────────────────────────────
// Extracted so the same JSX renders in both the mobile carousel and
// the desktop vertical stack without duplication.

function PanelContent({ venue }: { venue: VenueIndexItem }) {
  return (
    <>
      {/* Kicker in per-venue accent colour (A4-VX [HIGH]) */}
      <p
        style={{
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: venue.accent,
          marginBottom: "16px",
        }}
      >
        {venue.kicker}
      </p>

      <h2
        className="text-[40px] md:text-[56px]"
        style={{ fontWeight: 700, lineHeight: 1.05, color: "#FAFAFA", marginBottom: "16px", letterSpacing: "-0.01em" }}
      >
        {venue.name}
      </h2>

      <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", lineHeight: "1.7", marginBottom: "20px", maxWidth: "400px" }}>
        {venue.body}
      </p>

      {/* Inline specs row (A4-VX [HIGH]) */}
      <div
        className="flex flex-wrap items-center gap-x-3 gap-y-1"
        style={{ marginBottom: "32px" }}
        aria-label={`${venue.name} highlights`}
      >
        {venue.specs.map((spec, i) => (
          <span key={spec} className="flex items-center gap-3">
            <span style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.55)", letterSpacing: "0.02em" }}>
              {spec}
            </span>
            {i < venue.specs.length - 1 && (
              <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>·</span>
            )}
          </span>
        ))}
      </div>

      {/* Primary CTA — venue-panel-cta class adds tap ring on :active */}
      <Link
        href={venue.href}
        className="venue-panel-cta group inline-flex items-center justify-center gap-2 border border-white px-6 text-[16px] font-bold text-white hover:bg-white hover:text-black transition-colors duration-200 motion-reduce:transition-none w-full md:w-auto"
        style={{ height: "50px", marginBottom: "20px" }}
      >
        {venue.cta}
        <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
      </Link>

      {/* Secondary links */}
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link
          href={`/whats-on?venue=${venue.venueFilterParam}`}
          className="group inline-flex items-center gap-1 hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none"
          style={{ fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
        >
          <span className="border-b border-white/20 group-hover:border-white/60 transition-colors duration-200 pb-px">Events here</span>
          <ChevronRightIcon className="size-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all duration-200" />
        </Link>
        <Link
          href="/venue-hire"
          className="group inline-flex items-center gap-1 hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none"
          style={{ fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
        >
          <span className="border-b border-white/20 group-hover:border-white/60 transition-colors duration-200 pb-px">Hire this venue</span>
          <ChevronRightIcon className="size-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all duration-200" />
        </Link>
        {/* Tap-to-call — mobile only (A4-MX [MED]) */}
        <a
          href="tel:+441483342027"
          className="md:hidden group inline-flex items-center gap-1 hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none"
          style={{ fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
        >
          <span className="border-b border-white/20 group-hover:border-white/60 transition-colors duration-200 pb-px">Call to book</span>
        </a>
      </div>
    </>
  );
}
