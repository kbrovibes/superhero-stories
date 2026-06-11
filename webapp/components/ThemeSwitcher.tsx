"use client";

import { useEffect, useRef, useState } from "react";
import { TILE_THEMES, type TileTheme, loadTileTheme, saveTileTheme } from "@/lib/tile-theme";

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<TileTheme>("dark-gradient");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrent(loadTileTheme());
    const handler = () => setCurrent(loadTileTheme());
    window.addEventListener("tile-theme-changed", handler);
    return () => window.removeEventListener("tile-theme-changed", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const currentMeta = TILE_THEMES.find((t) => t.id === current) ?? TILE_THEMES[0];

  return (
    <div ref={ref} style={{ position: "relative", marginLeft: "auto" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Switch theme"
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Theme: ${currentMeta.label}`}
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          border: "1px solid var(--border)",
          background: "transparent",
          color: "var(--text-muted)",
          cursor: "pointer",
          padding: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          transition: "color 0.18s, border-color 0.18s, background 0.18s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--text-primary)";
          e.currentTarget.style.borderColor = "var(--border-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--text-muted)";
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M8 14.5A6.5 6.5 0 1 1 8 1.5c3.59 0 6.5 2.46 6.5 5.5 0 1.93-1.57 3.5-3.5 3.5h-1.25a1.25 1.25 0 0 0-1.04 1.94l.16.24a1.5 1.5 0 0 1-1.32 2.32H8z"/>
          <circle cx="4.5" cy="7" r="0.85" fill="currentColor" stroke="none"/>
          <circle cx="7" cy="4" r="0.85" fill="currentColor" stroke="none"/>
          <circle cx="10.5" cy="4.5" r="0.85" fill="currentColor" stroke="none"/>
          <circle cx="12.5" cy="8" r="0.85" fill="currentColor" stroke="none"/>
        </svg>
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: currentMeta.swatch,
            boxShadow: "0 0 0 1.5px rgba(10,10,15,0.95)",
          }}
        />
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: 44,
            right: 0,
            minWidth: 224,
            background: "rgba(15,15,22,0.96)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 6,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 6px 16px rgba(0,0,0,0.3)",
            zIndex: 60,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              padding: "8px 10px 6px",
            }}
          >
            Tile Theme
          </div>
          {TILE_THEMES.map((t) => {
            const on = t.id === current;
            return (
              <button
                key={t.id}
                role="menuitemradio"
                aria-checked={on}
                onClick={() => {
                  saveTileTheme(t.id);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "8px 10px",
                  border: "none",
                  borderRadius: 8,
                  background: on ? "rgba(162,107,255,0.15)" : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  color: on ? "var(--thanos-accent)" : "var(--text-secondary)",
                  fontFamily: "inherit",
                  fontWeight: on ? 700 : 500,
                  fontSize: 13,
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => {
                  if (!on) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!on) e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    background: t.swatch,
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.15) inset",
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1, lineHeight: 1.2 }}>
                  {t.label}
                  <span style={{ display: "block", fontSize: 10, color: "var(--text-muted)", fontWeight: 500, marginTop: 1 }}>
                    {t.hint}
                  </span>
                </span>
                {on && (
                  <span style={{ fontSize: 11, color: "var(--thanos-accent)" }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
