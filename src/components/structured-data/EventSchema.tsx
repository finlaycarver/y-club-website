import { JsonLd } from "./JsonLd";
import { SITE_URL, VENUES } from "@/lib/site";

export interface EventSchemaItem {
  title: string;
  /** ISO start date — YYYY-MM-DD */
  startDate: string;
  /** ISO end date — optional, defaults to startDate */
  endDate?: string;
  venue: "Y Club" | "Y Terrace" | "Y Bar & Lounge";
  imageUrl: string;
  description: string;
  ticketUrl: string;
}

function venueAddress(venue: EventSchemaItem["venue"]) {
  if (venue === "Y Club")
    return {
      name: VENUES.yClub.name,
      streetAddress: VENUES.yClub.streetAddress,
      locality: VENUES.yClub.locality,
      postalCode: VENUES.yClub.postalCode,
    };
  if (venue === "Y Terrace")
    return {
      name: VENUES.yTerrace.name,
      streetAddress: VENUES.yTerrace.streetAddress,
      locality: VENUES.yTerrace.locality,
      postalCode: VENUES.yTerrace.postalCode,
    };
  return {
    name: VENUES.yBarLounge.name,
    streetAddress: VENUES.yBarLounge.streetAddress,
    locality: VENUES.yBarLounge.locality,
    postalCode: VENUES.yBarLounge.postalCode,
  };
}

/**
 * Multi-event JSON-LD list. Renders one `Event` per item — Google
 * shows the soonest one in rich results when several are valid.
 */
export function EventSchema({ events }: { events: ReadonlyArray<EventSchemaItem> }) {
  const data = events.map((event) => {
    const venue = venueAddress(event.venue);
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.title,
      startDate: event.startDate,
      endDate: event.endDate ?? event.startDate,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      description: event.description.replace(/<[^>]+>/g, ""),
      image: event.imageUrl.startsWith("http")
        ? event.imageUrl
        : `${SITE_URL}${event.imageUrl}`,
      offers: {
        "@type": "Offer",
        url: event.ticketUrl,
        availability: "https://schema.org/InStock",
        validFrom: event.startDate,
      },
      location: {
        "@type": "Place",
        name: venue.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: venue.streetAddress,
          addressLocality: venue.locality,
          postalCode: venue.postalCode,
          addressCountry: "GB",
        },
      },
      organizer: {
        "@type": "Organization",
        name: "Y",
        url: SITE_URL,
      },
    };
  });

  return (
    <>
      {data.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
    </>
  );
}
