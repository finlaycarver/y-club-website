/**
 * Renders a single JSON-LD `<script>` tag with the supplied schema object.
 *
 * Use this directly when a one-off schema is needed; prefer the
 * named helpers (LocalBusinessSchema, EventSchema, FAQPageSchema)
 * for repeated schemas — they centralise the data shapes.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Schema objects are static, internal — stringify safely.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
