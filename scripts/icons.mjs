// Small inline platform symbols; link text remains the accessible name.
const shapes = {
  YouTube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 6 3-6 3Z" fill="var(--bg)"/>',
  Telegram: '<path d="m22 3-4 18-6-5-4 4 1-7 10-7-12 6-5-2Z"/>',
  Instagram: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.3"/>',
  TikTok: '<path d="M16 2c.4 3 2 4.5 5 5v4a9 9 0 0 1-5-2v8a6 6 0 1 1-6-6v4a2 2 0 1 0 2 2V2Z"/>',
  X: '<path d="M18 2h3l-7 8 8 12h-7l-5-8-7 8H0l8-10L1 2h7l5 7Zm-3 18h3L6 4H3Z"/>',
  'itch.io': '<path d="M4 3h16l2 6c-1 2-3 2-4 0-1 2-3 2-4 0-1 2-3 2-4 0-1 2-3 2-4 0-1 2-3 2-4 0ZM4 12c2 1 3 0 4-1 2 1 3 1 4 0 2 1 3 1 4 0 1 1 2 2 4 1v8H4Zm5 3v3h6v-3Z"/>'
};
export function icon(name) {return shapes[name] ? `<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${shapes[name]}</svg>` : '';}
