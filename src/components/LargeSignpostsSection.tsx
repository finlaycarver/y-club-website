import Image from "next/image";
import { ChevronRightIcon } from "@/components/icons";
import { GRAIN_SVG as GRAIN } from "@/lib/grain";

interface VenuePanel {
  kicker: string;
  heading: string;
  body: string;
  address: string;
  directionsUrl: string;
  cta: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  textLeft: boolean;
  light?: boolean;
}

const panels: VenuePanel[] = [
  {
    kicker: "The Cornerhouse",
    heading: "Where the night goes loud",
    body: "Big floors. Big sound. Open late every Friday and Saturday.",
    address: "Onslow Street, Guildford GU1 4SQ",
    directionsUrl: "https://maps.google.com/?q=Y+Club+Corner+House+Onslow+Street+Guildford",
    cta: "Explore Cornerhouse",
    href: "#cornerhouse",
    imageUrl: "/images/12.webp",
    imageAlt: "The Cornerhouse",
    textLeft: true,
    light: false,
  },
  {
    kicker: "The Quadrant",
    heading: "Open-air. All season",
    body: "Guildford's outdoor terrace. Cocktails, sport on the big screen, late summer evenings.",
    address: "2–4 The Quadrant, Bridge Street, Guildford GU1 4SG",
    directionsUrl: "https://maps.google.com/?q=Y+Guildford+Unit+2-4+The+Quadrant+Bridge+Street+Guildford+GU1+4SG",
    cta: "Explore The Quadrant",
    href: "#quadrant",
    imageUrl: "/images/club-y-image-4.webp",
    imageAlt: "The Quadrant",
    textLeft: false,
    light: false,
  },
];

type TextColumnProps = Pick<VenuePanel, "kicker" | "heading" | "body" | "address" | "directionsUrl" | "cta" | "href" | "light">;

function TextColumn({ kicker, heading, body, address, directionsUrl, cta, href, light }: TextColumnProps) {
  const bg        = light ? "bg-white"            : "bg-black";
  const kicCol    = light ? "text-black"           : "text-white";
  const headCol   = light ? "text-black"           : "text-white";
  const bodyCol   = light ? "text-black/65"        : "text-white/70";
  const addrCol   = light ? "text-black/65"        : "text-white/65";
  const btnBorder = light ? "border-black"         : "border-white";
  const btnText   = light ? "text-black"           : "text-white";
  const btnHover  = light ? "hover:bg-black hover:text-white" : "hover:bg-white hover:text-black";

  return (
    /* Mobile: generous padding, auto height. Desktop: centred in full-height column */
    <div className={`${bg} flex flex-col justify-center px-6 py-12 md:px-20 md:h-full relative overflow-hidden`}>
      {/* Grain overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.025, backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
      />
      <p className={`text-3xl md:text-5xl font-bold leading-tight mb-1 relative ${kicCol}`}>
        {kicker}
      </p>
      {/* Heading: smaller on mobile, desktop size on md+ */}
      <h2 className={`text-3xl md:text-5xl font-bold leading-tight mb-4 relative opacity-60 ${headCol}`}>
        {heading}
      </h2>
      <p className={`text-base md:text-lg mb-6 relative ${bodyCol}`}>
        {body}
      </p>
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group inline-flex items-center gap-1.5 text-lg mb-8 relative hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none ${addrCol}`}
      >
        {address}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity duration-200 shrink-0" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
      <a
        href={href}
        className={`group inline-flex items-center justify-center gap-2 border px-6 md:px-8 py-3 md:py-4 transition-colors duration-200 motion-reduce:transition-none relative w-full md:w-auto ${btnBorder} ${btnText} ${btnHover}`}
      >
        {cta}
        <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:transition-none" />
      </a>
    </div>
  );
}

function ImageColumn({ imageUrl, imageAlt }: { imageUrl: string; imageAlt: string }) {
  return (
    /* Mobile: fixed height. Desktop: fills full panel height */
    <div className="relative h-72 md:h-full overflow-hidden">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}

export function LargeSignpostsSection() {
  return (
    <section>
      {panels.map((panel) => (
        /*
         * Mobile:  flex-col — image always on top, text below
         * Desktop: grid-cols-2 at full screen height, textLeft controls order
         */
        <div
          key={panel.href}
          id={panel.href.replace("#", "")}
          className="flex flex-col md:grid md:grid-cols-2 md:h-screen"
        >
          {panel.textLeft ? (
            <>
              {/* Mobile: image first (order-first), then text */}
              <div className="order-1 md:order-2"><ImageColumn imageUrl={panel.imageUrl} imageAlt={panel.imageAlt} /></div>
              <div className="order-2 md:order-1"><TextColumn kicker={panel.kicker} heading={panel.heading} body={panel.body} address={panel.address} directionsUrl={panel.directionsUrl} cta={panel.cta} href={panel.href} light={panel.light} /></div>
            </>
          ) : (
            <>
              {/* Quadrant: image already first in DOM — correct for both mobile and desktop */}
              <ImageColumn imageUrl={panel.imageUrl} imageAlt={panel.imageAlt} />
              <TextColumn kicker={panel.kicker} heading={panel.heading} body={panel.body} address={panel.address} directionsUrl={panel.directionsUrl} cta={panel.cta} href={panel.href} light={panel.light} />
            </>
          )}
        </div>
      ))}
    </section>
  );
}
