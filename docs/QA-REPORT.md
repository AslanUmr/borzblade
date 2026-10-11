# Validation report — 11 October 2026

## Completed checks

- `npm run build`, `npm test`, and `npm run package` complete successfully. Node syntax checks pass for client JavaScript and the generator.
- Six pages served locally with HTTP 200, along with sitemap.xml, robots.txt and CNAME.
- Repeatable static check: 114 internal links/anchors and 192 image/asset references resolve. All supplied social/support URLs are preserved; external links use `noopener noreferrer`.
- All pages have one H1, unique localized titles, descriptions, absolute self-canonicals, reciprocal language annotations and `x-default`. All six URLs appear in the sitemap. No public page contains `noindex`.
- Russian and Turkish content is directly present in generated HTML. The site has no client-side translation dependency. Existing homepage anchors `#abrek`, `#profile`, `#contact` remain available.
- JSON-LD parses on all pages and has the expected Organization, WebSite, VideoGame, WebPage and BreadcrumbList entities. VideoGame links to the studio via `author`; no invented offers, dates, ratings or platforms appear. The optional `scripts/check-schema.py` checks types, inherited property domains and typed graph references against the current official Schema.org vocabulary.
- Normal text colors (ivory, secondary gray, gold) exceed WCAG 4.5:1 against the main charcoal/panel/support backgrounds. Focus styles, alt text, native dialog semantics, skip link and reduced-motion rules are included.
- Browser responsive measurements on all six routes at 320, 375, 430, 768, 1024, 1440, 1920 and 2560px: no horizontal document overflow or clipped headings, primary buttons, language selector or header. Desktop and Russian mobile screenshots inspected. Gallery and support sections inspected at desktop size.
- Mobile menu opens/closes, exposes the correct expanded state, closes on section selection and Escape, and restores focus on Escape.
- A 320×400px short-screen check confirms the open menu scrolls within the viewport. The Russian game FAQ opens and shows the correct answer.
- Gallery filters show matching categories. Lightbox opens, supports left/right keys and buttons, wraps through visible items, closes with Escape or its close button, returns focus to its image link, and traps Tab/Shift+Tab. A focus-wrap bug discovered during testing was corrected.
- Switching languages preserves game/home route context and section hash. All six localized equivalents are ordinary HTML links.
- Local serif font loaded successfully. Loaded images had no broken sources. No browser warnings/errors were recorded in the inspected preview.

## Performance work

Production JavaScript is about 4.6KB and CSS about 21KB uncompressed. No runtime framework or animation dependency is loaded. Literata subsets are self-hosted; body type uses system fonts. Videos are absent until actual content is supplied, and configured videos load YouTube only after a user click.

Hero imagery is prioritized; below-fold images are lazy-loaded, with explicit dimensions and responsive WebP sources. Relative to supplied originals, the 1600px poster is 287KB versus 1.75MB; the 1600px environment is 131KB versus 1.20MB; the native boss study is 38KB versus 380KB. The combat image retains a more detailed 462KB full-size version, with 169KB/40KB responsive alternatives. Original files remain available for fallback and future production work.

## Verification limits and follow-up

This is local validation, not a claim of a live deployment, search-console verification, or measured real-world Core Web Vitals. Lighthouse/axe score audits, a screen-reader session, hosted Schema.org/Rich Results validation, and testing on physical devices were not performed. No numerical performance/accessibility score is claimed.

The connected browser was used for screenshots, DOM geometry and keyboard behavior. One navigation timed out after reaching its destination, and one gallery click occurred during smooth scrolling; visible-state inspection resolved both and the controls were successfully retested.

All external URLs are the owner's supplied official URLs and are correctly integrated; account-side redirects, sign-in restrictions and membership offerings were not exhaustively tested. Patreon and Boosty profiles were not modified.

After approved publication, run Lighthouse on mobile and desktop, inspect live structured data, repeat the six-route link checks at borzblade.com, and use Search Console/Yandex Webmaster to verify indexing and real crawl responses. Check 404 HTTP status and trailing-slash normalization on the actual host. The preview server returns 404 for missing URLs and redirects directory URLs to their slash form.

Screenshots and detailed browser measurements are kept in the local ignored `.qa/` directory. No DNS record, remote repository or published site was changed.

## Poster and social update

The current supplied 2700×900 wide poster is used for desktop heroes, with the supplied 630×500 poster on mobile and in the gallery. The social preview and game structured-data image were updated. Instagram and TikTok appear first in the development section and footer. The latest static check passes all six routes, 114 internal links/anchors and 186 asset references. Browser inspection at 1440×1000 and 390×844 confirms both current poster sources and no mobile horizontal overflow. Screenshots are saved in .qa/new-poster-desktop.png and .qa/new-poster-mobile.png. Publication is pending GitHub repository write access; the connected integration returns HTTP 403.
