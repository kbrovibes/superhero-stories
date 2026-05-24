"use client";

import { useState } from "react";

interface StoryTabsProps {
  body: string;
  tldr?: string;
  readAloud?: string;
  accent: string;
}

type TabId = "tldr" | "summary" | "readaloud";

const PARA_STYLE = { fontSize: 18, lineHeight: 1.8, color: "var(--text-secondary)", margin: "0 0 20px" } as const;

export default function StoryTabs({ body, tldr, readAloud, accent }: StoryTabsProps) {
  const [active, setActive] = useState<TabId>("summary");

  const allTabs: { id: TabId; label: string; available: boolean }[] = [
    { id: "tldr",      label: "TLDR",       available: !!tldr },
    { id: "summary",   label: "Summary",    available: true },
    { id: "readaloud", label: "Read Aloud", available: !!readAloud },
  ];
  const tabs = allTabs.filter((t) => t.available);
  const activeTab = tabs.find((t) => t.id === active) ? active : tabs[0]?.id ?? "summary";

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 28 }}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                borderBottom: isActive ? `2px solid ${accent}` : "2px solid transparent",
                marginBottom: -1,
                transition: "color 0.15s, border-color 0.15s",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TLDR */}
      {activeTab === "tldr" && tldr && (
        <div>
          {tldr.split("\n").filter(Boolean).map((line, i) => {
            const isBullet = line.startsWith("•");
            return (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: isBullet ? 10 : 0, ...PARA_STYLE }}>
                {isBullet ? (
                  <>
                    <span style={{ color: accent, flexShrink: 0, marginTop: 2 }}>•</span>
                    <span>{line.slice(1).trim()}</span>
                  </>
                ) : (
                  <span>{line}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {activeTab === "summary" && (
        <div>
          {body.split("\n").filter(Boolean).map((para, i) => (
            <p key={i} style={PARA_STYLE}>{para.trim()}</p>
          ))}
        </div>
      )}

      {/* Read Aloud */}
      {activeTab === "readaloud" && readAloud && (
        <div>
          {readAloud.split("\n").filter(Boolean).map((para, i) => (
            <p key={i} style={PARA_STYLE}>{para.trim()}</p>
          ))}
        </div>
      )}
    </div>
  );
}
