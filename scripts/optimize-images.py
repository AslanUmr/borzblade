"""Optional asset preparation. Requires Pillow. Originals remain untouched."""
from pathlib import Path
from PIL import Image, ImageOps

assets = Path(__file__).resolve().parent.parent / 'assets'
out = assets / 'optimized'
out.mkdir(exist_ok=True)
for name in [p.name for p in assets.iterdir() if p.suffix.lower() in ['.jpg','.png'] and p.name != 'borzblade-logo.png']:
    im = Image.open(assets / name).convert('RGB')
    widths = sorted(set(min(w, im.width) for w in [480,960,1600])) if im.width > 800 else [im.width]
    for width in widths:
        sized = im.resize((width, round(im.height * width / im.width)), Image.Resampling.LANCZOS)
        sized.save(out / f'{Path(name).stem}-{width}.webp', quality=86, method=6)
logo = Image.open(assets / 'borzblade-logo.png').convert('RGBA')
logo.resize((96, 96), Image.Resampling.LANCZOS).save(out / 'borzblade-mark.webp', lossless=True)
for size, name in [(32, 'borzblade-icon'), (180, 'borzblade-touch')]:
    logo.resize((size, size), Image.Resampling.LANCZOS).save(out / f'{name}.png')
# Use the actual poster intact against a genuine environment crop for social previews.
back = Image.open(assets / 'abrek-key-art-clean.png').convert('RGB')
preview = ImageOps.fit(back, (1200,630), method=Image.Resampling.LANCZOS)
poster = Image.open(assets / 'abrek-poster-current.png').convert('RGB')
poster.thumbnail((630,630), Image.Resampling.LANCZOS)
preview.paste(poster, ((1200-poster.width)//2,(630-poster.height)//2))
preview.save(out / 'abrek-social.jpg',quality=88,optimize=True)
print('Optimized assets generated; originals preserved.')
