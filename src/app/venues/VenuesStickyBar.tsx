"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";

/**
 * Mobile-only sticky bottom CTA bar for the /venues page.
 *
 * "Find your night" anchors on /whats-on — the natural next step once
 * a visitor has seen the three venues and wants to book. md:hidden keeps
 * it strictly mobile; desktop has the persistent nav.
 *
 * iOS safe-area-inset-bottom keeps the CTA above the home indicator.
 */
export function VenuesStickyBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden"
      style={{
        background: "rgba(0,0,0,0.94)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <Link
        href="/whats-on"
        className="group flex items-center justify-center gap-2 text-white hover:bg-white/10 active:scale-[0.98] transition-all duration-200 motion-reduce:transition-none"
        style={{
          height: "58px",
          fontSize: "15px",
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        Find your night
        <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
      </Link>
    </div>
  );
}
