import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

const root = process.cwd();
const publicDir = join(root, 'public');
const baseUrl = 'https://www.therasoiyastreet.com';
const checkOnly = process.argv.includes('--check');

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
})[char]);

const slugPart = (value) => String(value)
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const loadWindowValue = (relativePath, key) => {
  const sandbox = { window: {} };
  runInNewContext(readFileSync(join(publicDir, relativePath), 'utf8'), sandbox);
  return sandbox.window[key];
};

const readPublic = (relativePath) => readFileSync(join(publicDir, relativePath), 'utf8');

const writeOrCheck = (relativePath, content) => {
  const path = join(publicDir, relativePath);
  if (checkOnly) {
    if (!existsSync(path)) throw new Error(`Missing generated file: public/${relativePath}`);
    const current = readFileSync(path, 'utf8');
    if (current !== content) throw new Error(`Generated file is stale: public/${relativePath}`);
    return;
  }
  writeFileSync(path, content);
};

const itemRow = (item) => {
  const tags = (item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
  const description = item.description ? `<div class="concept-item-description">${escapeHtml(item.description)}</div>` : '';
  const tagBlock = tags ? `<div class="concept-tags">${tags}</div>` : '';

  return `
      <div class="concept-item">
        <div class="concept-item-name">${escapeHtml(item.name)}</div>
        <div class="concept-item-meta">${description}${tagBlock}</div>
      </div>`;
};

const groupedRows = (section) => {
  let currentGroup = '';
  return section.items.map((item) => {
    const groupTitle = item.group && item.group !== currentGroup
      ? `
        <div class="concept-subhead" id="${section.id}-${slugPart(item.group)}">${escapeHtml(item.group)}</div>`
      : '';
    currentGroup = item.group || currentGroup;
    return `${groupTitle}${itemRow(item)}`;
  }).join('');
};

const sectionBlock = (section) => `
      <section class="concept-section" id="${section.id}">
        <div class="concept-section-header">
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.copy)}</p>
        </div>
        <div class="concept-list">${groupedRows(section)}
        </div>${section.note ? `
        <p class="concept-note">${escapeHtml(section.note)}</p>` : ''}
      </section>`;

const renderMenuMain = (menu) => `
        <section class="concept-hero">
          <div>
            <div class="concept-label">Full menu</div>
            <h1>The complete pure-veg menu.</h1>
            <p>Browse tandoor, North Indian curries, pizza, pasta, Asian favourites, chaat, sizzlers, breads and desserts. Jain preparations are available on request.</p>
          </div>
          <div class="concept-actions">
            <a href="Reserve.dc.html">Reserve a table</a>
            <a href="Outlets.dc.html#order">Order online</a>
          </div>
        </section>
        <section class="concept-explorer">
          <div class="concept-explorer-main">${menu.sections.map(sectionBlock).join('')}
          </div>
        </section>
        <section class="concept-cta">
          <h2>Hungry yet? Book a table or order from your nearest outlet.</h2>
          <div class="concept-actions">
            <a href="Reserve.dc.html">Reserve a table</a>
            <a href="Outlets.dc.html#order">Order online</a>
          </div>
        </section>`;

const menuItemSchemaNode = (item, section, index) => {
  const node = {
    '@type': 'MenuItem',
    '@id': `${baseUrl}/menu#${section.id}-${index + 1}-${slugPart(item.name)}`,
    name: item.name
  };

  if (item.description) node.description = item.description;

  if (item.tags?.length) {
    node.additionalProperty = item.tags.map((tag) => ({
      '@type': 'PropertyValue',
      name: 'Tag',
      value: tag
    }));
  }

  return node;
};

const menuSectionSchemaNode = (section) => {
  const node = {
    '@type': 'MenuSection',
    '@id': `${baseUrl}/menu#${section.id}`,
    name: section.title
  };

  if (section.copy) node.description = section.copy;

  const groups = [];
  for (const [index, item] of section.items.entries()) {
    const groupName = item.group || 'Items';
    let group = groups.find((entry) => entry.name === groupName);
    if (!group) {
      group = { name: groupName, items: [] };
      groups.push(group);
    }
    group.items.push(menuItemSchemaNode(item, section, index));
  }

  if (groups.length > 1 || groups[0]?.name !== 'Items') {
    node.hasMenuSection = groups.map((group) => ({
      '@type': 'MenuSection',
      '@id': `${baseUrl}/menu#${section.id}-${slugPart(group.name)}`,
      name: group.name,
      hasMenuItem: group.items
    }));
  } else {
    node.hasMenuItem = groups[0]?.items || [];
  }

  return node;
};

const menuSchema = (menu) => ({
  '@context': 'https://schema.org',
  '@type': 'Menu',
  '@id': `${baseUrl}/menu#menu`,
  name: 'The Rasoiya Street Menu',
  url: `${baseUrl}/menu`,
  inLanguage: 'en-IN',
  hasMenuSection: menu.sections.map(menuSectionSchemaNode)
});

const updateMenuPage = (menu) => {
  const current = readPublic('Menu.dc.html');
  const nextMain = `<main data-menu-concept-root>\n${renderMenuMain(menu)}\n      </main>`;
  const schemaScript = `<script type="application/ld+json" data-menu-schema>${JSON.stringify(menuSchema(menu))}</script>`;
  const existingSchema = /<script type="application\/ld\+json" data-menu-schema>[\s\S]*?<\/script>/;
  let next = current.replace(/<main data-menu-concept-root>[\s\S]*?<\/main>/, nextMain);
  next = existingSchema.test(next)
    ? next.replace(existingSchema, schemaScript)
    : next.replace(/(<script type="application\/ld\+json">[\s\S]*?BreadcrumbList[\s\S]*?<\/script>)/, `$1\n    ${schemaScript}`);
  writeOrCheck('Menu.dc.html', next);
};

const addressForSchema = (outlet) => ({
  '@type': 'PostalAddress',
  streetAddress: outlet.streetAddress || outlet.address,
  addressLocality: outlet.locality || 'Bengaluru',
  addressRegion: outlet.region || 'Karnataka',
  postalCode: outlet.postalCode,
  addressCountry: outlet.country || 'IN'
});

const openingHours = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  opens: '11:00',
  closes: '23:00'
};

const outletSchemaNode = (outlet) => {
  const node = {
    '@type': 'Restaurant',
    '@id': `${baseUrl}/outlets#${outlet.id}`,
    name: outlet.fullName || `The Rasoiya Street ${outlet.name}`,
    url: `${baseUrl}/outlets#${outlet.id}`,
    image: `${baseUrl}/assets/hero-photo.png`,
    priceRange: 'Moderate',
    servesCuisine: ['Indian', 'Asian', 'Italian', 'Mexican', 'Vegetarian'],
    acceptsReservations: true,
    hasMenu: `${baseUrl}/menu`,
    menu: `${baseUrl}/menu`,
    hasMap: outlet.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(outlet.mapsQuery || outlet.address || outlet.name)}`,
    address: addressForSchema(outlet),
    openingHoursSpecification: [openingHours],
    areaServed: {
      '@type': 'City',
      name: 'Bengaluru'
    }
  };

  if (/^tel:/.test(outlet.phoneHref || '')) {
    node.telephone = outlet.phoneHref.replace(/^tel:/, '');
  }

  const sameAs = [outlet.zomatoUrl, outlet.swiggyUrl].filter((url) => /^https?:\/\//.test(url || ''));
  if (sameAs.length) node.sameAs = sameAs;

  return node;
};

const updateOutletSchema = (outlets) => {
  const current = readPublic('Outlets.dc.html');
  const schema = {
    '@context': 'https://schema.org',
    '@graph': outlets.map(outletSchemaNode)
  };
  const script = `<script type="application/ld+json" data-outlet-schema>${JSON.stringify(schema)}</script>`;
  const existing = /<script type="application\/ld\+json" data-outlet-schema>[\s\S]*?<\/script>/;
  const next = existing.test(current)
    ? current.replace(existing, script)
    : current.replace(/(<script type="application\/ld\+json">[\s\S]*?<\/script>)/, `$1\n${script}`);
  writeOrCheck('Outlets.dc.html', next);
};

const sitemap = () => {
  const pages = [
    ['/', '1.0'],
    ['/menu', '0.9'],
    ['/outlets', '0.9'],
    ['/reserve', '0.8'],
    ['/banquets', '0.8'],
    ['/catering', '0.8'],
    ['/our-story', '0.6']
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([path, priority]) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
};

const robots = () => `User-agent: *
Allow: /
Disallow: /Menu-Clean.dc.html
Disallow: /Menu-Decision.dc.html
Disallow: /Menu-Explorer.dc.html

Sitemap: ${baseUrl}/sitemap.xml
`;

const menu = loadWindowValue('data/menu.js', 'TRS_MENU');
const outlets = loadWindowValue('data/outlets.js', 'TRS_OUTLETS');

if (!menu?.sections?.length) throw new Error('Menu data is missing sections.');
if (!Array.isArray(outlets) || outlets.length === 0) throw new Error('Outlet data is missing.');

updateMenuPage(menu);
updateOutletSchema(outlets);
writeOrCheck('sitemap.xml', sitemap());
writeOrCheck('robots.txt', robots());

if (!checkOnly) console.log('Static site assets generated.');
