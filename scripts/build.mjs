import { mkdir, writeFile } from 'node:fs/promises';
import { site } from '../content/site.mjs';
import { locales } from '../content/locales.mjs';
import { icon } from './icons.mjs';

const esc = (v) => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy = (s) => s.replaceAll('{game}', site.game.title).replaceAll('{studio}', site.studio);
const lines = (s) => esc(s).replaceAll('\n', '<br>');
const pathFor = (lang, game = false) => `${lang === 'en' ? '/' : `/${lang}/`}${game ? 'abrek/' : ''}`;
const external = (url, label, cls = '') => `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${icon(label)}${label}<span aria-hidden="true"> ↗</span></a>`;
function image(id, lang, cls = '', eager = false) {
  const g = site.gallery.find(g => g.id === id) || site.hero;
  const sizes = g.width > 800 ? [...new Set([480,960,1600].map(w=>Math.min(w,g.width)))] : [g.width];
  return `<picture>${id === 'hero' ? '<source media="(max-width:700px)" type="image/webp" srcset="/assets/optimized/abrek-poster-current-630.webp">' : ''}<source type="image/webp" srcset="${sizes.map(w => `/assets/optimized/${g.file}-${w}.webp ${w}w`).join(', ')}" sizes="${id === 'hero' ? '100vw' : '(max-width: 700px) 100vw, 70vw'}"><img class="${cls}" src="/assets/${g.file}.${g.original}" alt="${esc(locales[lang].gallery[id === 'hero' ? 'poster' : id][1])}" width="${g.width}" height="${g.height}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}
function render(lang, game) {
  const rebrand = v => typeof v === 'string' ? v.replaceAll('Abrek: Path of Honor','{GAME_TITLE}').replaceAll('Abrek',site.game.name).replaceAll('{GAME_TITLE}',site.game.title) : Array.isArray(v) ? v.map(rebrand) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k,val])=>[k,rebrand(val)])) : v;
  const t = rebrand(locales[lang]), home = pathFor(lang), gamePath = pathFor(lang, true), current = game ? gamePath : home;
  const title = copy(game ? t.gameTitle : t.homeTitle), description = copy(game ? t.gameDescription : t.homeDescription);
  const url = site.origin + current;
  const poster = site.gallery.find(g => g.id === 'poster');
  const org = {'@type':'Organization','@id':`${site.origin}/#studio`,name:site.studio,url:site.origin,logo:`${site.origin}/assets/borzblade-logo.png`,sameAs:[...site.socials.map(s => s[1]), ...site.support.map(s => s.url)]};
  const website = {'@type':'WebSite','@id':`${site.origin}/#website`,name:site.studio,url:site.origin,inLanguage:Object.keys(locales),publisher:{'@id':org['@id']}};
  const videoGame = {'@type':'VideoGame','@id':`${site.origin}/abrek/#game`,name:site.game.title,alternateName:lang === 'ru' ? [site.game.name, 'Абрек'] : site.game.name,url:`${site.origin}/abrek/`,description:copy(t.gameDescription),genre:['Action RPG','Soulslike'],image:`${site.origin}/assets/${poster.file}.${poster.original}`,author:{'@id':org['@id']}};
  const page = {'@type':'WebPage','@id':url+'#page',url,name:title,description,inLanguage:lang,isPartOf:{'@id':website['@id']},about:{'@id':videoGame['@id']}};
  const crumbs = {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:t.nav[0],item:site.origin+home},...(game ? [{'@type':'ListItem',position:2,name:site.game.title,item:url}] : [])]};
  const sectionHead = (label, heading, text = '') => `<div class="section-heading"><p class="eyebrow">${esc(label)}</p><h2>${lines(heading)}</h2>${text ? `<p class="section-intro">${esc(text)}</p>` : ''}</div>`;
  const socialLinks = site.socials.map(([name, url]) => external(url, esc(name))).join('');
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#10110f"><meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
${Object.keys(locales).map(l => `<link rel="alternate" hreflang="${l}" href="${site.origin + pathFor(l, game)}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${site.origin + pathFor('en', game)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${site.studio}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}">
<meta property="og:locale" content="${t.locale}">${Object.values(locales).filter(l => l !== t).map(l => `<meta property="og:locale:alternate" content="${l.locale}">`).join('')}
<meta property="og:image" content="${site.origin}/assets/optimized/abrek-social.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(t.gallery.poster[1])}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${site.origin}/assets/optimized/abrek-social.jpg"><meta name="twitter:image:alt" content="${esc(t.gallery.poster[1])}">
${site.verification.google ? `<meta name="google-site-verification" content="${esc(site.verification.google)}">` : ''}${site.verification.yandex ? `<meta name="yandex-verification" content="${esc(site.verification.yandex)}">` : ''}
<link rel="icon" href="/assets/optimized/borzblade-icon.png"><link rel="apple-touch-icon" href="/assets/optimized/borzblade-touch.png"><link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/styles.css"><script src="/script.js" defer></script>
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':[org,website,videoGame,page,crumbs]}).replaceAll('<','\\u003c')}</script>
</head>
<body>
<a class="skip-link" href="#main">${t.skip}</a>
<header class="site-header">
  <a class="brand" href="${home}" aria-label="${site.studio} — ${t.nav[0]}"><img src="/assets/optimized/borzblade-mark.webp" width="44" height="44" alt=""><span>${site.studio}</span></a>
  <button class="menu-toggle" hidden aria-controls="main-nav" aria-expanded="false"><span>${t.menu}</span><span class="menu-lines" aria-hidden="true"></span></button>
  <nav id="main-nav" aria-label="${t.menu}">
    <a href="${home}" ${!game ? 'aria-current="page"' : ''}>${t.nav[0]}</a><a href="${gamePath}" ${game ? 'aria-current="page"' : ''}>${t.nav[1]}</a>
    <a href="#media">${t.nav[2]}</a><a href="#development">${t.nav[3]}</a><a href="#profile">${t.nav[4]}</a><a class="nav-support" href="#support">${t.nav[5]}<span aria-hidden="true"> ↗</span></a>
  </nav>
  <div class="languages" aria-label="${t.language}">${Object.keys(locales).map(l => `<a lang="${l}" hreflang="${l}" href="${pathFor(l, game)}" ${l === lang ? 'aria-current="true"' : ''}>${l.toUpperCase()}</a>`).join('')}</div>
</header>
<main id="main">
  <section class="hero ${game ? 'game-hero' : ''}" id="top" aria-labelledby="hero-title">
    <div class="hero-copy"><p class="eyebrow">${game ? `${site.studio} / ${t.status}` : t.studioLabel}</p>
      <h1 id="hero-title"><span class="abrek-name">${esc(site.game.name)}</span><span class="subtitle">${esc(site.game.subtitle)}</span></h1>
      <div class="small-ornament" aria-hidden="true"><span></span>◇<span></span></div>
      <p class="hero-line">${lines(t.heroLine)}</p><p class="hero-lede">${esc(game ? t.gameHero : t.heroText)}</p>
      <div class="hero-actions"><a class="button primary" href="${game ? '#abrek' : gamePath}">${t.explore}<span aria-hidden="true"> →</span></a><a class="button secondary" href="#support">${t.supportAction}</a></div>
      <div class="hero-support">${site.support.map(s => external(s.url, s.name)).join('<span aria-hidden="true"> / </span>')}</div>
      <a class="scroll-link" href="#abrek"><span aria-hidden="true">↓</span> ${t.scroll}</a>
    </div>
    <div class="hero-art">${image('hero',lang,'',true)}<span class="art-label">${esc(t.gallery.poster[0])} / ${esc(t.working)}</span></div>
  </section>
  <div class="facts-bar"><span class="status"><i aria-hidden="true"></i>${t.status}</span>${t.facts.map(f => `<span>${esc(f)}</span>`).join('')}</div>
  <section class="section world-section" id="abrek">
    <div class="world-copy">${sectionHead(t.introLabel,t.introTitle)}<p>${esc(game ? t.gameIntro : t.intro)}</p><p>${esc(t.introMore)}</p>${!game ? `<a class="text-link" href="${gamePath}">${t.more} <span aria-hidden="true">→</span></a>` : `<p class="world-detail">${esc(t.intro)}</p>`}</div>
    <figure class="world-image">${image('world',lang)}<figcaption>${t.worldCaption}</figcaption></figure>
  </section>
  ${game ? `<section class="section story-section">${sectionHead(t.storyLabel,t.storyTitle)}<div><p>${t.story}</p><p>${t.storyMore}</p></div></section>` : ''}
  <section class="section gameplay-section" id="gameplay">
    ${sectionHead(t.gameplayLabel,t.gameplayTitle,t.gameplayText)}
    <div class="gameplay-layout"><figure class="combat-image">${image('combat',lang)}<figcaption><span>${t.prototype}</span>${t.gallery.combat[0]}</figcaption></figure>
    <div class="feature-list">${(game ? t.features : t.homeFeatures).map(([title,text],i) => { const status = site.featureStatuses[i];return `<article class="feature"><span class="feature-number" aria-hidden="true">0${i+1}</span><div><span class="badge ${status}">${t[status]}</span><h3>${title}</h3><p>${text}</p></div></article>`; }).join('')}${!game ? `<a class="text-link" href="${gamePath}#gameplay">${t.explore} →</a>` : ''}</div></div>
  </section>
  <section class="section media-section" id="media">
    ${sectionHead(t.mediaLabel,t.mediaTitle,t.mediaText)}
    <div class="gallery-filters" hidden aria-label="${t.nav[2]}">${Object.entries(t.filters).map(([key,label]) => `<button data-filter="${key}" aria-pressed="${key === 'all'}">${label}</button>`).join('')}</div>
    <div class="gallery-grid">${site.gallery.map(g => `<figure class="gallery-item gallery-${g.id}" data-category="${g.category}"><a class="gallery-open" href="/assets/${g.file}.${g.original}" data-full="/assets/optimized/${g.file}-${Math.min(g.width,1600)}.webp" aria-label="${t.expand}: ${esc(t.gallery[g.id][0])}">${image(g.id,lang)}<span class="expand-icon" aria-hidden="true">↗</span></a><figcaption><span>${t.gallery[g.id][0]}</span><small>${g.id === 'combat' ? t.prototype : g.id === 'poster' ? t.working : t.progress}</small></figcaption></figure>`).join('')}</div>
    ${site.videos.length ? `<div class="video-grid">${site.videos.map(v => `<button class="video-load" data-video="${esc(v.youtubeId)}" data-title="${esc(v.title[lang])}"><img src="${esc(v.thumbnail)}" alt="${esc(v.alt[lang])}" width="${v.width || 1280}" height="${v.height || 720}" loading="lazy"><span>${t.video}: ${esc(v.title[lang])}</span></button>`).join('')}</div>` : ''}
  </section>
  <section class="section development-section" id="development">
    <div class="development-heading">${sectionHead(t.devLabel,t.devTitle)}<div><p>${t.devText}</p><p class="muted">${t.devNote}</p></div></div>
    <div class="dev-grid">${t.devCards.map(([title,text],i) => `<article><span class="eyebrow">0${i+1} / ${t.progress}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>
    ${site.updates.length ? `<h3>${t.latest}</h3><div class="updates-grid">${site.updates.map(u => `<article>${u.image ? `<img src="${esc(u.image)}" alt="${esc(u.alt[lang])}" width="${u.width || 1920}" height="${u.height || 1080}" loading="lazy">` : ''}<time datetime="${esc(u.date)}">${new Intl.DateTimeFormat(lang,{dateStyle:'long',timeZone:'UTC'}).format(new Date(u.date))}</time><h3>${esc(u.title[lang])}</h3><p>${esc(u.summary[lang])}</p>${external(u.url,t.follow)}</article>`).join('')}</div>` : ''}
    <div class="follow-row"><span>${t.follow}</span>${site.socials.slice(0,2).map(([name,url]) => external(url,name,'text-link')).join('')}</div>
    <div class="compact-support"><p>${t.compactSupport}</p><a href="#support" class="text-link">${t.supportAction}<span aria-hidden="true"> →</span></a></div>
  </section>
  <section class="section about-section" id="profile">
    <div class="studio-intro">${sectionHead(t.aboutLabel,t.aboutTitle)}<p>${t.aboutText}</p></div>
    <div class="team-grid">${t.names.map((name,i) => `<article><span class="role">${t.roles[i]}</span><h3>${name}</h3><p>${t.bios[i]}</p></article>`).join('')}</div>
  </section>
  <section class="support-section" id="support"><div class="section">
    <div class="support-heading">${sectionHead(t.supportLabel,t.supportTitle)}<p>${t.supportText}</p></div>
    <div class="support-grid">${site.support.map((s,i) => `<article class="support-card"><div class="platform-heading"><span class="platform-mark platform-${s.name.toLowerCase()}" aria-hidden="true">${s.mark}</span><h3>${s.name}</h3><span aria-hidden="true">↗</span></div><p>${t.platformDescriptions[i]}</p>${external(s.url,t.platformButtons[i],'button secondary')}</article>`).join('')}</div>
    <p class="support-note">${t.supportNote}</p>
    ${site.rewards.length ? `<details class="rewards"><summary>${t.rewards}</summary>${site.rewards.map(r => `<h3>${esc(r.name[lang])}</h3><p>${esc(r.text[lang])}</p>`).join('')}</details>` : ''}
  </div></section>
  ${game ? `<section class="section faq-section">${sectionHead(t.faqLabel,t.faqTitle)}<div>${t.faq.map(([q,a]) => `<details><summary>${q}</summary><p>${esc(a.replaceAll('Abrek: Path of Honor',site.game.title))}</p></details>`).join('')}</div></section>` : ''}
</main>
<footer class="site-footer" id="contact"><div class="footer-top"><a class="brand" href="${home}"><img src="/assets/optimized/borzblade-mark.webp" width="44" height="44" alt=""><span>${site.studio}</span></a><p>${t.footerText}</p><a href="#top">${t.back} ↑</a></div><div class="footer-links"><div><p class="eyebrow">${t.follow}</p><div class="social-links">${socialLinks}</div></div><div><p class="eyebrow">${t.nav[5]}</p><div class="social-links">${site.support.map(s => external(s.url,s.name)).join('')}</div></div></div><div class="footer-bottom"><span>© ${new Date().getUTCFullYear()} ${t.copyright}</span><a href="${gamePath}">${esc(site.game.title)}</a><span>${t.working}</span></div></footer>
<dialog class="lightbox" aria-label="${t.nav[2]}"><div class="lightbox-top"><span id="lightbox-count" aria-live="polite"></span><button class="lightbox-close" aria-label="${t.close}" autofocus>×</button></div><figure><img id="lightbox-image" alt=""><figcaption id="lightbox-caption" aria-live="polite"></figcaption></figure><div class="lightbox-controls"><button class="lightbox-previous" aria-label="${t.previous}">←</button><button class="lightbox-next" aria-label="${t.next}">→</button></div></dialog>
</body></html>`;
}

for (const lang of Object.keys(locales)) for (const game of [false,true]) {
  const path = pathFor(lang,game).slice(1);
  await mkdir(path || '.',{recursive:true});
  await writeFile(`${path}index.html`,render(lang,game));
}
const urls = Object.keys(locales).flatMap(lang => [false,true].map(game => ({lang,game,url:site.origin+pathFor(lang,game)})));
await writeFile('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.map(({url,game}) => `\n<url><loc>${url}</loc>${Object.keys(locales).map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${site.origin+pathFor(l,game)}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${site.origin+pathFor('en',game)}"/></url>`).join('')}\n</urlset>\n`);
await writeFile('robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
await writeFile('404.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | Borzblade</title><link rel="stylesheet" href="/styles.css"><main class="section"><p class="eyebrow">404 / Borzblade</p><h1>${locales.en.notFound}</h1><p>${locales.en.notFoundText}</p>${Object.keys(locales).map(l=>`<p lang="${l}"><a class="text-link" href="${pathFor(l)}">${locales[l].nav[0]}</a> · <a href="${pathFor(l,true)}">Abrek</a></p>`).join('')}</main></html>`);
console.log('Built 6 localized pages, 404, sitemap.xml and robots.txt.');
