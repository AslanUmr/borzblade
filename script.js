document.body.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menu.hidden = false;
function closeMenu(restore = false) {
  nav.classList.remove('is-open'); menu.setAttribute('aria-expanded','false');
  if (restore) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('is-open',open); menu.setAttribute('aria-expanded',String(open));
});
nav.addEventListener('click', e => {if(e.target.closest('a')) closeMenu();});
document.addEventListener('click', e => {if (!e.target.closest('.site-header')) closeMenu();});
document.addEventListener('keydown', e => {if(e.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);});
matchMedia('(min-width:1001px)').addEventListener('change', () => closeMenu());
document.querySelectorAll('.languages a').forEach(a => a.addEventListener('click', () => {
  try {localStorage.setItem('borzblade-locale',a.lang);} catch {}
  if (location.hash) a.href += location.hash;
}));
// The URL defines the language. Never override a shared URL or redirect crawlers.
try {localStorage.setItem('borzblade-locale',document.documentElement.lang);} catch {}
const filters = document.querySelector('.gallery-filters');
const grid = document.querySelector('.gallery-grid');
const items = [...document.querySelectorAll('.gallery-item')];
filters.hidden = false;
filters.addEventListener('click', e => {
  const button = e.target.closest('button');if (!button) return;
  const category = button.dataset.filter;
  filters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed',String(b === button)));
  items.forEach(item => {item.hidden = category !== 'all' && item.dataset.category !== category;});
  grid.classList.toggle('filtered',category !== 'all');
});
const dialog = document.querySelector('.lightbox');
const fullImage = document.querySelector('#lightbox-image');
const caption = document.querySelector('#lightbox-caption');
const counter = document.querySelector('#lightbox-count');
let index = 0, visible = [], opener;
function showImage() {
  const item = visible[index];fullImage.src = item.querySelector('a').dataset.full;
  fullImage.alt = item.querySelector('img').alt;
  caption.textContent = [...item.querySelector('figcaption').children].map(x => x.textContent).join(' · ');
  counter.textContent = `${index+1} / ${visible.length}`;
}
function advance(step) {index = (index+step+visible.length)%visible.length;showImage();}
grid.addEventListener('click', e => {
  const link = e.target.closest('.gallery-open');if(!link || !dialog.showModal || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  e.preventDefault();opener = link;visible = items.filter(item => !item.hidden);index = visible.indexOf(link.closest('.gallery-item'));
  showImage();dialog.showModal();document.body.classList.add('modal-open');
});
dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.querySelector('.lightbox-previous').addEventListener('click', () => advance(-1));
dialog.querySelector('.lightbox-next').addEventListener('click', () => advance(1));
dialog.addEventListener('keydown', e => {
  if(e.key === 'ArrowRight'){e.preventDefault();advance(1);}
  if(e.key === 'ArrowLeft'){e.preventDefault();advance(-1);}
  if(e.key === 'Tab') {
    const buttons = [...dialog.querySelectorAll('button')];
    const first = buttons[0], last = buttons.at(-1);
    if(e.shiftKey && document.activeElement === first) {e.preventDefault();last.focus();}
    else if(!e.shiftKey && document.activeElement === last) {e.preventDefault();first.focus();}
  }
});
dialog.addEventListener('click', e => {if(e.target === dialog){const r = dialog.getBoundingClientRect();if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();}});
dialog.addEventListener('close', () => {document.body.classList.remove('modal-open');fullImage.removeAttribute('src');opener?.focus();});
document.querySelectorAll('.video-load').forEach(button => button.addEventListener('click', () => {
  if (!/^[\w-]{11}$/.test(button.dataset.video)) return;
  const frame = document.createElement('iframe');frame.src = `https://www.youtube-nocookie.com/embed/${button.dataset.video}?autoplay=1`;
  frame.title = button.dataset.title;frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';frame.allowFullscreen = true;
  button.replaceWith(frame);frame.focus();
}));
