import { JsonLd } from "./JsonLd";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, BRAND, VENUES } from "@/lib/site";

/**
 * Sitewide LocalBusiness schema (NightClub subtype). Lists all three
 * venues as `department` entries so each shows in local-pack results.
 */
export function LocalBusinessSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    alternateName: "Y Bar",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    telephone: BRAND.phone,
    email: BRAND.email,
    image: `${SITE_URL}/seo/og-image.png`,
    priceRange: "££",
    sameAs: [BRAND.instagram, BRAND.facebook, BRAND.tiktok],
    address: {
      "@type": "PostalAddress",
      streetAddress: VENUES.yClub.streetAddress,
      addressLocality: VENUES.yClub.locality,
      postalCode: VENUES.yClub.postalCode,
      addressRegion: VENUES.yClub.region,
      addressCountry: VENUES.yClub.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: VENUES.yClub.geo.latitude,
      longitude: VENUES.yClub.geo.longitude,
    },
    department: [
      {
        "@type": "NightClub",
        name: VENUES.yClub.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: VENUES.yClub.streetAddress,
          addressLocality: VENUES.yClub.locality,
          postalCode: VENUES.yClub.postalCode,
          addressRegion: VENUES.yClub.region,
          addressCountry: VENUES.yClub.country,
        },
      },
      {
        "@type": "NightClub",
        name: VENUES.yTerrace.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: VENUES.yTerrace.streetAddress,
          addressLocality: VENUES.yTerrace.locality,
          postalCode: VENUES.yTerrace.postalCode,
          addressRegion: VENUES.yTerrace.region,
          addressCountry: VENUES.yTerrace.country,
        },
      },
      {
        "@type": "BarOrPub",
        name: VENUES.yBarLounge.name,
        address: {
          "@type": "PostalAddress",
          addressLocality: VENUES.yBarLounge.locality,
          addressRegion: VENUES.yBarLounge.region,
          addressCountry: VENUES.yBarLounge.country,
        },
      },
    ],
  };

  return <JsonLd data={data} />;
}
