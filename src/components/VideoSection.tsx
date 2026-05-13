import Image from "next/image";
import { Play } from "lucide-react";
import { GRAIN_SVG } from "@/lib/grain";

export function VideoSection() {
  return (
    <section
      className="px-6 md:px-12 lg:px-20 xl:px-36 relative overflow-hidden"
      style={{
        backgroundColor: "rgb(0,0,0)",
        paddingTop: "48px",
        paddingBottom: "48px",
        color: "#FAFAFA",
      }}
    >
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

      {/* Kicker — matches site kicker style */}
      <p style={{
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.45)",
        margin: "0 0 14px",
      }}>
        Watch
      </p>

      {/* Heading — tighter bottom margin */}
      <h2
        className="text-[36px] md:text-[67px]"
        style={{
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: "0.67px",
          color: "#FAFAFA",
          margin: "0 0 16px",
        }}
      >
        A night at Club Y
      </h2>

      {/* Video placeholder — full section width, no extra horizontal margins */}
      <div
        className="relative overflow-hidden aspect-video"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/mg-7942.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          {/* Overlay reduced to 30% — lets photography read */}
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.30)" }} />
        </div>

        {/* Play button — scale + opacity on hover */}
        <button
          type="button"
          aria-label="Play brand video"
          className="relative hover:scale-110 hover:opacity-80 transition-all duration-300 motion-reduce:transition-none"
          style={{
            width: "96px",
            height: "96px",
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: "50%",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          <Play size={36} color="white" fill="white" />
        </button>
      </div>
    </section>
  );
}
