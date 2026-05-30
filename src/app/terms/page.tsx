import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of the Y website and venues.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

/**
 * Working terms of service. Replace with the version signed off by
 * your solicitor before launch. The headings here mirror standard UK
 * commercial-venue terms.
 */
const SECTIONS = [
  {
    heading: "About these terms",
    body:
      "These terms apply to your use of the Y website and to your attendance at any of our venues (Y Club, Y Terrace, and Y Bar &amp; Lounge). By using this website or entering one of our venues you accept these terms.",
  },
  {
    heading: "Admission",
    body:
      "Entry is for over-18s only. Photo ID may be required at the door. We reserve the right to refuse entry at our reasonable discretion and to ask anyone to leave who breaches our house rules.",
  },
  {
    heading: "Tickets",
    body:
      "Tickets are sold through authorised partners (currently Skiddle and Fatsoma). Refunds are at the discretion of the ticket provider and subject to their refund policy.",
  },
  {
    heading: "House rules",
    body:
      "Smart-casual dress code applies — no tracksuits, hoodies or sportswear. Bag searches may be conducted. We operate a zero-tolerance policy on drug use and on non-consensual behaviour. CCTV operates throughout for safety and security.",
  },
  {
    heading: "Cloakroom and lost property",
    body:
      "The cloakroom is offered for convenience, not as secure storage. Maximum liability per item is &pound;40, with evidence of value. Lost property is held for one month from the event date.",
  },
  {
    heading: "Liability",
    body:
      "We do not exclude liability for death or personal injury caused by our negligence. Otherwise our liability to you is limited to the extent permitted by UK law.",
  },
  {
    heading: "Changes",
    body:
      "We may update these terms from time to time. The latest version will always be available on this page, with the date of the most recent revision shown below.",
  },
  {
    heading: "Contact",
    body:
      "Questions about these terms? Email <a class='underline' href='mailto:barmanager@dreamoyster.com?subject=Terms%20question'>barmanager@dreamoyster.com</a>.",
  },
];

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">

        <section className="bg-black text-white" style={{ padding: "200px 24px 64px" }}>
          <div style={{ maxWidth: "920px", margin: "0 auto" }}>
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "16px",
            }}>
              Legal
            </p>
            <h1 className="text-[46px] md:text-[72px]" style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em", marginBottom: "24px" }}>
              Terms of Service
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)" }}>
              Last updated: 21 May 2026
            </p>
          </div>
        </section>

        <section className="bg-black text-white" style={{ padding: "32px 24px 96px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth: "920px", margin: "0 auto" }}>
            {SECTIONS.map((section) => (
              <div key={section.heading} style={{ marginBottom: "48px" }}>
                <h2 className="text-[24px] md:text-[28px]" style={{
                  fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em",
                  color: "#FAFAFA", marginBottom: "16px",
                }}>
                  {section.heading}
                </h2>
                <p
                  style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}
                  dangerouslySetInnerHTML={{ __html: section.body }}
                />
              </div>
            ))}
            {/*
              TODO(fin): Replace the section bodies above with the legal-reviewed
              copy from your solicitor before public launch. This draft is a
              working baseline only and is not legal advice.
            */}
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
