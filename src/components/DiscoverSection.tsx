import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface Signpost {
  title: string;
  subtitle?: string;
  imageUrl: string;
  href: string;
  wide?: boolean;
  imagePosition?: string;
}

const signposts: Signpost[] = [
  // Row 1 — wide left
  { title: "Y Club",             subtitle: "Late nights, big floors",           imageUrl: "/images/club-y-image-5.webp",   href: "#y-club",         wide: true },
  { title: "Y Terrace",         subtitle: "Outdoor terrace under the stars",   imageUrl: "/images/10.webp",               href: "#y-terrace" },
  { title: "The Line-up",        subtitle: "Every Friday and Saturday",         imageUrl: "/images/club-y-image-6.webp",   href: "#whats-on" },
  // Row 2 — wide middle
  { title: "Birthdays",         subtitle: "Tables, hosts & bottle service",    imageUrl: "/images/img-0961.jpeg",         href: "#birthdays" },
  { title: "Venue Hire",        subtitle: "Up to 1,000 capacity",              imageUrl: "/images/nadine-195.jpg",        href: "#venue-hire",     wide: true },
  { title: "Student Nights",    subtitle: "Midweek with Surrey Uni",           imageUrl: "/images/img-0841.jpeg",         href: "#student" },
  // Row 3 — wide right
  { title: "Bottle Service",    subtitle: "Premium tables in the club",        imageUrl: "/images/tempimage0cgvsr.jpg",   href: "#bottle-service" },
  // [CONFIRM] swap to evening sports / indoor crowd image when Y delivers assets
  { title: "Sports Screening",  subtitle: "Big games on the big screen",       imageUrl: "/images/tempimagetpo0ye5.webp", href: "#sports" },
  { title: "Christmas Parties", subtitle: "Book your festive night",           imageUrl: "/images/img-1907.jpg",          href: "#christmas",      wide: true, imagePosition: "right center" },
];

function SignpostCard({ title, subtitle, imageUrl, href, wide, imagePosition }: Signpost) {
  return (
    <a
      href={href}
      className={`group relative block overflow-hidden cursor-pointer${wide ? " lg:col-span-2" : ""}`}
      style={{ textDecoration: "none" }}
    >
      {/* Background image */}
      <Image
        fill
        src={imageUrl}
        alt={title}
        style={{ objectFit: "cover", objectPosition: imagePosition ?? "center" }}
        className="transition-transform duration-500 ease-out group-hover:scale-105"
        sizes={
          wide
            ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        }
      />

      {/* Gradient overlay — stronger bottom-up for title legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(transparent 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.8) 100%)",
          zIndex: 1,
        }}
      />

      {/* Hover darkening layer */}
      <div
        className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500"
        style={{ zIndex: 1 }}
      />

      {/* Text overlay — lifts on hover */}
      <div
        className="transition-transform duration-300 ease-out group-hover:-translate-y-1 motion-reduce:transition-none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: "28px",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "white",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: "16px",
              fontWeight: 450,
              lineHeight: "24px",
              letterSpacing: "0.48px",
              color: "white",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Arrow affordance — bottom-right, shifts right on hover */}
      <div
        className="absolute text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
        style={{ bottom: "16px", right: "16px", zIndex: 3 }}
      >
        <ArrowUpRight size={24} />
      </div>
    </a>
  );
}

export function DiscoverSection() {

  return (
    <section
      className="px-4 md:px-24"
      style={{
        paddingTop: "48px",
        paddingBottom: "48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#080808",
      }}
    >
      <div style={{ width: "100%" }}>
        <p style={{
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(8,8,8,0.45)",
          margin: "0 0 14px",
        }}>
          Inside Y
        </p>

        <h2
          className="text-[36px] md:text-[67px]"
          style={{
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "0.67px",
            color: "#080808",
            margin: "0 0 32px",
          }}
        >
          Discover Y
        </h2>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 discover-grid"
          style={{ columnGap: "20px", rowGap: "30px" }}
        >
          {signposts.map((signpost) => (
            <SignpostCard key={signpost.title} {...signpost} />
          ))}
        </div>
      </div>
    </section>
  );
}
