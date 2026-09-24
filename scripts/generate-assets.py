"""Generates the heavy/decorative assets the pages reference.

- public/images/hero-deal.png   : deliberately oversized, uncompressible PNG
- public/images/*.svg           : small product illustrations
- public/js/vendor/analytics-vendor.js : ~600 KB mostly-unused, render-blocking JS
"""
import os
import random

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(__file__), "..", "public")
random.seed(42)


def hero_png():
    # 1920x1080 per-pixel noise so PNG compression cannot shrink it (~5-6 MB).
    w, h = 1920, 1080
    img = Image.frombytes("RGB", (w, h), os.urandom(w * h * 3))
    overlay = Image.new("RGB", (w, h), (20, 50, 74))
    img = Image.blend(img, overlay, 0.55)
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 140)
    except OSError:
        font = ImageFont.load_default()
    draw.text((120, 410), "UP TO 40% OFF", fill=(255, 255, 255), font=font)
    img.save(os.path.join(ROOT, "images", "hero-deal.png"), optimize=False)


SVG = """<svg xmlns="http://www.w3.org/2000/svg" width="220" height="140" viewBox="0 0 220 140">
  <rect width="220" height="140" fill="{bg}"/>
  <{shape} fill="{fg}"/>
</svg>
"""


def product_svgs():
    items = {
        "shoe": ("#e3eef8", "#1a5d9c", 'path d="M30 100 L60 60 L120 70 L190 95 L190 110 L30 110 Z"'),
        "sock": ("#f3ece2", "#8a5a2b", 'path d="M90 20 L130 20 L130 90 L170 110 L150 125 L90 110 Z"'),
        "jacket": ("#e5f3e8", "#2e7d4f", 'path d="M70 30 L110 20 L150 30 L170 120 L50 120 Z"'),
        "bottle": ("#eceff1", "#607d8b", 'rect x="95" y="20" width="30" height="105" rx="10"'),
    }
    for name, (bg, fg, shape) in items.items():
        with open(os.path.join(ROOT, "images", f"{name}.svg"), "w") as f:
            f.write(SVG.format(bg=bg, fg=fg, shape=shape))


def vendor_js():
    lines = [
        "/* analytics-vendor.js - simulated third-party bundle (generated). */",
        "(function (w) {",
        "  var registry = {};",
    ]
    # ~2,000 functions that are defined but never called -> unused-javascript.
    for i in range(2000):
        a, b = random.randint(1, 999), random.randint(1, 999)
        lines.append(
            f"  registry.fn{i} = function (input) {{ var out = []; "
            f"for (var k = 0; k < {a}; k++) {{ out.push((input || 0) * {b} + k); }} "
            f"return out.reduce(function (s, v) {{ return s + v; }}, 0) / {a}; }};"
        )
    # The part that does run: a synchronous 800 ms busy loop before first paint.
    lines += [
        "  var end = Date.now() + 800;",
        "  var sink = 0;",
        "  while (Date.now() < end) { sink += Math.random(); }",
        "  w.__analytics = { registry: registry, sink: sink };",
        "})(window);",
    ]
    with open(os.path.join(ROOT, "js", "vendor", "analytics-vendor.js"), "w") as f:
        f.write("\n".join(lines) + "\n")


if __name__ == "__main__":
    os.makedirs(os.path.join(ROOT, "images"), exist_ok=True)
    os.makedirs(os.path.join(ROOT, "js", "vendor"), exist_ok=True)
    hero_png()
    product_svgs()
    vendor_js()
    print("assets generated")
