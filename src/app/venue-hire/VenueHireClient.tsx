"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  PartyPopper, GraduationCap, Briefcase, Gift, Sparkles,
  Music, Trophy, Shirt, Wine, Megaphone, Monitor, Ghost,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SocialProof } from "@/components/SocialProof";
import { Field } from "@/components/Field";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";
import { BRAND } from "@/lib/site";
import { SPACES, EVENT_TYPES_FORM, EVENT_TYPES_STRIP } from "@/data/venue-hire";
import { VenueHireStickyCTA } from "./VenueHireStickyCTA";

/* ── Analytics helper — fires for Plausible and GA4 ─────────────── */
function trackEvent(name: string, props?: Record<string, string>) {
  try {
    type AW = typeof window & {
      plausible?: (n: string, o?: { props?: Record<string, string> }) => void;
      gtag?: (c: string, n: string, p?: Record<string, string>) => void;
    };
    const w = window as AW;
    w.plausible?.(name, { props });
    w.gtag?.("event", name, props);
  } catch (_) {}
}

/* ── Strip label → form select value ────────────────────────────── */
const STRIP_TO_FORM: Partial<Record<string, string>> = {
  "Birthdays":          "Birthday party",
  "Graduations":        "Birthday party",
  "Corporate nights":   "Corporate event",
  "Christmas parties":  "Christmas / NYE",
  "NYE":                "Christmas / NYE",
  "Live performances":  "Live performance",
  "Award shows":        "Award show / Gala",
  "Galas":              "Award show / Gala",
  "Promotional events": "Promoter booking",
  "Fashion shows":      "Other",
  "Sports screenings":  "Other",
  "Halloween":          "Other",
};

/* ── Icon per pill ───────────────────────────────────────────────── */
const PILL_ICONS: Record<string, React.ReactNode> = {
  "Birthdays":          <PartyPopper   size={13} aria-hidden="true" />,
  "Graduations":        <GraduationCap size={13} aria-hidden="true" />,
  "Corporate nights":   <Briefcase     size={13} aria-hidden="true" />,
  "Christmas parties":  <Gift          size={13} aria-hidden="true" />,
  "NYE":                <Sparkles      size={13} aria-hidden="true" />,
  "Live performances":  <Music         size={13} aria-hidden="true" />,
  "Award shows":        <Trophy        size={13} aria-hidden="true" />,
  "Fashion shows":      <Shirt         size={13} aria-hidden="true" />,
  "Galas":              <Wine          size={13} aria-hidden="true" />,
  "Promotional events": <Megaphone     size={13} aria-hidden="true" />,
  "Sports screenings":  <Monitor       size={13} aria-hidden="true" />,
  "Halloween":          <Ghost         size={13} aria-hidden="true" />,
};

/* ── Progressive-disclosure extra field map ─────────────────────── */
const EVENT_EXTRA_FIELD: Partial<Record<string, { label: string; placeholder: string }>> = {
  "Birthday party":    { label: "Tables or booth service?", placeholder: "How many tables or booths?" },
  "Corporate event":   { label: "Company name",             placeholder: "Your company or organisation" },
  "Live performance":  { label: "Artist / performer",       placeholder: "Who is performing?" },
  "Promoter booking":  { label: "Promoter / brand",         placeholder: "Your promoter name or brand" },
  "Wedding reception": { label: "Partner name(s)",          placeholder: "Names for the reservation" },
  "Award show / Gala": { label: "Award body / host",        placeholder: "Organisation hosting the event" },
};

/* ── Types ───────────────────────────────────────────────────────── */
type SubmitState = "idle" | "submitting" | "success" | "error";

interface FormState {
  name:            string;
  email:           string;
  phone:           string;
  eventType:       string;
  extraDetail:     string;
  preferredVenue:  string;
  date:            string;
  guests:          string;
  message:         string;
  /** Honeypot — must remain empty. Bots fill this; humans don't see it. */
  company:         string;
}

const INITIAL_FORM: FormState = {
  name: "", email: "", phone: "", eventType: "", extraDetail: "",
  preferredVenue: "", date: "", guests: "", message: "", company: "",
};

const TODAY_ISO = new Date().toISOString().split("T")[0];
const DRAFT_KEY = "venue-hire-draft";

/* ── Component ───────────────────────────────────────────────────── */
export function VenueHireClient() {
  const router = useRouter();
  const [form, setForm]               = useState<FormState>(INITIAL_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg]       = useState("");
  const [touched, setTouched]         = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const hasFocusedRef = useRef(false);
  // Progressive form — mobile shows 1 step at a time, desktop shows all
  const [mobileStep, setMobileStep] = useState(1);
  const MOBILE_STEPS = 4;

  // Restore localStorage draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormState>;
        setForm((prev) => ({ ...prev, ...parsed, company: "" }));
      }
    } catch (_) {}
  }, []);

  // Debounced draft save (500ms) — never saves honeypot field
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const { company: _hp, ...rest } = form;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
      } catch (_) {}
    }, 500);
    return () => clearTimeout(id);
  }, [form]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function validateField(field: keyof FormState, value: string): string {
    if (field === "name"      && !value.trim())  return "Your name is required";
    if (field === "email") {
      if (!value.trim())                          return "Email address is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
    }
    if (field === "eventType" && !value)          return "Please choose an event type";
    return "";
  }

  function handleBlur(field: keyof FormState) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field] as string);
    setFieldErrors((prev) => ({ ...prev, [field]: error }));
  }

  function handleFirstFocus() {
    if (hasFocusedRef.current) return;
    hasFocusedRef.current = true;
    trackEvent("venue_hire_form_start");
  }

  /** Validate the current mobile step's required fields before advancing. */
  function advanceMobileStep() {
    if (mobileStep === 1) {
      const nameErr  = validateField("name",  form.name);
      const emailErr = validateField("email", form.email);
      if (nameErr || emailErr) {
        setTouched((p) => ({ ...p, name: true, email: true }));
        setFieldErrors((p) => ({ ...p, name: nameErr, email: emailErr }));
        return;
      }
    }
    if (mobileStep === 2) {
      const typeErr = validateField("eventType", form.eventType);
      if (typeErr) {
        setTouched((p) => ({ ...p, eventType: true }));
        setFieldErrors((p) => ({ ...p, eventType: typeErr }));
        return;
      }
    }
    setMobileStep((s) => Math.min(s + 1, MOBILE_STEPS));
  }

  function handlePillClick(stripLabel: string) {
    const formValue = STRIP_TO_FORM[stripLabel];
    if (formValue) {
      updateField("eventType", formValue);
      setTimeout(() => {
        document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitState === "submitting") return;

    const nameErr  = validateField("name",      form.name);
    const emailErr = validateField("email",     form.email);
    const typeErr  = validateField("eventType", form.eventType);
    if (nameErr || emailErr || typeErr) {
      setTouched({ name: true, email: true, eventType: true });
      setFieldErrors({ name: nameErr, email: emailErr, eventType: typeErr });
      return;
    }

    setSubmitState("submitting");
    setErrorMsg("");
    trackEvent("venue_hire_form_submit", {
      eventType:      form.eventType,
      preferredVenue: form.preferredVenue,
    });

    try {
      const res = await fetch("/api/venue-hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body?.error ?? "Could not send enquiry");
      }

      try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
      trackEvent("venue_hire_form_success", { eventType: form.eventType });

      setSubmitState("success");
      const qs = new URLSearchParams({ name: form.name, eventType: form.eventType }).toString();
      router.push(`/venue-hire/thank-you?${qs}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setSubmitState("error");
      setErrorMsg(msg);
      trackEvent("venue_hire_form_error", { error: msg });
    }
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content">

        {/* ── HERO — A4-VFP [HIGH]: was nadine-195.jpg (Y Bar & Lounge).
            Swapped to crowd/event shot that represents live events. */}
        <section className="relative bg-black overflow-hidden flex items-end" style={{ minHeight: "60svh" }}>
          <Image
            src="/images/IMG_0911.webp"
            alt="Guests celebrating at a private hire event in Guildford"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center 25%" }}
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
              Private Hire · Three venues · Up to 1,500 across Y Club and Y Terrace
            </p>
            <h1 className="text-[46px] md:text-[80px]" style={{ fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em" }}>
              Make it yours.
            </h1>
            <p
              className="text-[18px] md:text-[22px]"
              style={{ fontWeight: 400, color: "rgba(255,255,255,0.75)", marginTop: "24px", maxWidth: "640px", lineHeight: 1.4 }}
            >
              Birthdays, corporate nights, Christmas parties, promotional events.
              Three venues. One enquiry. We&apos;ll handle the rest.
            </p>
          </div>
        </section>

        {/* ── SPACES ───────────────────────────────────────────────── */}
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
                          fontSize: "15px", color: "rgba(255,255,255,0.65)",
                          padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", lineHeight: 1.45,
                        }}
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <p style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.05em", color: "rgba(255,255,255,0.5)" }}>
                    <span style={{ textTransform: "uppercase", marginRight: "8px", color: "rgba(255,255,255,0.4)" }}>Best for</span>
                    {space.bestFor}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── SOCIAL PROOF ─────────────────────────────────────────── */}
        <SocialProof
          variant="dark"
          kicker="Why hire Y"
          heading="Three venues, six bars, the energy of Guildford's busiest night."
        />

        {/* ── ENQUIRY FORM ─────────────────────────────────────────── */}
        <section id="enquiry-form" className="bg-white text-black" style={{ padding: "96px 24px" }}>
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
                  style={{ fontSize: "28px", fontWeight: 700, color: "#080808", textDecoration: "none", letterSpacing: "-0.01em" }}
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

            {/* Form — venue-hire-form wires up branded focus rings in globals.css */}
            {/* Mobile: progressive — 1 step at a time. Desktop: all steps visible. */}
            <form
              className="venue-hire-form lg:col-span-3 flex flex-col gap-5"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Mobile step progress indicator */}
              <div className="flex items-center gap-2 md:hidden" aria-label={`Step ${mobileStep} of ${MOBILE_STEPS}`}>
                {Array.from({ length: MOBILE_STEPS }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      height: "3px",
                      flex: 1,
                      background: i < mobileStep ? "#080808" : "rgba(0,0,0,0.15)",
                      borderRadius: "2px",
                      transition: "background 0.3s ease",
                    }}
                  />
                ))}
                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.45)", whiteSpace: "nowrap", marginLeft: "4px" }}>
                  {mobileStep}/{MOBILE_STEPS}
                </span>
              </div>
              {/* Honeypot — absolutely hidden, must stay empty */}
              <div
                aria-hidden="true"
                style={{ position: "absolute", left: "-10000px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}
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

              {/* ── STEP 1: Name + Email ── */}
              <div className={mobileStep === 1 ? "" : "hidden md:block"}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Field label="Your name" required>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      onFocus={handleFirstFocus}
                      autoComplete="name"
                      className="form-input"
                    />
                  </Field>
                  {touched.name && fieldErrors.name && (
                    <p role="alert" style={{ fontSize: "12px", color: "rgba(160,40,40,0.9)", marginTop: "5px" }}>
                      {fieldErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Field label="Email" required>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      autoComplete="email"
                      className="form-input"
                    />
                  </Field>
                  {touched.email && fieldErrors.email && (
                    <p role="alert" style={{ fontSize: "12px", color: "rgba(160,40,40,0.9)", marginTop: "5px" }}>
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Step 1 mobile Continue */}
              <button type="button" onClick={advanceMobileStep} className="md:hidden mt-3 inline-flex items-center justify-center gap-2 border border-black bg-black text-white text-[15px] font-bold w-full venue-cta-ripple" style={{ height: "50px" }}>
                Continue →
              </button>
              </div>{/* end step 1 */}

              {/* ── STEP 2: Phone + Event type ── */}
              <div className={mobileStep === 2 ? "" : "hidden md:block"}>
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
                <div>
                  <Field label="Event type" required>
                    <select
                      required
                      value={form.eventType}
                      onChange={(e) => updateField("eventType", e.target.value)}
                      onBlur={() => handleBlur("eventType")}
                      className="form-input"
                    >
                      <option value="">Choose one</option>
                      {EVENT_TYPES_FORM.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </Field>
                  {touched.eventType && fieldErrors.eventType && (
                    <p role="alert" style={{ fontSize: "12px", color: "rgba(160,40,40,0.9)", marginTop: "5px" }}>
                      {fieldErrors.eventType}
                    </p>
                  )}
                </div>
              </div>

              {/* Progressive disclosure — context-specific extra field */}
              {EVENT_EXTRA_FIELD[form.eventType] && (
                <Field label={EVENT_EXTRA_FIELD[form.eventType]!.label}>
                  <input
                    type="text"
                    value={form.extraDetail}
                    onChange={(e) => updateField("extraDetail", e.target.value)}
                    placeholder={EVENT_EXTRA_FIELD[form.eventType]!.placeholder}
                    className="form-input"
                  />
                </Field>
              )}

              {/* Step 2 mobile navigation */}
              <div className="md:hidden flex gap-3 mt-3">
                <button type="button" onClick={() => setMobileStep((s) => Math.max(s - 1, 1))} className="flex-none inline-flex items-center justify-center border border-black/30 text-black/60 text-[14px] font-medium venue-cta-ripple" style={{ height: "50px", padding: "0 20px" }}>
                  ← Back
                </button>
                <button type="button" onClick={advanceMobileStep} className="flex-1 inline-flex items-center justify-center gap-2 border border-black bg-black text-white text-[15px] font-bold venue-cta-ripple" style={{ height: "50px" }}>
                  Continue →
                </button>
              </div>
              </div>{/* end step 2 */}

              {/* ── STEP 3: Venue + Date + Guests + Message ── */}
              <div className={mobileStep === 3 ? "" : "hidden md:block"}>
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

              {/* Step 3 mobile navigation */}
              <div className="md:hidden flex gap-3 mt-3">
                <button type="button" onClick={() => setMobileStep((s) => Math.max(s - 1, 1))} className="flex-none inline-flex items-center justify-center border border-black/30 text-black/60 text-[14px] font-medium venue-cta-ripple" style={{ height: "50px", padding: "0 20px" }}>
                  ← Back
                </button>
                <button type="button" onClick={advanceMobileStep} className="flex-1 inline-flex items-center justify-center gap-2 border border-black bg-black text-white text-[15px] font-bold venue-cta-ripple" style={{ height: "50px" }}>
                  Continue →
                </button>
              </div>
              </div>{/* end step 3 */}

              {/* ── STEP 4: Submit ── */}
              <div className={mobileStep === 4 ? "" : "hidden md:block"}>
              {/* Back button on step 4 mobile */}
              <button type="button" onClick={() => setMobileStep((s) => Math.max(s - 1, 1))} className="md:hidden mb-4 inline-flex items-center gap-1.5 text-black/50 text-[14px] font-medium" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                ← Back
              </button>

              {/* Submit — spinner while submitting + ripple */}
              <button
                type="submit"
                disabled={submitState === "submitting"}
                className="group venue-cta-ripple inline-flex items-center justify-center gap-2 border border-black bg-black px-8 text-white text-[16px] font-bold hover:bg-white hover:text-black transition-colors duration-200 motion-reduce:transition-none disabled:opacity-60 w-full md:w-auto"
                style={{ height: "56px", alignSelf: "flex-start", marginTop: "8px" }}
              >
                {submitState === "submitting" ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                    >
                      <circle className="opacity-25" cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
                      <path className="opacity-75" fill="currentColor" d="M8 1a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5V1z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Send Enquiry
                    <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
                  </>
                )}
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
              </div>{/* end step 4 */}
            </form>
          </div>
        </section>

      </main>
      <SiteFooter />
      {/* Sticky mobile CTA — call + scroll to form */}
      <VenueHireStickyCTA />
    </>
  );
}
