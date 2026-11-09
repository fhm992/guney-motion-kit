# python3 tools/sheet.py out.png img1 img2 ...   (2 columns, half size, time labels)
import sys
from PIL import Image, ImageDraw, ImageFont
out, files = sys.argv[1], sys.argv[2:]
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 28)
cols = 2; W, H = 960, 540; rows = (len(files) + 1) // 2
S = Image.new('RGB', (W * cols, H * rows))
for i, p in enumerate(files):
    im = Image.open(p).convert('RGB').resize((W, H)); d = ImageDraw.Draw(im)
    d.text((14, 10), p.split('/')[-1].replace('.png', ''), font=f, fill='#ffff00', stroke_width=3, stroke_fill='#000')
    S.paste(im, ((i % cols) * W, (i // cols) * H))
S.save(out)
