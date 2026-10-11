# Borzblade website

The finished website is a static, multilingual studio and game site. There are no production dependencies, backend services, or client-side translation requirements. All six pages contain their localized text and metadata directly in HTML.

## Local workflow

Requires Node.js 18 or newer. No `npm install` is needed.

```sh
npm run build
npm test
npm run dev
```

Open `http://127.0.0.1:4173/`. Stop the server with Ctrl+C. This is a local preview only.

`npm run build` writes the production HTML, sitemap, robots file, and 404 page to the repository root. These generated files are included so GitHub Pages can serve them directly. **Edit the content and generator, then rebuild; do not maintain the six HTML pages by hand.**

`npm run package` copies the production files and assets into `dist/`, excluding source modules, documentation, and QA artifacts. It does not deploy. It replaces only the generated `dist/` directory. The original supplied images remain in `assets/`.

For an additional structured-data vocabulary audit, run `python scripts/check-schema.py`. This optional check downloads the current official Schema.org vocabulary and uses only Python's standard library. Hosted rich-result validation remains a post-deployment check.

## Content and appearance

| File | Purpose |
| --- | --- |
| `content/site.mjs` | Game name/subtitle, studio identity, official URLs, gallery catalog, feature statuses, optional videos/posts/rewards, verification tokens |
| `content/locales.mjs` | Complete English, Russian, Turkish copy, captions, alt text, metadata templates |
| `scripts/build.mjs` | Shared page template, localized routes, metadata, structured data, sitemap |
| `styles.css` | Charcoal/ivory/crimson/gold design, responsive layouts, reduced motion, self-hosted font definitions |
| `script.js` | Mobile disclosure menu, language context, gallery filters, accessible dialog, optional click-to-load videos |
| `scripts/check.mjs` | Repeatable local link, asset, SEO, structured-data shape, contrast and localization checks |

### Add a screenshot

1. Put a genuine screenshot in `assets/` with a descriptive name, such as `abrek-mountain-pass.jpg`. Prefer JPG for photographs/screenshots; keep PNG for transparency or when required by the source.
2. Add an entry to `site.gallery`:

```js
{ id: 'mountain-pass', file: 'abrek-mountain-pass', original: 'jpg',
  width: 1920, height: 1080, category: 'world' }
```

3. In each `locales.en.gallery`, `locales.ru.gallery`, and `locales.tr.gallery`, add the matching ID with `[caption, descriptiveAltText]`. Categories currently supported are `gameplay`, `world`, and `art`.
4. Run `python scripts/optimize-images.py` with Python and Pillow, then `npm run build` and `npm test`. The optimizer creates 480px, 960px and up-to-1600px WebP variants from all top-level JPG/PNG media, preserving original files. Small art stays at its native width.
5. Check cropping and captions in the browser. New items use the ordinary grid layout; add a CSS class rule if a new item needs a special span. Never register an image that is absent. Empty future content lists stay hidden instead of showing broken placeholders.

The optimizer is optional during ordinary text edits: the optimized assets are already supplied. If installing it separately, install Pillow from PyPI. Self-hosted Literata font files and their OFL license are included; the optional `scripts/download-fonts.py` can refresh them from Google Fonts without adding runtime third-party requests.

### Add a real development update

`site.updates` is currently empty because no verified dated posts were supplied. The site shows an undated factual overview. When a real post exists, add:

```js
{
  date: 'YYYY-MM-DD', // actual publication date
  title: { en: '...', ru: '...', tr: '...' },
  summary: { en: '...', ru: '...', tr: '...' },
  url: 'https://...', // actual published post
  image: '/assets/your-supplied-image.jpg', // optional
  width: 1920, height: 1080, // actual image dimensions
  alt: { en: '...', ru: '...', tr: '...' } // required if image is supplied
}
```

Rebuild and test. Add only statements the post supports. Do not announce dates, demos, platforms, or rewards without confirmation.

### Add an actual video

Add an item to `site.videos` with `youtubeId` (11-character ID), `title: { en, ru, tr }`, a genuine local `thumbnail` URL, its actual `width`/`height`, and `alt: { en, ru, tr }`. The button loads a `youtube-nocookie.com` iframe only after a click. No video is currently displayed, and no fabricated VideoObject metadata is generated. Adding search metadata for a video requires confirmed publication date, description, thumbnail, and video URL.

### Rebrand the game

Edit `site.game.name` and `site.game.subtitle`, then rebuild. Page titles, primary headings, structured data and metadata templates use this central identity; baseline `Abrek` references in rendered prose are also substituted. Keep `/abrek/` as a stable URL unless you plan migration redirects separately. Review the Cyrillic alias `Абрек` in Russian copy and replace poster artwork if its embedded old logo is no longer accurate. Original image captions describe the supplied artwork.

### Translations, feature statuses and links

Edit all three locale entries in `content/locales.mjs` together. Features are ordered consistently; the active labels come from `site.featureStatuses`. Values are `prototype`, `progress`, and `explored`. Changing a label requires checking that the corresponding prose is still accurate.

Edit Patreon and Boosty URLs in `site.support`, and official account URLs in `site.socials`. Rebuild to update every page, footer, hero and structured-data reference. This website integration does not modify external profile pages.

Confirmed supporter information can be added to `site.rewards` as `{ name: {en,ru,tr}, text: {en,ru,tr} }`. A translated expandable component appears only when this list has content. Current prices and benefits remain on the platforms; no tiers have been invented.

### Add a page

Extend the route/render logic in `scripts/build.mjs`, add localized title/description/content, render its real directory and `index.html`, and add it to the sitemap and navigation. Extend the route list in `scripts/check.mjs` and the production-copy list in `scripts/package.mjs`. Use one H1, self-canonicalization, reciprocal language equivalents and `x-default`; keep all useful copy in generated HTML. Verify the new URL locally before publishing.

## Deployment to the existing GitHub Pages site

**Nothing has been published, pushed, or changed in DNS. Publishing requires the owner's explicit approval.**

The production repository is `https://github.com/AslanUmr/borzblade`, with the existing Pages deployment running from `main`. Its CNAME is `borzblade.com`. The live domain's DNS points to GitHub Pages and its HTTP response identifies `Server: GitHub.com`. The original workspace has no remote; a separate checkout under `.qa/deployment` preserves the remote history for deployment preparation. Publishing still requires authenticated write access. Keep the existing repository and domain settings.

After approval:

1. Back up the current production repository, including any ownership verification files, custom domain configuration, and workflow files that were not supplied here.
2. Run `npm run build`, `npm test`, and `npm run package`.
3. For the existing Pages branch/root workflow, copy the contents of `dist/` into the configured published root of that repository. If the existing source is `/docs`, copy into that directory instead. Preserve verification files and existing GitHub configuration. Include `CNAME` containing exactly `borzblade.com` and the empty `.nojekyll` file.
4. Review and commit/push to the existing publishing branch only after approval. If Pages uses GitHub Actions, retain its workflow and make its upload-artifact step publish the prepared static directory. Do not introduce an SPA fallback or server rewrites.
5. Keep the custom domain set to `borzblade.com` and HTTPS enabled in Pages. Preserve existing DNS records; all new paths are ordinary static directories.
6. After the actual deployment succeeds, verify all six routes, `/robots.txt`, `/sitemap.xml`, icons, CSS, fonts, 404 behavior, and both support links at the live domain. Then complete the search-console setup in [docs/SEO-SETUP.md](docs/SEO-SETUP.md).

For rollback, restore the previous published snapshot while preserving its domain and verification configuration. The packaged files also work on other static hosts that serve directory index files and support a custom 404 page.

Read [media recommendations](docs/MEDIA-CHECKLIST.md) and [validation results](docs/QA-REPORT.md) for the remaining editorial and post-deployment checks.
