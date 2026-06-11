#!/usr/bin/env python3
"""
Generate Nano-Banana cartoon portraits for heroes/villains that still use the
geometric SVG placeholder, then wire them into the app.

Source of truth: webapp/lib/stories.ts HERO_META — any entry tagged
`avatarFormat: "svg"` is a candidate. After a successful generation we drop the
override from HERO_META so the app picks up the new .webp automatically.

Auth: uses the `gemini` CLI's Nano Banana extension (OAuth, already logged in).
No API key needed.

Examples:
  python3 scripts/regenerate-avatars.py                  # all SVG-overridden
  python3 scripts/regenerate-avatars.py --dry-run
  python3 scripts/regenerate-avatars.py --hero joker
  python3 scripts/regenerate-avatars.py --limit 5
  python3 scripts/regenerate-avatars.py --force          # regen even if webp exists
"""

import argparse
import re
import subprocess
import sys
import time
from pathlib import Path

from PIL import Image

REPO_ROOT = Path(__file__).resolve().parent.parent
STORIES_TS = REPO_ROOT / "webapp" / "lib" / "stories.ts"
AVATARS_DIR = REPO_ROOT / "webapp" / "public" / "avatars"
TMP_DIR = Path("/tmp")

STYLE_PREAMBLE = (
    "Cartoon portrait, head and chest visible, facing the camera directly, "
    "square 1:1 framing, clean flat-color illustration, vibrant bold colors, "
    "strong black outlines, no text, no letters, no words, no watermark, "
    "no speech bubbles, no logos, children's picture-book art style, "
    "plain solid white background, no scenery, no environment."
)

HERO_LINE = re.compile(
    r'^\s*(?:"([^"]+)"|([a-zA-Z][\w-]*))\s*:\s*\{(.+?)\}\s*,?\s*$'
)
META_FIELDS = {
    "name": re.compile(r'name\s*:\s*"([^"]+)"'),
    "avatarFormat": re.compile(r'avatarFormat\s*:\s*"(\w+)"'),
    "kind": re.compile(r'kind\s*:\s*"(\w+)"'),
}


def parse_hero_meta(text: str):
    """Yield (id, name, avatarFormat, kind, line_no, raw_line) for each entry."""
    start = text.index("HERO_META")
    body_start = text.index("{", start) + 1
    depth = 1
    i = body_start
    while depth > 0:
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
        i += 1
    body = text[body_start : i - 1]

    line_offset = text[:body_start].count("\n")
    for j, line in enumerate(body.splitlines(), start=line_offset + 1):
        m = HERO_LINE.match(line)
        if not m:
            continue
        hero_id = m.group(1) or m.group(2)
        inner = m.group(3)
        fields = {}
        for key, pat in META_FIELDS.items():
            fm = pat.search(inner)
            if fm:
                fields[key] = fm.group(1)
        if "name" not in fields:
            continue
        yield {
            "id": hero_id,
            "name": fields["name"],
            "avatarFormat": fields.get("avatarFormat", "webp"),
            "kind": fields.get("kind", "hero"),
            "line_no": j,
            "raw_line": line,
        }


def detect_universe(hero_id: str) -> str | None:
    """Marvel vs DC: prefer the avatars directory the placeholder svg lives in."""
    for universe in ("marvel", "dc"):
        if (AVATARS_DIR / universe / f"{hero_id}.svg").exists():
            return universe
        if (REPO_ROOT / "superhero-repo" / universe / hero_id).is_dir():
            return universe
    return None


def build_prompt(hero: dict, universe: str) -> str:
    name = hero["name"]
    expression = (
        "Sinister, menacing, intimidating expression — but stylized for a "
        "children's picture book, not gory or nightmarish. Confident smirk."
        if hero["kind"] == "villain"
        else "Heroic, confident, determined expression. Friendly but strong."
    )
    universe_label = "Marvel Comics" if universe == "marvel" else "DC Comics"
    return (
        f"Use the Nano Banana extension to generate one cartoon portrait image. "
        f"Save it to {TMP_DIR}/{hero['id']}.png. "
        f"Subject: {name} from {universe_label}, depicted in their most iconic "
        f"costume and look from the comics and modern adaptations. {expression} "
        f"Style: {STYLE_PREAMBLE}"
    )


def run_gemini(prompt: str, retries: int = 2) -> bool:
    cmd = [
        "gemini",
        "--yolo",
        "--skip-trust",
        "-p",
        prompt,
    ]
    env = {"GEMINI_CLI_TRUST_WORKSPACE": "true"}
    import os

    full_env = {**os.environ, **env}
    for attempt in range(1, retries + 2):
        try:
            res = subprocess.run(
                cmd,
                env=full_env,
                cwd=str(REPO_ROOT),
                capture_output=True,
                text=True,
                timeout=240,
            )
            tail = (res.stdout + res.stderr).strip().splitlines()[-3:]
            print(f"     gemini: {' | '.join(tail)[:250]}")
            return res.returncode == 0
        except subprocess.TimeoutExpired:
            print(f"     timeout on attempt {attempt}")
        if attempt <= retries:
            time.sleep(2)
    return False


def install_webp(src_png: Path, universe: str, hero_id: str) -> bool:
    if not src_png.exists() or src_png.stat().st_size == 0:
        print(f"     no png produced at {src_png}")
        return False
    dst = AVATARS_DIR / universe / f"{hero_id}.webp"
    dst.parent.mkdir(parents=True, exist_ok=True)
    img = Image.open(src_png).convert("RGB").resize((512, 512), Image.LANCZOS)
    img.save(dst, "WEBP", quality=88, method=6)
    print(f"     {dst.relative_to(REPO_ROOT)} ({dst.stat().st_size // 1024}KB)")
    return True


def drop_svg_override(hero_id: str) -> bool:
    """Remove `avatarFormat: "svg"` from HERO_META entry for hero_id."""
    text = STORIES_TS.read_text()
    pattern = re.compile(
        r'^(\s*(?:"[^"]+"|[a-zA-Z][\w-]*)\s*:\s*\{[^}]*?)'
        r',\s*avatarFormat\s*:\s*"svg"'
        r'([^}]*\}.*)$',
        re.MULTILINE,
    )

    def replace_line(match: re.Match) -> str:
        line = match.group(0)
        # Quote the id to make sure we only touch the right line.
        prefix = match.group(1)
        suffix = match.group(2)
        id_match = re.match(r'^\s*(?:"([^"]+)"|([a-zA-Z][\w-]*))\s*:', prefix)
        if not id_match:
            return line
        line_id = id_match.group(1) or id_match.group(2)
        return f"{prefix}{suffix}" if line_id == hero_id else line

    new_text = pattern.sub(replace_line, text)
    if new_text == text:
        return False
    STORIES_TS.write_text(new_text)
    return True


def parse_args():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--dry-run", action="store_true", help="list candidates only")
    p.add_argument("--hero", help="regenerate just this hero id")
    p.add_argument("--limit", type=int, help="cap how many to process")
    p.add_argument(
        "--force",
        action="store_true",
        help="regen even if webp already exists",
    )
    return p.parse_args()


def main() -> int:
    args = parse_args()
    entries = list(parse_hero_meta(STORIES_TS.read_text()))

    if args.hero:
        candidates = [e for e in entries if e["id"] == args.hero]
        if not candidates:
            print(f"No HERO_META entry found for id={args.hero}")
            return 1
    else:
        candidates = [e for e in entries if e["avatarFormat"] == "svg"]

    if not args.force and not args.hero:
        # Already-generated webps that someone forgot to clear the SVG flag on
        # also count as done — but most of the time the flag and the file match.
        pass

    if args.limit:
        candidates = candidates[: args.limit]

    print(f"Found {len(candidates)} candidate(s):")
    for c in candidates:
        u = detect_universe(c["id"]) or "?"
        print(f"  - {c['id']:<22} {c['name']:<22} [{u}, {c['kind']}]")
    print()

    if args.dry_run:
        return 0

    ok = fail = 0
    for i, c in enumerate(candidates, 1):
        universe = detect_universe(c["id"])
        if not universe:
            print(f"[{i}/{len(candidates)}] {c['id']}: cannot resolve universe, skipping")
            fail += 1
            continue

        dst = AVATARS_DIR / universe / f"{c['id']}.webp"
        if dst.exists() and not args.force:
            print(f"[{i}/{len(candidates)}] {c['id']}: webp already exists, dropping flag only")
            if drop_svg_override(c["id"]):
                print(f"     removed avatarFormat:'svg' override")
            ok += 1
            continue

        print(f"[{i}/{len(candidates)}] {c['id']} ({c['name']}, {universe}, {c['kind']})")
        src_png = TMP_DIR / f"{c['id']}.png"
        if src_png.exists():
            src_png.unlink()

        prompt = build_prompt(c, universe)
        if not run_gemini(prompt):
            print(f"     gemini cli failed")
            fail += 1
            continue

        if not install_webp(src_png, universe, c["id"]):
            fail += 1
            continue

        if drop_svg_override(c["id"]):
            print(f"     removed avatarFormat:'svg' override")
        ok += 1
        time.sleep(1)

    print(f"\nDone: {ok} succeeded, {fail} failed.")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
