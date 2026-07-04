"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  accent: string;
  title: string;
  heroName: string;
  artwork?: string; // hero avatar URL, used for lock-screen art
}

function fmt(t: number) {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Spotify-style narration player: play/pause, scrubbable seekbar, skip ±10s,
// elapsed/duration, and OS media-session integration so phone lock screens show
// artwork + transport controls. Audio is network-only (see the SW /audio bypass).
export default function ReadAloudButton({ src, accent, title, heroName, artwork }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onLoaded = () => { setDur(a.duration || 0); setReady(true); };
    const onTime = () => { if (!scrubbing) setCur(a.currentTime); };
    const onPlay = () => { setPlaying(true); setLoading(false); };
    const onPause = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    const onEnded = () => { setPlaying(false); setCur(0); };
    const onError = () => { setError(true); setLoading(false); };
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("durationchange", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("playing", onPlaying);
    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onError);
    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("durationchange", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("waiting", onWaiting);
      a.removeEventListener("playing", onPlaying);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onError);
    };
  }, [scrubbing]);

  // OS media session: lock-screen art + transport controls on mobile.
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    try {
      ms.metadata = new MediaMetadata({
        title,
        artist: heroName,
        album: "Superhero Stories",
        artwork: artwork
          ? [96, 128, 192, 256, 384, 512].map((s) => ({
              src: artwork,
              sizes: `${s}x${s}`,
              type: artwork.endsWith(".svg") ? "image/svg+xml" : "image/webp",
            }))
          : undefined,
      });
    } catch { /* MediaMetadata may be unavailable */ }
    const a = () => audioRef.current;
    ms.setActionHandler("play", () => a()?.play());
    ms.setActionHandler("pause", () => a()?.pause());
    ms.setActionHandler("seekbackward", (d) => { const el = a(); if (el) el.currentTime = Math.max(0, el.currentTime - (d.seekOffset || 10)); });
    ms.setActionHandler("seekforward", (d) => { const el = a(); if (el) el.currentTime = Math.min(el.duration || 0, el.currentTime + (d.seekOffset || 10)); });
    try {
      ms.setActionHandler("seekto", (d) => { const el = a(); if (el && d.seekTime != null) el.currentTime = d.seekTime; });
    } catch { /* seekto unsupported */ }
    return () => {
      for (const act of ["play", "pause", "seekbackward", "seekforward", "seekto"] as const) {
        try { ms.setActionHandler(act, null); } catch { /* noop */ }
      }
    };
  }, [title, heroName, artwork]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    try { navigator.mediaSession.playbackState = playing ? "playing" : "paused"; } catch { /* noop */ }
  }, [playing]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    setError(false);
    if (playing) el.pause();
    else { setLoading(true); el.play().catch(() => { setError(true); setLoading(false); }); }
  };

  const skip = (delta: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Math.min(Math.max(0, el.currentTime + delta), dur || el.duration || 0);
    setCur(el.currentTime);
  };

  const onSeek = (v: number) => { setCur(v); };
  const commitSeek = (v: number) => {
    const el = audioRef.current;
    if (el) el.currentTime = v;
    setScrubbing(false);
  };

  const pct = dur > 0 ? (cur / dur) * 100 : 0;

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "16px 18px",
        marginBottom: 28,
        borderRadius: 18,
        border: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {artwork && (
          <img
            src={artwork}
            alt=""
            width={48}
            height={48}
            style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover", flexShrink: 0, border: `1.5px solid ${accent}` }}
          />
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: accent }}>
            {error ? "Needs internet" : loading ? "Loading…" : playing ? "Now reading" : "Read aloud"}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </div>
        </div>
      </div>

      {/* Seekbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums", width: 34, textAlign: "right" }}>{fmt(cur)}</span>
        <input
          type="range"
          min={0}
          max={dur || 0}
          step={0.1}
          value={cur}
          disabled={!ready || error}
          onChange={(e) => onSeek(Number(e.target.value))}
          onPointerDown={() => setScrubbing(true)}
          onPointerUp={(e) => commitSeek(Number((e.target as HTMLInputElement).value))}
          onKeyUp={(e) => commitSeek(Number((e.target as HTMLInputElement).value))}
          aria-label="Seek"
          style={{
            flex: 1,
            height: 6,
            appearance: "none",
            WebkitAppearance: "none",
            borderRadius: 999,
            background: `linear-gradient(to right, ${accent} ${pct}%, var(--border) ${pct}%)`,
            cursor: ready ? "pointer" : "default",
            outline: "none",
          }}
        />
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums", width: 34 }}>{fmt(dur)}</span>
      </div>

      {/* Transport */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
        <button onClick={() => skip(-10)} disabled={!ready || error} aria-label="Back 10 seconds"
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 3 }}>
          ↺ 10
        </button>
        <button onClick={toggle} disabled={error} aria-label={playing ? "Pause" : "Play"}
          style={{
            width: 52, height: 52, borderRadius: "50%", border: "none",
            background: accent, color: "#fff", fontSize: 20, cursor: error ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 14px ${accent}55`, flexShrink: 0,
          }}>
          {loading ? "…" : playing ? "⏸" : "▶"}
        </button>
        <button onClick={() => skip(10)} disabled={!ready || error} aria-label="Forward 10 seconds"
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 3 }}>
          10 ↻
        </button>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 15px; height: 15px; border-radius: 50%;
          background: ${accent}; border: 2px solid #fff; cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 15px; height: 15px; border-radius: 50%;
          background: ${accent}; border: 2px solid #fff; cursor: pointer;
        }
      `}</style>

      <audio ref={audioRef} src={src} preload="metadata" />
    </section>
  );
}
