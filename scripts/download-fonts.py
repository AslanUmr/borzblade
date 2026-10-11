"""One-time download of self-hosted, OFL-licensed Literata subsets."""
import re
import urllib.request
from pathlib import Path

out = Path(__file__).resolve().parent.parent / 'assets' / 'fonts'
out.mkdir(exist_ok=True)
url = 'https://fonts.googleapis.com/css2?family=Literata:wght@400..700&display=swap'
request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'})
css = urllib.request.urlopen(request).read().decode()
for subset, block in re.findall(r'/\* ([^*]+) \*/\s*(@font-face\s*\{[^}]+\})', css):
    if subset in ['latin', 'cyrillic', 'latin-ext']:
        font_url = re.search(r'url\(([^)]+)\)', block).group(1)
        urllib.request.urlretrieve(font_url, out / f'literata-{subset}.woff2')
urllib.request.urlretrieve('https://raw.githubusercontent.com/google/fonts/main/ofl/literata/OFL.txt', out / 'OFL.txt')
print('Downloaded Literata Latin, Cyrillic and extended Latin subsets with OFL license.')
