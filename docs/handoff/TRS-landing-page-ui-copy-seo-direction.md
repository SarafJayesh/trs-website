# The Rasoiya Street Website Direction

Purpose: use this as a UI, UX, copy, and SEO direction note for the programmer or designer. This is not a production-ready build brief; it defines what the current landing-page template should become.

## Core Positioning

The Rasoiya Street should feel like Bengaluru's trusted pure-veg family restaurant for all kinds of family meals.

Use this idea throughout the website:

> One pure-veg table for Indian, Asian, Italian, Mexican, chaat, pizza, pasta, sweets, and family celebrations.

Avoid making the brand feel like only Indian street food. The strength is variety with trust: a broad pure-veg menu, family comfort, and reliable dining across Bengaluru.

## Main Customer Jobs

The website should help a visitor do five things quickly:

1. Understand what The Rasoiya Street is.
2. Find the nearest outlet.
3. Browse the menu without feeling lost.
4. Reserve, order, or enquire for events.
5. Trust the restaurant before visiting.

## Recommended Navigation

Desktop:

- Home
- Menu
- Outlets
- Banquets
- Catering
- Our Story
- Reserve a Table

Mobile:

- Logo left
- Menu icon right
- Sticky bottom actions: Reserve, Order, Directions

Do not show the full desktop navigation in one row on mobile. It currently causes horizontal overflow and cuts off content.

## Homepage Direction

The homepage should sell trust, variety, and action. It should not behave like a long brand brochure. Recommended order:

1. Header
2. Hero
3. Trust strip
4. Outlet finder
5. Menu browsing paths
6. Outlets
7. Banquets and catering
8. Founder story
9. Real proof
10. Final CTA

### 1. Header

Desktop:

- Logo
- Menu
- Outlets
- Banquets
- Catering
- Our Story
- Reserve a Table

Mobile:

- Logo
- Compact menu
- Sticky bottom actions: Menu, Order, Reserve

### 2. Hero

Use a real full-width food or dining image, not a placeholder. Best image: a warm family table with multiple pure-veg dishes visible. The visitor should immediately see food, variety, and a family dining mood.

Recommended hero copy:

H1:

Bengaluru's pure-veg family restaurant for all kinds of meals.

Supporting line:

Indian, Asian, Italian, Mexican, chaat, desserts, banquets and catering - served from one trusted pure-veg kitchen.

Primary CTA:

Reserve a table

Secondary CTAs:

View menu

Order online

Trust line under hero:

100% pure vegetarian | Since 2016 | Bengaluru outlets | Jain options on request | Banquets and catering

### 3. Trust Strip

Keep this compact and factual. Do not over-emphasize outlet count.

Use:

- 100% pure vegetarian
- Serving Bengaluru since 2016
- Dynamic outlet count
- Jain options on request
- Banquets and catering

### 4. Outlet Finder

Put a compact outlet selector near the top of the homepage. It should help a guest choose the nearest outlet and immediately see directions, reservations, delivery links, phone number, and WhatsApp link.

Section title:

Choose your nearest Rasoiya Street.

Subcopy:

Get directions, reserve a table, order online, or use the outlet contact options.

### 5. Menu Browsing Paths

Current direction is good, but make it more customer-led. Use real dish images and a short reason to click.

Section title:

What are you in the mood for today?

Cards:

- North Indian and Tandoor: Paneer tikka, soya chaap, dal makhani, curries, breads.
- Pizza and Pasta: Pizza, pasta, lasagne, garlic bread, cheesy family favourites.
- Asian and Wok: Hakka noodles, Manchurian, fried rice, sizzlers, Thai curry.
- Chaat and Street Bites: Malai golgappe, pav bhaji, samosa chole, nachos.
- Desserts and Drinks: Rabdi faluda, kulfi, sizzling brownie, mocktails and shakes.
- Chef's Signatures: TRS specials and house creations made for sharing.

### 6. Outlets

Use the shared outlet data for all outlet content. Keep addresses exact. Phone number and WhatsApp link fields may remain clean placeholders during design review, but they must be replaced before launch.

Each outlet card should show:

- Outlet name
- Exact address
- Phone number
- Opening hours
- Directions button
- Reserve button
- Swiggy and Zomato links if available for that outlet

Implementation rule:

- Store outlets in one structured source and render outlet cards, order links, reservation options, and story outlet milestones from it. In this static direction project, that source is `public/data/outlets.js`.

Homepage copy:

Find your nearest table

Subcopy:

Pick the closest Rasoiya Street outlet for directions, reservations, or delivery links.

### 7. Banquets And Catering

Keep Banquets and Catering as separate cards. They are commercial conversion paths and should be visible before the story section.

Banquets card:

Pure-veg venues for birthdays, receptions, kitty parties, anniversaries, and corporate gatherings.

CTA:

Enquire for a date

Catering card:

The same Rasoiya Street kitchen at your home, office, or celebration venue.

CTA:

Request catering quote

### 8. Story Section

Keep the founder story, but do not make it too heavy on the homepage. Use a short emotional version and link to the full story.

Recommended copy:

Built from a promise. Served with care since 2016.

In 1990, Leela Gupta's family story began with a restaurant in Mount Abu. In 2016, that promise became The Rasoiya Street in Bengaluru - a pure-veg kitchen built on care, consistency, and variety.

CTA:

Read our story

### 9. Real Proof

Do not use placeholder review copy. Either remove reviews until real ones are available or use verified short customer quotes.

Good review format:

"Great pure veg family restaurant with options for everyone."

Name, outlet, source

Do not add review schema unless the reviews are real, visible on the page, and policy-compliant.

### 10. Final CTA

End with one simple conversion block:

One pure-veg table for the whole family.

Buttons:

- Reserve a table
- View menu
- Find outlet

## Menu Page Direction

The current menu page has good breadth, but it reads like a list. Improve scanability and decision-making.

Recommended structure:

- Intro: Pure veg, Jain options, outlet availability
- Sticky section headers
- Category sections with 2 to 3 columns on desktop, 1 column on mobile
- Add small tags where useful: Jain on request, Spicy, Signature, Family Favourite
- Add prices only if prices are current and outlet-consistent
- Add item descriptions only for unfamiliar items or signatures

Do not create top-level audience buckets like kids, comfort, or sharing. Keep the menu organized by cuisine and dish type.

Recommended category names:

- Chef's Signatures
- Tandoor and Starters
- Italian and Mexican
- Wok and Asian
- Sizzlers and Combos
- Soups and Salads
- Chaat and Street Bites
- Curries and Dal
- Rice and Biryani
- Breads
- Desserts
- Beverages

## Outlets Page Direction

This is a high-intent page. It should be functional before decorative.

Above the fold:

H1:

Find The Rasoiya Street near you

Subcopy:

Choose your nearest Bengaluru outlet for directions, reservations, phone numbers, and delivery links.

Each outlet card:

- Real outlet photo or map preview
- Exact address
- Phone
- Timing
- Direction link to Google Maps
- Reserve CTA
- Swiggy and Zomato deep links

Avoid generic links to swiggy.com or zomato.com. Use the actual outlet URLs.

## Reserve Page Direction

The current form should not show success unless the enquiry is actually captured.

Recommended copy:

H1:

Reserve your table at The Rasoiya Street

Subcopy:

Choose an outlet, date, time, and party size. Our team will confirm by phone or WhatsApp.

Form fields:

- Full name
- Phone number
- Outlet
- Date
- Time
- Party size
- Special request

UX requirements:

- Use visible labels, not only placeholders.
- Confirm how the reservation will be handled.
- Add phone/WhatsApp fallback.
- Add error state if the form fails.
- Add success state only after the enquiry is actually captured.

## Catering Page Direction

This page should sell confidence and operational reliability.

H1:

Pure-veg catering across Bengaluru

Subcopy:

From house gatherings to corporate lunches and full-scale functions, The Rasoiya Street brings its pure-veg kitchen to your venue.

Sections:

- What we cater: homes, offices, functions, weddings
- What makes it reliable: custom menus, Jain options, on-time setup, full-service support
- How it works: share details, get menu and quote, we cater on the day
- Enquiry form

Add proof:

- Event photos
- Guest count range
- Areas served
- Sample menu categories
- Service formats: buffet, live counters, packed meals, plated service if available

## Banquets Page Direction

This page should make venue selection easy.

H1:

Pure-veg banquet venues for family celebrations

Subcopy:

Host birthdays, receptions, kitty parties, anniversaries, and corporate gatherings with pure-veg menus and full event support.

Each venue card should show:

- Venue name
- Location
- Capacity
- Seating formats
- Included support
- Photos
- Check availability CTA

Avoid vague "more locations are on the way" unless expansion is confirmed and useful to customers.

## Our Story Page Direction

Keep it human and concise. The current founder story is a strong trust asset.

Recommended H1:

Built from a promise. Served with care since 2016.

Key message:

Rasoiya means care in the kitchen. Street means many choices side by side. The Rasoiya Street brings both together: trust, variety, and a pure-veg table where mixed family cravings can meet.

Use:

- Founder photo if available
- Timeline
- Values: Trust, Variety, Elevation
- Link back to reserve/menu

## Visual Design Direction

The current warm premium-casual direction works. Improve it with stronger real-world restaurant signals.

Keep:

- Warm off-white background
- Deep brown text
- Terracotta CTA color
- Teal as secondary accent
- Elegant serif headings
- Clean sans-serif body text

Improve:

- Replace all placeholder blocks with real photos.
- Reduce huge empty hero space on mobile.
- Use food photos that show actual dishes clearly.
- Keep cards simple with 6 to 8 px radius.
- Avoid decorative graphics that do not help customers decide.
- Use consistent spacing between sections.
- Use stronger mobile hierarchy: one column, readable headings, full-width CTAs.

Mobile rules:

- No horizontal scrolling.
- Header collapses into mobile menu.
- Homepage hero CTA buttons stack vertically.
- Menu category chips scroll horizontally.
- Outlet cards become one column.
- Forms become one column.
- Footer becomes one column.
- Font sizes should be set by breakpoint, not by viewport width.

## SEO Direction

SEO should focus on local restaurant search and intent-based pages.

Primary keyword themes:

- pure veg restaurant Bengaluru
- vegetarian family restaurant Bengaluru
- pure veg restaurant near me
- The Rasoiya Street menu
- The Rasoiya Street outlets
- pure veg catering Bengaluru
- vegetarian banquet hall Bengaluru
- Jain food options Bengaluru

### Recommended Page Titles And Meta Descriptions

Home title:

The Rasoiya Street | Pure Veg Family Restaurant in Bengaluru

Home meta:

Visit The Rasoiya Street for pure-veg family dining across Bengaluru. Explore Indian, Asian, Italian, Mexican, chaat, desserts, banquets, and catering.

Menu title:

Menu | The Rasoiya Street Pure Veg Restaurant Bengaluru

Menu meta:

Explore The Rasoiya Street menu: tandoor, North Indian curries, pizza, pasta, Indo-Chinese, chaat, sizzlers, desserts, beverages, and Jain options.

Outlets title:

Outlets | The Rasoiya Street Bengaluru Locations

Outlets meta:

Find The Rasoiya Street outlets in Bengaluru with addresses, timings, phone numbers, directions, reservations, and online ordering links.

Reserve title:

Reserve a Table | The Rasoiya Street Bengaluru

Reserve meta:

Reserve a table at The Rasoiya Street, a pure-veg family restaurant across Bengaluru. Choose your outlet, date, time, and party size.

Catering title:

Pure Veg Catering in Bengaluru | The Rasoiya Street

Catering meta:

Book pure-veg catering in Bengaluru for house parties, office lunches, functions, and celebrations with custom menus and Jain options.

Banquets title:

Pure Veg Banquet Venues in Bengaluru | The Rasoiya Street

Banquets meta:

Host birthdays, receptions, kitty parties, anniversaries, and corporate events at The Rasoiya Street's pure-veg banquet venues in Bengaluru.

Our Story title:

Our Story | The Rasoiya Street

Our Story meta:

Read the story of The Rasoiya Street, a pure-veg family dining brand in Bengaluru built on care, variety, and trust since 2016.

### Technical SEO Requirements For Programmer

- Use clean URLs if possible: `/`, `/menu`, `/outlets`, `/reserve`, `/catering`, `/banquets`, `/our-story`.
- Add one unique `<title>` per page.
- Add one unique meta description per page.
- Add canonical URLs.
- Add Open Graph tags for social sharing.
- Add descriptive image alt text.
- Add XML sitemap and robots.txt.
- Add schema markup as JSON-LD.
- Ensure rendered content is crawlable without depending on fragile client-side placeholders.
- Keep fake ratings, fake reviews, fake phone numbers, and placeholder addresses out of production.
- Keep outlet count agnostic. Add, remove, or edit outlets from a single structured source such as `public/data/outlets.js`, then render outlet cards, order links, and reservation options from that source.

### Structured Data Direction

Use JSON-LD:

- `Organization` on the homepage.
- `Restaurant` or `LocalBusiness` for each outlet.
- `PostalAddress`, `geo`, `telephone`, `openingHoursSpecification`, `servesCuisine`, and `url` where real data is available.
- `BreadcrumbList` on inner pages.
- `Menu` and `MenuSection` if the menu is represented structurally.

Only mark up information that is visible and true on the page. Do not add review or aggregate rating schema unless reviews and ratings are real, first-party/allowed, and visible to users.

Reference sources for the programmer:

- Google title link guidance: https://developers.google.com/search/docs/appearance/title-link
- Google meta snippet guidance: https://developers.google.com/search/docs/appearance/snippet
- Google local business structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google structured data intro: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Schema.org Restaurant type: https://schema.org/Restaurant

## Assets Needed Before Final Design

- Official logo files
- Hero food/table photo
- 6 to 10 strong dish photos
- Founder photo
- Outlet photos or map previews
- Exact outlet addresses
- Phone numbers
- Google Maps links
- Swiggy/Zomato outlet links
- Real reviews with source and outlet
- Banquet venue photos
- Catering/event photos

## Immediate Programmer Handoff Priorities

1. Build a mobile-first responsive layout.
2. Replace desktop navigation with a mobile menu under 768 px.
3. Add real page titles, meta descriptions, canonical URLs, and Open Graph tags.
4. Replace placeholder outlet/contact/order data.
5. Make enquiry forms real or route to WhatsApp/call as a temporary fallback.
6. Add real imagery before presenting the site as customer-facing.
7. Add local business structured data once exact outlet data is available.
