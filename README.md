# Y Website

Marketing site for **Y — Guildford's late-night quarter**. Three venues (Y Club,
Y Terrace, Y Bar & Lounge), one short walk apart.

Built by [First AI.D](https://firstaid.studio).

---

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19** + **TypeScript**
- **Tailwind v4** (no shadcn — bespoke design system)
- **lucide-react** for iconography
- Deployed on **Vercel**

---

## Local development

```bash
# Node 24+ required
nvm use 24

# Install deps
npm install

# Copy env template + fill in values
cp .env.example .env.local

# Run the dev server
npm run dev
# → http://localhost:3000
```

## Scripts

| Command          | Description                                |
| ---------------- | ------------------------------------------ |
| `npm run dev`    | Dev server with Turbopack                  |
| `npm run build`  | Production build                           |
| `npm run start`  | Run the production build                   |
| `npm run lint`   | ESLint                                     |
| `npm run typecheck` | TypeScript only (no emit)               |
| `npm run check`  | Lint + typecheck + build (CI gate)         |

---

## Environment variables

See [`.env.example`](./.env.example) for the full list with descriptions.

**Required in production:**

- `NEXT_PUBLIC_SITE_URL` — drives canonical URLs, OG images, sitemap, schema

**Optional:**

- `NEXT_PUBLIC_COMPANY_LEGAL_NAME`, `NEXT_PUBLIC_COMPANY_NUMBER`, `NEXT_PUBLIC_VAT_NUMBER` — UK company registration line in footer
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — activates Plausible analytics
- `SENTRY_DSN` + `NEXT_PUBLIC_SENTRY_DSN` — activates Sentry error tracking
- `RESEND_API_KEY` + `ENQUIRIES_INBOX` — wires venue-hire form to a real inbox

---

## Project structure

```
src/
├── app/                       # Next.js App Router pages + API routes
│   ├── api/                   # Form submission endpoints
│   ├── venues/                # Venue detail pages
│   ├── venue-hire/            # Hire enquiry + thank-you
│   ├── whats-on/              # Events grid
│   ├── members/               # Membership signup
│   ├── about/                 # Brand + careers + contact
│   ├── faqs/                  # FAQ accordion
│   ├── privacy-policy/        # Legal
│   ├── terms/                 # Legal
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home
│   ├── not-found.tsx          # Branded 404
│   ├── error.tsx              # Branded error boundary
│   ├── sitemap.ts             # /sitemap.xml
│   └── robots.ts              # /robots.txt
├── components/                # Shared UI components
│   ├── structured-data/       # JSON-LD helpers (LocalBusiness / Event / FAQPage)
│   ├── SiteHeader.tsx
│   ├── SiteFooter.tsx
│   ├── CookieBanner.tsx
│   └── …
├── data/                      # Static data (events.ts, faqs.ts)
├── lib/                       # Pure helpers (site.ts, email-provider.ts, grain.ts)
└── hooks/                     # (empty — placeholder)

public/
├── images/                    # Photography (webp / jpg)
├── videos/                    # Venue loop clips
├── fonts/                     # Self-hosted Neue Haas + Birdie
└── seo/                       # Favicon, OG image
```

### Conventions

- Mobile-first (375px baseline, 320px stress-tested, 1440 desktop)
- UK English everywhere
- GBP for any prices (none currently shown)
- **The home page (`src/app/page.tsx` and its section components in
  `src/components/{Hero,Whatson,Video,Discover,LargeSignposts}Section.tsx`)
  is signed off — preserve layout exactly.**

---

## Working with the data

| Data        | File                          | Notes                                         |
| ----------- | ----------------------------- | --------------------------------------------- |
| Events      | `src/data/events.ts`          | Drives home carousel + `/whats-on` + JSON-LD  |
| FAQs        | `src/data/faqs.ts`            | Drives accordion + FAQPage JSON-LD            |
| Venue info  | `src/lib/site.ts → VENUES`    | Addresses + geo coords for LocalBusiness JSON-LD |
| Brand info  | `src/lib/site.ts → BRAND`     | Phone, email, social handles                  |
| Company reg | `src/lib/site.ts → COMPANY`   | Reads env vars; renders in footer when set    |

Adding a new event: append to `EVENTS` in `src/data/events.ts`. It will
automatically appear in the home page carousel and the `/whats-on` filterable
grid, and emit Event JSON-LD on `/whats-on`.

---

## Forms

Three forms POST to API routes:

| Form            | Page              | API route               |
| --------------- | ----------------- | ----------------------- |
| Venue hire      | `/venue-hire`     | `POST /api/venue-hire`  |
| Members signup  | `/members`        | `POST /api/members/signup` |
| Newsletter      | Footer (sitewide) | `POST /api/newsletter`  |

Currently all three log submissions to the server console (visible in
Vercel function logs) and return `{ ok: true }`. **To wire them to a real
inbox / list**, edit the implementations in `src/lib/email-provider.ts` —
the TODO comments mark where to integrate Resend / Mailchimp / Brevo.

The venue-hire form includes a hidden honeypot field (`company`) that bots
typically fill in; submissions with a non-empty honeypot are silently dropped.

---

## Deployment (Vercel)

1. Push to the production branch (`main`)
2. Vercel auto-deploys
3. Verify the production env vars are set (see `.env.example`)
4. Smoke-test:
   - Home loads, hero renders, CTAs visible
   - Submit a test venue-hire enquiry — check Vercel function logs
   - Check `/sitemap.xml` and `/robots.txt` resolve
   - Paste production URL into Slack/WhatsApp — OG image renders
   - Hit `/random-route` → 404 page renders on-brand

---

## Known follow-ups

The following items are tracked as `// TODO(fin)` comments in code and require
real data before they can be resolved:

1. **Y Bar & Lounge street address** — Michelle to confirm, then update
   `src/lib/site.ts → VENUES.yBarLounge.streetAddress` and the kicker in
   `src/app/venues/y-bar-lounge/page.tsx`
2. **"Open since" year** — re-add as a fourth About stat in
   `src/app/about/page.tsx`
3. **Privacy Policy + Terms** — replace draft bodies with solicitor-reviewed
   copy in `src/app/{privacy-policy,terms}/page.tsx`
4. **Real testimonials / reviews** — pass an array of `ReviewQuote` to
   `<SocialProof quotes={…} />` on About + venue-hire pages to switch from
   the stats variant to the quote-grid variant
5. **Brand reel video** — drop a dedicated reel into
   `public/videos/brand-reel.mp4` and update `BRAND_REEL_SRC` in
   `src/components/VideoSection.tsx` (currently aliased to `y-club-loop.mp4`)

---

## Known-accepted `npm audit` findings

Run `npm audit` and you'll currently see two moderate-severity findings for
`postcss < 8.5.10` (XSS via unescaped `</style>` in stringify output). Both
are inside Next.js's own transitive dependency tree and can only be cleared
when Next publishes a patched minor.

The vulnerability is **non-exploitable in this site** because:

- We never call `postcss.stringify()` on user-provided CSS
- We use Tailwind v4 (its own pipeline) plus a static `globals.css`
- The site has no user-generated content surfaces

Re-evaluate after each Next minor bump — if Next clears them upstream, the
audit will go quiet automatically.

---

## License

Proprietary. © Y, all rights reserved.
