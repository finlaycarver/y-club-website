"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG } from "@/lib/grain";
import { captureError } from "@/lib/error-tracking";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    captureError(error, { digest: error.digest, location: "global-error-boundary" });
  }, [error]);

  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="relative bg-black overflow-hidden flex items-center"
        style={{ minHeight: "100svh" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.03, backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
        />

        <div className="relative z-10 text-white px-6 md:px-16 w-full" style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <p style={{
            fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "18px",
          }}>
            Something broke
          </p>
          <h1 className="text-[56px] md:text-[96px]" style={{
            fontWeight: 700, lineHeight: 0.95, letterSpacing: "-0.02em", marginBottom: "24px",
          }}>
            Hit a snag.
          </h1>
          <p
            className="text-[18px] md:text-[22px]"
            style={{
              fontWeight: 400, color: "rgba(255,255,255,0.7)",
              marginBottom: "40px", maxWidth: "560px", lineHeight: 1.5,
            }}
          >
            Something went wrong on our end. Try refreshing — if it keeps happening,
            drop us a line at{" "}
            <a href="mailto:barmanager@dreamoyster.com" className="underline">
              barmanager@dreamoyster.com
            </a>.
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <button
              type="button"
              onClick={reset}
              className="group inline-flex items-center justify-center gap-2 border border-white px-6 text-[17px] font-bold hover:-translate-y-0.5 transition-transform duration-200 motion-reduce:transition-none bg-white text-black w-full md:w-auto cursor-pointer"
              style={{ height: "52px" }}
            >
              Try Again
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </button>
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 border border-white/60 px-6 text-[17px] font-bold text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 motion-reduce:transition-none w-full md:w-auto"
              style={{ height: "52px" }}
            >
              Back to Home
              <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
            </Link>
          </div>

          {error?.digest && (
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "40px", fontFamily: "monospace" }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
