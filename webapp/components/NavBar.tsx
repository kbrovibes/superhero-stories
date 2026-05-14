"use client";
import Link from "next/link";
import { motion } from "framer-motion";

interface Crumb { label: string; href?: string; }
interface NavBarProps { crumbs: Crumb[]; }

export default function NavBar({ crumbs }: NavBarProps) {
  return (
    <nav style={{
      height: 52,
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: 8,
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <Link href="/" style={{ fontWeight: 800, color: "var(--text-primary)", textDecoration: "none", marginRight: 16 }}>
        ✦ Stories
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {i > 0 && <span style={{ color: "var(--text-muted)", fontSize: 12 }}>/</span>}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
          >
            {crumb.href ? (
              <Link href={crumb.href} style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 14 }}>
                {crumb.label}
              </Link>
            ) : (
              <span style={{ color: "var(--text-primary)", fontSize: 14 }}>{crumb.label}</span>
            )}
          </motion.span>
        </span>
      ))}
    </nav>
  );
}
