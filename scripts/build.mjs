import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderPerformance} from './performance.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brand = JSON.parse(await fs.readFile(path.join(root, 'brand.json'), 'utf8'));
const performance = JSON.parse(await fs.readFile(path.join(root, 'performance.json'), 'utf8'));
const performanceContent = renderPerformance(performance);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isPublicHttps = value => {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.') || /[\s<>"|]/.test(value)) throw new Error('Expected a public HTTPS URL');
  return url;
};
for (const route of brand.routes) {
  const url = isPublicHttps(route.url);
  if (url.hostname !== route.domain) throw new Error('Visible domain must match link: ' + route.domain);
  if (typeof route.recommendable !== 'boolean') throw new Error('Each route needs an explicit recommendation state');
  if (route.recommendable) {
    if (!brand.promotion?.registrationService?.trim() || !brand.promotion?.registrationHost?.trim()) throw new Error('Active routes require a configured registration service and host');
    if (route.registrationBrandObserved !== brand.promotion.registrationService || route.registrationHostObserved !== brand.promotion.registrationHost) throw new Error('Registration destination must match the configured service and expected host');
  }
}
for (const field of ['updatedAt','linksUpdatedAt','linksCheckedAt']) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(brand[field]) || Number.isNaN(Date.parse(brand[field]))) throw new Error('Invalid date: '+field);
}
const activeRoutes = brand.routes.filter(route => route.recommendable);
const heldRoutes = brand.routes.filter(route => !route.recommendable);
let siteMeta = '';
if (brand.siteUrl) {
  const site = isPublicHttps(brand.siteUrl);
  if (site.search || site.hash || !site.pathname.endsWith('/')) throw new Error('siteUrl must end in / and have no query or fragment');
  siteMeta = `<link rel="canonical" href="${escape(site.href)}">\n  <meta property="og:url" content="${escape(site.href)}">`;
  const imageUrl = new URL('assets/social-preview.png', site).href;
  const pageData = {'@context':'https://schema.org','@type':'WebPage',url:site.href,name:brand.title,description:brand.description,inLanguage:'zh-CN',dateModified:brand.updatedAt};
  siteMeta += `\n  <meta property="og:image" content="${escape(imageUrl)}">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n  <meta property="og:image:alt" content="魔戒机场 Mojie 入口导航与使用指南">\n  <meta name="twitter:card" content="summary_large_image">\n  <script type="application/ld+json">${JSON.stringify(pageData).replace(/</g,'\\u003c')}</script>`;
  await fs.writeFile(path.join(root,'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(site.href)}</loc><lastmod>${escape(brand.updatedAt)}</lastmod></url></urlset>\n`);
} else {
  await fs.rm(path.join(root,'sitemap.xml'), {force:true});
}
if (brand.repositoryUrl) {
  const repository = isPublicHttps(brand.repositoryUrl);
  if (repository.hostname !== 'github.com' || !/^\/[\w.-]+\/[\w.-]+\/?$/.test(repository.pathname)) throw new Error('repositoryUrl must point to a GitHub repository');
}
const routeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="3" width="8" height="6" rx="2"/><path d="M12 9v5M5 14h14M5 14v3m14-3v3"/><rect x="2" y="17" width="6" height="4" rx="1"/><rect x="16" y="17" width="6" height="4" rx="1"/></svg>';
const copyIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/></svg>';
const cards = brand.routes.map(route => `<article class="route-card" aria-labelledby="route-${escape(route.id)}">
        <div class="card-top"><span class="route-icon">${routeIcon}</span><span class="route-number">${escape(route.id)}</span></div>
        <h3 id="route-${escape(route.id)}">${escape(route.name)}</h3>
        <p class="route-domain">${escape(route.domain)}</p>
        ${route.recommendable ? `<a class="button route-link" href="${escape(route.url)}" target="_blank" rel="sponsored noopener noreferrer" aria-label="打开${escape(route.name)} ${escape(route.domain)}，新窗口">打开入口 <span aria-hidden="true">↗</span></a><button class="copy-domain" type="button" data-copy="${escape(route.url)}" aria-label="复制${escape(route.name)}地址">${copyIcon}复制地址</button>` : '<p class="route-unavailable">入口维护中，请使用其他地址。</p>'}
      </article>`).join('\n');
const values = {
  TITLE:escape(brand.title), DESCRIPTION:escape(brand.description), ADDRESS_DATE:escape(brand.linksUpdatedAt),
  OPERATOR_STATEMENT:escape(brand.operatorStatement), ROUTE_CARDS:cards, ACTIVE_ROUTE_COUNT:String(activeRoutes.length), SITE_META:siteMeta,
  OFFICIAL_ADDRESS_TEXT:escape(brand.officialAddressText), PERFORMANCE_MD:performanceContent.markdown,
  REPOSITORY_LINK:brand.repositoryUrl?`<a href="${escape(brand.repositoryUrl)}" target="_blank" rel="noopener noreferrer">GitHub 资料</a>`:'',
  LIVE_LINK:brand.siteUrl?`[查看魔戒访问指南网页](${brand.siteUrl})`:'',
  ROUTE_TABLE:['| 入口 | 访问地址 |','| --- | --- |',...brand.routes.map(route=>`| ${route.name}${route.recommendable?'':'（维护中）'} | ${route.recommendable?`[${route.domain}](${route.url})`:'`'+route.domain+'`'} |`)].join('\n')
};
for (const file of ['index.html','README.md']) {
  const template=await fs.readFile(path.join(root,'templates',file),'utf8');
  const output=template.replace(/\{\{([A-Z_]+)\}\}/g,(_,key)=>{
    if (!(key in values)) throw new Error('Unknown template field: '+key);
    return values[key];
  });
  await fs.writeFile(path.join(root,file),file.endsWith('.md')?output.replace(/\n{3,}/g,'\n\n'):output);
}
await fs.writeFile(path.join(root,'robots.txt'),'User-agent: *\nAllow: /\n'+(brand.siteUrl?`Sitemap: ${new URL('sitemap.xml',brand.siteUrl).href}\n`:''));
console.log(`Built ${brand.name}: ${activeRoutes.length} active entrances, ${heldRoutes.length} held records. Canonical URL ${brand.siteUrl?'configured':'not configured (local draft)'}.`);
