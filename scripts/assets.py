"""Builds web-ready raster assets from the source logo files in site/assets.
Run: python3 scripts/assets.py   (outputs to public/assets and public/)"""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT, PUB = ROOT / 'site/assets', ROOT / 'public/assets', ROOT / 'public'
OUT.mkdir(parents=True, exist_ok=True)
BLUE, OCCL, WHITE = (31, 42, 255), (10, 10, 12), (255, 255, 255)

# 1 · Logo variants at 1x/2x display widths (nav 28px tall ≈ 161px wide; credits up to 260px wide)
for name in ['ortho-marketing-logo', 'ortho-marketing-logo-reversed', 'ortho-marketing-logo-white']:
    im = Image.open(SRC / f'{name}.png').convert('RGBA')
    for w in (330, 660):
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(OUT / f'{name}-{w}.webp', 'WEBP', quality=90, method=6)
    print('logo', name, im.size)

# 2 · The Orb (the logo's O), rasterised with 4x supersampling
def orb(size, bg=None, scale=1.0):
    S = size * 4
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float32) + 0.5
    r = S * scale / 2
    cx = cy = S / 2
    u = (xx - cx) / r * 62 + 62      # map into the 124-unit orb space
    v = (yy - cy) / r * 62 + 62
    inside = (u - 62) ** 2 + (v - 62) ** 2 <= 62 ** 2
    t = np.clip(1 - ((u - 62) / 62) ** 2, 0, 1)
    top = 49.6 + 38.4 * np.sqrt(t)
    bot = 56.7 + 56.3 * np.sqrt(t)
    band = inside & (v >= top) & (v <= bot)
    img = np.zeros((S, S, 4), np.uint8)
    if bg:
        img[..., :3] = bg; img[..., 3] = 255
    img[inside] = (*BLUE, 255)
    img[band] = (*WHITE, 255)
    return Image.fromarray(img, 'RGBA').resize((size, size), Image.LANCZOS)

orb(32).save(PUB / 'favicon-32.png', optimize=True)
orb(180, bg=OCCL, scale=0.62).convert('RGB').save(PUB / 'apple-touch-icon.png', optimize=True)
orb(192, bg=OCCL, scale=0.6).save(PUB / 'icon-192.png', optimize=True)
orb(512, bg=OCCL, scale=0.6).save(PUB / 'icon-512.png', optimize=True)   # maskable: 60% keeps inside the safe zone
print('icons written')
