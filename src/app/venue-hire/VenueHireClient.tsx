"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SocialProof } from "@/components/SocialProof";
import { Field } from "@/components/Field";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";
import { BRAND } from "@/lib/site";
import { SPACES, EVENT_TYPES_FORM, EVENT_TYPES_STRIP } from "@/data/venue-hire";

type SubmitState = "idle" | "submitting" | "success" | "error";

interface FormState {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  preferredVenue: string;
  date: string;
  guests: string;
  message: string;
  /** Honeypot — must remain empty. Bots fill this; humans don't see it. */
  company: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  preferredVenue: "",
  date: "",
  guests: "",
  message: "",
  company: "",
};

// Today in YYYY-MM-DD for date input min attr (prevents past-date selection)
const TODAY_ISO = new Date().toISOString().split("T")[0];

export function VenueHireClient() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitState === "submitting") return;
    setSubmitState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/venue-hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Could not send enquiry");
      }

      setSubmitState("success");
      // Build query string so the thank-you page can personalise
      const qs = new URLSearchParams({
        name: form.name,
        eventType: form.eventType,
      }).toString();
      router.push(`/venue-hire/thank-you?${qs}`);
    } catch (err) {
      setSubmitState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section className="relative bg-black overflow-hidden flex items-end" style={{ minHeight: "60svh" }}>
          <Image
            src="/images/nadine-195.jpg"
            alt="Venue hire at Y"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.88) 100%)" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.03, backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
          />
          <div className="relative z-10 text-white px-6 md:px-16 pb-16 pt-40">
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "16px",
            }}>
              Private Hire · Three venues · Up to 1,000 across Y Club and Y Terrace
            </p>
            <h1 className="text-[46px] md:text-[80px]" style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em" }}>
              Make it yours.
            </h1>
            <p
              className="text-[18px] md:text-[22px]"
              style={{
                fontWeight: 400, color: "rgba(255,255,255,0.75)",
                marginTop: "24px", maxWidth: "640px", lineHeight: 1.4,
              }}
            >
              Birthdays, corporate nights, Christmas parties, promotional events.
              Three venues. One enquiry. We&apos;ll handle the rest.
            </p>
          </div>
        </section>

        {/* ── SPACES ─────────────────────────────────────────────────── */}
        <section className="bg-black text-white" style={{ padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <div className="mb-12 md:mb-16">
              <p style={{
                fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "16px",
              }}>
                The Spaces
              </p>
              <h2
                className="text-[36px] md:text-[56px]"
                style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em", maxWidth: "720px" }}
              >
                Three venues, one walk apart.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {SPACES.map((space) => (
                <div key={space.name} className="flex flex-col">
                  <div className="relative overflow-hidden mb-6" style={{ aspectRatio: "4/5" }}>
                    <Image
                      src={space.imageUrl}
                      alt={space.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%)" }}
                    />
                    <div className="absolute" style={{ bottom: "20px", left: "20px" }}>
                      <p style={{
                        fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em",
                        textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: "6px",
                      }}>
                        {space.capacity}
                      </p>
                      <p className="text-[28px] md:text-[32px]" style={{
                        fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em", color: "#FAFAFA",
                      }}>
                        {space.name}
                      </p>
                    </div>
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "16px" }}>
                    {space.features.map((feature) => (
                      <li
                        key={feature}
                        style={{
                          fontSize: "15px",
                          color: "rgba(255,255,255,0.65)",
                          padding: "10px 0",
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                          lineHeight: 1.45,
                        }}
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <p style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    color: "rgba(255,255,255,0.5)",
                  }}>
                    <span style={{ textTransform: "uppercase", marginRight: "8px", color: "rgba(255,255,255,0.4)" }}>
                      Best for
                    </span>
                    {space.bestFor}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EVENT TYPES STRIP ──────────────────────────────────────── */}
        <section className="bg-black text-white" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "64px 24px" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <p style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "20px",
            }}>
              We host
            </p>
            <div className="flex flex-wrap" style={{ gap: "10px" }}>
              {EVENT_TYPES_STRIP.map((type) => (
                <span
                  key={type}
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    padding: "10px 18px",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "#FAFAFA",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF ───────────────────────────────────────────── */}
        <SocialProof
          variant="dark"
          kicker="Why hire Y"
          heading="Three venues, six bars, the energy of Guildford's busiest night."
        />

        {/* ── ENQUIRY FORM ───────────────────────────────────────────── */}
        <section className="bg-white text-black" style={{ padding: "96px 24px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16" style={{ maxWidth: "1280px", margin: "0 auto" }}>

            {/* Left intro */}
            <div className="lg:col-span-2">
              <p style={{
                fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "16px",
              }}>
                Get in Touch
              </p>
              <h2
                className="text-[36px] md:text-[52px]"
                style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em", marginBottom: "20px" }}
              >
                Birthdays. Corporates.<br />Big nights.
              </h2>
              <p style={{ fontSize: "18px", color: "rgba(0,0,0,0.55)", lineHeight: 1.65, marginBottom: "32px" }}>
                Tell us the night you&apos;re planning and the rough size. We aim to reply within two working days with
                venue options, dates and a tailored package.
              </p>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "24px" }}>
                <p style={{
                  fontSize: "12px", fontWeight: 500, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "10px",
                }}>
                  Or call us
                </p>
                <a
                  href={`tel:${BRAND.phone}`}
                  style={{
                    fontSize: "28px", fontWeight: 700, color: "#080808",
                    textDecoration: "none", letterSpacing: "-0.01em",
                  }}
                  className="hover:underline underline-offset-4"
                >
                  {BRAND.phoneDisplay}
                </a>
                <p style={{ marginTop: "16px", fontSize: "15px", color: "rgba(0,0,0,0.55)" }}>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="hover:underline underline-offset-4"
                    style={{ color: "rgba(0,0,0,0.7)", textDecoration: "none" }}
                  >
                    {BRAND.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Form */}
            <form className="lg:col-span-3 flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
              {/* Honeypot — visually hidden, must remain empty for humans */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-10000px",
                  top: "auto",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                }}
              >
                <label>
                  Company (leave blank)
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={(e) => updateField("company", e.target.value)}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Your name" required>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    autoComplete="name"
                    className="form-input"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    autoComplete="email"
                    className="form-input"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Phone">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    autoComplete="tel"
                    className="form-input"
                  />
                </Field>
                <Field label="Event type" required>
                  <select
                    required
                    value={form.eventType}
                    onChange={(e) => updateField("eventType", e.target.value)}
                    className="form-input"
                  >
                    <option value="">Choose one</option>
                    {EVENT_TYPES_FORM.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Field label="Preferred venue">
                  <select
                    value={form.preferredVenue}
                    onChange={(e) => updateField("preferredVenue", e.target.value)}
                    className="form-input"
                  >
                    <option value="">No preference</option>
                    <option value="Y Club">Y Club</option>
                    <option value="Y Terrace">Y Terrace</option>
                    <option value="Y Bar & Lounge">Y Bar &amp; Lounge</option>
                  </select>
                </Field>
                <Field label="Date">
                  <input
                    type="date"
                    value={form.date}
                    min={TODAY_ISO}
                    onChange={(e) => updateField("date", e.target.value)}
                    className="form-input"
                  />
                </Field>
                <Field label="Guests">
                  <input
                    type="number"
                    min="1"
                    value={form.guests}
                    onChange={(e) => updateField("guests", e.target.value)}
                    placeholder="Approx."
                    className="form-input"
                  />
                </Field>
              </div>

              <Field label="Tell us more">
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Anything else we should know? Bar tabs, decoration, special requests…"
                  className="form-input"
                  style={{ resize: "vertical", minHeight: "120px" }}
                />
              </Field>

              <button
                type="submit"
                disabled={submitState === "submitting"}
                className="group inline-flex items-center justify-center gap-2 border border-black bg-black px-8 text-white text-[16px] font-bold hover:bg-white hover:text-black transition-colors duration-200 motion-reduce:transition-none disabled:opacity-60"
                style={{ height: "56px", alignSelf: "flex-start", marginTop: "8px" }}
              >
                {submitState === "submitting" ? "Sending..." : "Send Enquiry"}
                <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
              </button>

              {submitState === "error" && (
                <p role="alert" style={{ fontSize: "14px", color: "rgba(160,40,40,0.95)", marginTop: "8px" }}>
                  {errorMsg || "Couldn't send your enquiry — please try again or email"}{" "}
                  <a href={`mailto:${BRAND.email}`} className="underline">{BRAND.email}</a>.
                </p>
              )}

              <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)", marginTop: "4px" }}>
                We&apos;ll only use your details to respond to this enquiry. See our{" "}
                <Link href="/privacy-policy" className="underline">privacy policy</Link>.
              </p>
            </form>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
