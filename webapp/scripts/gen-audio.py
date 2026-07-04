#!/usr/bin/env python3
"""Generate warm, kid-paced narration audio for a story's Story Time text.

Uses Gemini TTS (gemini-2.5-flash-preview-tts). Reads the <story>.storytime.txt
variant (the long-form read-aloud) and writes a 24kHz mono WAV to
public/audio/<universe>/<hero>/<story>.wav. Audio is NOT precached — the UI
only offers playback when online (see the story page's read-aloud button).

Run:  GEMINI_API_KEY=...  python3 scripts/gen-audio.py marvel groot 01-origin
      GEMINI_API_KEY=...  python3 scripts/gen-audio.py marvel/groot/01-origin ...
"""
import os
import shutil
import subprocess
import sys
from pathlib import Path

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    sys.exit("Set GEMINI_API_KEY first.")

from google import genai  # noqa: E402
from google.genai import types  # noqa: E402

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
REPO = ROOT / "superhero-repo"
MODEL = os.environ.get("GEMINI_TTS_MODEL", "gemini-2.5-flash-preview-tts")
VOICE = os.environ.get("GEMINI_TTS_VOICE", "Callirrhoe")  # warm, easy-going
BITRATE = os.environ.get("GEMINI_TTS_BITRATE", "32k")  # mono MP3 ~ 0.24 MB/min


def find_ffmpeg():
    override = os.environ.get("GEMINI_FFMPEG")
    if override and Path(override).exists():
        return override
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg  # bundled static binary (scripts/.venv)
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        sys.exit("No ffmpeg. Install: scripts/.venv/bin/pip install imageio-ffmpeg")


FFMPEG = find_ffmpeg()

# A natural-language style directive; Gemini TTS applies it and does NOT read it
# aloud. Keeps the pace gentle and unhurried for young children.
STYLE = (
    "Narrate the following children's story aloud in a warm, friendly, "
    "storyteller voice. Read slowly and clearly at a calm, unhurried pace "
    "suitable for a young child, with gentle expression:\n\n"
)

client = genai.Client(api_key=API_KEY)


def parse(arg_list):
    triples = []
    i = 0
    while i < len(arg_list):
        a = arg_list[i]
        if "/" in a:
            u, h, s = a.split("/")
            triples.append((u, h, s))
            i += 1
        else:
            triples.append((arg_list[i], arg_list[i + 1], arg_list[i + 2]))
            i += 3
    return triples


targets = parse(sys.argv[1:])
if not targets:
    sys.exit("usage: gen-audio.py <universe> <hero> <story>  (or u/h/s)")

for universe, hero, story in targets:
    src = REPO / universe / hero / f"{story}.storytime.txt"
    if not src.exists():
        print(f"skip {universe}/{hero}/{story}: no storytime file")
        continue
    text = src.read_text().strip()
    print(f"narrating {universe}/{hero}/{story} ({len(text)} chars, {VOICE}) ...")
    resp = client.models.generate_content(
        model=MODEL,
        contents=STYLE + text,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=VOICE)
                )
            ),
        ),
    )
    pcm = resp.candidates[0].content.parts[0].inline_data.data
    out_dir = ROOT / "public" / "audio" / universe / hero
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / f"{story}.mp3"
    # Pipe raw 24kHz/16-bit/mono PCM straight to a low-bitrate mono MP3.
    subprocess.run(
        [FFMPEG, "-hide_banner", "-loglevel", "error", "-y",
         "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", "pipe:0",
         "-c:a", "libmp3lame", "-b:a", BITRATE, "-ac", "1", str(out)],
        input=pcm, check=True,
    )
    secs = len(pcm) / 2 / 24000
    print(f"  wrote {out.relative_to(ROOT)}  ({secs:.0f}s, {out.stat().st_size//1024} KB @ {BITRATE})")
