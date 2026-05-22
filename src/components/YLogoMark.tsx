/**
 * The Y logo mark, sized for inline use within headings.
 *
 * Uses a plain <img> (not next/image) so the height can be expressed
 * in `em` units and the mark scales naturally with whatever font-size
 * the parent element carries. Next/Image requires px dimensions and
 * doesn't support em-based sizing in inline text contexts.
 *
 * The asset is a pre-optimised .webp — no further compression pipeline
 * is needed for a small inline logo.
 */

interface YLogoMarkProps {
  /** Height as a CSS value. Default: "0.82em" (≈ cap-height of Haas). */
  height?: string;
  /** Additional class names for animation or spacing. */
  className?: string;
}

export function YLogoMark({ height = "0.82em", className }: YLogoMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo/y-white-no-background.webp"
      alt="Y"
      className={`inline-block${className ? ` ${className}` : ""}`}
      style={{
        height,
        width: "auto",
        // Sink slightly below the cap top so the Y base meets the baseline
        verticalAlign: "-0.05em",
        objectFit: "contain",
      }}
    />
  );
}
