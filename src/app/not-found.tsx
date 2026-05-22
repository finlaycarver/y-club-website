import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "We couldn't find the page you were looking for.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="relative bg-black overflow-hidden flex items-center"
        style={{ minHeight: "100svh" }}
      >
        {/* No `priority` — wasting a preload on an error page is silly.
            loading="lazy" + opacity=0.4 keeps it as ambience, not focus. */}
        <Image
          src="/images/14.webp"
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          style={{ objectFit: "cover", opacity: 0.4 }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.03, backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
        />

        <div className="relative z-10 text-white px-6 md:px-16 w-full" style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <p
            className="error-404-glitch"
            style={{
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "18px",
              display: "inline-block",
            }}
          >
            Error 404
          </p>
          <h1 className="text-[64px] md:text-[120px]" style={{
            fontWeight: 700, lineHeight: 0.95, letterSpacing: "-0.02em", marginBottom: "24px",
          }}>
            Off the<br />guest list.
          </h1>
          <p
            className="text-[18px] md:text-[22px]"
            style={{
              fontWeight: 400, color: "rgba(255,255,255,0.7)",
              marginBottom: "40px", maxWidth: "520px", lineHeight: 1.5,
            }}
          >
            We can&apos;t find the page you&apos;re after. It might have moved, or it might never have existed.
            Either way — let&apos;s get you back to where the night is.
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 border border-white px-6 text-[17px] font-bold hover:-translate-y-0.5 transition-transform duration-200 motion-reduce:transition-none bg-white text-black w-full md:w-auto"
              style={{ height: "52px" }}
            >
              Back to Home
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
            <Link
              href="/whats-on"
              className="group inline-flex items-center justify-center gap-2 border border-white/60 px-6 text-[17px] font-bold text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 motion-reduce:transition-none w-full md:w-auto"
              style={{ height: "52px" }}
            >
              See What&apos;s On
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
          </div>

          {/* Popular destinations — gives the user a way out beyond
              the two hero CTAs when they hit a dead URL. */}
          <nav
            aria-label="Popular destinations"
            style={{
              marginTop: "56px",
              paddingTop: "32px",
              borderTop: "1px solid rgba(255,255,255,0.12)",
              maxWidth: "640px",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                marginBottom: "16px",
              }}
            >
              Or try
            </p>
            <ul
              className="flex flex-wrap gap-x-6 gap-y-3"
              style={{ listStyle: "none", padding: 0, margin: 0 }}
            >
              {[
                { href: "/venues",      label: "Our venues" },
                { href: "/venue-hire",  label: "Venue hire" },
                { href: "/members",     label: "Become a member" },
                { href: "/about",       label: "About Y" },
                { href: "/about#contact", label: "Contact" },
                { href: "/faqs",        label: "FAQs" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none"
                    style={{
                      fontSize: "15px",
                      color: "rgba(255,255,255,0.75)",
                      textDecoration: "underline",
                      textDecorationColor: "rgba(255,255,255,0.25)",
                      textUnderlineOffset: "4px",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
