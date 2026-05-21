import Image from "next/image";
import Link from "next/link";
import { Gift, Ticket, Sparkles, Cake, Crown, UserPlus } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MembersSignupForm } from "@/components/MembersSignupForm";
import { FaqAccordion } from "@/app/faqs/FaqAccordion";
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
    images: [{ url: "/images/img-0961.jpeg", width: 1200, height: 630 }],
  },
};

interface Benefit {
  Icon: typeof Gift;
  title: string;
  body: string;
}

/**
 * Six benefits chosen to read as a richer value bundle than the
 * original four. Icons add visual variety to what was previously an
 * all-text grid. Order roughly: most concrete perk first.
 */
const BENEFITS: ReadonlyArray<Benefit> = [
  {
    Icon: Gift,
    title: "Free drinks",
    body: "Members-only drink offers, rotating monthly across all three venues.",
  },
  {
    Icon: Ticket,
    title: "Early ticket access",
    body: "First in line for major events. Get tickets before they go on sale to the public.",
  },
  {
    Icon: Sparkles,
    title: "Exclusive offers",
    body: "Promotional discounts, VIP table upgrades, and members-only nights.",
  },
  {
    Icon: Cake,
    title: "Birthday perks",
    body: "Treats on us when you celebrate at Y in your birthday month.",
  },
  {
    Icon: Crown,
    title: "Priority entry",
    body: "Skip the queue on busy nights at all three venues — show your member ID on the door.",
  },
  {
    Icon: UserPlus,
    title: "Bring a +1",
    body: "Selected members-only nights include a plus-one. Share the perks with someone you like.",
  },
];

export default function MembersPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section className="relative bg-black overflow-hidden flex items-end" style={{ minHeight: "70svh" }}>
          <Image
            src="/images/img-0961.jpeg"
            alt="Y Members"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
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
            <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: "16px" }}>
              <p style={{
                fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.55)",
              }}>
                Free Forever
              </p>
              {/* Tier label. Positions current membership as the only / free tier
                  so future paid tiers can launch alongside without confusing
                  existing members. */}
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
            </div>
            <h1 className="text-[46px] md:text-[80px]" style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em" }}>
              Become a member.
            </h1>
            <p
              className="text-[18px] md:text-[22px]"
              style={{
                fontWeight: 400, color: "rgba(255,255,255,0.75)",
                marginTop: "24px", maxWidth: "640px", lineHeight: 1.4,
              }}
            >
              Free drinks, exclusive offers, early ticket releases — and a lot more
              when you join Y, Guildford&apos;s late-night quarter.
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

        {/* ── BENEFITS ───────────────────────────────────────────────── */}
        <section className="bg-black text-white" style={{ padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div className="mb-12 md:mb-16">
              <p style={{
                fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "16px",
              }}>
                What you get
              </p>
              <h2
                className="text-[36px] md:text-[56px]"
                style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em", maxWidth: "720px" }}
              >
                Free to join. Built for regulars.
              </h2>
            </div>

            {/* 3-column grid on desktop for 6 benefits; 2-col on tablet; 1-col on mobile. */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {BENEFITS.map(({ Icon, title, body }) => (
                <div
                  key={title}
                  style={{
                    padding: "40px 32px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    borderRight: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <Icon
                    aria-hidden="true"
                    size={32}
                    strokeWidth={1.5}
                    color="#FAFAFA"
                    style={{ opacity: 0.9 }}
                  />
                  <h3 style={{
                    fontSize: "24px", fontWeight: 700, lineHeight: 1.2,
                    color: "#FAFAFA", letterSpacing: "-0.01em",
                  }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SIGN UP CTA ────────────────────────────────────────────── */}
        <section className="bg-white text-black" style={{ padding: "96px 24px" }}>
          <div
            className="flex flex-col items-center text-center"
            style={{ maxWidth: "720px", margin: "0 auto" }}
          >
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "16px",
            }}>
              Join in 30 seconds
            </p>
            <h2
              className="text-[36px] md:text-[56px]"
              style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: "24px" }}
            >
              Scan in venue, or sign up online.
            </h2>
            <p style={{
              fontSize: "18px", color: "rgba(0,0,0,0.55)",
              marginBottom: "40px", maxWidth: "520px", lineHeight: 1.65,
            }}>
              Pop into Y Club, Y Terrace, or Y Bar &amp; Lounge and scan the QR code at the bar.
              Or sign up below and we&apos;ll have your perks ready for your next visit.
            </p>

            {/* Sign-up form (client island) */}
            <MembersSignupForm />

            <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)", marginTop: "16px" }}>
              By signing up, you agree to our{" "}
              <Link href="/privacy-policy" className="underline">privacy policy</Link>.
            </p>
          </div>
        </section>

        {/* ── MEMBERS FAQ ────────────────────────────────────────────── */}
        <section
          id="members-faq"
          className="bg-black text-white scroll-mt-20"
          style={{ padding: "96px 24px", borderTop: "1px solid rgba(0,0,0,0.08)" }}
        >
          <div style={{ maxWidth: "880px", margin: "0 auto" }}>
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "16px",
            }}>
              Questions
            </p>
            <h2
              className="text-[36px] md:text-[50px]"
              style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: "32px" }}
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
