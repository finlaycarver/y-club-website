import { GRAIN_SVG } from "@/lib/grain";

/**
 * Thin trust signals band — operational facts only, no fabricated review
 * counts or ratings. Sits between Hero and the line-up carousel so the
 * first scroll lands on credibility before content.
 *
 * Replace / extend once verified social proof lands (Google rating,
 * actual "Open since" year, press logos, etc.).
 */
interface TrustItem {
  value: string;
  label: string;
}

const ITEMS: ReadonlyArray<TrustItem> = [
  { value: "3",       label: "Venues, one Y" },
  { value: "6+",      label: "Bars across the quarter" },
  { value: "1,000",   label: "Combined capacity" },
  { value: "Fri+Sat", label: "Open late" },
];

/** Border-divider helper. On mobile (2-col): right border on left cells,
 *  bottom border on top row. On desktop (4-col): right border on all
 *  except the last. */
function dividerClasses(index: number, total: number): string {
  const classes: string[] = [];
  // Mobile: top row (0, 1) gets bottom border
  if (index < 2) classes.push("border-b md:border-b-0");
  // Mobile: left column (even indices) gets right border
  // Desktop: all except last get right border
  if (index % 2 === 0) classes.push("border-r");
  if (index !== total - 1) classes.push("md:border-r");
  // Desktop overrides: even-index cells that are not last need to KEEP
  // right border (so cells 0, 2 keep theirs — which they do)
  // Cells 1 (mobile no right; desktop yes): add md:border-r
  if (index === 1) classes.push("md:border-r");
  return classes.join(" ");
}

export function TrustStrip() {
  return (
    <section
      aria-label="Why Y"
      className="relative bg-black text-white overflow-hidden"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Grain overlay — matches the rest of the page texture system */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage: GRAIN_SVG,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
      <div
        className="grid grid-cols-2 md:grid-cols-4 relative"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          // CSS variable referenced by Tailwind's border-* utilities
          // via the surrounding `border-white/[0.06]` token won't resolve
          // in inline style, so we keep border colour as a class above.
        }}
      >
        {ITEMS.map((item, i) => (
          <div
            key={item.label}
            className={`px-6 md:px-8 border-white/[0.06] ${dividerClasses(i, ITEMS.length)}`}
            style={{ padding: "28px 24px" }}
          >
            <p
              className="text-[28px] md:text-[36px]"
              style={{
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.01em",
                color: "#FAFAFA",
                marginBottom: "8px",
              }}
            >
              {item.value}
            </p>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
