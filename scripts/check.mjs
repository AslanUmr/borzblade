import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { site } from '../content/site.mjs';
import { locales } from '../content/locales.mjs';
const paths = ['/', '/abrek/', '/ru/', '/ru/abrek/', '/tr/', '/tr/abrek/'];
const readPage = p => readFile(`.${p}index.html`,'utf8');
const pages = new Map(await Promise.all(paths.map(async p => [p,await readPage(p)])));
const attr = (tag,key) => tag.match(new RegExp(`\\b${key}="([^"]*)"`))?.[1];
const titles = new Set();
let linkCount = 0, assetCount = 0;
for (const [path,html] of pages) {
  const lang = path.startsWith('/ru/') ? 'ru' : path.startsWith('/tr/') ? 'tr' : 'en';
  assert(html.includes(`<html lang="${lang}">`), `${path} language`);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${path} one H1`);
  assert(!html.includes('noindex'),`${path} indexable`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert(title?.includes(site.studio) && title.includes(site.game.name));
  assert(!titles.has(title),`${path} unique title`);titles.add(title);
  assert(html.includes(`<link rel="canonical" href="${site.origin+path}">`));
  assert(html.includes(`<meta name="description" content="`));
  for (const l of Object.keys(locales)) {
    const target = `${l==='en'?'/':`/${l}/`}${path.endsWith('/abrek/')?'abrek/':''}`;
    assert(html.includes(`<link rel="alternate" hreflang="${l}" href="${site.origin+target}">`));
    assert(pages.get(target).includes(`hreflang="${lang}" href="${site.origin+path}"`));
  }
  assert(html.includes('hreflang="x-default"'));
  if (lang === 'ru') assert(html.includes('Абрек') && html.includes('разработ'));
  if (lang === 'tr') assert(html.includes('geliştir') && html.includes('Kafkasya'));
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/)[1]);
  assert.equal(graph['@context'],'https://schema.org');
  for (const type of ['Organization','WebSite','VideoGame','WebPage','BreadcrumbList']) assert(graph['@graph'].some(n=>n['@type']===type));
  const game = graph['@graph'].find(n=>n['@type']==='VideoGame');
  assert.equal(game.name,site.game.title);assert(game.author['@id'].endsWith('/#studio'));
  for (const invented of ['aggregateRating','offers','datePublished','gamePlatform']) assert(!(invented in game));
  for (const tag of html.match(/<a\b[^>]*>/g)||[]) {
    const href = attr(tag,'href');assert(href);
    if(href.startsWith('https:')) {assert(tag.includes('rel="noopener noreferrer"'));continue;}
    const [pagePath,hash] = href.split('#'), targetPath = pagePath || path;
    if (targetPath.startsWith('/assets/')) {await stat('.'+targetPath);assetCount++;continue;}
    assert(pages.has(targetPath),`${path}: broken ${href}`);
    if (hash) assert(pages.get(targetPath).includes(`id="${hash}"`),`${path}: missing #${hash}`);
    linkCount++;
  }
  for(const tag of html.match(/<img\b[^>]*>/g)||[]) {
    assert(attr(tag,'alt') !== undefined,`${path}: missing alt`);
    const src = attr(tag,'src');if(src) {await stat('.'+src);assetCount++;}
    if(attr(tag,'id')!=='lightbox-image') assert(attr(tag,'width') && attr(tag,'height'));
  }
  for(const tag of html.match(/<source\b[^>]*>/g)||[]) for(const src of attr(tag,'srcset').split(',').map(s=>s.trim().split(' ')[0])) {await stat('.'+src);assetCount++;}
  for(const s of site.support) assert((html.match(new RegExp(s.url.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length >= 3);
  for(const [,url] of site.socials) assert(html.includes(url));
}
const sitemap = await readFile('sitemap.xml','utf8');
assert.equal((sitemap.match(/<loc>/g)||[]).length,6);
for(const p of paths) assert(sitemap.includes(`<loc>${site.origin+p}</loc>`));
const robots = await readFile('robots.txt','utf8');assert(robots.includes('Allow: /') && robots.includes(site.origin+'/sitemap.xml'));assert(!robots.includes('Disallow'));
assert.equal((await readFile('CNAME','utf8')).trim(),'borzblade.com');
const css = await readFile('styles.css','utf8');
for(const path of [...css.matchAll(/url\('([^']+)'\)/g)].map(m=>m[1])) await stat('.'+path);
assert(css.includes('prefers-reduced-motion:reduce') && css.includes(':focus-visible'));
// WCAG normal-text contrast check for primary and secondary text on each main surface.
function luminance(hex) {const a=hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*a[0]+.7152*a[1]+.0722*a[2];}
for(const bg of ['10110f','171815','211816']) for(const fg of ['eee8db','b5b3a8','c3a87b']) assert((luminance(fg)+.05)/(luminance(bg)+.05)>=4.5,`${fg}/${bg} contrast`);
console.log(`PASS: 6 localized pages; ${linkCount} internal links/anchors; ${assetCount} asset references; metadata, reciprocal hreflang, sitemap, robots, JSON-LD structure, support/social URLs, fonts, text contrast.`);
