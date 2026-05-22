"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";

type FormState = "idle" | "submitting" | "success" | "error";

/**
 * Members / newsletter CTA section.
 *
 * Used at the foot of the What's On page. Dark variant so it blends
 * with the surrounding dark sections (events grid + footer) — removes
 * the jarring bg-white island sandwiched between two dark surfaces.
 *
 * Includes:
 *  - Inline email signup wired to /api/newsletter
 *  - "Join the list" link as secondary path
 *  - Trust hint (no fake member counts — real copy only)
 *  - Subtle background venue image with grain + overlay
 *  - Magnetic primary CTA on desktop (pointer-fine, no reduced-motion)
 */
export function MembersCTASection() {
  const [email, setEmail]       = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const ctaRef = useRef<HTMLAnchorElement>(null);

  /* Magnetic secondary CTA — mirrors HeroSection pattern.
     Pointer-fine desktop only; reduced-motion guard. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const btn = ctaRef.current;
    if (!btn) return;

    const RADIUS = 40;
    const PULL   = 0.3;

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > rect.width / 2 + RADIUS) {
        btn.style.transform  = "translate(0, 0)";
        btn.style.transition = "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)";
        return;
      }
      btn.style.transition = "transform 60ms linear";
      btn.style.transform  = `translate(${dx * PULL}px, ${dy * PULL}px)`;
    };
    const onLeave = () => {
      btn.style.transition = "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)";
      btn.style.transform  = "translate(0, 0)";
    };

    window.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formState === "submitting" || !email) return;
    setFormState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "whats-on-cta" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Subscription failed");
      }
      setFormState("success");
      setEmail("");
    } catch (err) {
      setFormState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section
      className="relative bg-black text-white overflow-hidden"
      style={{ padding: "80px 24px" }}
    >
      {/* Background venue photo — absolute, heavy dark overlay so text
          stays legible. Subtle atmosphere, not a statement image. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/club-y-image-5.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          opacity: 0.18,
        }}
      />

      {/* Gradient scrim — ensures crisp edges against adjacent dark sections */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)" }}
      />

      {/* Grain overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.025, backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
      />

      {/* Border top/bottom */}
      <div className="absolute inset-x-0 top-0"    style={{ height: "1px", background: "rgba(255,255,255,0.08)" }} />
      <div className="absolute inset-x-0 bottom-0" style={{ height: "1px", background: "rgba(255,255,255,0.08)" }} />

      <div
        className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-10"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* Left — copy */}
        <div style={{ maxWidth: "480px" }}>
          <p style={{
            fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "16px",
          }}>
            Members only
          </p>
          <h2
            className="text-[36px] md:text-[50px]"
            style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em", color: "#FAFAFA" }}
          >
            Want first dibs?
          </h2>
          <p style={{
            fontSize: "17px", color: "rgba(255,255,255,0.6)",
            marginTop: "16px", lineHeight: "1.65",
          }}>
            Early access to ticket releases, members-only events, and exclusive offers.
          </p>
        </div>

        {/* Right — inline email form + secondary CTA */}
        <div style={{ minWidth: "320px", maxWidth: "440px", width: "100%" }}>
          {formState === "success" ? (
            <div style={{
              padding: "20px 24px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.04)",
            }}>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#FAFAFA", marginBottom: "4px" }}>
                You&apos;re on the list.
              </p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
                Check your inbox to confirm — we&apos;ll be in touch before the next drop.
              </p>
            </div>
          ) : (
            <>
              {/* Inline email signup — wired to /api/newsletter */}
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", marginBottom: "16px" }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={formState === "submitting"}
                  className="flex-1 border border-white/25 focus:border-white/70 focus:outline-none transition-[border-color] duration-200 placeholder:text-white/30 disabled:opacity-60"
                  style={{
                    height: "50px", background: "transparent", color: "#FAFAFA",
                    fontFamily: "haas, Arial, sans-serif", fontSize: "15px",
                    borderRadius: 0, padding: "0 16px", minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="group relative overflow-hidden hover:bg-white hover:text-black transition-colors duration-300 shrink-0 disabled:opacity-60"
                  style={{
                    height: "50px", padding: "0 24px",
                    border: "1px solid rgba(255,255,255,0.6)", borderLeft: "none",
                    borderRadius: 0, background: "transparent", color: "#FAFAFA",
                    fontSize: "14px", fontWeight: 700, letterSpacing: "0.06em",
                    textTransform: "uppercase", cursor: formState === "submitting" ? "wait" : "pointer",
                    fontFamily: "haas, Arial, sans-serif", whiteSpace: "nowrap",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out pointer-events-none motion-reduce:hidden"
                    style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)" }}
                  />
                  <span className="relative z-10">
                    {formState === "submitting" ? "Sending…" : "Subscribe"}
                  </span>
                </button>
              </form>

              {formState === "error" && (
                <p role="alert" style={{ fontSize: "13px", color: "rgba(255,200,200,0.85)", marginBottom: "12px" }}>
                  {errorMsg || "Couldn't subscribe — please try again."}
                </p>
              )}

              {/* Trust hint — real copy only, no fabricated member counts */}
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", marginBottom: "20px" }}>
                Free to join. Members get early access. Unsubscribe any time.
              </p>

              {/* Secondary CTA — magnetic on desktop hover */}
              <Link
                ref={ctaRef}
                href="/members"
                className="group relative inline-flex items-center gap-1.5"
                style={{
                  fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.6)",
                  textDecoration: "none", willChange: "transform",
                }}
              >
                <span className="border-b border-white/25 group-hover:border-white/60 transition-colors duration-200 pb-px">
                  Become a Member
                </span>
                <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
