import Image from "next/image";
import type { ReactNode } from "react";
import { GRAIN_SVG } from "@/lib/grain";

/**
 * Generic split-grid panel: image on one side, text content on the other.
 * Mobile collapses to image-on-top, text-below. Used by /venues to keep
 * its markup DRY across the three venue cards.
 *
 * NOTE: The home page's `LargeSignpostsSection` is the sibling pattern
 * with its own typography lock-in (kicker + tagline + address + CTA).
 * Because that surface is approved pixel-perfect, it intentionally
 * stays separate from this primitive. A future refactor could merge
 * them once both surfaces are stable.
 */

export type VenuePanelHeight = "screen" | "viewport-80" | "viewport-70" | "viewport-55";

export interface VenuePanelProps {
  /** Optional anchor id for in-page links (e.g. /venues#y-club). */
  id?: string;
  imageUrl: string;
  imageAlt: string;
  /** Which side of the desktop layout the image sits on. Mobile is always image-on-top. */
  imageSide?: "left" | "right";
  /** Light or dark text column. Defaults to "dark". */
  variant?: "dark" | "light";
  /** Desktop panel height. "viewport-55" for a tighter venue-index. */
  desktopHeight?: VenuePanelHeight;
  /** Decorative ordinal overlaid on the image column (e.g. "01"). */
  ordinal?: string;
  /** Text content for the panel — owns its own typography. */
  children: ReactNode;
  /** Preload this panel's image (use for the first visible panel). */
  priority?: boolean;
}

const HEIGHT_CLASS: Record<VenuePanelHeight, string> = {
  "screen":      "md:h-screen",
  "viewport-80": "md:h-[80vh]",
  "viewport-70": "md:h-[70vh]",
  "viewport-55": "md:h-[55vh]",
};

export function VenuePanel({
  id,
  imageUrl,
  imageAlt,
  imageSide = "left",
  variant = "dark",
  desktopHeight = "screen",
  ordinal,
  children,
  priority = false,
}: VenuePanelProps) {
  const heightClass = HEIGHT_CLASS[desktopHeight];
  const textBg = variant === "light" ? "bg-white" : "bg-black";

  // DOM order: image is always first (mobile shows image on top).
  // On desktop we use grid order to flip sides without touching DOM.
  const imageOrderClass = imageSide === "right" ? "md:order-2" : "md:order-1";
  const textOrderClass  = imageSide === "right" ? "md:order-1" : "md:order-2";

  return (
    // group — enables group-hover:scale-105 on the image so the whole
    // panel triggers the scale, not just the image column.
    <div
      id={id}
      className={`group flex flex-col md:grid md:grid-cols-2 ${heightClass}`}
    >
      {/* Image column */}
      <div className={`relative h-72 md:h-full overflow-hidden ${imageOrderClass}`}>
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority={priority}
          style={{ objectFit: "cover", objectPosition: "center" }}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
        />
        {/* Decorative ordinal — large ghost numeral bottom-right of image */}
        {ordinal && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "16px",
              right: "20px",
              fontSize: "clamp(80px, 10vw, 140px)",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "rgba(255,255,255,0.07)",
              pointerEvents: "none",
              userSelect: "none",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {ordinal}
          </span>
        )}
      </div>

      {/* Text column */}
      <div className={`${textBg} relative overflow-hidden ${textOrderClass}`}>
        {/* Grain overlay */}
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
        {/* Content wrapper — sits above grain, owns vertical centring + spacing. */}
        <div className="relative h-full flex flex-col justify-center px-6 py-12 md:px-20">
          {children}
        </div>
      </div>
    </div>
  );
}
