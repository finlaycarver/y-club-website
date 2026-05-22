import Image from "next/image";
import Link from "next/link";
import { QrCode } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MembersSignupForm } from "@/components/MembersSignupForm";
import { FaqAccordion } from "@/app/faqs/FaqAccordion";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import type { Metadata } from "next";
import { GRAIN_SVG } from "@/lib/grain";
import { MEMBERS_FAQS } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Members — Y Club, Y Terrace & Y Bar & Lounge",
  description:
    "Free drinks, exclusive offers, early ticket releases. Free membership for Y, Guildford's late-night quarter.",
  alternates: { canonical: "/members" },
  openGraph: {
    title: "Members — Free perks at Y",
    description:
      "Free drinks, exclusive offers, early ticket releases. Free membership.",
    url: "/members",
    // Switched to lifestyle/social shot — connects better with
    // "Members" messaging than the rooftop terrace (A4-VF [HIGH]).
    images: [{ url: "/images/nadine-189.jpg", width: 1200, height: 630 }],
  },
};

/** Marquee track content — duplicated twice for seamless loop. */
const MARQUEE_ITEMS = [
  "Free drinks",
  "Early access",
  "Birthday treats",
  "Exclusive offers",
  "Priority entry",
  "Bring a +1",
  "Free drinks",
  "Early access",
  "Birthday treats",
  "Exclusive offers",
  "Priority entry",
  "Bring a +1",
];

export default function MembersPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        {/* Image changed from rooftop shot (img-0961.jpeg) to a social /
            lifestyle scene — connects directly with the "join a community
            of regulars" message (A4-VF [HIGH]). */}
        <section
          className="relative bg-black overflow-hidden flex items-end"
          style={{ minHeight: "70svh" }}
        >
          <Image
            src="/images/nadine-189.jpg"
            alt="Friends enjoying a night at Y Bar & Lounge"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%)" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.03, backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
          />

          <div className="relative z-10 text-white px-6 md:px-16 pb-16 pt-40">
            {/* Kicker row — tier label + trust signals (A4-VX [HIGH]) */}
            <div className="flex flex-wrap items-center gap-3" style={{ marginBottom: "16px" }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Free Forever
              </p>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "4px 10px",
                }}
              >
                Free Tier
              </span>
              {/* Trust signals — confirmed facts, no fabricated counts */}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                · 3 venues · No card required · Cancel any time
              </span>
            </div>

            <h1
              className="text-[46px] md:text-[80px]"
              style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em" }}
            >
              Become a member.
            </h1>

            <p
              className="text-[18px] md:text-[22px]"
              style={{
                fontWeight: 400,
                color: "rgba(255,255,255,0.75)",
                marginTop: "24px",
                maxWidth: "640px",
                lineHeight: 1.4,
              }}
            >
              Free drinks, exclusive offers, early ticket releases — and a lot
              more when you join Y, Guildford&apos;s late-night quarter.
            </p>

            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                marginTop: "16px",
                maxWidth: "540px",
                lineHeight: 1.5,
              }}
            >
              No joining fee. No subscription. Cancel any time.
            </p>
          </div>
        </section>

        {/* ── PERKS MARQUEE ──────────────────────────────────────────── */}
        {/* Thin scrolling strip between hero and benefits — gives the page
            kinetic energy and restates the key perks at a glance (A4-VX [LOW]). */}
        <div className="perks-marquee bg-black" aria-hidden="true">
          <div className="perks-marquee-track">
            {/* Two identical spans for seamless loop */}
            {[0, 1].map((copy) => (
              <span key={copy} className="flex items-center gap-0">
                {MARQUEE_ITEMS.map((item, i) => (
                  <span key={`${copy}-${i}`} className="flex items-center">
                    <span style={{ padding: "0 20px" }}>{item}</span>
                    <span style={{ opacity: 0.3, fontSize: "6px" }}>◆</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── BENEFITS ───────────────────────────────────────────────── */}
        {/* BenefitsGrid is a client island — handles stagger entrance
            animation + 3D card tilt on hover (A4-VX [MED] + [HIGH]). */}
        <section
          className="bg-black text-white"
          style={{ padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div className="mb-12 md:mb-16">
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "16px",
                }}
              >
                What you get
              </p>
              <h2
                className="text-[36px] md:text-[56px]"
                style={{
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                  maxWidth: "720px",
                }}
              >
                Free to join. Built for regulars.
              </h2>
            </div>

            <BenefitsGrid />
          </div>
        </section>

        {/* ── SIGN UP CTA ────────────────────────────────────────────── */}
        <section className="bg-white text-black" style={{ padding: "96px 24px" }}>
          <div
            className="flex flex-col items-center text-center"
            style={{ maxWidth: "720px", margin: "0 auto" }}
          >
            <p
              style={{
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.4)",
                marginBottom: "16px",
              }}
            >
              Join in 30 seconds
            </p>
            <h2
              className="text-[36px] md:text-[56px]"
              style={{
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                marginBottom: "24px",
              }}
            >
              Scan in venue, or sign up online.
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "rgba(0,0,0,0.55)",
                marginBottom: "36px",
                maxWidth: "520px",
                lineHeight: 1.65,
              }}
            >
              Pop into Y Club, Y Terrace, or Y Bar &amp; Lounge and scan the
              QR code at the bar. Or sign up below and we&apos;ll have your
              perks ready for your next visit.
            </p>

            {/* QR code scan affordance (A4-VX [MED]).
                Visual cue for the "scan at the bar" message — uses the QrCode
                icon rather than a specific code so it's always accurate. */}
            <div
              className="flex items-center gap-5 mb-10 text-left"
              style={{
                border: "1px solid rgba(0,0,0,0.12)",
                padding: "20px 24px",
                background: "rgba(0,0,0,0.03)",
                width: "100%",
                maxWidth: "400px",
              }}
            >
              <div
                style={{
                  border: "1.5px solid rgba(0,0,0,0.2)",
                  padding: "12px",
                  flexShrink: 0,
                }}
              >
                <QrCode size={52} strokeWidth={1.25} color="#080808" aria-hidden="true" />
              </div>
              <div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#080808", marginBottom: "4px" }}>
                  Scan at the bar
                </p>
                <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.5)", lineHeight: 1.5 }}>
                  QR codes at Y Club, Y Terrace
                  <br />and Y Bar &amp; Lounge
                </p>
              </div>
            </div>

            {/* Sign-up form (client island) */}
            <MembersSignupForm />

            <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)", marginTop: "16px" }}>
              By signing up, you agree to our{" "}
              <Link href="/privacy-policy" className="underline">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ── MEMBERS FAQ ────────────────────────────────────────────── */}
        <section
          id="members-faq"
          className="bg-black text-white scroll-mt-20"
          style={{ padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div style={{ maxWidth: "880px", margin: "0 auto" }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "16px",
              }}
            >
              Questions
            </p>
            <h2
              className="text-[36px] md:text-[50px]"
              style={{
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                marginBottom: "32px",
              }}
            >
              Membership, answered.
            </h2>
            <FaqAccordion items={MEMBERS_FAQS} />
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", marginTop: "32px" }}>
              Still wondering? Check the{" "}
              <Link href="/faqs" className="underline underline-offset-2 hover:opacity-80">
                full FAQ
              </Link>
              {" "}or{" "}
              <Link href="/about#contact" className="underline underline-offset-2 hover:opacity-80">
                get in touch
              </Link>
              .
            </p>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
