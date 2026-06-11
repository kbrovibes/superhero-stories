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
          width: 36,
          height: 36,
          borderRadius: 999,
          border: "1px solid var(--border)",
          background: currentMeta.swatch,
          cursor: "pointer",
          padding: 0,
          boxShadow: "0 0 0 2px rgba(10,10,15,0.6) inset",
          transition: "transform 0.15s, border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.06)";
          e.currentTarget.style.borderColor = "var(--border-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      />
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
