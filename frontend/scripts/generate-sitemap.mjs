#!/usr/bin/env node
/**
 * Regenerates public/sitemap.xml from the canonical list of indexable public routes.
 * Run automatically before each build via the `prebuild` npm script.
 *
 * Excludes auth, dashboard, admin, booking, and any route with a path parameter,
 * since those are either private or have no canonical URL to index.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://kitlo.net';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, '..', 'public', 'sitemap.xml');

/**
 * Each entry: { path, changefreq, priority }
 * `lastmod` is stamped at generation time so search engines see fresh dates per build.
 */
const routes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/early-access', changefreq: 'weekly', priority: '0.9' },
  { path: '/how-it-works', changefreq: 'monthly', priority: '0.8' },
  { path: '/search', changefreq: 'daily', priority: '0.8' },
  { path: '/list-your-gear', changefreq: 'monthly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/trust', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/lister-agreement', changefreq: 'yearly', priority: '0.3' },
];

const lastmod = new Date().toISOString().slice(0, 10);

const urlEntries = routes
  .map(({ path, changefreq, priority }) => {
    const loc = `${SITE_URL}${path === '/' ? '' : path}`;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, xml, 'utf8');

console.log(`[sitemap] wrote ${routes.length} urls to ${outputPath}`);
