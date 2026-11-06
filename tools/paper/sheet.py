# python3 plan/sheet.py qa/dir out.png [cols]  -> numeric-sorted labelled contact sheet
import sys, glob, re, os
from PIL import Image, ImageDraw, ImageFont
d, out = sys.argv[1], sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3
fs = sorted(glob.glob(d + '/t*.png'), key=lambda f: float(re.findall(r't([\d.]+)\.png', f)[0]))
if not fs: sys.exit("no frames")
W, H = 640, 360; rows = (len(fs) + cols - 1) // cols
im = Image.new('RGB', (cols * W, rows * H), 'white'); dr = ImageDraw.Draw(im)
try: f = ImageFont.truetype(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../fonts/figtree-800-latin.woff2'), 26)
except OSError: f = ImageFont.load_default(26)
for i, fn in enumerate(fs):
    x, y = (i % cols) * W, (i // cols) * H
    im.paste(Image.open(fn).convert('RGB').resize((W, H)), (x, y))
    t = re.findall(r't([\d.]+)\.png', fn)[0]; dr.rectangle([x, y, x + 110, y + 34], fill='black'); dr.text((x + 6, y + 2), t, font=f, fill='white')
im.save(out)
