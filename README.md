# The Rasoiya Street Website Direction

This repository contains a static UI, UX, copy, and SEO direction template for The Rasoiya Street website. It is meant for programmer/designer handoff, not as a finished production website.

## Structure

```text
public/                 Runnable static website mockup
public/assets/          Website images and CSS
public/data/            Shared outlet data used by outlet-dependent UI
docs/handoff/           UI, copy, design, and SEO direction notes
docs/references/        Source PDFs, text extracts, screenshots, and supporting files
scripts/                Local development and validation scripts
```

## Run Locally

```bash
npm run dev
```

Then open:

```text
http://127.0.0.1:4173/
```

## Validate

```bash
npm run check
```

The check verifies basic handoff hygiene: key pages exist, SEO tags are present, stale placeholder phrases are absent, and core assets are in place.

## Handoff Notes

Read [TRS landing page UI/copy/SEO direction](docs/handoff/TRS-landing-page-ui-copy-seo-direction.md) before implementation.

The programmer still needs to add:

- Final outlet addresses and phone numbers in `public/data/outlets.js`
- Actual Google Maps, Swiggy, and Zomato outlet URLs
- Final hero, dish, outlet, founder, banquet, and catering images
- Real reservation, catering, and banquet form integrations
- Final production domain if it differs from `https://www.therasoiyastreet.com`

## Current Pages

- `public/index.html`
- `public/Home.dc.html`
- `public/Menu.dc.html`
- `public/Outlets.dc.html`
- `public/Reserve.dc.html`
- `public/Catering.dc.html`
- `public/Banquets.dc.html`
- `public/Our-Story.dc.html`

## Outlet Updates

Do not hardcode the number of outlets in page copy or layout. To add a new outlet, add one entry to `public/data/outlets.js`; the homepage outlet strip, outlets page, order links, and reservation outlet dropdown are rendered from that shared list.

## Important

Do not publish this as-is. It is a direction template with explicit handoff placeholders where real business data, real assets, or backend integrations are still needed.
