import { ChevronRightIcon, InstagramIcon } from "@/components/icons";
import { BRAND } from "@/lib/site";

/**
 * Trust / social-proof block.
 *
 * Currently shows verifiable signals only — venue stats and a live
 * Instagram handle — to avoid shipping mock testimonials. When real
 * Google / Trustpilot reviews are collected, pass them via the
 * `quotes` prop to render a quote grid in place of the stats row.
 */

export interface ReviewQuote {
  text: string;
  author: string;
  source: "Google" | "Trustpilot" | "Instagram";
  /** ISO date string */
  date?: string;
}

interface SocialProofProps {
  /** Pass real quotes when available — falsy/empty falls back to the stats variant. */
  quotes?: ReadonlyArray<ReviewQuote>;
  /** Background variant. */
  variant?: "dark" | "light";
  /** Top-of-section microcopy. */
  kicker?: string;
  heading?: string;
}

const STATS = [
  { value: "3",      label: "Venues"        },
  { value: "6+",     label: "Bars"          },
  { value: "1,500",  label: "Combined capacity" },
] as const;

export function SocialProof({
  quotes,
  variant = "dark",
  kicker = "Trusted by Guildford",
  heading = "Three venues. Six bars. One short walk.",
}: SocialProofProps) {
  const isDark = variant === "dark";
  const bg = isDark ? "#000" : "#FFF";
  const fg = isDark ? "#FAFAFA" : "#080808";
  const muted = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)";
  const subtle = isDark ? "rgba(255,255,255,0.4)"  : "rgba(0,0,0,0.4)";
  const border = isDark ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.1)";

  const hasQuotes = Array.isArray(quotes) && quotes.length > 0;

  return (
    <section style={{ background: bg, color: fg, padding: "80px 24px", borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{
          fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
          textTransform: "uppercase", color: subtle, marginBottom: "16px",
        }}>
          {kicker}
        </p>
        <h2 className="text-[32px] md:text-[44px]" style={{
          fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em", maxWidth: "720px", marginBottom: "40px",
        }}>
          {heading}
        </h2>

        {hasQuotes ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {quotes.map((quote, i) => (
              <figure
                key={`${quote.author}-${i}`}
                style={{
                  padding: "28px",
                  border: `1px solid ${border}`,
                  background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                }}
              >
                <blockquote style={{ fontSize: "17px", color: fg, lineHeight: 1.6, marginBottom: "20px" }}>
                  &ldquo;{quote.text}&rdquo;
                </blockquote>
                <figcaption style={{ fontSize: "13px", color: muted }}>
                  <span style={{ color: fg, fontWeight: 600 }}>{quote.author}</span>
                  <span aria-hidden="true" style={{ margin: "0 8px" }}>·</span>
                  {quote.source}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-px" style={{ border: `1px solid ${border}` }}>
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                style={{
                  padding: "32px 24px",
                  borderRight: `1px solid ${border}`,
                  background: bg,
                }}
              >
                <p className="text-[36px] md:text-[52px]" style={{
                  fontWeight: 700, lineHeight: 1, color: fg, marginBottom: "10px", letterSpacing: "-0.01em",
                }}>
                  {value}
                </p>
                <p style={{
                  fontSize: "12px", fontWeight: 500, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: subtle,
                }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Instagram CTA — present in both variants */}
        <div className="mt-10 md:mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p style={{ fontSize: "15px", color: muted, lineHeight: 1.55, maxWidth: "520px" }}>
            See last night at Y on Instagram — fresh photos every weekend.
          </p>
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 py-3 text-[15px] font-bold transition-colors duration-200 motion-reduce:transition-none"
            style={{
              border: `1px solid ${isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)"}`,
              color: fg,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            <InstagramIcon style={{ width: "18px", height: "18px", fill: fg }} />
            Follow @y_bar_
            <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
          </a>
        </div>
      </div>
    </section>
  );
}

