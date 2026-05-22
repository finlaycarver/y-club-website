"use client";

import { useEffect, useRef } from "react";
import { VENUES, BRAND } from "@/lib/site";

interface FindUsBottomSheetProps {
  open: boolean;
  onClose: () => void;
}

interface VenueEntry {
  name: string;
  address: string | null;
  directionsUrl: string | null;
}

/** Builds a Google Maps directions URL from a venue address string. */
function mapsUrl(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

const VENUE_ENTRIES: VenueEntry[] = [
  {
    name: VENUES.yClub.name,
    address: `${VENUES.yClub.streetAddress}, ${VENUES.yClub.locality} ${VENUES.yClub.postalCode}`,
    directionsUrl: mapsUrl(`${VENUES.yClub.streetAddress}, ${VENUES.yClub.locality}`),
  },
  {
    name: VENUES.yTerrace.name,
    address: `${VENUES.yTerrace.streetAddress}, ${VENUES.yTerrace.locality} ${VENUES.yTerrace.postalCode}`,
    directionsUrl: mapsUrl(`${VENUES.yTerrace.streetAddress}, ${VENUES.yTerrace.locality}`),
  },
  {
    name: VENUES.yBarLounge.name,
    // Address confirmed as pending — render placeholder until Michelle provides it.
    address: VENUES.yBarLounge.streetAddress || null,
    directionsUrl: VENUES.yBarLounge.streetAddress
      ? mapsUrl(VENUES.yBarLounge.streetAddress)
      : null,
  },
];

/**
 * "Find us" bottom sheet.
 *
 * Shows all three venue addresses with tap-to-directions links.
 * Triggered from the SiteFooter Contact block.
 * Follows the same open/close pattern as EventBottomSheet.
 */
export function FindUsBottomSheet({ open, onClose }: FindUsBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Focus into sheet on open
  useEffect(() => {
    if (open) {
      sheetRef.current
        ?.querySelector<HTMLElement>("button, [href]")
        ?.focus();
    }
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm",
          "transition-opacity duration-300 motion-reduce:transition-none",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Find us"
        className={[
          "fixed bottom-0 left-0 right-0 z-50 bg-black",
          "border-t border-white/10 rounded-t-2xl overflow-hidden",
          "transition-transform duration-300 ease-out motion-reduce:transition-none",
          open ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" aria-hidden="true" />
        </div>

        <div className="px-6 pb-10 pt-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
                Guildford Town Centre
              </p>
              <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#FAFAFA", lineHeight: 1.1, margin: 0 }}>
                Find us
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="inline-flex items-center justify-center border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition-colors duration-200"
              style={{ width: "40px", height: "40px", background: "transparent", cursor: "pointer" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Venue list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {VENUE_ENTRIES.map((venue, i) => (
              <div
                key={venue.name}
                style={{
                  padding: "20px 0",
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.08)" : undefined,
                }}
              >
                <p style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
                  {venue.name}
                </p>

                {venue.address ? (
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                    <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", lineHeight: 1.5, margin: 0 }}>
                      {venue.address}
                    </p>
                    <a
                      href={venue.directionsUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 text-white border-b border-white/30 hover:border-white transition-colors duration-200 motion-reduce:transition-none"
                      style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", paddingBottom: "2px", whiteSpace: "nowrap" }}
                    >
                      Directions
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                      </svg>
                    </a>
                  </div>
                ) : (
                  <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
                    Address coming soon
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Call CTA at bottom */}
          <a
            href={`tel:${BRAND.phone}`}
            className="mt-6 flex items-center gap-3 border-t border-white/08 pt-6 hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none"
            style={{ textDecoration: "none", opacity: 0.7 }}
          >
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>Call us</span>
            <span style={{ fontSize: "18px", color: "#FAFAFA", fontWeight: 700, letterSpacing: "-0.01em" }}>{BRAND.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </>
  );
}
