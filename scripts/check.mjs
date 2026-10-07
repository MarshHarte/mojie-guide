import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const brand=JSON.parse(await fs.readFile(path.join(root,'brand.json'),'utf8'));
const html=await fs.readFile(path.join(root,'index.html'),'utf8');
const readme=await fs.readFile(path.join(root,'README.md'),'utf8');
assert.equal((html.match(/<h1\b/g)||[]).length,1,'one primary heading');
assert.equal((html.match(/class="button route-link"/g)||[]).length,brand.routes.filter(route=>route.recommendable).length);
assert.equal(new Set(brand.routes.map(r=>r.url)).size,brand.routes.length,'no duplicated routes');
for (const route of brand.routes) {
  if (route.recommendable) {
    assert(html.includes(`href="${route.url}"`),'visible HTML link missing');
    assert(readme.includes(`](${route.url})`),'README link mismatch');
    const link=html.match(new RegExp(`<a class="button route-link"[^>]+href="${route.url.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"[^>]*>`))?.[0];
    assert(link?.includes('rel="sponsored noopener noreferrer"'),'promotion link must be marked');
  } else {
    assert(!html.includes(`href="${route.url}"`),'held route must not be recommended');
    assert(!readme.includes(`](${route.url})`),'held route leaked into README as an entrance');
  }
  assert.equal(new URL(route.url).hostname,route.domain,'domain text must match destination');
}
for (const match of html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)) {
  if (/^(https?:|mailto:)/.test(match[1])) continue;
  await fs.access(path.join(root,match[1].split('#')[0]));
}
assert(!/\{\{[A-Z_]+\}\}/.test(html+readme),'unresolved template token');
assert(readme.includes(brand.linksUpdatedAt) && html.includes(`datetime="${brand.linksUpdatedAt}"`),'address update date mismatch');
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(html.includes(`id="${match[1]}"`),'missing section target: '+match[1]);
for (const match of html.matchAll(/aria-(?:labelledby|describedby)="([^"]+)"/g)) {
  for (const id of match[1].split(/\s+/)) assert(html.includes(`id="${id}"`),'missing accessible description: '+id);
}
for (const match of readme.matchAll(/\]\(([^)]+)\)/g)) {
  if (/^(?:https?:|#)/.test(match[1])) continue;
  await fs.access(path.join(root,match[1].split('#')[0]));
}
assert(!/https?:\/\/[^\s"'<>]+\/admin(?:[/?#\s"'<>]|$)|\bsite_ids\b|to\.iix\.im|[?&](?:invite|invite_code|ref|referral)=/i.test(html+readme),'private admin or borrowed promotion data');
assert(!/meta[^>]+http-equiv=["']refresh/i.test(html),'no forced redirect');
assert(!/GoogleAnalytics|googletagmanager|gtag\(/.test(html),'no unconfigured tracking');
if (brand.siteUrl) {
  assert(html.includes(`rel="canonical" href="${brand.siteUrl}"`));
  assert((await fs.readFile(path.join(root,'sitemap.xml'),'utf8')).includes(`<loc>${brand.siteUrl}</loc>`));
  const metadata=JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1]||'null');
  assert.equal(metadata?.['@type'],'WebPage');
  assert.equal(metadata.url,brand.siteUrl);
  assert.equal(metadata.dateModified,brand.updatedAt);
  assert(!metadata.aggregateRating && !metadata.offers,'no unsupported review or product claims');
  await fs.access(path.join(root,'assets/social-preview.png'));
} else {
  assert(!html.includes('rel="canonical"'),'unconfigured canonical');
  assert(!html.includes('application/ld+json'),'unconfigured structured metadata');
  assert(!await fs.stat(path.join(root,'sitemap.xml')).catch(()=>null),'stale sitemap');
}
console.log('PASS: entrance states, date consistency, references, assets, metadata and public content.');
