#!/usr/bin/env python3
"""Generate movie-accurate cartoon .webp avatars with Gemini's image model.

Replaces the Imagen path (gen-webp.py), which ignored the detailed costume
prompts and slapped generic Superman "S"-shields onto characters. Gemini's
image model ("nano-banana") follows the per-character prompt faithfully, so the
described costume/props actually render.

Reads scripts/avatar-prompts.json ({ "<id>": "<prompt>", ... }) and the roster
in scripts/new-characters.json (id -> universe). Writes a true-square 512x512
webp to public/avatars/<universe>/<id>.webp. Any non-square model output is
center-cropped (never squish-resized), so avatars can't come out thin.

Run:  GEMINI_API_KEY=...  python3 scripts/gen-webp-gemini.py            # all
      GEMINI_API_KEY=...  python3 scripts/gen-webp-gemini.py gamora venom
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
MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3-pro-image")

# NOTE: do NOT reference the "movie"/actor/live-action version of a
# human-faced character — that maps to a real celebrity likeness and the image
# model refuses (PROHIBITED_CONTENT). Describe the character as a fictional
# cartoon instead; the detailed per-character prompt already captures the
# movie look (costume, colors, features).
STYLE_PREFIX = (
    "Children's picture-book cartoon portrait, square composition. Single "
    "character centered in the frame, head-and-shoulders, facing the camera, "
    "filling most of the square at natural proportions (do NOT stretch, "
    "squeeze, or distort). Clean flat-color illustration, vibrant bold "
    "colors, strong confident black outlines, soft cel shading. Plain solid "
    "pure-white background, no scenery, no environment, no gradients, no "
    "text, no letters, no words, no logos except ones explicitly described, "
    "no watermark, no speech bubbles, no border. The character:\n\n"
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
only = set(sys.argv[1:])


def extract_image(resp):
    for cand in resp.candidates or []:
        for part in (cand.content.parts or []):
            inline = getattr(part, "inline_data", None)
            if inline and inline.data:
                return inline.data
    return None


def to_square_512(raw):
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    w, h = img.size
    if w != h:  # center-crop to square — never squish
        side = min(w, h)
        left = (w - side) // 2
        top = (h - side) // 2
        img = img.crop((left, top, left + side, top + side))
    return img.resize((512, 512), Image.LANCZOS)


made, failed = 0, []
targets = only or set(prompts)
for cid in targets:
    if cid not in prompts:
        print(f"skip {cid}: no prompt in avatar-prompts.json")
        continue
    if cid not in roster:
        print(f"skip {cid}: not in roster")
        continue
    universe = roster[cid]["universe"]
    full = STYLE_PREFIX + prompts[cid].strip()
    print(f"generating {cid} ({MODEL}) ...")
    raw = None
    for attempt in range(1, 4):  # PROHIBITED_CONTENT is often flaky; retry
        try:
            resp = client.models.generate_content(
                model=MODEL,
                contents=full,
                config=types.GenerateContentConfig(
                    response_modalities=["Image"],
                    image_config=types.ImageConfig(aspect_ratio="1:1"),
                ),
            )
            raw = extract_image(resp)
            if raw:
                break
            fr = resp.candidates[0].finish_reason if resp.candidates else "?"
            print(f"  .. attempt {attempt}: no image ({fr})")
        except Exception as e:  # noqa: BLE001
            print(f"  .. attempt {attempt} error: {e}")
    if not raw:
        print(f"  !! failed for {cid}")
        failed.append(cid)
        continue
    out_dir = ROOT / "public" / "avatars" / universe
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / f"{cid}.webp"
    to_square_512(raw).save(out, "WEBP", quality=90)
    made += 1
    print(f"  wrote {out.relative_to(ROOT)}")

print(f"\n{made} avatar(s) generated.")
if failed:
    print(f"failed: {', '.join(failed)}")
