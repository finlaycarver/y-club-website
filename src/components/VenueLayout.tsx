import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { VenueVideo } from "@/components/VenueVideo";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";
import { VenueHeroExtras } from "@/components/VenueHeroExtras";
import { VenueNextEvent } from "@/components/VenueNextEvent";
import { VenueStickyCTA } from "@/components/VenueStickyCTA";
import { Phone } from "lucide-react";
import { VenueOpenStatus } from "@/components/VenueOpenStatus";
import { SpecsCountGrid } from "@/components/SpecsCountGrid";
import { PhotoGridClient } from "@/components/PhotoGridClient";
import type { EventItem } from "@/data/events";
import { BRAND } from "@/lib/site";

/**
 * Shared layout for venue detail pages (Y Club, Y Terrace, Y Bar & Lounge).
 *
 * Each venue page passes a single `config` object describing its hero,
 * overview, specs, video, photos, address treatment, and hire CTA.
 *
 * The two address variants accommodate venues with a public street
 * address ("street") vs venues routing visitors via the contact page
 * ("contact") — used for Y Bar & Lounge until Michelle confirms the
 * street address.
 */

interface SpecItem {
  label: string;
  value: string;
  /** When true, renders the value at 28px (text weight) regardless of
   *  specsStyle — use for multi-word values like "Fri + Sat". */
  compact?: boolean;
  /** Optional accent pill rendered below the label (e.g. "Summer only"). */
  accentBadge?: string;
}

interface PhotoItem {
  src: string;
  alt: string;
}

type AddressVariant =
  | {
      variant: "street";
      kicker: string;
      title: ReactNode;
      postalLine: string;
      directionsUrl: string;
      mapQuery?: string;
    }
  | {
      variant: "contact";
      kicker: string;
      title: ReactNode;
      body: string;
      contactHref: string;
    };

export interface VenueLayoutConfig {
  /** URL slug — used to exclude this venue from the "Also at Y" cross-links. */
  slug?: string;
  hero: {
    imageSrc: string;
    imageAlt: string;
    kicker: string;
    /** ReactNode so venues can use <br/> or styled spans in the headline. */
    title: ReactNode;
    subhead: string;
    /** Optional looped video URL. When set, the video fades over the static
     *  image on capable desktop devices (same upgrade gate as HeroSection). */
    videoSrc?: string;
    primaryCta?: { href: string; label: string };
    secondaryCta?: { href: string; label: string };
    /** Static seasonal label shown as a frosted pill in the hero
     *  (e.g. "Open: April – September"). Use for outdoor/seasonal venues. */
    seasonalBadge?: string;
    /** When true, renders a short vertical line CSS draw-in below the H1. */
    showVerticalLine?: boolean;
    /** When true, the kicker renders as a frosted-glass pill. */
    kickerFrosted?: boolean;
  };
  /** Optional next upcoming event at this venue. Drives the countdown
   *  ticker below the hero subhead. */
  nextEvent?: EventItem;
  overview: {
    kicker: string;
    heading: string;
    paragraphs: ReadonlyArray<string>;
    /** Decorative large numerals shown above the kicker (e.g. ["01","02"] for two-room venues). */
    accentNumerals?: ReadonlyArray<string>;
  };
  specs: ReadonlyArray<SpecItem>;
  /**
   * Visual weight of the spec values:
   * - "numeric"    — 44px display (numbers + short text).
   * - "text"       — 28px weight (text-only labels).
   * - "highlights" — horizontal pill list (venues without numeric stats).
   */
  specsStyle: "numeric" | "text" | "highlights";
  /** Omit to hide the VenueVideo section (e.g. when only CCTV footage
   *  is available — hide until branded content is ready). */
  video?: {
    src: string;
    posterSrc: string;
    kicker: string;
    caption: string;
    /** CSS-crop the top-right corner to hide burned-in timestamps. */
    cropTimestamp?: boolean;
    /** Override playbackRate (e.g. 0.7 for cinematic slow-motion). Default: 1. */
    playbackRate?: number;
    /** Full-frame overlay opacity 0–1 to mute raw footage. */
    overlayOpacity?: number;
  };
  photos: ReadonlyArray<PhotoItem>;
  /**
   * - "feature" : Y Club  — 6 photos, 3-col, first photo 2-row span + panoramic last
   * - "split"   : Y Terrace — legacy 2-col with row-span (prefer "quad")
   * - "row"     : Y Bar  — 3 photos, uniform 3-col
   * - "quad"    : 4 photos, clean 2×2 grid, no row-span
   */
  photoLayout: "feature" | "split" | "row" | "quad";
  /**
   * Optional venue-specific feature section rendered between the video
   * and the photo grid. Used by Y Bar & Lounge for the cocktails module
   * — a unique differentiator vs the club/terrace pages.
   */
  featureSection?: {
    kicker?: string;
    heading: string;
    body: string;
    cta?: { href: string; label: string };
  };
  address: AddressVariant;
  /** Days the venue is open (0=Sun … 6=Sat). Drives "open tonight" indicator. */
  openDays?: ReadonlyArray<number>;
  hire: {
    kicker?: string;
    heading: string;
    body: string;
    /** Short trust signal, e.g. "Avg. response under 48 hours" */
    trustHint?: string;
  };
}

const ENTRY_RULES: ReadonlyArray<string> = [
  "Over 18s only — valid ID required",
  "No tracksuits, hoodies, or sportswear",
  "Smart-casual dress code enforced",
  "Bag searches on entry",
  "Zero tolerance on drugs",
];

/** Cross-link destination data — each venue links to the other two. */
const ALL_VENUE_LINKS = [
  { slug: "y-club",       label: "Y Club",         href: "/venues/y-club",       imageUrl: "/images/12.webp",             tagline: "Where the night goes loud" },
  { slug: "y-terrace",    label: "Y Terrace",      href: "/venues/y-terrace",    imageUrl: "/images/club-y-image-4.webp", tagline: "Open-air, all season" },
  { slug: "y-bar-lounge", label: "Y Bar & Lounge", href: "/venues/y-bar-lounge", imageUrl: "/images/nadine-195.jpg",      tagline: "Where the night starts" },
] as const;

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

export function VenueLayout({ config }: { config: VenueLayoutConfig }) {
  const primaryCta = config.hero.primaryCta ?? { href: "/whats-on",   label: "See What's On" };
  const secondaryCta = config.hero.secondaryCta ?? { href: "/venue-hire", label: "Hire the Venue" };
  const siblingVenues = ALL_VENUE_LINKS.filter((v) => v.slug !== config.slug);

  return (
    <main id="main-content">

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section
        className="relative bg-black overflow-hidden"
        style={{ minHeight: "100svh" }}
      >
        {/* Static poster image — always present as fallback */}
        <Image
          src={config.hero.imageSrc}
          alt={config.hero.imageAlt}
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.9) 100%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.03, backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
        />

        {/* Client island: video overlay + cursor reactive light + native share.
            Renders nothing on server; activates after hydration. */}
        <VenueHeroExtras
          videoSrc={config.hero.videoSrc}
          posterSrc={config.hero.imageSrc}
          shareTitle={typeof config.hero.title === "string" ? config.hero.title : undefined}
          shareText={config.hero.subhead}
        />

        <div className="absolute left-6 md:left-16 text-white" style={{ bottom: "80px", zIndex: 10 }}>
          {config.hero.kickerFrosted ? (
            /* Frosted-glass pill kicker — A4-VX [LOW] for intimate venues */
            <p
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "5px 12px",
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.18)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                marginBottom: "18px",
              }}
            >
              {config.hero.kicker}
            </p>
          ) : (
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "18px",
            }}>
              {config.hero.kicker}
            </p>
          )}

          {/* Seasonal open badge — static pill for outdoor/seasonal venues */}
          {config.hero.seasonalBadge && (
            <p
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "5px 12px",
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.18)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                marginBottom: "20px",
              }}
            >
              <span
                aria-hidden="true"
                style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }}
              />
              {config.hero.seasonalBadge}
            </p>
          )}

          <h1
            className="text-[52px] md:text-[90px]"
            style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em", marginBottom: config.hero.showVerticalLine ? "16px" : "24px" }}
          >
            {config.hero.title}
          </h1>

          {/* Vertical line draw-in — CSS animation on a 1px rule below H1 */}
          {config.hero.showVerticalLine && (
            <div
              className="venue-hero-vline"
              aria-hidden="true"
              style={{ marginBottom: "24px" }}
            />
          )}

          <p
            className="text-[18px] md:text-[22px]"
            style={{
              fontWeight: 400, color: "rgba(255,255,255,0.75)",
              marginBottom: "8px", maxWidth: "520px", lineHeight: 1.4,
            }}
          >
            {config.hero.subhead}
          </p>

          {/* Next event ticker — client island, null until hydrated */}
          {config.nextEvent && <VenueNextEvent event={config.nextEvent} />}

          <div className="flex flex-col gap-3 md:flex-row md:gap-4" style={{ marginTop: "36px" }}>
            <Link
              href={primaryCta.href}
              className="group venue-cta-ripple inline-flex items-center justify-center gap-2 border border-white px-6 text-[17px] font-bold hover:-translate-y-0.5 transition-transform duration-200 motion-reduce:transition-none bg-white text-black w-full md:w-auto"
              style={{ height: "50px" }}
            >
              {primaryCta.label}
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
            <Link
              href={secondaryCta.href}
              className="group venue-cta-ripple inline-flex items-center justify-center gap-2 border border-white/60 px-6 text-[17px] font-bold text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 motion-reduce:transition-none w-full md:w-auto"
              style={{ height: "50px" }}
            >
              {secondaryCta.label}
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
          </div>

          {/* Tap-to-call — mobile only. Sits below the hero CTAs so it's
              always reachable without scrolling. Desktop uses footer contact. */}
          <a
            href={`tel:${BRAND.phone}`}
            className="md:hidden inline-flex items-center gap-2 mt-5 hover:opacity-100 transition-opacity duration-200"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
            </svg>
            {BRAND.phoneDisplay}
          </a>
        </div>
      </section>

      {/* ── OVERVIEW + SPECS ───────────────────────────────────────── */}
      <section
        id="overview"
        className="bg-black text-white scroll-mt-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 24px" }}
        >
          <div>
            {/* Decorative accent numerals — e.g. "01 / 02" for rooms.
                Large ghost numerals above the kicker (A4-VX [HIGH]). */}
            {config.overview.accentNumerals && (
              <div
                className="flex gap-4"
                aria-hidden="true"
                style={{ marginBottom: "20px" }}
              >
                {config.overview.accentNumerals.map((n) => (
                  <span
                    key={n}
                    style={{
                      fontSize: "clamp(48px, 6vw, 80px)",
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      color: "rgba(255,255,255,0.07)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {n}
                  </span>
                ))}
              </div>
            )}

            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "20px",
            }}>
              {config.overview.kicker}
            </p>

            {/* Sticky H2 — stays in view as user reads the body copy (A4-VX [MED]) */}
            <h2
              className="text-[36px] md:text-[50px]"
              style={{
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                marginBottom: "24px",
                position: "sticky",
                top: "140px",
                zIndex: 1,
              }}
            >
              {config.overview.heading}
            </h2>

            {config.overview.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                style={{
                  fontSize: "18px",
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: "1.75",
                  marginBottom: i === config.overview.paragraphs.length - 1 ? 0 : "16px",
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Animated specs grid — count-up on intersection, edge-light rim */}
          <SpecsCountGrid specs={config.specs} specsStyle={config.specsStyle} />
        </div>
      </section>

      {/* ── VENUE LOOP — omitted when config.video is absent (e.g. only
          CCTV footage available — hidden until branded content lands) ── */}
      {config.video && (
        <div id="video" className="scroll-mt-20">
          <VenueVideo
            src={config.video.src}
            posterSrc={config.video.posterSrc}
            kicker={config.video.kicker}
            caption={config.video.caption}
            cropTimestamp={config.video.cropTimestamp}
            playbackRate={config.video.playbackRate}
            overlayOpacity={config.video.overlayOpacity}
          />
        </div>
      )}

      {/* ── FEATURE SECTION (optional) ────────────────────────────── */}
      {/* Venue-specific module — e.g. cocktails at Y Bar & Lounge.
          Rendered between the video loop and the photo grid so it
          has context (you've seen the space) before the deep dive. */}
      {config.featureSection && (
        <section
          className="bg-black text-white"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "80px 24px",
          }}
        >
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
            style={{ maxWidth: "1200px", margin: "0 auto" }}
          >
            <div>
              {config.featureSection.kicker && (
                <p style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "20px",
                }}>
                  {config.featureSection.kicker}
                </p>
              )}
              <h2
                className="text-[36px] md:text-[50px]"
                style={{
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                  marginBottom: "20px",
                }}
              >
                {config.featureSection.heading}
              </h2>
              <p style={{
                fontSize: "18px",
                color: "rgba(255,255,255,0.65)",
                lineHeight: "1.75",
                marginBottom: config.featureSection.cta ? "32px" : 0,
                maxWidth: "540px",
              }}>
                {config.featureSection.body}
              </p>
              {config.featureSection.cta && (
                <Link
                  href={config.featureSection.cta.href}
                  className="group inline-flex items-center gap-2 border border-white/30 px-6 text-[15px] font-bold text-white hover:border-white hover:bg-white hover:text-black transition-all duration-200 motion-reduce:transition-none"
                  style={{ height: "50px" }}
                >
                  {config.featureSection.cta.label}
                  <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
                </Link>
              )}
            </div>

            {/* Right column — decorative quote / atmosphere copy */}
            <div
              className="hidden lg:flex flex-col justify-center"
              style={{
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                paddingLeft: "64px",
              }}
            >
              <p
                className="text-[22px]"
                style={{
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontFamily: "var(--font-birdie), serif",
                  color: "rgba(255,255,255,0.25)",
                  lineHeight: 1.4,
                  letterSpacing: "0.01em",
                }}
              >
                &ldquo;Where the night starts.&rdquo;
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── PHOTO GRID ─────────────────────────────────────────────── */}
      {/* PhotoGridClient adds: stagger entrance, caption overlay on hover,
          lightbox on click — all in a single client island. */}
      <div id="photos" className="scroll-mt-20">
        <PhotoGridClient photos={config.photos} layout={config.photoLayout} />
      </div>

      {/* ── ADDRESS + ENTRY ────────────────────────────────────────── */}
      <section
        id="address"
        className="bg-black text-white scroll-mt-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "80px 24px" }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <AddressBlock address={config.address} openDays={config.openDays} />

          <div>
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "20px",
            }}>
              Entry
            </p>
            {/* Desktop: always expanded.
                Mobile: <details> collapse to cut visual bulk (A4-MF [HIGH]).
                No JS needed — native HTML. */}
            <div className="hidden md:block">
              <EntryList />
            </div>
            <details className="md:hidden">
              <summary
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.45)",
                  padding: "8px 0",
                  userSelect: "none",
                  listStyle: "none",
                }}
              >
                See entry requirements ›
              </summary>
              <div style={{ marginTop: "8px" }}>
                <EntryList />
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ── HIRE CTA ───────────────────────────────────────────────── */}
      <section id="hire" className="text-white scroll-mt-20" style={{ padding: "80px 24px", background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <div>
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "16px",
            }}>
              {config.hire.kicker ?? "Private Hire"}
            </p>
            <h2
              className="text-[36px] md:text-[50px]"
              style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em" }}
            >
              {config.hire.heading}
            </h2>
            <p style={{
              fontSize: "18px", color: "rgba(255,255,255,0.55)",
              marginTop: "16px", maxWidth: "460px", lineHeight: "1.65",
            }}>
              {config.hire.body}
            </p>
            {config.hire.trustHint && (
              <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: "14px" }}>
                {config.hire.trustHint}
              </p>
            )}
          </div>
          <Link
            href="/venue-hire"
            className="group inline-flex items-center justify-center gap-2 border border-white/40 px-8 text-[17px] font-bold text-white hover:bg-white hover:text-black transition-colors duration-200 motion-reduce:transition-none shrink-0"
            style={{ height: "54px" }}
          >
            Enquire About Hire
            <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
          </Link>
        </div>
      </section>

      {/* ── ALSO AT Y — cross-links to sibling venues ──────────────── */}
      {siblingVenues.length > 0 && (
        <section className="bg-black text-white" style={{ padding: "64px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <p style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "32px" }}>
              Also at Y
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {siblingVenues.map((venue) => (
                <Link key={venue.slug} href={venue.href} className="group relative block overflow-hidden" style={{ textDecoration: "none", aspectRatio: "16/7" }}>
                  <Image src={venue.imageUrl} alt={venue.label} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} className="transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "5px" }}>{venue.tagline}</p>
                    <div className="flex items-center justify-between">
                      <p style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.01em" }}>{venue.label}</p>
                      <ChevronRightIcon className="size-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 motion-reduce:transition-none" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile sticky CTA — "Get tickets" + tap-to-call.
          z-40 sits above MobileCtaBar (z-30) so it replaces it
          with venue-specific actions on venue detail pages. */}
      <VenueStickyCTA
        nextEvent={config.nextEvent}
        whatsOnHref={primaryCta.href}
      />

    </main>
  );
}

// ─── Subcomponents ──────────────────────────────────────────────────

function EntryList() {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {ENTRY_RULES.map((rule) => (
        <li
          key={rule}
          style={{
            fontSize: "17px",
            color: "rgba(255,255,255,0.6)",
            padding: "14px 0",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            lineHeight: "1.5",
          }}
        >
          {rule}
        </li>
      ))}
    </ul>
  );
}

/**
 * Photo grid with three layout modes, picked per venue based on the
 * shape and count of photos available. Visual inconsistency across
 * venues is INTENTIONAL — each venue's grid was tuned to its own asset
 * set rather than forced into a uniform template.
 *
 *  - "feature" — Y Club:    6 photos, 3-col, first photo 1:1 spanning 2 rows
 *  - "split"   — Y Terrace: 4 photos, 2-col, first photo 3:4 spanning 2 rows
 *  - "row"     — Y Bar:     3 photos, uniform 3-col, 3:4 aspect
 */
function PhotoGrid({
  photos,
  layout,
}: {
  photos: ReadonlyArray<PhotoItem>;
  layout: "feature" | "split" | "row";
}) {
  // "row" — uniform 3-col, 3:4 aspect per cell (Y Bar & Lounge)
  if (layout === "row") {
    return (
      <section className="bg-black" style={{ paddingBottom: "2px" }}>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "2px" }}>
          {photos.map((photo) => (
            <div
              key={photo.src}
              className="relative overflow-hidden"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // "split" — 2-col grid with feature photo spanning 2 rows (Y Terrace, 4 photos)
  if (layout === "split") {
    return (
      <section className="bg-black" style={{ paddingBottom: "2px" }}>
        <div className="grid grid-cols-2" style={{ gap: "2px" }}>
          {photos.map((photo, i) => (
            <div
              key={photo.src}
              className={`relative overflow-hidden${i === 0 ? " row-span-2" : ""}`}
              style={{ aspectRatio: i === 0 ? "3/4" : "4/3" }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                style={{ objectFit: "cover" }}
                sizes="50vw"
                className="hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // "feature" — 3-col grid, 6 photos.
  // Previous row-span approach created blank cells — replaced with:
  //   Row 1-2: photo[0] spans col 1 (portrait), photos[1-4] fill cols 2-3
  //   Row 3:   photo[5] spans all 3 cols (panoramic banner)
  // This fills all 9 grid cells without any blanks.
  return (
    <section className="bg-black" style={{ paddingBottom: "2px" }}>
      <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: "2px" }}>
        {photos.map((photo, i) => {
          const isFeature  = i === 0;
          const isPanoramic = i === photos.length - 1 && photos.length === 6;
          return (
            <div
              key={photo.src}
              className={[
                "relative overflow-hidden",
                isFeature   ? "col-span-1 row-span-2" : "",
                isPanoramic ? "col-span-2 md:col-span-3" : "",
              ].join(" ")}
              style={{
                // Feature: no aspect-ratio — height driven by adjacent cells
                // Panoramic: 21/9 cinematic banner
                // Regular:   4/3 portrait
                aspectRatio: isFeature ? undefined : isPanoramic ? "21/9" : "4/3",
                // Feature photo needs a minimum height so the fill Image renders
                minHeight: isFeature ? "280px" : undefined,
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                style={{ objectFit: "cover" }}
                sizes={
                  isPanoramic
                    ? "100vw"
                    : isFeature
                      ? "(max-width: 768px) 50vw, 33vw"
                      : "(max-width: 768px) 50vw, 33vw"
                }
                className="hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AddressBlock({ address, openDays }: { address: AddressVariant; openDays?: ReadonlyArray<number> }) {
  return (
    <div>
      <p style={{
        fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "20px",
      }}>
        {address.kicker}
      </p>
      {address.variant === "street" && address.mapQuery && (
        <div className="relative overflow-hidden mb-6" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <iframe
            title="Venue map"
            src={`https://maps.google.com/maps?q=${address.mapQuery}&output=embed&z=16`}
            width="100%"
            height="220"
            style={{ display: "block", border: 0, filter: "invert(0.9) hue-rotate(180deg) brightness(0.85) saturate(0.6)" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
      {/* Promoted from h3 → h2 so each major section starts at the same
          depth (overview h2 / address h2 / hire h2). */}
      <h2 style={{ fontSize: "34px", fontWeight: 700, lineHeight: 1.1, marginBottom: "12px" }}>
        {address.title}
      </h2>

      {address.variant === "street" ? (
        <>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", marginBottom: "14px" }}>
            {address.postalLine}
          </p>
          {/* Opening hours + live "open tonight" indicator */}
          {openDays && (
            <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: "32px" }}>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)" }}>Wed–Sat, 8pm onwards</p>
              <VenueOpenStatus openDays={openDays} />
            </div>
          )}
          {!openDays && <div style={{ marginBottom: "32px" }} />}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={address.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-[15px] font-bold text-white hover:border-white hover:bg-white hover:text-black transition-all duration-200 motion-reduce:transition-none"
            >
              Get Directions
              <ExternalLinkIcon />
              {/* Visually-hidden for screen readers; sighted users see the icon. */}
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <a
              href={`tel:${BRAND.phone}`}
              className="group inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-[15px] font-medium text-white/65 hover:text-white hover:border-white/50 transition-all duration-200 motion-reduce:transition-none"
            >
              <Phone size={16} aria-hidden="true" />
              {BRAND.phoneDisplay}
            </a>
          </div>
        </>
      ) : (
        <>
          <p style={{
            fontSize: "18px", color: "rgba(255,255,255,0.55)",
            marginBottom: "36px", lineHeight: 1.55, maxWidth: "400px",
          }}>
            {address.body}
          </p>
          <Link
            href={address.contactHref}
            className="group inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-[15px] font-bold text-white hover:border-white hover:bg-white hover:text-black transition-all duration-200 motion-reduce:transition-none"
          >
            Contact Us
            <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
          </Link>
        </>
      )}
    </div>
  );
}
