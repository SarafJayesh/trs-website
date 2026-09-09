import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

const root = process.cwd();
const publicDir = join(root, 'public');

const requiredFiles = [
  'index.html',
  'Home.dc.html',
  'Menu.dc.html',
  'Outlets.dc.html',
  'Reserve.dc.html',
  'Catering.dc.html',
  'Banquets.dc.html',
  'Our-Story.dc.html',
  'robots.txt',
  'sitemap.xml',
  'support.js',
  'assets/trs-site.css',
  'assets/menu-concepts.css',
  'assets/menu-concepts.js',
  'assets/outlets.js',
  'data/menu.js',
  'data/outlets.js',
  'assets/hero-photo.png',
  'assets/banquet-photo.png',
  'assets/catering-photo.png'
];

const stalePatterns = [
  /00000/,
  /Address line/,
  /Google review quote/,
  /PASTE_YOUR/,
  /Elevated pure-veg/,
  /The kids' vote/,
  /full-bleed hero/,
  /five (Bengaluru|pure-veg|outlet)/i,
  /all five outlets/i,
  /Programmer handoff/i,
  /connection pending/i,
  /website direction/i,
  /Exact address/i,
  /Phone number to be added/i,
  /outlet photo \/ map/i
];

const htmlPages = requiredFiles.filter((file) => file.endsWith('.html'));
const issues = [];

for (const file of requiredFiles) {
  const path = join(publicDir, file);
  if (!existsSync(path)) issues.push(`Missing required file: public/${file}`);
}

for (const file of ['Menu-Clean.dc.html', 'Menu-Decision.dc.html', 'Menu-Explorer.dc.html']) {
  if (existsSync(join(publicDir, file))) issues.push(`Remove public menu concept page before launch: public/${file}`);
}

for (const file of htmlPages) {
  const path = join(publicDir, file);
  if (!existsSync(path)) continue;

  const html = readFileSync(path, 'utf8');
  if (!/<title>[^<]+<\/title>/i.test(html)) issues.push(`Missing title: public/${file}`);
  if (!/<meta\s+name="description"/i.test(html)) issues.push(`Missing meta description: public/${file}`);
  if (!/<link\s+rel="canonical"/i.test(html)) issues.push(`Missing canonical: public/${file}`);
  if (file !== 'index.html' && !/assets\/trs-site\.css/.test(html)) {
    issues.push(`Missing shared stylesheet: public/${file}`);
  }
  if (/support\.js/.test(html) && !/window\.__resources\s*=\s*true/.test(html)) {
    issues.push(`Design runtime page must disable duplicate self-fetch rendering: public/${file}`);
  }

  for (const pattern of stalePatterns) {
    if (pattern.test(html)) issues.push(`Stale placeholder "${pattern.source}" found in public/${file}`);
  }
}

const handoff = join(root, 'docs', 'handoff', 'TRS-landing-page-ui-copy-seo-direction.md');
if (!existsSync(handoff)) issues.push('Missing handoff direction document.');

const outletDataPath = join(publicDir, 'data', 'outlets.js');
if (existsSync(outletDataPath)) {
  const sandbox = { window: {} };
  runInNewContext(readFileSync(outletDataPath, 'utf8'), sandbox);
  const outlets = sandbox.window.TRS_OUTLETS;
  if (!Array.isArray(outlets) || outlets.length === 0) {
    issues.push('Outlet data must be a non-empty array: public/data/outlets.js');
  } else {
    for (const [index, outlet] of outlets.entries()) {
      for (const field of ['id', 'name', 'opened', 'address', 'timings', 'phone']) {
        if (!outlet[field]) issues.push(`Outlet ${index + 1} is missing ${field} in public/data/outlets.js`);
      }
    }
  }
}

for (const file of ['Home.dc.html', 'Outlets.dc.html', 'Reserve.dc.html', 'Our-Story.dc.html']) {
  const html = readFileSync(join(publicDir, file), 'utf8');
  if (!/assets\/outlets\.js/.test(html)) issues.push(`Missing shared outlet renderer: public/${file}`);
  if (!/data\/outlets\.js/.test(html)) issues.push(`Missing shared outlet data: public/${file}`);
}

const menuHtml = readFileSync(join(publicDir, 'Menu.dc.html'), 'utf8');
if (!/Rasoiya(?:'|&#039;)s Soup of the Season/.test(menuHtml) || !/Rasoiya Tandoor-E-Mehfil/.test(menuHtml)) {
  issues.push('Menu.dc.html must include static menu content for crawlers and no-JS visitors.');
}
if (!/<script type="application\/ld\+json" data-menu-schema>/.test(menuHtml) || !/"@type":"MenuItem"/.test(menuHtml)) {
  issues.push('Menu.dc.html must include Menu/MenuSection/MenuItem structured data.');
}

const outletsHtml = readFileSync(join(publicDir, 'Outlets.dc.html'), 'utf8');
if (!/<script type="application\/ld\+json" data-outlet-schema>/.test(outletsHtml)) {
  issues.push('Outlets page is missing outlet-level Restaurant structured data.');
}
if (!/"telephone":/.test(outletsHtml) || !/"hasMap":/.test(outletsHtml) || !/"menu":/.test(outletsHtml)) {
  issues.push('Outlets page Restaurant schema must include telephone, map and menu details.');
}

const sitemap = readFileSync(join(publicDir, 'sitemap.xml'), 'utf8');
if (/Menu-(Clean|Decision|Explorer)\.dc\.html/.test(sitemap)) {
  issues.push('Sitemap must not include menu concept pages.');
}
for (const path of ['/', '/menu', '/outlets', '/reserve', '/banquets', '/catering', '/our-story']) {
  if (!sitemap.includes(`https://www.therasoiyastreet.com${path}`)) {
    issues.push(`Sitemap is missing ${path}`);
  }
}

const robots = readFileSync(join(publicDir, 'robots.txt'), 'utf8');
if (!/Sitemap: https:\/\/www\.therasoiyastreet\.com\/sitemap\.xml/.test(robots)) {
  issues.push('robots.txt must point to the sitemap.');
}

if (issues.length) {
  console.error('Site check failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('Site check passed.');
