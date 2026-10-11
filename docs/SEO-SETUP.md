# Search setup and localized URLs

These URLs are prepared locally and become live only after an approved deployment:

| Language | Studio | Game |
| --- | --- | --- |
| English | https://borzblade.com/ | https://borzblade.com/abrek/ |
| Russian | https://borzblade.com/ru/ | https://borzblade.com/ru/abrek/ |
| Turkish | https://borzblade.com/tr/ | https://borzblade.com/tr/abrek/ |

Each page has a unique localized title/description, one H1, an absolute self-canonical URL, reciprocal `en`, `ru`, `tr`, and `x-default` links, matching Open Graph locale metadata, and X preview metadata. English is the `x-default`. Canonicals use trailing slashes and do not collapse localized pages into English. The selector preserves the page type and current hash without IP or browser-language redirects. Substantial Russian/Turkish copy is present in the source HTML.

`https://borzblade.com/sitemap.xml` lists exactly these six canonical pages, with reciprocal language annotations. `https://borzblade.com/robots.txt` allows public crawling and references the sitemap. Images, CSS, JS, fonts and localized directories are not blocked. The 404 page is intentionally `noindex`; public pages are indexable.

JSON-LD describes Organization, WebSite, VideoGame, WebPage and BreadcrumbList. The game's `author` references Borzblade's Organization entity; `author` accepts an Organization in the [Schema.org VideoGame vocabulary](https://schema.org/VideoGame). Game identity stays consistent across translations and the Russian alternate name includes Абрек. No ratings, reviews, offers, release dates or supported platforms are asserted. FAQ content is ordinary accessible HTML; no FAQ rich-result eligibility is claimed. No VideoObject is emitted without verified videos.

## Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console/). Add a **Domain** property for `borzblade.com` if there is not already a verified property you own.
2. Copy Google's exact TXT verification value. At the existing DNS provider, add a TXT record at the domain root (often `@`, or an empty host field, depending on the provider). Keep all existing A/AAAA/CNAME records. Wait for the TXT record to resolve, then press Verify. A Domain property requires DNS verification; Google documents the methods in its [ownership guide](https://support.google.com/webmasters/answer/9008080).
3. Alternatively, use a URL-prefix property for `https://borzblade.com/` and Google's exact supplied HTML file or meta tag. Preserve the downloaded filename and file contents at the requested root path, or put just the supplied token in `site.verification.google` and rebuild. Publish that verification addition only with approval. Keep the token/file in future deployments.
4. After the redesigned site is live, open Sitemaps and submit `https://borzblade.com/sitemap.xml`. Check the resulting status for parsing/fetch problems. See Google's [Sitemaps report guide](https://support.google.com/webmasters/answer/7451001).
5. Inspect `/`, `/abrek/`, `/ru/`, `/ru/abrek/`, `/tr/`, and `/tr/abrek/` individually. Run the live test, inspect rendered HTML/resources, and request indexing for the new key pages. Use the [URL Inspection guide](https://support.google.com/webmasters/answer/9012289). Check Google's selected canonical when indexed data becomes available.
6. Monitor Page indexing and Performance reports. Filter by page to compare English and Russian game URLs and review impressions, queries, clicks and indexing problems over time. No property has been registered or verified in this task.

## Yandex Webmaster

1. Sign into [Yandex Webmaster](https://webmaster.yandex.com/) and add the exact primary site `https://borzblade.com/`, or select your existing verified site.
2. Choose a verification method offered in its ownership screen. For an HTML file, download Yandex's exact verification filename and content and keep it at the requested published root. For a meta tag, put the supplied token in `site.verification.yandex` and rebuild. For DNS, add the exact TXT record Yandex supplies at the domain root, keeping existing hosting records. Deploy file/meta additions only after approval, then press the confirmation button. Yandex's [ownership instructions](https://yandex.com/support/webmaster/en/service/rights) explain the current methods.
3. Submit `https://borzblade.com/sitemap.xml` in the sitemap section and check its fetch and processing status. Yandex documents sitemap submission in [Sitemap files](https://yandex.com/support/webmaster/en/indexing-options/sitemap).
4. Review indexing and crawl diagnostics. Use the available page-check/reindex tools for `/ru/` and `/ru/abrek/` as well as English and Turkish URLs. Confirm that the Russian text, canonical and asset responses are visible to Yandex, and review any excluded-page or server-error reports.
5. Review search queries and impressions for the Russian game URL. Do not assign a misleading regional business location: this is an international game site. No Yandex registration, ownership verification or indexing request has been performed here.

## Expectations and final checks

After deployment, submit the game HTML to [Schema.org Validator](https://validator.schema.org/) and inspect any supported enhancements with Google's URL Inspection or Rich Results Test. VideoGame entity markup helps describe the subject; it does not guarantee a special search result. Local tests cover JSON syntax, graph shape, vocabulary terms, inherited property domains and typed references; hosted rich-result behavior still needs live verification.

Indexing and ranking take time and depend on factors beyond these files. `Abrek` and `Абрек` have meanings outside the game, so specific game/studio queries and consistent external mentions help establish its identity. No first-page ranking or indexing date is promised.
