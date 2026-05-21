import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChevronRightIcon } from "@/components/icons";
import { FaqAccordion } from "./FaqAccordion";
import { FAQS } from "@/data/faqs";
import { FAQPageSchema } from "@/components/structured-data/FAQPageSchema";

export const metadata: Metadata = {
  title: "FAQs — Good to know before you visit Y",
  description:
    "Admissions, dress code, safety, cloakroom and more. Everything you need to know before heading down to Y, Guildford's late-night quarter.",
  alternates: { canonical: "/faqs" },
  openGraph: {
    title: "Frequently Asked Questions — Y, Guildford",
    description:
      "Everything you need to know before heading down to Y.",
    url: "/faqs",
  },
};

export default function FaqsPage() {
  return (
    <>
      <FAQPageSchema faqs={FAQS} />
      <SiteHeader />
      <main id="main-content">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section className="bg-black text-white relative" style={{ padding: "200px 24px 64px" }}>
          <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "16px",
            }}>
              Frequently Asked Questions
            </p>
            <h1 className="text-[46px] md:text-[80px]" style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em", marginBottom: "24px" }}>
              Good to know.
            </h1>
            <p
              className="text-[18px] md:text-[22px]"
              style={{
                fontWeight: 400, color: "rgba(255,255,255,0.65)", maxWidth: "620px", lineHeight: 1.5,
              }}
            >
              Everything you need before you head down. Can&apos;t find what you&apos;re looking for? Drop us a line.
            </p>
          </div>
        </section>

        {/* ── FAQ LIST ───────────────────────────────────────────────── */}
        <section className="bg-black text-white" style={{ padding: "0 24px 96px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
            <FaqAccordion />
          </div>
        </section>

        {/* ── CONTACT CTA ────────────────────────────────────────────── */}
        <section className="bg-white text-black" style={{ padding: "80px 24px" }}>
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
            style={{ maxWidth: "1080px", margin: "0 auto" }}
          >
            <div>
              <p style={{
                fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "16px",
              }}>
                Still got a question?
              </p>
              <h2
                className="text-[32px] md:text-[44px]"
                style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em" }}
              >
                We&apos;re a quick reply away.
              </h2>
            </div>
            <Link
              href="/about#contact"
              className="group inline-flex items-center justify-center gap-2 border border-black px-8 text-[16px] font-bold text-black hover:bg-black hover:text-white transition-colors duration-200 motion-reduce:transition-none shrink-0"
              style={{ height: "54px" }}
            >
              Contact Us
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
