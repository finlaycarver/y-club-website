import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChevronRightIcon } from "@/components/icons";
import { BRAND, VENUES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Y handles your personal information.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

/*
 * IMPORTANT — DRAFT POLICY
 *
 * This file is a working baseline only. Section bodies below need to
 * be reviewed by a UK privacy / data-protection solicitor before
 * public launch. Replace section.body strings with the legally-reviewed
 * versions; structure (TOC, retention table, contact section) is
 * production-shaped already.
 */

interface PolicySection {
  /** Stable URL-safe slug; used for the in-page TOC anchor. */
  slug: string;
  heading: string;
  /** Body may contain inline HTML — pair with `.policy-body` styles. */
  body: string;
}

const POLICY_SECTIONS: ReadonlyArray<PolicySection> = [
  {
    slug: "who-we-are",
    heading: "Who we are",
    body: `Y is the trading name for the venue group operating ${VENUES.yClub.name} (${VENUES.yClub.streetAddress}, ${VENUES.yClub.locality}), ${VENUES.yTerrace.name} (${VENUES.yTerrace.streetAddress}, ${VENUES.yTerrace.locality}), and ${VENUES.yBarLounge.name} (${VENUES.yBarLounge.locality}). References in this policy to &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo; refer to Y. We are the data controller for personal information collected through this website and in our venues.`,
  },
  {
    slug: "what-we-collect",
    heading: "What we collect",
    body:
      "When you contact us, sign up to our mailing list, become a member, or submit an enquiry, we collect the personal data you provide — typically your name, email address, phone number, and (where relevant) date of birth. When you visit our venues, CCTV operates throughout for safety and security. We may also collect basic device and usage data (such as IP address and pages viewed) through this website's analytics.",
  },
  {
    slug: "how-we-use-it",
    heading: "How we use your information",
    body:
      "We use your details to: respond to enquiries; deliver and improve our services; send marketing communications you have opted in to receive; manage your membership; and operate our venues safely. Where we rely on consent, you can withdraw that consent at any time. Where we rely on legitimate interests (such as venue security), we balance those interests against your privacy rights.",
  },
  {
    slug: "who-we-share-with",
    heading: "Who we share with",
    body:
      "We do not sell your data. We share personal information only with trusted service providers operating on our behalf (such as our email platform, ticketing platform, or hosting provider), with law enforcement where legally required, and with professional advisers where necessary. Any third-party processors are bound by data-processing agreements.",
  },
  {
    slug: "data-retention",
    heading: "Data retention",
    body:
      "We keep personal data only as long as we need it for the purposes described above, after which we delete or anonymise it. See the retention table below for typical periods. Some data may be retained for longer where required by law (for example, employment or accounting records).",
  },
  {
    slug: "your-rights",
    heading: "Your rights",
    body: `Under UK GDPR you have the right to access, correct, or delete the personal data we hold about you; to object to or restrict its processing; and to portability. To exercise any right, email <a href='mailto:${BRAND.email}?subject=Privacy%20request'>${BRAND.email}</a> with your request and we will respond within one month. You also have the right to complain to the Information Commissioner's Office at <a href='https://ico.org.uk/concerns' target='_blank' rel='noopener noreferrer'>ico.org.uk/concerns</a>.`,
  },
  {
    slug: "cookies",
    heading: "Cookies",
    body:
      "Our website uses essential cookies to function and may use analytics cookies to help us understand how the site is used. You can manage cookies through your browser settings and through the consent banner on first visit.",
  },
  {
    slug: "changes-to-this-policy",
    heading: "Changes to this policy",
    body:
      "We may update this policy from time to time. The latest version will always be available on this page, with the date of the most recent revision shown at the top. We recommend reviewing this page periodically.",
  },
];

/** Typical retention periods — adjust once legal review is complete. */
interface RetentionRow {
  dataType: string;
  retention: string;
}

const RETENTION_TABLE: ReadonlyArray<RetentionRow> = [
  { dataType: "Newsletter subscribers",      retention: "Until you unsubscribe" },
  { dataType: "Member sign-ups",             retention: "3 years from last activity" },
  { dataType: "Venue hire enquiries",        retention: "12 months after the enquiry closes" },
  { dataType: "Job applications",            retention: "6 months from submission" },
  { dataType: "CCTV footage",                retention: "30 days, longer if needed for an investigation" },
  { dataType: "Lost property — IDs/passports", retention: "4 weeks if unclaimed, then securely destroyed" },
  { dataType: "Accounting and tax records",  retention: "6 years (UK statutory minimum)" },
];

/** Sourced from build time so the last-updated line stays honest as the
 *  page is redeployed. Format: "12 March 2026". */
const LAST_UPDATED = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section className="bg-black text-white" style={{ padding: "200px 24px 64px" }}>
          <div style={{ maxWidth: "920px", margin: "0 auto" }}>
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "16px",
            }}>
              Legal
            </p>
            <h1 className="text-[46px] md:text-[72px]" style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em", marginBottom: "24px" }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)" }}>
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </section>

        {/* ── DRAFT BANNER ───────────────────────────────────────────── */}
        {/* Sets honest expectations until the policy is signed off by
            legal. Drop this block once the section bodies are finalised. */}
        <section
          aria-label="Draft notice"
          className="bg-black text-white"
          style={{ padding: "0 24px 32px" }}
        >
          <div style={{ maxWidth: "920px", margin: "0 auto" }}>
            <div
              role="note"
              style={{
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.04)",
                padding: "20px 24px",
              }}
            >
              <p style={{
                fontSize: "12px", fontWeight: 600, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "8px",
              }}>
                Working draft
              </p>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                This is a working policy and is in the process of legal
                review. The structure below reflects the final shape; the
                wording will be finalised before public launch. For
                anything urgent, contact us at{" "}
                <a href={`mailto:${BRAND.email}?subject=Privacy%20question`} className="underline underline-offset-2">
                  {BRAND.email}
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* ── TABLE OF CONTENTS ──────────────────────────────────────── */}
        <section
          aria-label="On this page"
          className="bg-black text-white"
          style={{ padding: "16px 24px 48px" }}
        >
          <div style={{ maxWidth: "920px", margin: "0 auto" }}>
            <p style={{
              fontSize: "12px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "16px",
            }}>
              On this page
            </p>
            <ol
              style={{
                listStyle: "none", padding: 0, margin: 0,
                display: "grid", gap: "8px",
              }}
            >
              {POLICY_SECTIONS.map((section, i) => (
                <li key={section.slug}>
                  <a
                    href={`#${section.slug}`}
                    className="hover:opacity-70 transition-opacity duration-200 motion-reduce:transition-none"
                    style={{
                      fontSize: "15px",
                      color: "rgba(255,255,255,0.7)",
                      textDecoration: "none",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.35)", marginRight: "10px" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── SECTIONS ───────────────────────────────────────────────── */}
        <section className="bg-black text-white" style={{ padding: "32px 24px 64px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth: "920px", margin: "0 auto" }}>
            {POLICY_SECTIONS.map((section) => (
              <div
                key={section.slug}
                id={section.slug}
                className="scroll-mt-20"
                style={{ marginBottom: "48px" }}
              >
                <h2
                  className="text-[24px] md:text-[28px]"
                  style={{
                    fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em",
                    color: "#FAFAFA", marginBottom: "16px",
                  }}
                >
                  {section.heading}
                </h2>
                <p
                  className="policy-body"
                  style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}
                  dangerouslySetInnerHTML={{ __html: section.body }}
                />

                {/* Inline retention table inside its own section. */}
                {section.slug === "data-retention" && (
                  <div
                    style={{
                      marginTop: "24px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      overflowX: "auto",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "15px",
                      }}
                    >
                      <thead>
                        <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                          <th
                            scope="col"
                            style={{
                              textAlign: "left",
                              padding: "14px 18px",
                              fontSize: "12px",
                              fontWeight: 600,
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              color: "rgba(255,255,255,0.55)",
                              borderBottom: "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            Data type
                          </th>
                          <th
                            scope="col"
                            style={{
                              textAlign: "left",
                              padding: "14px 18px",
                              fontSize: "12px",
                              fontWeight: 600,
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              color: "rgba(255,255,255,0.55)",
                              borderBottom: "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            Retention period
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {RETENTION_TABLE.map((row, i) => (
                          <tr
                            key={row.dataType}
                            style={{
                              borderBottom: i === RETENTION_TABLE.length - 1
                                ? "none"
                                : "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <td style={{ padding: "14px 18px", color: "#FAFAFA" }}>
                              {row.dataType}
                            </td>
                            <td style={{ padding: "14px 18px", color: "rgba(255,255,255,0.7)" }}>
                              {row.retention}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── PRIVACY CONTACT ────────────────────────────────────────── */}
        <section className="bg-white text-black" style={{ padding: "80px 24px" }}>
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
            style={{ maxWidth: "920px", margin: "0 auto" }}
          >
            <div>
              <p style={{
                fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "16px",
              }}>
                Privacy enquiries
              </p>
              <h2
                className="text-[28px] md:text-[40px]"
                style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em" }}
              >
                Got a privacy question?
              </h2>
              <p style={{
                fontSize: "17px", color: "rgba(0,0,0,0.55)",
                marginTop: "16px", maxWidth: "520px", lineHeight: 1.65,
              }}>
                Data access, deletion, opt-out — anything. Drop us an email
                with the details and we&apos;ll come back within one month.
              </p>
            </div>
            <Link
              href={`mailto:${BRAND.email}?subject=Privacy%20request`}
              className="group inline-flex items-center justify-center gap-2 border border-black px-8 text-[16px] font-bold text-black hover:bg-black hover:text-white transition-colors duration-200 motion-reduce:transition-none shrink-0"
              style={{ height: "54px" }}
            >
              Email us
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
