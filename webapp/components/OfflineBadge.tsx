"use client";
import { useEffect, useState } from "react";

/**
 * A small pill that slides in at the top of every page when the browser goes
 * offline, and slides back out when the connection returns. The app is a
 * precaching PWA, so cached stories keep working — the copy reassures rather
 * than alarms.
 *
 * Uses plain CSS transitions on a always-mounted div (no framer-motion): the
 * div is driven directly by the `offline` React state, so it reliably toggles
 * in BOTH directions. It stays out of the layout flow and never intercepts
 * clicks (pointer-events: none), and is hidden from assistive tech while
 * online.
 */
export default function OfflineBadge() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  return (
    <>
      <style>{`@keyframes ov-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }`}</style>
      <div
        role="status"
        aria-live="polite"
        aria-hidden={!offline}
        style={{
          position: "fixed",
          top: 12,
          left: "50%",
          zIndex: 100,
          pointerEvents: "none",
          transform: `translateX(-50%) translateY(${offline ? "0" : "-80px"})`,
          opacity: offline ? 1 : 0,
          transition:
            "transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.01em",
          color: "#3a2600",
          background: "linear-gradient(180deg, #ffcf5c 0%, #f5a623 100%)",
          border: "1px solid rgba(0,0,0,0.12)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.28)",
          whiteSpace: "nowrap",
        }}
      >
        <span
          aria-hidden
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#3a2600",
            display: "inline-block",
            animation: offline ? "ov-pulse 1.6s ease-in-out infinite" : "none",
          }}
        />
        Offline mode — saved stories still work
      </div>
    </>
  );
}
