#!/usr/bin/env python3
"""Generate real cartoon .webp avatars for the new roster via Imagen / nano-banana.

Reads scripts/avatar-prompts.json  ({ "<id>": "<full prompt>", ... }) and the
roster in scripts/new-characters.json (for id -> universe mapping), generates a
512x512 white-background cartoon for each, and writes it to
public/avatars/<universe>/<id>.webp — the same flow as the original
hero-images/fix_boxy.py pipeline.

Run:  GEMINI_API_KEY=...  python3 scripts/gen-webp.py            # all with a prompt
      GEMINI_API_KEY=...  python3 scripts/gen-webp.py wolverine  # one id

After generating a real .webp for a character, drop the `avatarFormat: "svg"`
override for that id in lib/stories.ts so the .webp (the default) is served.
"""
import io
import json
import os
import sys
from pathlib import Path

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    sys.exit("Set GEMINI_API_KEY first (the avatars step needs it).")

try:
    from PIL import Image
    from google import genai
    from google.genai import types
except ImportError as e:
    sys.exit(f"Missing dep ({e}). Install: pip install pillow google-genai")

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent

STYLE_PREFIX = (
    "Cartoon portrait, facing camera directly, square 1:1 format, clean "
    "flat-color illustration, vibrant bold colors, strong black outlines, no "
    "text, no letters, no words, no watermark, no speech bubbles, children's "
    "picture-book art style, plain solid white background, no scenery, no "
    "environment, no gradients. "
)

roster = {
    c["id"]: c
    for c in json.loads((HERE / "new-characters.json").read_text())["characters"]
}
prompts_path = HERE / "avatar-prompts.json"
if not prompts_path.exists():
    sys.exit("scripts/avatar-prompts.json not found — generate prompts first.")
prompts = json.loads(prompts_path.read_text())

client = genai.Client(api_key=API_KEY)
only = sys.argv[1] if len(sys.argv) > 1 else None

made = 0
for cid, prompt in prompts.items():
    if only and cid != only:
        continue
    if cid not in roster:
        print(f"skip {cid}: not in roster")
        continue
    universe = roster[cid]["universe"]
    full = STYLE_PREFIX + prompt.strip()
    print(f"generating {cid} ...")
    resp = client.models.generate_images(
        model="imagen-4.0-generate-001",
        prompt=full,
        config=types.GenerateImagesConfig(number_of_images=1, aspect_ratio="1:1"),
    )
    img_bytes = resp.generated_images[0].image.image_bytes
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB").resize((512, 512))
    out_dir = ROOT / "public" / "avatars" / universe
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / f"{cid}.webp"
    img.save(out, "WEBP", quality=88)
    made += 1
    print(f"  wrote {out.relative_to(ROOT)}")

print(f"\n{made} avatar(s) generated.")
