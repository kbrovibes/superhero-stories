"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  accent: string;
}

// Network-only narration player. Audio is not precached, so playback simply
// fails gracefully when offline. Kept deliberately slow/calm at the source
// (the TTS was generated at a gentle pace), so we play at natural rate.
export default function ReadAloudButton({ src, accent }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">("idle");

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => setState("playing");
    const onWaiting = () => setState("loading");
    const onEnded = () => setState("idle");
    const onPause = () => setState((s) => (s === "playing" || s === "loading" ? "idle" : s));
    const onError = () => setState("error");
    a.addEventListener("play", onPlay);
    a.addEventListener("playing", onPlay);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("ended", onEnded);
    a.addEventListener("pause", onPause);
    a.addEventListener("error", onError);
    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("playing", onPlay);
      a.removeEventListener("waiting", onWaiting);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("error", onError);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (state === "playing" || state === "loading") {
      a.pause();
    } else {
      setState("loading");
      a.play().catch(() => setState("error"));
    }
  };

  const label =
    state === "playing" ? "Pause" :
    state === "loading" ? "Loading…" :
    state === "error" ? "Needs internet" :
    "Read aloud";
  const icon = state === "playing" ? "⏸" : state === "loading" ? "…" : state === "error" ? "⚠️" : "🔊";

  return (
    <div style={{ marginBottom: 24 }}>
      <button
        onClick={toggle}
        disabled={state === "error"}
        aria-label={label}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "9px 16px",
          borderRadius: 999,
          border: `1.5px solid ${accent}`,
          background: state === "playing" ? accent : "transparent",
          color: state === "playing" ? "#fff" : "var(--text-primary)",
          fontSize: 14,
          fontWeight: 700,
          cursor: state === "error" ? "not-allowed" : "pointer",
          letterSpacing: "0.02em",
          transition: "background 0.15s, color 0.15s",
        }}
      >
        <span style={{ fontSize: 15 }}>{icon}</span>
        {label}
      </button>
      {state === "error" && (
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
          Read-aloud needs an internet connection.
        </div>
      )}
      <audio ref={audioRef} src={src} preload="none" />
    </div>
  );
}
