import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SocialProof } from "@/components/SocialProof";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";
import { BRAND, VENUES } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Y — Guildford's Late-Night Quarter",
  description:
    "Three venues in the heart of Guildford. The story behind Y, the team, and how to join us.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Y — Guildford's Late-Night Quarter",
    description:
      "Three venues in the heart of Guildford. The story behind Y, the team, and how to join us.",
    url: "/about",
    images: [{ url: "/images/14.webp", width: 1200, height: 630 }],
  },
};

// "Open since" stat will return once Michelle confirms the year — for now
// we lead with a fourth verifiable number: nights open per week (Fri + Sat).
const STATS = [
  { label: "Venues",        value: "3"      },
  { label: "Bars",          value: "6+"     },
  { label: "Capacity",      value: "1,000"  },
  { label: "Late nights",   value: "Fri+Sat" },
];

interface Vacancy {
  title: string;
  body: string;
}

const VACANCIES: ReadonlyArray<Vacancy> = [
  {
    title: "Bar Staff",
    body: "Mix and serve. Warm welcome, sharp service, high-energy environment. Prior bar experience preferred.",
  },
  {
    title: "Glass Collector",
    body: "Keep the floor moving. Maintain the bar, support the team, work fast.",
  },
  {
    title: "General Labourer",
    body: "Versatile venue support. Facility upkeep, manual tasks, working closely with the wider team.",
  },
];

/**
 * Prefilled mailto body — gives the applicant a sensible starting
 * scaffold so the email arrives with enough context to triage quickly.
 * Newlines encoded as %0A; final URL is built once at module scope.
 */
const APPLY_MAILTO = (() => {
  const subject = "Job application";
  const body = [
    "Hi Y team,",
    "",
    "I'd like to apply for a role at Y. Quick context:",
    "",
    "- Role of interest:",
    "- Availability (days / hours):",
    "- Relevant experience:",
    "",
    "I've attached my CV.",
    "",
    "Thanks,",
  ].join("\n");
  return `mailto:${BRAND.jobsEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
})();

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section className="relative bg-black overflow-hidden flex items-end" style={{ minHeight: "70svh" }}>
          <Image
            src="/images/14.webp"
            alt="About Y"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.88) 100%)" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.03, backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
          />
          <div className="relative z-10 text-white px-6 md:px-16 pb-16 pt-40">
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "16px",
            }}>
              About Y
            </p>
            <h1 className="text-[46px] md:text-[80px]" style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em" }}>
              Guildford&apos;s<br />Late-Night Quarter.
            </h1>
          </div>
        </section>

        {/* ── STORY ──────────────────────────────────────────────────── */}
        <section
          id="story"
          className="bg-black text-white scroll-mt-20"
          style={{ padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20" style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div className="lg:col-span-2">
              <p style={{
                fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "16px",
              }}>
                Our Story
              </p>
              <h2
                className="text-[36px] md:text-[52px]"
                style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em" }}
              >
                Built for the
                <br />
                whole night.
              </h2>
            </div>
            <div className="lg:col-span-3">
              <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: "20px" }}>
                Y started with a stubborn idea: that Guildford&apos;s best nights
                shouldn&apos;t have to end with one venue closing its doors. So we
                built three — a cocktail bar, an open-air terrace, and a late-night
                club — each tuned for a different chapter of the same evening.
              </p>
              <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "16px" }}>
                Six bars across the three sites. A roof terrace. A wood-fire pizza
                oven for the in-between hours. And Friday and Saturday line-ups
                that pull DJs and artists from across the UK to a town that knows
                how to throw a night.
              </p>
              <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                Cocktails to start, terrace to settle in, club to finish — all a
                short walk apart. Whatever night you&apos;re after, we&apos;ve got
                the room for it.
              </p>
            </div>
          </div>
        </section>

        {/* ── TEAM VOICE ─────────────────────────────────────────────── */}
        {/* Adds brand presence without depending on a founder photo asset.
            Voice / quote treatment so the page doesn't read corporate. */}
        <section
          aria-label="From the team"
          className="bg-black text-white"
          style={{ padding: "0 24px 64px" }}
        >
          <figure
            style={{
              maxWidth: "880px",
              margin: "0 auto",
              borderLeft: "2px solid rgba(255,255,255,0.25)",
              paddingLeft: "32px",
            }}
          >
            <blockquote
              className="text-[24px] md:text-[36px]"
              style={{
                fontWeight: 700,
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
                color: "#FAFAFA",
                margin: 0,
              }}
            >
              &ldquo;Three venues. One door policy. Same crew behind every bar.
              That&apos;s what makes Y feel like Y.&rdquo;
            </blockquote>
            <figcaption
              style={{
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                marginTop: "20px",
              }}
            >
              The Y team
            </figcaption>
          </figure>
        </section>

        {/* ── STATS ──────────────────────────────────────────────────── */}
        <section
          id="stats"
          className="bg-black text-white scroll-mt-20"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "0 24px 96px" }}
        >
          <div
            className="grid grid-cols-2 lg:grid-cols-4"
            style={{ maxWidth: "1280px", margin: "0 auto", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {STATS.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  padding: "40px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  borderRight: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p style={{ fontSize: "56px", fontWeight: 700, lineHeight: 1, color: "#FAFAFA", marginBottom: "10px" }}>
                  {value}
                </p>
                <p style={{
                  fontSize: "12px", fontWeight: 500, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
                }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── IMAGERY ─────────────────────────────────────────────────── */}
        <section
          id="imagery"
          className="bg-black scroll-mt-20"
          style={{ paddingBottom: "2px" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: "2px" }}>
            {[
              { src: "/images/12.webp",                                              alt: "Y Club"          },
              { src: "/images/club-y-image-4.webp",                                  alt: "Y Terrace"       },
              { src: "/images/nadine-195.jpg",                                       alt: "Y Bar & Lounge"  },
              { src: "/images/img-1901.jpg",                                         alt: "Y crowd"         },
              { src: "/images/441900351_371148019313956_2396615588718096493_n-2-copy.webp", alt: "Y night" },
              { src: "/images/img-0959.jpeg",                                        alt: "Y atmosphere"    },
            ].map((photo) => (
              <div key={photo.src} className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── SOCIAL PROOF ───────────────────────────────────────────── */}
        <SocialProof
          variant="dark"
          kicker="Trusted by Guildford"
          heading="The numbers behind the night."
        />

        {/* ── CAREERS ────────────────────────────────────────────────── */}
        <section id="careers" className="bg-black text-white" style={{ padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div className="mb-12 md:mb-16 max-w-2xl">
              <p style={{
                fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "16px",
              }}>
                Careers
              </p>
              <h2
                className="text-[36px] md:text-[52px]"
                style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: "20px" }}
              >
                Work with us.
              </h2>
              <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
                We&apos;re always looking for friendly, energetic people who can handle a busy floor.
                If that sounds like you, get in touch.
              </p>
            </div>

            {VACANCIES.length === 0 ? (
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "40px 32px",
                  textAlign: "center",
                  maxWidth: "640px",
                }}
              >
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#FAFAFA",
                    marginBottom: "10px",
                  }}
                >
                  No live openings right now.
                </p>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>
                  We add new roles here as they open. Drop us your CV in the
                  meantime — we keep promising applications on file and reach
                  out when something opens up.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {VACANCIES.map((vac) => (
                  <div
                    key={vac.title}
                    style={{
                      border: "1px solid rgba(255,255,255,0.1)",
                      padding: "32px 28px",
                    }}
                  >
                    <h3 style={{
                      fontSize: "22px", fontWeight: 700, lineHeight: 1.2,
                      marginBottom: "12px", color: "#FAFAFA",
                    }}>
                      {vac.title}
                    </h3>
                    <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>
                      {vac.body}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: "40px" }}>
              <a
                href={APPLY_MAILTO}
                className="group inline-flex items-center justify-center gap-2 border border-white px-8 text-[16px] font-bold text-white hover:bg-white hover:text-black transition-colors duration-200 motion-reduce:transition-none"
                style={{ height: "56px" }}
              >
                {VACANCIES.length === 0 ? "Send your CV" : "Apply Now"}
                <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
              </a>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginTop: "16px" }}>
                Or pop in and ask for a manager — we&apos;re usually around.
              </p>
            </div>
          </div>
        </section>

        {/* ── CONTACT ────────────────────────────────────────────────── */}
        <section id="contact" className="bg-white text-black" style={{ padding: "96px 24px" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12" style={{ maxWidth: "1280px", margin: "0 auto" }}>

            <div>
              <p style={{
                fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "16px",
              }}>
                Get in Touch
              </p>
              <h2
                className="text-[36px] md:text-[52px]"
                style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: "32px" }}
              >
                Say hi.
              </h2>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "24px" }}>
                <p style={{
                  fontSize: "12px", fontWeight: 500, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "8px",
                }}>
                  Phone
                </p>
                <a
                  href={`tel:${BRAND.phone}`}
                  className="hover:underline underline-offset-4"
                  style={{ fontSize: "26px", fontWeight: 700, color: "#080808", textDecoration: "none" }}
                >
                  {BRAND.phoneDisplay}
                </a>
              </div>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "24px", marginTop: "24px" }}>
                <p style={{
                  fontSize: "12px", fontWeight: 500, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "8px",
                }}>
                  Email
                </p>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="hover:underline underline-offset-4"
                  style={{ fontSize: "22px", fontWeight: 500, color: "#080808", textDecoration: "none" }}
                >
                  {BRAND.email}
                </a>
              </div>
            </div>

            <div>
              <p style={{
                fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "16px",
              }}>
                Find Us
              </p>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "24px" }}>
                <p style={{ fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "8px" }}>
                  {VENUES.yClub.name}
                </p>
                <p style={{ fontSize: "18px", color: "#080808", lineHeight: 1.5 }}>
                  {VENUES.yClub.streetAddress}<br />
                  {VENUES.yClub.locality}, {VENUES.yClub.postalCode}
                </p>
              </div>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "24px", marginTop: "24px" }}>
                <p style={{ fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "8px" }}>
                  {VENUES.yTerrace.name}
                </p>
                <p style={{ fontSize: "18px", color: "#080808", lineHeight: 1.5 }}>
                  {VENUES.yTerrace.streetAddress}<br />
                  {VENUES.yTerrace.locality}, {VENUES.yTerrace.postalCode}
                </p>
              </div>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "24px", marginTop: "24px" }}>
                <p style={{ fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "8px" }}>
                  {VENUES.yBarLounge.name}
                </p>
                {/* Defensive render: pull from VENUES.yBarLounge once Michelle
                    confirms the street address. Until then, fall back to the
                    locality + a "call for directions" link. */}
                <p style={{ fontSize: "18px", color: "#080808", lineHeight: 1.5 }}>
                  {VENUES.yBarLounge.streetAddress ? (
                    <>
                      {VENUES.yBarLounge.streetAddress}<br />
                      {VENUES.yBarLounge.locality}{VENUES.yBarLounge.postalCode ? `, ${VENUES.yBarLounge.postalCode}` : ""}
                    </>
                  ) : (
                    <>
                      {VENUES.yBarLounge.locality}<br />
                      <a
                        href={`tel:${BRAND.phone}`}
                        className="hover:underline underline-offset-4"
                        style={{ color: "rgba(0,0,0,0.65)", textDecoration: "none", fontSize: "16px" }}
                      >
                        Call for directions
                      </a>
                    </>
                  )}
                </p>
              </div>

              <Link
                href="/venue-hire"
                className="group inline-flex items-center gap-2 mt-8 underline underline-offset-4 hover:opacity-60 transition-opacity duration-200"
                style={{ fontSize: "15px", color: "#080808", fontWeight: 500 }}
              >
                Venue hire enquiries
                <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
