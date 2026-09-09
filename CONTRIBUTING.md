# Contribution Guidelines

## Scope

Keep changes focused on The Rasoiya Street website direction: UI, UX, copy, SEO, responsive behavior, and programmer handoff clarity.

## Before Editing

- Run `npm run check`.
- Keep source references in `docs/references/`.
- Keep runnable website files in `public/`.
- Do not add fake reviews, fake phone numbers, fake addresses, or unverified ratings.

## Copy Rules

- Preserve the pure-veg family dining position.
- Preserve the multi-cuisine breadth: Indian, Asian, Italian, Mexican, chaat, pizza, pasta, desserts, banquets, and catering.
- Avoid making the brand feel like only Indian street food.
- Use direct customer language before decorative phrasing.
- Do not hardcode the number of outlets. Add or update outlet entries in `public/data/outlets.js` and let page sections render from that source.

## SEO Rules

- Each page should have one useful `<title>`.
- Each page should have a meta description.
- Canonical URLs should match the final production domain.
- Structured data must describe visible, true information only.
- Do not add review schema until real visible reviews are added.

## Forms

Forms must not show success unless data is actually captured. Until integrations are complete, keep the pending-integration message visible.
