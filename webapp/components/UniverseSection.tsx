"use client";
import React from "react";
import { motion } from "framer-motion";

export default function UniverseSection({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <h2 style={{ 
          fontSize: 12, 
          letterSpacing: "0.25em", 
          color: "var(--text-secondary)", 
          fontWeight: 800,
          margin: 0,
          textTransform: "uppercase",
          whiteSpace: "nowrap"
        }}>
          {label}
        </h2>
        <div style={{ 
          height: 1, 
          flex: 1, 
          background: "linear-gradient(90deg, var(--border), transparent)",
          position: "relative",
          overflow: "hidden"
        }}>
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, transparent, var(--text-muted), transparent)",
              opacity: 0.3
            }}
          />
        </div>
        <span style={{ 
          fontSize: 9, 
          color: "var(--text-muted)", 
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em"
        }}>
          {count} Units
        </span>
      </div>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: 12 
      }}>
        {children}
      </div>
    </section>
  );
}
