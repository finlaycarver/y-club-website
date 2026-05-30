"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Calendar, Phone } from "lucide-react";
import { ChevronRightIcon } from "@/components/icons";
import { BRAND } from "@/lib/site";

interface EventSheetData {
  title: string;
  venue: string;
  date: string;
  imageUrl?: string;
  href: string;
  featured?: boolean;
  urgency?: string;
  price?: string;
  description?: string;
}

interface EventBottomSheetProps {
  event: EventSheetData | null;
  onClose: () => void;
  /** Pre-built data:text/calendar URL. When omitted the "Add to calendar"
   *  action is hidden. Built per-event via {@link buildEventIcsDataUrl}. */
  icsUrl?: string;
  /** Optional click-to-call number override. Falls back to BRAND.phone. */
  callPhoneHref?: string;
}

/** Formats a date string to short uppercase pill: "Fri 29 May 2026" → "FRI 29 MAY" */
function formatDateShort(dateStr: string): string {
  const parts = dateStr.toUpperCase().split(" ");
  return parts.slice(0, 3).join(" ");
}

/**
 * Mobile-first bottom sheet for event details.
 *
 * Opens when the user taps an event tile. Slides up from below the fold.
 * Closes on backdrop click, close button, or Escape key.
 * Respects prefers-reduced-motion (instant open/close).
 * Body scroll is locked while open.
 */
export function EventBottomSheet({ event, onClose, icsUrl, callPhoneHref }: EventBottomSheetProps) {
  const phoneHref = callPhoneHref ?? `tel:${BRAND.phone}`;
  const sheetRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const isOpen = event !== null;

  // ── Body scroll lock ──────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── Escape key + focus trap ────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !sheetRef.current) return;

      const focusable = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        )
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // ── Focus management — move focus in, restore it on close ──────────
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      const firstFocusable = sheetRef.current?.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      firstFocusable?.focus();
    } else {
      previouslyFocusedRef.current?.focus();
      previouslyFocusedRef.current = null;
    }
  }, [isOpen]);

  const isExternal = event?.href.startsWith("http") ?? false;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm",
          "transition-opacity duration-300 motion-reduce:transition-none",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={event?.title ?? "Event details"}
        className={[
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-black border-t border-white/10",
          "rounded-t-2xl overflow-hidden",
          "transition-transform duration-300 ease-out motion-reduce:transition-none",
          isOpen ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        style={{ maxHeight: "85vh", overflowY: "auto" }}
      >
        {/* Drag handle — visual affordance */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" aria-hidden="true" />
        </div>

        {event && (
          <div className="px-6 pb-10 pt-2">
            {/* Chips row */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "3px 10px",
                }}
              >
                {formatDateShort(event.date)}
              </span>
              {event.featured && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#080808",
                    background: "#FAFAFA",
                    padding: "3px 10px",
                  }}
                >
                  Featured
                </span>
              )}
              {event.urgency && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#FAFAFA",
                    background: "rgba(210,60,30,0.88)",
                    padding: "3px 10px",
                  }}
                >
                  {event.urgency}
                </span>
              )}
            </div>

            {/* Title */}
            <h2
              className="text-[32px] font-bold leading-tight tracking-tight text-white mb-2"
            >
              {event.title}
            </h2>

            {/* Venue */}
            <p style={{ fontSize: "14px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "16px" }}>
              {event.venue}
            </p>

            {/* Description */}
            {event.description && (
              <p style={{ fontSize: "16px", lineHeight: "1.6", color: "rgba(255,255,255,0.65)", marginBottom: "24px" }}>
                {event.description}
              </p>
            )}

            {/* Price */}
            {event.price && (
              <p style={{ fontSize: "15px", fontWeight: 500, color: "rgba(255,255,255,0.45)", marginBottom: "24px" }}>
                {event.price}
              </p>
            )}

            {/* Primary CTA — full-width, prominent */}
            <Link
              href={event.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="group relative w-full overflow-hidden inline-flex items-center justify-center gap-1.5 bg-white text-black text-[14px] font-bold tracking-[0.04em] uppercase transition-colors duration-200 active:bg-white/90"
              style={{ height: "52px" }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out pointer-events-none motion-reduce:hidden"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.06) 50%, transparent 100%)" }}
              />
              <span className="relative z-10">Get tickets</span>
              <ChevronRightIcon className="relative z-10 size-4" />
            </Link>

            {/* Secondary actions — calendar + call.
                Calendar opens a data: ICS URL (no backend); browser
                routes it to the OS calendar app. Call uses tel: with
                the brand phone number. Hidden gracefully if either
                isn't applicable. */}
            <div className="flex gap-3 mt-3">
              {icsUrl && (
                <a
                  href={icsUrl}
                  download={`${event.title.replace(/[^\w\d-]+/g, "-")}.ics`}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-white/25 text-white/85 hover:text-white hover:border-white/50 active:bg-white/5 transition-colors duration-200 text-[13px] font-semibold tracking-wide"
                  style={{ height: "48px" }}
                >
                  <Calendar size={16} aria-hidden="true" />
                  Add to calendar
                </a>
              )}
              <a
                href={phoneHref}
                aria-label={`Call ${BRAND.phoneDisplay}`}
                className="inline-flex items-center justify-center gap-2 border border-white/25 text-white/85 hover:text-white hover:border-white/50 active:bg-white/5 transition-colors duration-200 text-[13px] font-semibold tracking-wide"
                style={{ height: "48px", padding: "0 18px" }}
              >
                <Phone size={16} aria-hidden="true" />
                Call
              </a>
            </div>

            {/* Close — tertiary, low-emphasis */}
            <button
              onClick={onClose}
              className="mt-3 w-full text-white/45 hover:text-white/70 transition-colors duration-200 text-[13px] font-medium tracking-wide"
              style={{ height: "40px" }}
              aria-label="Close"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
}
