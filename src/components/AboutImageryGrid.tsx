"use client";

import Image from "next/image";

/**
 * People-first gallery marquee for the About page.
 *
 * Two rows scroll at different speeds. Each row uses a completely
 * different set of 12 images — no photo appears in both rows.
 *
 * Row 1: the _MG_ paparazzi-style crowd portraits series.
 * Row 2: wider venue shots, group photos, dance floor atmosphere.
 *
 * Each row doubles its own array for the seamless -50% translateX loop.
 * Hovering any row pauses it. Reduced-motion: both rows wrap into a grid.
 */

/** Row 1 — 12 paparazzi-style crowd portraits */
const ROW1: ReadonlyArray<{ src: string; alt: string }> = [
  { src: "/images/_MG_7912.jpg", alt: "A night at Y Club" },
  { src: "/images/_MG_7927.jpg", alt: "A night at Y Club" },
  { src: "/images/_MG_7952.jpg", alt: "A night at Y Club" },
  { src: "/images/_MG_7938.jpg", alt: "A night at Y Club" },
  { src: "/images/_MG_7922.jpg", alt: "A night at Y Club" },
  { src: "/images/_MG_8010.jpg", alt: "A night at Y Club" },
  { src: "/images/_MG_7917.jpg", alt: "A night at Y Club" },
  { src: "/images/_MG_7995.jpg", alt: "A night at Y Club" },
  { src: "/images/_MG_7975.jpg", alt: "A night at Y Club" },
  { src: "/images/_MG_8030.jpg", alt: "A night at Y Club" },
  { src: "/images/_MG_7906.jpg", alt: "A night at Y Club" },
  { src: "/images/_MG_8026.jpg", alt: "A night at Y Club" },
];

/** Row 2 — 12 completely different images: venue atmosphere + group shots */
const ROW2: ReadonlyArray<{ src: string; alt: string }> = [
  { src: "/images/_MG_7934.jpg",  alt: "Y Club dance floor"                   },
  { src: "/images/img-1890.jpg",  alt: "Friends dancing at Y Club"             },
  { src: "/images/_MG_7964.jpg",  alt: "Y Club main room"                      },
  { src: "/images/img-1917.jpg",  alt: "A night at Y"                          },
  { src: "/images/img-1901.jpg",  alt: "Y Club crowd"                          },
  { src: "/images/img-0841.jpeg", alt: "A night out at Y"                      },
  { src: "/images/img-1903-2.jpg", alt: "Late-night dance floor at Y Club"     },
  { src: "/images/mg-7942.webp",  alt: "DJ set at Y Club"                      },
  { src: "/images/nadine-180.jpg", alt: "Y Terrace at night"                   },
  { src: "/images/img-0959.jpeg", alt: "Y Club in full flow"                   },
  { src: "/images/club-y-image-5.webp", alt: "Packed crowd at Y Club"          },
  { src: "/images/img-1907.jpg",  alt: "Y Terrace group night out"             },
];

const IMG_W = 360;
const IMG_H = 240;
const GAP   = 10;

function MarqueeRow({
  photos,
  trackClass,
  priority,
}: {
  photos: ReadonlyArray<{ src: string; alt: string }>;
  trackClass: string;
  priority: boolean;
}) {
  const doubled = [...photos, ...photos];

  return (
    <div style={{ overflow: "hidden" }}>
      <div className={trackClass}>
        {doubled.map((photo, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: `${IMG_W}px`,
              height: `${IMG_H}px`,
              marginRight: `${GAP}px`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={`${IMG_W}px`}
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority={priority && i < photos.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AboutImageryGrid() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: `${GAP}px` }}
      aria-label="Photos from nights at Y"
    >
      <MarqueeRow photos={ROW1} trackClass="gallery-marquee-track"      priority={true}  />
      <MarqueeRow photos={ROW2} trackClass="gallery-marquee-track-slow" priority={false} />
    </div>
  );
}
