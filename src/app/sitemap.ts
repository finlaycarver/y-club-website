import type { MetadataRoute } from "next";
import { EVENTS } from "@/data/events";

/**
 * Static sitemap of every page on the Y site. Next.js serves this at
 * /sitemap.xml automatically thanks to the App Router convention.
 *
 * Update SITE_URL via env when the production domain is confirmed.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://club-y.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const eventEntries: MetadataRoute.Sitemap = EVENTS.map((event) => ({
    url: `${SITE_URL}/whats-on/${event.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    { url: `${SITE_URL}/`,                       lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/whats-on`,               lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/venues`,                 lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/venues/y-club`,          lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/venues/y-terrace`,       lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/venues/y-bar-lounge`,    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/venue-hire`,             lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/members`,                lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/about`,                  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faqs`,                   lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`,         lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE_URL}/terms`,                  lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    ...eventEntries,
  ];
}
