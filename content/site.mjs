export const site = {
  origin: 'https://borzblade.com',
  studio: 'Borzblade',
  hero: { id: 'hero', file: 'abrek-key-art-clean', original: 'png', width: 2700, height: 900 },
  game: { name: 'Abrek', subtitle: 'Path of Honor', get title() { return `${this.name}: ${this.subtitle}`; } },
  support: [
    { name: 'Patreon', url: 'https://www.patreon.com/c/borzblade', mark: 'P' },
    { name: 'Boosty', url: 'https://boosty.to/borzblade', mark: 'b' }
  ],
  socials: [
    // The first two channels are featured in the development section.
    ['Instagram', 'https://www.instagram.com/borzblade/'],
    ['TikTok', 'https://www.tiktok.com/@borzblade'],
    ['Telegram', 'https://t.me/borzblade'],
    ['YouTube', 'https://www.youtube.com/@borzblade'],
    ['X', 'https://x.com/borzblade'],
    ['itch.io', 'https://borzblade.itch.io/']
  ],
  // Genuine supplied images only. Captions/alt text are in locales.mjs.
  gallery: [
    { id: 'fortress', file: 'fortress-character-early-development', original: 'png', width: 948, height: 695, category: 'world' },
    { id: 'overlook', file: 'fortress-overlook-early-development', original: 'png', width: 1843, height: 788, category: 'world' },
    { id: 'combat', file: 'combat-current', original: 'png', width: 1455, height: 795, category: 'gameplay' },
    { id: 'world', file: 'mountain-village-current', original: 'png', width: 1297, height: 780, category: 'world' },
    { id: 'boss', file: 'boss-concept-early-development', original: 'png', width: 512, height: 382, category: 'art' },
    { id: 'poster', file: 'abrek-poster-current', original: 'png', width: 630, height: 500, category: 'art' }
  ],
  // Add only verified posts; title and summary must have en/ru/tr entries.
  updates: [],
  // Optional confirmed rewards: { name: {en,ru,tr}, text: {en,ru,tr} }.
  rewards: [],
  // Optional supplied YouTube videos: { youtubeId, title: {en,ru,tr}, thumbnail, alt: {en,ru,tr} }.
  videos: [],
  featureStatuses: ['prototype', 'progress', 'progress', 'progress', 'explored'],
  verification: { google: '', yandex: '' }
};
